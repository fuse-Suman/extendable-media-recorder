export const createNativeMediaRecorderFactory = (createInvalidModificationError, createNotSupportedError) => {
    return (nativeMediaRecorderConstructor, stream, mediaRecorderOptions) => {
        const dataAvailableListeners = new WeakMap();
        const errorListeners = new WeakMap();
        const nativeMediaRecorder = new nativeMediaRecorderConstructor(stream, mediaRecorderOptions);
        nativeMediaRecorder.addEventListener = ((addEventListener) => {
            return (type, listener, options) => {
                let patchedEventListener = listener;
                if (typeof listener === 'function') {
                    if (type === 'dataavailable') {
                        // Bug #7 & 8: Chrome fires a dataavailable event before it fires an error event.
                        patchedEventListener = (event) => setTimeout(() => listener.call(nativeMediaRecorder, event));
                        dataAvailableListeners.set(listener, patchedEventListener);
                    }
                    else if (type === 'error') {
                        patchedEventListener = (event) => {
                            // Bug #3 & 4: Chrome throws an error event without any error.
                            if (event.error === undefined) {
                                listener.call(nativeMediaRecorder, new ErrorEvent('error', { error: createInvalidModificationError() }));
                                // Bug #1 & 2: Firefox throws an error event with an UnknownError.
                            }
                            else if (event.error.name === 'UnknownError') {
                                const message = event.error.message;
                                listener.call(nativeMediaRecorder, new ErrorEvent('error', { error: createInvalidModificationError(message) }));
                            }
                            else {
                                listener.call(nativeMediaRecorder, event);
                            }
                        };
                        dataAvailableListeners.set(listener, patchedEventListener);
                    }
                }
                return addEventListener.call(nativeMediaRecorder, type, patchedEventListener, options);
            };
        })(nativeMediaRecorder.addEventListener);
        nativeMediaRecorder.removeEventListener = ((removeEventListener) => {
            return (type, listener, options) => {
                let patchedEventListener = listener;
                if (typeof listener === 'function') {
                    if (type === 'dataavailable') {
                        const dataAvailableListener = dataAvailableListeners.get(listener);
                        if (dataAvailableListener !== undefined) {
                            patchedEventListener = dataAvailableListener;
                        }
                    }
                    else if (type === 'error') {
                        const errorListener = errorListeners.get(listener);
                        if (errorListener !== undefined) {
                            patchedEventListener = errorListener;
                        }
                    }
                }
                return removeEventListener.call(nativeMediaRecorder, type, patchedEventListener, options);
            };
        })(nativeMediaRecorder.removeEventListener);
        nativeMediaRecorder.start = ((start) => {
            return (timeslice) => {
                /*
                 * Bug #6: Chrome will emit a blob without any data when asked to encode a MediaStream with a video track into an audio
                 * codec.
                 */
                if (mediaRecorderOptions.mimeType !== undefined
                    && mediaRecorderOptions.mimeType.startsWith('audio/')
                    && stream.getVideoTracks().length > 0) {
                    throw createNotSupportedError();
                }
                return (timeslice === undefined) ? start.call(nativeMediaRecorder) : start.call(nativeMediaRecorder, timeslice);
            };
        })(nativeMediaRecorder.start);
        return nativeMediaRecorder;
    };
};
//# sourceMappingURL=/build/es2018/factories/native-media-recorder.js.map