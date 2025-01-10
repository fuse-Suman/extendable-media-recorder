import { deregister as drgstr, register as rgstr } from 'media-encoder-host';
import { createDecodeWebMChunk } from './factories/decode-web-m-chunk';
import { createEventTargetConstructor } from './factories/event-target-constructor';
import { createEventTargetFactory } from './factories/event-target-factory';
import { createInvalidModificationError } from './factories/invalid-modification-error';
import { createInvalidStateError } from './factories/invalid-state-error';
import { createIsSupportedPromise } from './factories/is-supported-promise';
import { createMediaRecorderConstructor } from './factories/media-recorder-constructor';
import { createNativeMediaRecorderFactory } from './factories/native-media-recorder';
import { createNativeMediaRecorderConstructor } from './factories/native-media-recorder-constructor';
import { createNotSupportedError } from './factories/not-supported-error';
import { createReadElementContent } from './factories/read-element-content';
import { createReadElementType } from './factories/read-element-type';
import { createReadVariableSizeInteger } from './factories/read-variable-size-integer';
import { createWebAudioMediaRecorderFactory } from './factories/web-audio-media-recorder';
import { createWebmPcmMediaRecorderFactory } from './factories/webm-pcm-media-recorder';
import { createWindow } from './factories/window';
import { readVariableSizeIntegerLength } from './functions/read-variable-size-integer-length';
import { wrapEventListener } from './functions/wrap-event-listener';
/*
 * @todo Explicitly referencing the barrel file seems to be necessary when enabling the
 * isolatedModules compiler option.
 */
export * from './interfaces/index';
export * from './types/index';
const encoderRegexes = [];
const createNativeMediaRecorder = createNativeMediaRecorderFactory(createInvalidModificationError, createNotSupportedError);
const createWebAudioMediaRecorder = createWebAudioMediaRecorderFactory(createInvalidModificationError, createInvalidStateError, createNotSupportedError);
const readVariableSizeInteger = createReadVariableSizeInteger(readVariableSizeIntegerLength);
const readElementContent = createReadElementContent(readVariableSizeInteger);
const readElementType = createReadElementType(readVariableSizeInteger);
const decodeWebMChunk = createDecodeWebMChunk(readElementContent, readElementType);
const createWebmPcmMediaRecorder = createWebmPcmMediaRecorderFactory(createInvalidModificationError, createNotSupportedError, decodeWebMChunk);
const window = createWindow();
const createEventTarget = createEventTargetFactory(window);
const nativeMediaRecorderConstructor = createNativeMediaRecorderConstructor(window);
const mediaRecorderConstructor = createMediaRecorderConstructor(createNativeMediaRecorder, createNotSupportedError, createWebAudioMediaRecorder, createWebmPcmMediaRecorder, encoderRegexes, createEventTargetConstructor(createEventTarget, wrapEventListener), nativeMediaRecorderConstructor);
export { mediaRecorderConstructor as MediaRecorder };
export const isSupported = () => createIsSupportedPromise(window);
const ports = new WeakMap();
export const deregister = async (port) => {
    await drgstr(port);
    const encoderRegex = ports.get(port);
    if (encoderRegex !== undefined) {
        const index = encoderRegexes.indexOf(encoderRegex);
        encoderRegexes.splice(index, 1);
    }
};
export const register = async (port) => {
    const encoderRegex = await rgstr(port);
    encoderRegexes.push(encoderRegex);
    ports.set(port, encoderRegex);
};
//# sourceMappingURL=/build/es2018/module.js.map