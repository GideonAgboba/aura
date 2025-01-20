import {AppEventMap} from '@types';
import EventEmitter from 'eventemitter3';

export const eventEmitter = new EventEmitter<AppEventMap>();
