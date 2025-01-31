import clsx from 'clsx';
import React from 'react';
import {Button, ConditionalDiv, Div, Text} from '@components';
import {analyzeMoodTrend, eventEmitter} from '@lib';
import {AppEventType, MoodEntry} from '@types';
import {TrendStats} from '../TrendStats';
import styles from './MoodTrend.module.css';

interface MoodTrendProps {
  data: MoodEntry[];
  testID?: string;
  addRandomMoods: (numberOfMoods: number) => void;
}

export const MoodTrend: React.FC<MoodTrendProps> = ({data, testID, addRandomMoods}) => {
  const hasEnoughData = data.length >= 3;

  const trend = React.useMemo(() => analyzeMoodTrend(data), [data]);

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
      <Div className={styles.messageBox}>
        <Div className={clsx(hasEnoughData && styles.textContainer)}>
          <Text className={styles.text} as="p">
            {trend.message}
          </Text>
        </Div>
        <ConditionalDiv
          if={{
            condition: !hasEnoughData,
            render: (
              <Button title="Add" onClick={handleAddRandomMoods} titleStyle={styles.buttonText} />
            ),
          }}
        />
      </Div>
      <ConditionalDiv
        if={{
          condition: hasEnoughData,
          render: (
            <TrendStats
              trend={trend.trend}
              fluctuationRate={trend.fluctuationRate}
              severity={trend.severity}
            />
          ),
        }}
      />
    </Div>
  );
};
