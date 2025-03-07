import { TElementType } from './element-type';
export declare type TDecodeWebMChunkFunction = (dataView: Pick<DataView, 'byteLength' | 'byteOffset' | 'getFloat32' | 'getUint8'>, elementType: null | TElementType, channelCount?: number) => {
    contents: (readonly Float32Array[])[];
    currentElementType: null | TElementType;
    offset: number;
};
//# sourceMappingURL=/build/es2018/types/decode-web-m-chunk-function.d.ts.map