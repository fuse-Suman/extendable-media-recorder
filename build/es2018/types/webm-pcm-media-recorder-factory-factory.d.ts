import { TDecodeWebMChunkFunction } from './decode-web-m-chunk-function';
import { TInvalidModificationErrorFactory } from './invalid-modification-error-factory';
import { TNotSupportedErrorFactory } from './not-supported-error-factory';
import { TWebmPcmMediaRecorderFactory } from './webm-pcm-media-recorder-factory';
export declare type TWebmPcmMediaRecorderFactoryFactory = (createInvalidModificationError: TInvalidModificationErrorFactory, createNotSupportedError: TNotSupportedErrorFactory, decodeWebMChunk: TDecodeWebMChunkFunction) => TWebmPcmMediaRecorderFactory;
//# sourceMappingURL=/build/es2018/types/webm-pcm-media-recorder-factory-factory.d.ts.map