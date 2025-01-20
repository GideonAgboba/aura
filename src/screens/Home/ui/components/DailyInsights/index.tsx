import React from 'react';
import {DailyInsightMetric} from './DailyInsightMetric';
import {useEvent, useMood} from '@hooks';
import {Platform, Pressable, Vibration} from 'react-native';
import {AppEventType, InsightMetric} from '@types';
import {Text, View} from '@components';
import {
  ArrowPathIcon,
  CalendarIcon,
  FaceSmileIcon,
} from 'react-native-heroicons/outline';
import tw from '@libs/tailwind';
import {MoodTrend} from './MoodTrend';
import {MoodAnalytics} from './MoodAnalytics';
import {DAILY_INSIGHTS_TEST_IDS} from '@constants';
import {getRandomNumber} from '@helpers';

const RANDOM_TASK_VALUE = getRandomNumber();

export const DailyInsights: React.FC = () => {
  const {moodEntries, weeklyMoods, addRandomMoods} = useMood();
  const [tasksCompleted, setTasksCompleted] =
    React.useState<number>(RANDOM_TASK_VALUE);
  const [moodScore, setMoodScore] = React.useState<number>(0);
  const [isRefreshing, setIsRefreshing] = React.useState<boolean>(false);

  const calculateMoodScore = React.useCallback((): number => {
    if (weeklyMoods.length === 0) {
      return 0;
    }

    const sum = weeklyMoods.reduce((acc, entry) => acc + entry.score, 0);
    return Number((sum / weeklyMoods.length).toFixed(1));
  }, [weeklyMoods]);

  const refreshTasks = React.useCallback(() => {
    Platform.OS === 'ios' && Vibration.vibrate(50);
    setIsRefreshing(true);
    setTasksCompleted(getRandomNumber());
  }, []);

  React.useLayoutEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isRefreshing) {
      timeoutId = setTimeout(() => {
        setIsRefreshing(false);
      }, 500);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isRefreshing]);

  React.useLayoutEffect(() => {
    setMoodScore(calculateMoodScore());
  }, [calculateMoodScore, weeklyMoods]);

  useEvent({
    eventType: AppEventType.MOOD_SYNC,
    handler: payload => {
      if (payload.success) {
        refreshTasks();
      }
    },
  });

  const metrics: InsightMetric[] = [
    {
      id: 1,
      value: tasksCompleted,
      label: 'Tasks Completed',
      icon: <CalendarIcon size={25} color={tw.color('tasks-completed')} />,
      bgColor: 'bg-green-50 dark:bg-white',
    },
    {
      id: 2,
      value: moodScore,
      label: 'Mood Score',
      icon: <FaceSmileIcon size={25} color={tw.color('mood-score')} />,
      bgColor: 'bg-blue-50 dark:bg-white',
    },
  ];

  return (
    <View className="gap-y-2">
      <View className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm">
        <View className="flex-row justify-between items-center mb-5">
          <Text className="text-xl font-semibold text-gray-900">
            Daily Insights
          </Text>
          <Pressable
            testID={DAILY_INSIGHTS_TEST_IDS.REFRESH_BUTTON}
            onPress={refreshTasks}
            style={tw`p-2 rounded-full hover:bg-gray-100`}>
            <ArrowPathIcon size={24} color={tw.color('gray-500')} />
          </Pressable>
        </View>

        <View className="flex-row gap-x-3 justify-between">
          {metrics.map(metric => (
            <DailyInsightMetric key={`metric-${metric.id}`} metric={metric} />
          ))}
        </View>
      </View>
      <MoodTrend
        testID={DAILY_INSIGHTS_TEST_IDS.MOOD_TREND}
        data={moodEntries}
        addRandomMoods={addRandomMoods}
      />
      <MoodAnalytics
        testID={DAILY_INSIGHTS_TEST_IDS.MOOD_ANALYTICS}
        data={moodEntries}
      />
    </View>
  );
};

DailyInsights.displayName = 'DailyInsights';
