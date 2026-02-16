import { useState, useEffect, useCallback } from 'react';
import { getDailyQuest, CATEGORY_EMOJI, type Quest } from './quests';
import { addCompletedQuest, getStreak, getWeeklyMinutes, getWeeklyTotal, isTodayComplete, type Reflection } from './store';
import { startAmbient, stopAmbient, isAmbientPlaying } from './audio';

type Screen = 'home' | 'quest' | 'timer' | 'reflect' | 'done';

function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [quest] = useState<Quest>(getDailyQuest());
  const [todayDone, setTodayDone] = useState(isTodayComplete());
  const [streak, setStreak] = useState(getStreak());
  const [timeLeft, setTimeLeft] = useState(0);
  const [questStart, setQuestStart] = useState(0);
  const [soundOn, setSoundOn] = useState(false);
  const [reflection, setReflection] = useState<Reflection>({ presence: 3, calm: 3, wonder: 3 });
  const weeklyData = getWeeklyMinutes();
  const weeklyTotal = getWeeklyTotal();

  const refreshStats = useCallback(() => {
    setTodayDone(isTodayComplete());
    setStreak(getStreak());
  }, []);

  // Timer countdown
  useEffect(() => {
    if (screen !== 'timer' || timeLeft <= 0) return;
    const t = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(t);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [screen, timeLeft]);

  // Auto-advance when timer finishes
  useEffect(() => {
    if (screen === 'timer' && timeLeft === 0 && questStart > 0) {
      stopAmbient();
      setSoundOn(false);
      setScreen('reflect');
    }
  }, [screen, timeLeft, questStart]);

  const startQuest = () => {
    setQuestStart(Date.now());
    if (quest.timerSeconds) {
      setTimeLeft(quest.timerSeconds);
      setScreen('timer');
    } else {
      setScreen('quest');
    }
  };

  const toggleSound = () => {
    if (isAmbientPlaying()) {
      stopAmbient();
      setSoundOn(false);
    } else {
      startAmbient();
      setSoundOn(true);
    }
  };

  const finishQuest = () => {
    stopAmbient();
    setSoundOn(false);
    setScreen('reflect');
  };

  const submitReflection = () => {
    const elapsed = Math.max(quest.durationMinutes, Math.round((Date.now() - questStart) / 60000));
    addCompletedQuest({
      questId: quest.id,
      date: new Date().toISOString().split('T')[0],
      durationMinutes: elapsed,
      reflection,
      completedAt: new Date().toISOString(),
    });
    refreshStats();
    setScreen('done');
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="min-h-screen nature-texture p-4 max-w-md mx-auto pb-20">
      {/* Header */}
      <header className="text-center pt-6 pb-4">
        <h1 className="text-4xl font-bold text-forest-700 tracking-tight">
          🌿 Micro-Rewilding
        </h1>
        <p className="text-earth-500 text-lg mt-1">Your daily nature dose</p>
      </header>

      {/* Streak badge */}
      {streak > 0 && (
        <div className="text-center mb-4">
          <span className="inline-flex items-center gap-2 bg-forest-100 text-forest-700 px-4 py-2 rounded-full text-lg hand-drawn border-2 border-forest-200">
            🔥 {streak} day streak
          </span>
        </div>
      )}

      {/* HOME SCREEN */}
      {screen === 'home' && (
        <div className="space-y-6">
          {/* Daily Quest Card */}
          <div className="relative bg-white/80 p-6 hand-drawn border-2 border-earth-200 shadow-lg leaf-bg">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{CATEGORY_EMOJI[quest.category]}</span>
              <span className="uppercase text-sm tracking-widest text-earth-400 font-bold">
                {quest.category} quest
              </span>
            </div>
            <p className="text-2xl text-earth-800 leading-relaxed mb-4">
              "{quest.text}"
            </p>
            <div className="flex items-center justify-between">
              <span className="text-earth-400 text-sm">~{quest.durationMinutes} min</span>
              {quest.timerSeconds && (
                <span className="text-earth-400 text-sm">⏱ {formatTime(quest.timerSeconds)}</span>
              )}
            </div>

            {todayDone ? (
              <div className="mt-4 text-center py-3 bg-forest-100 rounded-2xl text-forest-600 text-lg">
                ✅ Completed today!
              </div>
            ) : (
              <button
                onClick={startQuest}
                className="mt-4 w-full py-4 bg-forest-500 hover:bg-forest-600 active:bg-forest-700 text-white text-xl rounded-2xl transition-colors hand-drawn border-2 border-forest-600"
              >
                🌱 Begin Quest
              </button>
            )}
          </div>

          {/* Weekly Nature Dose */}
          <div className="bg-white/80 p-5 hand-drawn border-2 border-earth-200">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl text-forest-700">Nature Dose</h2>
              <span className="text-sm text-earth-400">{weeklyTotal}/120 min</span>
            </div>

            {/* Progress bar */}
            <div className="h-3 bg-earth-100 rounded-full mb-4 overflow-hidden">
              <div
                className="h-full bg-forest-400 rounded-full grow-bar transition-all"
                style={{ width: `${Math.min(100, (weeklyTotal / 120) * 100)}%` }}
              />
            </div>
            <p className="text-xs text-earth-400 mb-4">WHO recommends 120 min/week in nature</p>

            {/* Bar chart */}
            <div className="flex items-end justify-between gap-1 h-24">
              {weeklyData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex items-end justify-center" style={{ height: '80px' }}>
                    <div
                      className="w-full max-w-[28px] bg-forest-300 rounded-t-lg transition-all grow-bar"
                      style={{
                        height: d.minutes > 0 ? `${Math.max(8, (d.minutes / 30) * 80)}px` : '0px',
                      }}
                    />
                  </div>
                  <span className="text-xs text-earth-400">{d.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE QUEST (no timer) */}
      {screen === 'quest' && (
        <div className="space-y-6 text-center">
          <div className="bg-white/80 p-8 hand-drawn border-2 border-earth-200">
            <span className="text-5xl mb-4 block breathe">{CATEGORY_EMOJI[quest.category]}</span>
            <p className="text-2xl text-earth-800 leading-relaxed mb-6">
              "{quest.text}"
            </p>
            <button
              onClick={toggleSound}
              className="mb-4 px-6 py-2 bg-earth-100 text-earth-600 rounded-full text-sm hand-drawn border border-earth-200"
            >
              {soundOn ? '🔊 Sounds On' : '🔇 Nature Sounds'}
            </button>
          </div>
          <button
            onClick={finishQuest}
            className="w-full py-4 bg-forest-500 hover:bg-forest-600 text-white text-xl rounded-2xl hand-drawn border-2 border-forest-600"
          >
            ✨ I'm Done
          </button>
        </div>
      )}

      {/* TIMER SCREEN */}
      {screen === 'timer' && (
        <div className="space-y-6 text-center">
          <div className="bg-white/80 p-8 hand-drawn border-2 border-earth-200">
            <p className="text-lg text-earth-500 mb-4">"{quest.text}"</p>

            {/* Timer circle */}
            <div className="relative w-48 h-48 mx-auto mb-6">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#e0d0bb" strokeWidth="4" />
                <circle
                  cx="50" cy="50" r="45" fill="none"
                  stroke="#3d7a3d" strokeWidth="4" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - timeLeft / (quest.timerSeconds || 1))}`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl text-forest-700 font-mono">{formatTime(timeLeft)}</span>
              </div>
            </div>

            <button
              onClick={toggleSound}
              className="px-6 py-2 bg-earth-100 text-earth-600 rounded-full text-sm hand-drawn border border-earth-200"
            >
              {soundOn ? '🔊 Sounds On' : '🔇 Nature Sounds'}
            </button>
          </div>

          <button
            onClick={finishQuest}
            className="w-full py-3 bg-earth-200 text-earth-600 rounded-2xl text-lg"
          >
            Skip Timer →
          </button>
        </div>
      )}

      {/* REFLECTION SCREEN */}
      {screen === 'reflect' && (
        <div className="space-y-6">
          <div className="bg-white/80 p-6 hand-drawn border-2 border-earth-200">
            <h2 className="text-2xl text-forest-700 text-center mb-6">How was that?</h2>

            {(['presence', 'calm', 'wonder'] as const).map(key => (
              <div key={key} className="mb-5">
                <label className="text-lg text-earth-700 capitalize block mb-2">
                  {key === 'presence' ? '🎯 Presence' : key === 'calm' ? '🕊️ Calm' : '✨ Wonder'}
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(v => (
                    <button
                      key={v}
                      onClick={() => setReflection(r => ({ ...r, [key]: v }))}
                      className={`flex-1 py-3 rounded-xl text-lg transition-all ${
                        reflection[key] >= v
                          ? 'bg-forest-400 text-white'
                          : 'bg-earth-100 text-earth-400'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="mb-4">
              <label className="text-lg text-earth-700 block mb-2">📝 Notes (optional)</label>
              <textarea
                value={reflection.note || ''}
                onChange={e => setReflection(r => ({ ...r, note: e.target.value }))}
                placeholder="What did you notice?"
                className="w-full p-3 bg-earth-50 border-2 border-earth-200 rounded-xl text-earth-700 placeholder:text-earth-300 resize-none h-24 focus:outline-none focus:border-forest-300"
              />
            </div>
          </div>

          <button
            onClick={submitReflection}
            className="w-full py-4 bg-forest-500 hover:bg-forest-600 text-white text-xl rounded-2xl hand-drawn border-2 border-forest-600"
          >
            🌿 Complete Quest
          </button>
        </div>
      )}

      {/* DONE SCREEN */}
      {screen === 'done' && (
        <div className="text-center space-y-6 pt-8">
          <div className="text-7xl breathe">🌳</div>
          <h2 className="text-3xl text-forest-700">Beautiful.</h2>
          <p className="text-xl text-earth-500">
            You spent time with nature today.
            {streak > 1 && ` ${streak} days and counting.`}
          </p>
          <div className="bg-white/80 p-4 hand-drawn border-2 border-earth-200 inline-block">
            <p className="text-earth-500">This week: <strong className="text-forest-600">{weeklyTotal} min</strong> / 120 min</p>
          </div>
          <button
            onClick={() => { refreshStats(); setScreen('home'); }}
            className="block mx-auto px-8 py-3 bg-earth-200 text-earth-600 rounded-2xl text-lg"
          >
            ← Back Home
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
