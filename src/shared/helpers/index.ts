import {REACTIONS} from '@constants';
import {MoodEntry} from '@types';
import moment from 'moment';

export * from './eventEmitter';

export const getTimeOfDay = ():
  | 'morning'
  | 'afternoon'
  | 'evening'
  | 'night' => {
  const hour = moment().hour();

  if (hour >= 5 && hour < 12) {
    return 'morning';
  } else if (hour >= 12 && hour < 17) {
    return 'afternoon';
  } else if (hour >= 17 && hour < 21) {
    return 'evening';
  } else {
    return 'night';
  }
};

export const toValidNumber = (value: number, defaultValue = 0): number => isNaN(value) ? defaultValue : value;

export const getFormattedDate = (date: Date) =>
  moment(date).format('MMM-D-YYYY');

export const generateRandomMoodEntries = (
  numberOfDays: number = 10,
): MoodEntry[] => {
  const moodTypes = REACTIONS.map(reaction => reaction.name);
  const moodScores = REACTIONS.reduce(
    (acc, reaction, index) => ({
      ...acc,
      [reaction.name]: REACTIONS.length - index,
    }),
    {} as Record<string, number>,
  );
  const entries: MoodEntry[] = [];

  for (let i = 0; i < numberOfDays; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const randomMood = moodTypes[Math.floor(Math.random() * moodTypes.length)];

    entries.push({
      id: Math.random().toString(36).substring(7),
      timestamp: date,
      mood: moodScores[randomMood],
      score: moodScores[randomMood],
      note: `Random mood for ${date.toLocaleDateString()}`,
    });
  }

  return entries.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
};

/**
 * @note
 * The getRandomNumber number helper function dynamically mocks the user’s mood data as given requested in Technical details (3.):
 * - Data Handling: Mock the user’s mood data in a local array (e.g., an array of objects with dates and mood scores).
 */
export const getRandomNumber = () => Math.floor(Math.random() * 10) + 1;
