import React from "react";
import {
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  Line,
  LabelList,
} from "recharts";
import { format } from "date-fns";
import styles from "./index.module.css";
import { MoodEntry } from "@types";
import { Div, Text } from "@components";
import { toValidNumber } from "@helpers";

type TimePeriod = "daily" | "weekly" | "monthly";
const tabs: TimePeriod[] = ["daily", "weekly", "monthly"];

interface MoodAnalyticsProps {
  data: MoodEntry[];
  testID?: string;
}

const EMOJIS = ["😔", "😐", "😊"];

export const MoodAnalytics: React.FC<MoodAnalyticsProps> = ({
  data: moodEntries = [],
  testID,
}) => {
  const [activePeriod, setActivePeriod] = React.useState<TimePeriod>("daily");

  const chartData = React.useMemo(() => {
    switch (activePeriod) {
      case "daily":
        return Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));

          const entry = moodEntries.find(
            (e) =>
              format(new Date(e.timestamp), "yyyy-MM-dd") ===
              format(date, "yyyy-MM-dd")
          );

          return {
            value: entry?.score || 0,
            date: format(date, "EEE"),
            emoji: entry?.score ? EMOJIS[entry.score - 1] : "",
          };
        });

      case "weekly":
        return Array.from({ length: 4 }, (_, i) => {
          const weekStart = new Date();
          weekStart.setDate(weekStart.getDate() - (3 - i) * 7);

          const weekEntries = moodEntries.filter((entry) => {
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
            date: format(weekStart, "MMM d"),
          };
        });

      case "monthly":
        return Array.from({ length: 6 }, (_, i) => {
          const monthStart = new Date();
          monthStart.setMonth(monthStart.getMonth() - (5 - i));

          const monthEntries = moodEntries.filter(
            (entry) =>
              format(new Date(entry.timestamp), "yyyy-MM") ===
              format(monthStart, "yyyy-MM")
          );

          const avgScore = monthEntries.length
            ? monthEntries.reduce((sum, entry) => sum + entry.score, 0) /
              monthEntries.length
            : 0;

          return {
            value: Number(avgScore.toFixed(1)),
            date: format(monthStart, "MMM"),
          };
        });

      default:
        return [];
    }
  }, [moodEntries, activePeriod]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload?.[0]) {
      return (
        <Text as="span">
          {payload[0].payload.emoji ||
            toValidNumber(payload[0].value).toFixed(1)}
        </Text>
      );
    }
    return null;
  };

  return (
    <Div className={styles.container} testID={testID}>
      <h2 className={styles.title}>Mood Trends</h2>

      <Div className={styles.tabsContainer}>
        {tabs.map((period) => (
          <button
            key={period}
            onClick={() => setActivePeriod(period)}
            className={`${styles.tab} ${
              activePeriod === period ? styles.activeTab : ""
            }`}
          >
            {period}
          </button>
        ))}
      </Div>

      <Div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--chart-gradient-start)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--chart-gradient-end)"
                  stopOpacity={0.2}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className={styles.chartGrid} />
            <XAxis
              dataKey="date"
              stroke="var(--chart-axis)"
              tick={{ fill: "var(--text-secondary)" }}
            />
            <YAxis
              domain={[0, 3]}
              ticks={[1, 2, 3]}
              stroke="var(--chart-axis)"
              tick={{ fill: "var(--text-secondary)" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--chart-line)"
              fillOpacity={1}
              fill="url(#colorValue)"
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--color-primary)"
              activeDot={{ r: 8 }}
            >
              <LabelList position="top" offset={10} />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      </Div>
    </Div>
  );
};

MoodAnalytics.displayName = "MoodAnalytics";
