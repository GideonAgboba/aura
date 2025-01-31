import clsx from 'clsx';
import React from 'react';
import {Div, Text} from '@components';
import {DAILY_INSIGHTS_TEST_IDS} from '@constants';
import {toValidNumber} from '@lib';
import {InsightMetric} from '@types';
import styles from './DailyInsightMetric.module.css';

interface DailyInsightMetricProps {
  metric: InsightMetric;
}
export const DailyInsightMetric: React.FC<DailyInsightMetricProps> = ({metric}) => (
  <Div className={clsx(styles.container, metric.bgClass)}>
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
    <Div className={clsx(styles.iconContainer, metric.bgClass)}>{metric.icon}</Div>
  </Div>
);

DailyInsightMetric.displayName = 'DailyInsightMetric';
