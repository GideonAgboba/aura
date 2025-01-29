import React from "react";
import { DailyInsightMetric } from "./DailyInsightMetric";
import { useEvent, useMood } from "@hooks";
import { AppEventType, InsightMetric } from "@types";
import {
  ArrowPathIcon,
  CalendarIcon,
  FaceSmileIcon,
} from "@heroicons/react/24/outline";
import { MoodTrend } from "./MoodTrend";
import { MoodAnalytics } from "./MoodAnalytics";
import { getRandomNumber } from "@helpers";
import styles from "./index.module.css";
import { DAILY_INSIGHTS_TEST_IDS } from "@constants";
import { Button, Div, Text } from "@components";

const RANDOM_TASK_VALUE = getRandomNumber();

export const DailyInsights: React.FC = () => {
  const { moodEntries, weeklyMoods, addRandomMoods } = useMood();
  const [tasksCompleted, setTasksCompleted] = React.useState(RANDOM_TASK_VALUE);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const calculateMoodScore = React.useCallback((): number => {
    if (weeklyMoods.length === 0) return 0;
    const sum = weeklyMoods.reduce((acc, entry) => acc + entry.score, 0);
    return Number((sum / weeklyMoods.length).toFixed(1));
  }, [weeklyMoods]);

  const refreshTasks = React.useCallback(() => {
    setIsRefreshing(true);
    setTasksCompleted(getRandomNumber());
  }, []);

  React.useLayoutEffect(() => {
    if (!isRefreshing) return;
    const timeoutId = setTimeout(() => setIsRefreshing(false), 500);
    return () => clearTimeout(timeoutId);
  }, [isRefreshing]);

  useEvent({
    eventType: AppEventType.MOOD_SYNC,
    handler: (payload) => {
      if (payload.success) refreshTasks();
    },
  });

  const metrics: InsightMetric[] = React.useMemo(
    () => [
      {
        id: 1,
        value: tasksCompleted,
        label: "Tasks Completed",
        icon: <CalendarIcon className={styles.tasksIcon} />,
        bgClass: styles.tasksBackground,
      },
      {
        id: 2,
        value: calculateMoodScore(),
        label: "Mood Score",
        icon: <FaceSmileIcon className={styles.moodIcon} />,
        bgClass: styles.moodBackground,
      },
    ],
    [calculateMoodScore, tasksCompleted]
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
              onClick={refreshTasks}
              className={styles.refreshButton}
              testID={DAILY_INSIGHTS_TEST_IDS.REFRESH_BUTTON}
              icon={
                <ArrowPathIcon
                  className={`${styles.refreshIcon} ${
                    isRefreshing ? styles.spinning : ""
                  }`}
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
      <MoodAnalytics
        data={moodEntries}
        testID={DAILY_INSIGHTS_TEST_IDS.MOOD_ANALYTICS}
      />
    </Div>
  );
};

DailyInsights.displayName = "DailyInsights";
