import {Text, View} from '@components';
import {DAILY_INSIGHTS_TEST_IDS} from '@constants';
import tw from '@libs/tailwind';
import {InsightMetric} from '@types';
import React from 'react';

interface DailyInsightMetricProps {
  metric: InsightMetric;
}

export const DailyInsightMetric: React.FC<DailyInsightMetricProps> = ({
  metric,
}) => (
  <View style={tw`flex-1 p-4 rounded-xl items-center ${metric.bgColor}`}>
    <Text
      testID={`${
        metric.id === 1
          ? DAILY_INSIGHTS_TEST_IDS.TASKS_VALUE
          : DAILY_INSIGHTS_TEST_IDS.MOOD_SCORE_VALUE
      }`}
      className="text-2xl font-bold text-gray-900 dark:text-black mt-3 mb-1">
      {metric.value}
    </Text>
    <Text className="text-sm text-gray-600 dark:text-gray-700 text-center">
      {metric.label}
    </Text>
    <View
      style={tw`absolute -top-2 p-1.5 rounded-full items-center ${metric.bgColor}`}>
      {metric.icon}
    </View>
  </View>
);

DailyInsightMetric.displayName = 'DailyInsightMetric';
