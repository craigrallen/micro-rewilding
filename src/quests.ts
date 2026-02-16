export type QuestCategory = 'sight' | 'sound' | 'touch' | 'smell' | 'stillness';

export interface Quest {
  id: number;
  text: string;
  category: QuestCategory;
  durationMinutes: number;
  timerSeconds?: number; // if quest has a timed component
}

export const CATEGORY_EMOJI: Record<QuestCategory, string> = {
  sight: '👁️',
  sound: '👂',
  touch: '🤲',
  smell: '👃',
  stillness: '🧘',
};

export const CATEGORY_COLOR: Record<QuestCategory, string> = {
  sight: 'bg-forest-400',
  sound: 'bg-sky-soft',
  touch: 'bg-earth-400',
  smell: 'bg-sunset',
  stillness: 'bg-moss-400',
};

export const quests: Quest[] = [
  // SIGHT (12)
  { id: 1, text: "Find 5 different shades of green within arm's reach.", category: 'sight', durationMinutes: 5 },
  { id: 2, text: "Find something decaying. Watch it for 2 minutes.", category: 'sight', durationMinutes: 3, timerSeconds: 120 },
  { id: 3, text: "Look up. What shapes do the clouds or branches make?", category: 'sight', durationMinutes: 3 },
  { id: 4, text: "Find the smallest living thing you can see. Study it.", category: 'sight', durationMinutes: 5 },
  { id: 5, text: "Watch a shadow move for 60 seconds.", category: 'sight', durationMinutes: 2, timerSeconds: 60 },
  { id: 6, text: "Find something that doesn't belong in nature. Observe it.", category: 'sight', durationMinutes: 3 },
  { id: 7, text: "Spot 3 different insects. What are they doing?", category: 'sight', durationMinutes: 5 },
  { id: 8, text: "Find a pattern in nature — spirals, fractals, symmetry.", category: 'sight', durationMinutes: 5 },
  { id: 9, text: "Watch water move. A puddle, stream, or raindrop on a leaf.", category: 'sight', durationMinutes: 3, timerSeconds: 120 },
  { id: 10, text: "Find something beautiful that most people would walk past.", category: 'sight', durationMinutes: 5 },
  { id: 11, text: "Look at the horizon. Let your eyes rest there for 1 minute.", category: 'sight', durationMinutes: 2, timerSeconds: 60 },
  { id: 12, text: "Find 3 things that are the same color but different textures.", category: 'sight', durationMinutes: 5 },

  // SOUND (11)
  { id: 13, text: "Sit still outside. Count distinct sounds for 3 minutes.", category: 'sound', durationMinutes: 4, timerSeconds: 180 },
  { id: 14, text: "Close your eyes. Point to where each sound comes from.", category: 'sound', durationMinutes: 3, timerSeconds: 120 },
  { id: 15, text: "Find the quietest spot you can. What's the softest sound?", category: 'sound', durationMinutes: 5 },
  { id: 16, text: "Listen to a bird song. Try to whistle it back.", category: 'sound', durationMinutes: 5 },
  { id: 17, text: "Stand near a tree. Can you hear the wind in its leaves?", category: 'sound', durationMinutes: 3, timerSeconds: 120 },
  { id: 18, text: "Walk slowly. Listen only to your footsteps for 2 minutes.", category: 'sound', durationMinutes: 3, timerSeconds: 120 },
  { id: 19, text: "Find running water. Close your eyes and just listen.", category: 'sound', durationMinutes: 3, timerSeconds: 120 },
  { id: 20, text: "Count how many layers of sound you can separate right now.", category: 'sound', durationMinutes: 3, timerSeconds: 120 },
  { id: 21, text: "Listen for 1 minute. What's the most distant sound?", category: 'sound', durationMinutes: 2, timerSeconds: 60 },
  { id: 22, text: "Cup your hands behind your ears. How does the world change?", category: 'sound', durationMinutes: 3 },
  { id: 23, text: "Find a rhythm in nature — dripping water, rustling, chirping.", category: 'sound', durationMinutes: 5 },

  // TOUCH (10)
  { id: 24, text: "Touch tree bark. Close your eyes. What do you notice?", category: 'touch', durationMinutes: 3 },
  { id: 25, text: "Walk barefoot for 40 steps. Describe what you feel.", category: 'touch', durationMinutes: 5 },
  { id: 26, text: "Pick up a stone. Feel its weight, texture, temperature.", category: 'touch', durationMinutes: 3 },
  { id: 27, text: "Let wind touch your face for 1 minute. Eyes closed.", category: 'touch', durationMinutes: 2, timerSeconds: 60 },
  { id: 28, text: "Touch 5 different natural surfaces. Compare them.", category: 'touch', durationMinutes: 5 },
  { id: 29, text: "Hold a leaf. Trace its veins with your fingertip.", category: 'touch', durationMinutes: 3 },
  { id: 30, text: "Put your palm flat on the ground. What do you feel?", category: 'touch', durationMinutes: 2 },
  { id: 31, text: "Find something soft in nature. Something rough. Hold both.", category: 'touch', durationMinutes: 5 },
  { id: 32, text: "Let rain or dew touch your skin. Don't wipe it away.", category: 'touch', durationMinutes: 3 },
  { id: 33, text: "Press your back against a tree. Feel it support you.", category: 'touch', durationMinutes: 3, timerSeconds: 120 },

  // SMELL (9)
  { id: 34, text: "Smell the air deeply 5 times. What layers can you detect?", category: 'smell', durationMinutes: 3 },
  { id: 35, text: "Find a flower or herb. Breathe it in slowly.", category: 'smell', durationMinutes: 3 },
  { id: 36, text: "Crush a leaf gently. What does it smell like?", category: 'smell', durationMinutes: 3 },
  { id: 37, text: "Smell the earth. Kneel down close to soil and inhale.", category: 'smell', durationMinutes: 3 },
  { id: 38, text: "Find 3 different smells within 10 steps.", category: 'smell', durationMinutes: 5 },
  { id: 39, text: "After rain: breathe in petrichor. That's the earth greeting you.", category: 'smell', durationMinutes: 3 },
  { id: 40, text: "Smell tree bark. Then its leaves. Compare.", category: 'smell', durationMinutes: 3 },
  { id: 41, text: "Find the strongest natural scent near you.", category: 'smell', durationMinutes: 5 },
  { id: 42, text: "Breathe through your nose only for 2 minutes outdoors.", category: 'smell', durationMinutes: 3, timerSeconds: 120 },

  // STILLNESS (10)
  { id: 43, text: "Sit on the ground for 5 minutes. Don't check your phone.", category: 'stillness', durationMinutes: 5, timerSeconds: 300 },
  { id: 44, text: "Stand like a tree for 2 minutes. Feet rooted, arms as branches.", category: 'stillness', durationMinutes: 3, timerSeconds: 120 },
  { id: 45, text: "Watch a single spot for 3 minutes. What changes?", category: 'stillness', durationMinutes: 4, timerSeconds: 180 },
  { id: 46, text: "Breathe with nature. Match your breath to the wind or waves.", category: 'stillness', durationMinutes: 5, timerSeconds: 180 },
  { id: 47, text: "Find a comfortable outdoor spot. Do absolutely nothing for 3 minutes.", category: 'stillness', durationMinutes: 4, timerSeconds: 180 },
  { id: 48, text: "Lie on your back outside. Watch the sky for 5 minutes.", category: 'stillness', durationMinutes: 5, timerSeconds: 300 },
  { id: 49, text: "Close your eyes outdoors. Take 10 slow breaths.", category: 'stillness', durationMinutes: 3 },
  { id: 50, text: "Sit with a tree. Lean against it. Just be.", category: 'stillness', durationMinutes: 5, timerSeconds: 300 },
  { id: 51, text: "Watch sunset or sunrise. No photos. Just presence.", category: 'stillness', durationMinutes: 10, timerSeconds: 600 },
  { id: 52, text: "Find an ant. Follow it. See where it goes.", category: 'stillness', durationMinutes: 5, timerSeconds: 180 },
];

export function getDailyQuest(dateStr?: string): Quest {
  const d = dateStr || new Date().toISOString().split('T')[0];
  // Simple hash from date string for deterministic daily quest
  let hash = 0;
  for (let i = 0; i < d.length; i++) {
    hash = ((hash << 5) - hash + d.charCodeAt(i)) | 0;
  }
  return quests[Math.abs(hash) % quests.length];
}
