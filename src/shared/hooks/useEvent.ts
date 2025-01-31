import {useEffect} from 'react';
import {eventEmitter} from '@lib';
import {AppEventType, EventPayload} from '@types';

interface UseEventProps<T extends AppEventType> {
  eventType: T;
  handler: (payload: EventPayload<T>) => void;
  deps?: any[];
}

export const useEvent = <T extends AppEventType>({
  eventType,
  handler,
  deps = [],
}: UseEventProps<T>) => {
  useEffect(() => {
    eventEmitter.on(eventType, handler);
    return () => {
      eventEmitter.off(eventType, handler);
    };
  }, [eventType, handler, deps]);
};
