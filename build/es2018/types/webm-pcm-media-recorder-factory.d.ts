import { IMediaRecorder } from '../interfaces';
import { TNativeEventTarget } from './native-event-target';
import { TNativeMediaRecorderConstructor } from './native-media-recorder-constructor';
export declare type TWebmPcmMediaRecorderFactory = (eventTarget: TNativeEventTarget, nativeMediaRecorderConstructor: TNativeMediaRecorderConstructor, mediaStream: MediaStream, mimeType: string) => Omit<IMediaRecorder, 'ondataavailable' | keyof TNativeEventTarget>;
//# sourceMappingURL=/build/es2018/types/webm-pcm-media-recorder-factory.d.ts.map