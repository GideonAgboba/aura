import clsx from 'clsx';
import React from 'react';
import {Button, Div, Text} from '@components';
import {DAILY_INSIGHTS_TEST_IDS} from '@constants';
import {ArrowPathIcon, CalendarIcon, FaceSmileIcon} from '@heroicons/react/24/outline';
import {useEvent, useMood} from '@hooks';
import {getRandomNumber} from '@lib';
import {AppEventType, InsightMetric} from '@types';
import {DailyInsightMetric, MoodAnalytics, MoodTrend} from './components';
import styles from './DailyInsights.module.css';

const REFRESH_TIMEOUT = 500;

export const DailyInsights: React.FC = () => {
  const {moodEntries, weeklyMoods, addRandomMoods} = useMood();
  const [tasksCompleted, setTasksCompleted] = React.useState<number>(() => getRandomNumber());
  const [isRefreshing, setIsRefreshing] = React.useState<boolean>(false);

  const moodScore = React.useMemo(() => {
    if (!weeklyMoods.length) return 0;

    const sum = weeklyMoods.reduce((acc, entry) => acc + entry.score, 0);
    return Number((sum / weeklyMoods.length).toFixed(1));
  }, [weeklyMoods]);

  const handleRefresh = React.useCallback(() => {
    setIsRefreshing(true);

    /** @note Refreshing tasks completed at random (Not part of the requirement as it's already set randomly on app load) */
    setTasksCompleted(getRandomNumber());
  }, []);

  React.useEffect(() => {
    if (!isRefreshing) return;

    const timeoutId = window.setTimeout(() => {
      setIsRefreshing(false);
    }, REFRESH_TIMEOUT);

    return () => window.clearTimeout(timeoutId);
  }, [isRefreshing]);

  useEvent({
    eventType: AppEventType.MOOD_SYNC,
    handler: (payload) => {
      if (payload.success) handleRefresh();
    },
  });

  const metrics = React.useMemo<InsightMetric[]>(
    () => [
      {
        id: 1,
        value: tasksCompleted,
        label: 'Tasks Completed',
        icon: <CalendarIcon className={styles.tasksIcon} />,
        bgClass: styles.tasksBackground,
      },
      {
        id: 2,
        value: moodScore,
        label: 'Mood Score',
        icon: <FaceSmileIcon className={styles.moodIcon} />,
        bgClass: styles.moodBackground,
      },
    ],
    [moodScore, tasksCompleted],
  );

  return (
    <Div className={styles.container}>
      <Div className={styles.containerContent}>
        <Div className={styles.insightsCard}>
          <Div className={styles.header}>
            <Text as="h2" className={styles.title}>
              Daily Insights
            </Text>
            <Button
              onClick={handleRefresh}
              className={styles.refreshButton}
              testID={DAILY_INSIGHTS_TEST_IDS.REFRESH_BUTTON}
              icon={
                <ArrowPathIcon
                  className={clsx(styles.refreshIcon, isRefreshing && styles.spinning)}
                />
              }
            />
          </Div>

          <Div className={styles.metricsContainer}>
            {metrics.map((metric) => (
              <DailyInsightMetric key={`metric-${metric.id}`} metric={metric} />
            ))}
          </Div>
        </Div>

        <MoodTrend
          data={moodEntries}
          addRandomMoods={addRandomMoods}
          testID={DAILY_INSIGHTS_TEST_IDS.MOOD_TREND}
        />
      </Div>
      <MoodAnalytics data={moodEntries} testID={DAILY_INSIGHTS_TEST_IDS.MOOD_ANALYTICS} />
    </Div>
  );
};

DailyInsights.displayName = 'DailyInsights';
