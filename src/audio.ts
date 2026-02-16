// Ambient nature sounds via Web Audio API

let audioCtx: AudioContext | null = null;
let activeNodes: AudioNode[] = [];
let isPlaying = false;

function getCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

function createWindNoise(ctx: AudioContext, gain: GainNode) {
  const bufferSize = 2 * ctx.sampleRate;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  // Brown noise for wind
  let last = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    data[i] = (last + 0.02 * white) / 1.02;
    last = data[i];
    data[i] *= 3.5;
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  // Low-pass filter for wind character
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 400;
  filter.Q.value = 0.5;

  // Slow LFO for wind gusts
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.value = 0.15;
  lfoGain.gain.value = 150;
  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);
  lfo.start();

  const windGain = ctx.createGain();
  windGain.gain.value = 0.15;

  source.connect(filter);
  filter.connect(windGain);
  windGain.connect(gain);
  source.start();

  activeNodes.push(source, filter, lfo, lfoGain, windGain);
}

function createBirdChirp(ctx: AudioContext, gain: GainNode) {
  const chirp = () => {
    if (!isPlaying) return;

    const osc = ctx.createOscillator();
    const chirpGain = ctx.createGain();
    const now = ctx.currentTime;

    // Random bird-like frequency
    const baseFreq = 2000 + Math.random() * 3000;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * (0.7 + Math.random() * 0.6), now + 0.1);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * (0.8 + Math.random() * 0.4), now + 0.15);

    chirpGain.gain.setValueAtTime(0, now);
    chirpGain.gain.linearRampToValueAtTime(0.03, now + 0.02);
    chirpGain.gain.linearRampToValueAtTime(0.02, now + 0.08);
    chirpGain.gain.linearRampToValueAtTime(0, now + 0.15);

    osc.connect(chirpGain);
    chirpGain.connect(gain);
    osc.start(now);
    osc.stop(now + 0.2);

    // Sometimes do a double chirp
    if (Math.random() > 0.5) {
      setTimeout(chirp, 150 + Math.random() * 100);
    }

    // Schedule next bird
    setTimeout(chirp, 2000 + Math.random() * 6000);
  };

  // Start with random delay
  setTimeout(chirp, Math.random() * 3000);
}

function createCrickets(ctx: AudioContext, gain: GainNode) {
  const osc = ctx.createOscillator();
  const cricketGain = ctx.createGain();

  osc.frequency.value = 4500;
  osc.type = 'sine';

  // Amplitude modulation for cricket pattern
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.value = 15; // Rapid on-off
  lfoGain.gain.value = 0.008;
  lfo.connect(lfoGain);
  lfoGain.connect(cricketGain.gain);

  cricketGain.gain.value = 0.008;
  osc.connect(cricketGain);
  cricketGain.connect(gain);

  osc.start();
  lfo.start();
  activeNodes.push(osc, lfo, lfoGain, cricketGain);
}

export function startAmbient() {
  if (isPlaying) return;
  isPlaying = true;

  const ctx = getCtx();
  if (ctx.state === 'suspended') ctx.resume();

  const masterGain = ctx.createGain();
  masterGain.gain.value = 0;
  masterGain.gain.linearRampToValueAtTime(1, ctx.currentTime + 2);
  masterGain.connect(ctx.destination);
  activeNodes.push(masterGain);

  createWindNoise(ctx, masterGain);
  createBirdChirp(ctx, masterGain);
  createCrickets(ctx, masterGain);
}

export function stopAmbient() {
  isPlaying = false;
  if (audioCtx) {
    const masterGain = activeNodes.find(n => n instanceof GainNode && (n as GainNode).gain.value > 0.5);
    if (masterGain && masterGain instanceof GainNode) {
      masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1);
      setTimeout(() => {
        activeNodes.forEach(n => {
          try { (n as any).stop?.(); } catch {}
          try { n.disconnect(); } catch {}
        });
        activeNodes = [];
      }, 1200);
    } else {
      activeNodes.forEach(n => {
        try { (n as any).stop?.(); } catch {}
        try { n.disconnect(); } catch {}
      });
      activeNodes = [];
    }
  }
}

export function isAmbientPlaying() { return isPlaying; }
