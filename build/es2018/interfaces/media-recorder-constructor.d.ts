import { IMediaRecorder } from './media-recorder';
import { IMediaRecorderOptions } from './media-recorder-options';
export interface IMediaRecorderConstructor {
    new (stream: MediaStream, options?: IMediaRecorderOptions): IMediaRecorder;
    isTypeSupported(mimeType: string): boolean;
}
//# sourceMappingURL=/build/es2018/interfaces/media-recorder-constructor.d.ts.map