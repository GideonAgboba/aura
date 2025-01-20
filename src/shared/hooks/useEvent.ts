import {AppEventType, EventPayload} from '@types';
import {useEffect} from 'react';
import {eventEmitter} from '../helpers/eventEmitter';

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
