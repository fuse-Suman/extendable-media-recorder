import { IMediaRecorderConstructor } from '../interfaces';
import { TEventTargetConstructor } from './event-target-constructor';
import { TNativeMediaRecorderConstructor } from './native-media-recorder-constructor';
import { TNativeMediaRecorderFactory } from './native-media-recorder-factory';
import { TNotSupportedErrorFactory } from './not-supported-error-factory';
import { TWebAudioMediaRecorderFactory } from './web-audio-media-recorder-factory';
import { TWebmPcmMediaRecorderFactory } from './webm-pcm-media-recorder-factory';
export declare type TMediaRecorderConstructorFactory = (createNativeMediaRecorder: TNativeMediaRecorderFactory, createNotSupportedError: TNotSupportedErrorFactory, createWebAudioMediaRecorder: TWebAudioMediaRecorderFactory, createWebmPcmMediaRecorder: TWebmPcmMediaRecorderFactory, encoderRegexes: RegExp[], eventTargetConstructor: TEventTargetConstructor, nativeMediaRecorderConstructor: null | TNativeMediaRecorderConstructor) => IMediaRecorderConstructor;
//# sourceMappingURL=/build/es2018/types/media-recorder-constructor-factory.d.ts.map