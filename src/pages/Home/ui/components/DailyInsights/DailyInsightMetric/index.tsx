import React from "react";
import styles from "./index.module.css";
import { InsightMetric } from "@types";
import { Div, Text } from "@components";
import { DAILY_INSIGHTS_TEST_IDS } from "@constants";
import { toValidNumber } from "@helpers";

interface DailyInsightMetricProps {
  metric: InsightMetric;
}

export const DailyInsightMetric: React.FC<DailyInsightMetricProps> = ({
  metric,
}) => (
  <Div className={`${styles.container} ${styles[metric.bgClass]}`}>
    <Text
      as="span"
      className={styles.value}
      testID={`${
        metric.id === 1
          ? DAILY_INSIGHTS_TEST_IDS.TASKS_VALUE
          : DAILY_INSIGHTS_TEST_IDS.MOOD_SCORE_VALUE
      }`}
    >
      {toValidNumber(metric.value)}
    </Text>
    <Text as="span" className={styles.label}>
      {metric.label}
    </Text>
    <Div className={`${styles.iconContainer} ${styles[metric.bgClass]}`}>
      {metric.icon}
    </Div>
  </Div>
);

DailyInsightMetric.displayName = "DailyInsightMetric";
