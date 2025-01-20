/* eslint-disable react/require-default-props */
import React, {
  useCallback,
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
  useRef,
} from 'react';
import {Text} from './Text';
import {TextStyle} from 'react-native';
import tw from '@libs/tailwind';

export interface TimerProps {
  timer: number;
  textStyle?: TextStyle | string;
  onExpire?: () => void;
  showHours?: boolean;
  format?: 'full' | 'compact';
}

export interface TimerRef {
  reset: () => void;
}

const formatNumber = (
  num: number,
  format: 'full' | 'compact' = 'full',
): string => {
  if (format === 'compact' && num < 10) {
    return num.toString();
  }
  return num.toString().padStart(2, '0');
};

const formatTime = (
  totalSeconds: number,
  showHours: boolean = false,
  format: 'full' | 'compact' = 'full',
): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0 || showHours) {
    return `${formatNumber(hours, format)}:${formatNumber(
      minutes,
    )}:${formatNumber(seconds)}`;
  }

  return `${formatNumber(minutes, format)}:${formatNumber(seconds)}`;
};

export const Timer = forwardRef<TimerRef, TimerProps>(
  (
    {timer, textStyle, onExpire = () => {}, showHours = false, format = 'full'},
    ref,
  ) => {
    const [count, setCount] = useState(timer);
    const clockCall = useRef<NodeJS.Timeout | null>(null);

    const decrementClock = useCallback(() => {
      setCount(prevCount => {
        if (prevCount <= 0) {
          if (clockCall.current) {
            clearInterval(clockCall.current);
          }
          onExpire();
          return 0;
        } else {
          return prevCount - 1;
        }
      });
    }, [onExpire]);

    const reset = useCallback(() => {
      if (clockCall.current) {
        clearInterval(clockCall.current);
      }
      setCount(timer);
      clockCall.current = setInterval(decrementClock, 1000);
    }, [timer, decrementClock]);

    useImperativeHandle(ref, () => ({
      reset,
    }));

    useEffect(() => {
      clockCall.current = setInterval(decrementClock, 1000);

      return () => {
        if (clockCall.current) {
          clearInterval(clockCall.current);
        }
      };
    }, [decrementClock]);

    return (
      <Text style={tw.style(textStyle)}>
        {formatTime(count, showHours, format)}
      </Text>
    );
  },
);

Timer.displayName = 'Timer';
