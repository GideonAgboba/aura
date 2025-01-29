import React from "react";
import styles from "./index.module.css";
import { AppEventType, MoodEntry } from "@types";
import { eventEmitter } from "@helpers";
import { Button, ConditionalDiv, Div, Text } from "@components";

interface MoodTrendProps {
  data: MoodEntry[];
  testID?: string;
  addRandomMoods: (numberOfMoods: number) => void;
}

export const MoodTrend: React.FC<MoodTrendProps> = ({
  data,
  testID,
  addRandomMoods,
}) => {
  const hasEnoughData = data.length >= 3;

  const analyzeMoodTrend = React.useCallback(
    (entries: MoodEntry[]): string => {
      if (!hasEnoughData) return "Not enough data for analysis";

      const scores = entries.map((entry) => entry.score);
      const trendSum = scores
        .slice(1)
        .reduce((sum, score, i) => sum + (score - scores[i]), 0);

      if (trendSum > 1)
        return "Your mood has been improving over the past few days! 🚀";
      if (trendSum < -1)
        return "It seems like you've been feeling a bit down. Hang in there!";

      const fluctuations = scores
        .slice(1)
        .filter((score, i) => Math.abs(score - scores[i]) > 0).length;

      return fluctuations > 2
        ? "Your mood has been varying lately. Try finding balance!"
        : "Your mood has been stable.";
    },
    [hasEnoughData]
  );

  const handleAddRandomMoods = React.useCallback(() => {
    addRandomMoods(10);
    eventEmitter.emit(AppEventType.MOOD_SYNC, {
      timestamp: new Date(),
      success: true,
      entries: 10,
    });
  }, [addRandomMoods]);

  return (
    <Div testID={testID} className={styles.container}>
      <Div className={styles.header}>
        <Div>
          <Text className={styles.text} as="p">{analyzeMoodTrend(data)}</Text>
        </Div>
        <ConditionalDiv
          if={{
            condition: !hasEnoughData,
            render: (
              <Button
                title="Add"
                onClick={handleAddRandomMoods}
              />
            ),
          }}
        />
      </Div>
    </Div>
  );
};
