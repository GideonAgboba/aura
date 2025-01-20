import {Button, ConditionalView, Text, View} from '@components';
import {eventEmitter} from '@helpers';
import tw from '@libs/tailwind';
import {AppEventType, MoodEntry} from '@types';
import React from 'react';

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
      if (!hasEnoughData) {
        return 'Not enough data for analysis';
      }

      const scores = entries.map(entry => entry.score);

      let trendSum = 0;
      for (let i = 1; i < scores.length; i++) {
        trendSum += scores[i] - scores[i - 1];
      }

      if (trendSum > 1) {
        return 'Your mood has been improving over the past few days! 🚀';
      } else if (trendSum < -1) {
        return "It seems like you've been feeling a bit down. Hang in there!";
      }

      // Extra check for fluctuation
      let fluctuations = 0;
      for (let i = 1; i < scores.length; i++) {
        if (Math.abs(scores[i] - scores[i - 1]) > 0) {
          fluctuations++;
        }
      }

      if (fluctuations > 2) {
        return 'Your mood has been varying lately. Try finding balance!';
      }

      return 'Your mood has been stable.';
    },
    [hasEnoughData],
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
    <View
      testID={testID}
      className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm">
      <View className="flex-row items-center justify-between">
        <View>
          <Text>{analyzeMoodTrend(data)}</Text>
        </View>
        <ConditionalView
          if={{
            condition: !hasEnoughData,
            render: (
              <Button
                title="Add"
                onPress={handleAddRandomMoods}
                textStyle={tw`text-sm`}
                containerStyle={tw`p-1 h-full w-auto`}
              />
            ),
          }}
        />
      </View>
    </View>
  );
};

MoodTrend.displayName = 'MoodTrend';
