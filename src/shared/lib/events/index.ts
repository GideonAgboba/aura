import EventEmitter from 'eventemitter3';
import {AppEventMap} from '@types';

export const eventEmitter = new EventEmitter<AppEventMap>();
