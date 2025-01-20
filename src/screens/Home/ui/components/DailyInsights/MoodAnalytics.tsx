import React, {useState, useMemo} from 'react';
import {LineChart} from 'react-native-gifted-charts';
import {format} from 'date-fns';
import {MoodEntry} from '@types';
import {Text, View} from '@components';
import {Pressable} from 'react-native';
import tw from '@libs/tailwind';
import {useTheme} from '@hooks';

type ViewPeriod = 'daily' | 'weekly' | 'monthly';
const tabs: ViewPeriod[] = ['daily', 'weekly', 'monthly'];

interface MoodAnalyticsProps {
  data: MoodEntry[];
  testID?: string;
}

export const MoodAnalytics: React.FC<MoodAnalyticsProps> = ({
  data: moodEntries = [],
  testID,
}) => {
  const {isDark} = useTheme();
  const [activePeriod, setActivePeriod] = useState<ViewPeriod>('daily');

  const chartData = useMemo(() => {
    let data = [];

    switch (activePeriod) {
      case 'daily':
        data = Array.from({length: 7}, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));

          const entry = moodEntries.find(
            e =>
              format(new Date(e.timestamp), 'yyyy-MM-dd') ===
              format(date, 'yyyy-MM-dd'),
          );

          return {
            value: entry?.score || 0,
            label: format(date, 'EEE'),
            frontColor: tw.color('chart-line'),
            topLabelComponent: () => (
              <Text className="text-sm">
                {entry?.score ? ['😔', '😐', '😊'][entry.score - 1] : ''}
              </Text>
            ),
          };
        });
        break;

      case 'weekly':
        data = Array.from({length: 4}, (_, i) => {
          const weekStart = new Date();
          weekStart.setDate(weekStart.getDate() - (3 - i) * 7);

          const weekEntries = moodEntries.filter(entry => {
            const entryDate = new Date(entry.timestamp);
            return (
              entryDate >= weekStart &&
              entryDate <
                new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000)
            );
          });

          const avgScore = weekEntries.length
            ? weekEntries.reduce((sum, entry) => sum + entry.score, 0) /
              weekEntries.length
            : 0;

          return {
            value: Number(avgScore.toFixed(1)),
            label: format(weekStart, 'MMM d'),
            frontColor: tw.color('chart-line'),
          };
        });
        break;

      case 'monthly':
        data = Array.from({length: 6}, (_, i) => {
          const monthStart = new Date();
          monthStart.setMonth(monthStart.getMonth() - (5 - i));

          const monthEntries = moodEntries.filter(entry => {
            const entryDate = new Date(entry.timestamp);
            return (
              format(entryDate, 'yyyy-MM') === format(monthStart, 'yyyy-MM')
            );
          });

          const avgScore = monthEntries.length
            ? monthEntries.reduce((sum, entry) => sum + entry.score, 0) /
              monthEntries.length
            : 0;

          return {
            value: Number(avgScore.toFixed(1)),
            label: format(monthStart, 'MMM'),
            frontColor: tw.color('chart-line'),
          };
        });
        break;
    }

    return data;
  }, [moodEntries, activePeriod]);

  return (
    <View
      testID={testID}
      className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm">
      <Text className="text-xl font-semibold text-gray-900 mb-4">
        Mood Trends
      </Text>

      <View className="flex-row mb-4 bg-gray-100 rounded-lg p-1">
        {tabs.map(period => (
          <Pressable
            key={period}
            onPress={() => setActivePeriod(period)}
            style={tw.style('flex-1 py-2 px-4 rounded-md', {
              'bg-white shadow': activePeriod === period,
            })}>
            <Text
              style={tw.style('text-center capitalize text-gray-600', {
                'text-blue-600': activePeriod === period,
              })}>
              {period}
            </Text>
          </Pressable>
        ))}
      </View>

      <View className="h-65 mt-4">
        <LineChart
          data={chartData}
          height={230}
          spacing={40}
          initialSpacing={20}
          color={tw.color('red-700')}
          thickness={2}
          startFillColor={tw.color('primary')}
          endFillColor={tw.color('red-200')}
          startOpacity={0.9}
          endOpacity={0.2}
          backgroundColor={tw.color(isDark ? 'gray-900' : 'white')}
          xAxisColor={tw.color('chart-axis')}
          yAxisColor={tw.color('chart-axis')}
          yAxisThickness={0}
          rulesType="solid"
          rulesColor={tw.color('chart-rules')}
          yAxisTextStyle={{color: tw.color('chart-text')}}
          xAxisLabelTextStyle={{color: tw.color('chart-text')}}
          hideRules
          maxValue={3}
          noOfSections={3}
          yAxisLabelSuffix=""
          hideDataPoints
          areaChart
          curved
        />
      </View>
    </View>
  );
};

MoodAnalytics.displayName = 'MoodAnalytics';
