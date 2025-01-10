import { IMediaRecorder } from '../interfaces';
import { TNativeEventTarget } from './native-event-target';
export declare type TWebAudioMediaRecorderFactory = (eventTarget: TNativeEventTarget, mediaStream: MediaStream, mimeType: string) => Omit<IMediaRecorder, 'ondataavailable' | keyof TNativeEventTarget>;
//# sourceMappingURL=/build/es2018/types/web-audio-media-recorder-factory.d.ts.map