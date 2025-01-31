import moment from 'moment';
import {useCallback, useMemo} from 'react';
import {REACTIONS} from '@constants';
import {generateRandomMoodEntries, getFormattedDate} from '@lib';
import {useStore} from '@store';
import {ReactionType} from '@types';

export const useMood = () => {
  const {moodEntries, addMoodEntry, setMoodEntries, getMoodEntriesForDateRange} = useStore();
  const startOfWeek = moment().startOf('week');
  const endOfWeek = moment().endOf('week');

  const weeklyMoods = getMoodEntriesForDateRange(startOfWeek, endOfWeek);

  const activeEmotion = useMemo(() => {
    const emotion = weeklyMoods.find((mood) => mood.id === getFormattedDate(new Date()));
    return !!emotion && emotion?.mood
      ? REACTIONS.find((reaction) => reaction.type === emotion.mood)
      : undefined;
  }, [weeklyMoods]);

  const addMood = useCallback(
    (mood: ReactionType, callback?: () => void) => {
      addMoodEntry({
        mood,
        score: mood,
        timestamp: new Date(),
      });
      callback && callback();
    },
    [addMoodEntry],
  );

  const addRandomMoods = useCallback(
    (numberOfMoods: number) => {
      const entries = generateRandomMoodEntries(numberOfMoods);
      setMoodEntries(entries);
    },
    [setMoodEntries],
  );

  return {moodEntries, weeklyMoods, activeEmotion, addMood, addRandomMoods};
};
