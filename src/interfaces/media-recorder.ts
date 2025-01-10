import { TDataavailableEventHandler, TNativeEventTarget, TRecordingState } from '../types';
import { IMediaRecorderEventMap } from './media-encoder-event-map';

export interface IMediaRecorder extends TNativeEventTarget {

    ondataavailable: null | TDataavailableEventHandler;

    readonly state: TRecordingState;

    addEventListener<K extends keyof IMediaRecorderEventMap> (
        type: K,
        listener: (this: IMediaRecorder, event: IMediaRecorderEventMap[K]) => any,
        options?: boolean | AddEventListenerOptions
    ): void;

    addEventListener (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;

    removeEventListener<K extends keyof IMediaRecorderEventMap> (
        type: K,
        listener: (this: IMediaRecorder, event: IMediaRecorderEventMap[K]) => any,
        options?: boolean | EventListenerOptions
    ): void;

    removeEventListener (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;

    start (timeslice?: number): void;

    stop (): void;

}
