import clsx from 'clsx';
import {format} from 'date-fns';
import {
  Area,
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import React from 'react';
import {Button, ConditionalDiv, Div, Icon, Text} from '@components';
import {REACTIONS} from '@constants';
import {MoodEntry} from '@types';
import styles from './MoodAnalytics.module.css';

type TimePeriod = 'daily' | 'weekly' | 'monthly';
const tabs: TimePeriod[] = ['daily', 'weekly', 'monthly'];

interface MoodAnalyticsProps {
  data: MoodEntry[];
  testID?: string;
}

export const MoodAnalytics: React.FC<MoodAnalyticsProps> = ({data: moodEntries = [], testID}) => {
  const [activePeriod, setActivePeriod] = React.useState<TimePeriod>('daily');

  const chartData = React.useMemo(() => {
    switch (activePeriod) {
      case 'daily':
        return Array.from({length: 7}, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));

          const entry = moodEntries.find(
            (e) => format(new Date(e.timestamp), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'),
          );

          const emoji = REACTIONS.find((r) => r.type === entry?.mood)?.icon;

          return {
            emoji,
            value: entry?.score || 0,
            date: format(date, 'EEE'),
          };
        });

      case 'weekly':
        return Array.from({length: 4}, (_, i) => {
          const weekStart = new Date();
          weekStart.setDate(weekStart.getDate() - (3 - i) * 7);

          const weekEntries = moodEntries.filter((entry) => {
            const entryDate = new Date(entry.timestamp);
            return (
              entryDate >= weekStart &&
              entryDate < new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000)
            );
          });

          const avgScore = weekEntries.length
            ? weekEntries.reduce((sum, entry) => sum + entry.score, 0) / weekEntries.length
            : 0;

          return {
            value: Number(avgScore.toFixed(1)),
            date: format(weekStart, 'MMM d'),
          };
        });

      case 'monthly':
        return Array.from({length: 6}, (_, i) => {
          const monthStart = new Date();
          monthStart.setMonth(monthStart.getMonth() - (5 - i));

          const monthEntries = moodEntries.filter(
            (entry) =>
              format(new Date(entry.timestamp), 'yyyy-MM') === format(monthStart, 'yyyy-MM'),
          );

          const avgScore = monthEntries.length
            ? monthEntries.reduce((sum, entry) => sum + entry.score, 0) / monthEntries.length
            : 0;

          return {
            value: Number(avgScore.toFixed(1)),
            date: format(monthStart, 'MMM'),
          };
        });

      default:
        return [];
    }
  }, [moodEntries, activePeriod]);

  const CustomTooltip = ({active, payload}: any) => {
    if (active && payload?.[0]) {
      const icon = payload[0].payload.emoji;
      return (
        <ConditionalDiv
          if={{condition: !!icon, render: <Icon name={icon} width={20} height={20} />}}
        />
      );
    }
    return null;
  };

  return (
    <Div className={styles.container} testID={testID}>
      <Text as="h2" className={styles.title}>
        Mood Trends
      </Text>

      <Div className={styles.tabsContainer}>
        {tabs.map((period) => (
          <Button
            key={period}
            title={period}
            onClick={() => setActivePeriod(period)}
            className={clsx(styles.tab, activePeriod === period && styles.activeTab)}
            titleStyle={styles.tabText}
          />
        ))}
      </Div>

      <Div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData} margin={{top: 20, right: 20, bottom: 20, left: 20}}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-gradient-start)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--chart-gradient-end)" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className={styles.chartGrid} />
            <XAxis
              dataKey="date"
              stroke="var(--chart-axis)"
              tick={{fill: 'var(--text-secondary)'}}
            />
            <YAxis
              domain={[0, 3]}
              ticks={[1, 2, 3]}
              stroke="var(--chart-axis)"
              tick={{fill: 'var(--text-secondary)'}}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--chart-line)"
              fillOpacity={1}
              fill="url(#colorValue)"
            />
            <Line type="monotone" dataKey="value" stroke="var(--color-primary)" activeDot={{r: 8}}>
              <LabelList position="top" offset={10} />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      </Div>
    </Div>
  );
};

MoodAnalytics.displayName = 'MoodAnalytics';
