import {ReactionInfo, ReactionType} from '@types';

export const SHARED_TRANSITION_TAGS = {
  SPLASH: {
    HEADER: {
      id: '__SPLASH_HEADER',
    },
  },
};

export const SPLASH_SIMILAR_WORDS = [
  'atmosphere',
  'air',
  'quality',
  'aspect',
  'character',
  'ambience',
  'mood',
  'spirit',
  'feeling',
  'feel',
  'flavour',
  'colouring',
  'colour',
  'complexion',
  'climate',
  'tone',
  'overtone',
  'undertone',
  'tenor',
  'impression',
  'suggestion',
  'emanation',
  'vibrations',
  'vibes',
  'vibe',
];

export const REACTIONS: ReactionInfo[] = [
  {
    type: ReactionType.SAD,
    name: 'sad',
    icon: 'emoji-sad',
  },
  {
    type: ReactionType.NEUTRAL,
    name: 'neutral',
    icon: 'emoji-neutral',
  },
  {
    type: ReactionType.HAPPY,
    name: 'happy',
    icon: 'emoji-happy',
  },
];

export const DAILY_INSIGHTS_TEST_IDS = {
  TASKS_VALUE: 'tasks-value',
  MOOD_SCORE_VALUE: 'mood-score-value',
  REFRESH_BUTTON: 'refresh-button',
  MOOD_TREND: 'mood-trend',
  MOOD_ANALYTICS: 'mood-analytics',
};

export const BUTTON_PRESS_OPACITY = 0.8;
