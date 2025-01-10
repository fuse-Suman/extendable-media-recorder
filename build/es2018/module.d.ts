import { IMediaRecorderConstructor } from './interfaces';
export * from './interfaces/index';
export * from './types/index';
declare const mediaRecorderConstructor: IMediaRecorderConstructor;
export { mediaRecorderConstructor as MediaRecorder };
export declare const isSupported: () => Promise<boolean>;
export declare const deregister: (port: MessagePort) => Promise<void>;
export declare const register: (port: MessagePort) => Promise<void>;
//# sourceMappingURL=/build/es2018/module.d.ts.map