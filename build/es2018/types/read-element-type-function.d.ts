import { TElementType } from './element-type';
export declare type TReadElementTypeFunction = (dataView: Pick<DataView, 'byteLength' | 'byteOffset' | 'getFloat32' | 'getUint8'>, offset: number) => null | {
    length: number;
    type: TElementType;
};
//# sourceMappingURL=/build/es2018/types/read-element-type-function.d.ts.map