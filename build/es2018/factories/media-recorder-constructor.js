export const createMediaRecorderConstructor = (createNativeMediaRecorder, createNotSupportedError, createWebAudioMediaRecorder, createWebmPcmMediaRecorder, encoderRegexes, eventTargetConstructor, nativeMediaRecorderConstructor) => {
    return class MediaRecorder extends eventTargetConstructor {
        constructor(stream, options = {}) {
            const { mimeType } = options;
            if ((nativeMediaRecorderConstructor !== null)
                && (mimeType === undefined || nativeMediaRecorderConstructor.isTypeSupported(mimeType))) {
                const internalMediaRecorder = createNativeMediaRecorder(nativeMediaRecorderConstructor, stream, options);
                super(internalMediaRecorder);
                this._internalMediaRecorder = internalMediaRecorder;
            }
            else if (mimeType !== undefined && encoderRegexes.some((regex) => regex.test(mimeType))) {
                super();
                if (nativeMediaRecorderConstructor !== null && nativeMediaRecorderConstructor.isTypeSupported('audio/webm;codecs=pcm')) {
                    this._internalMediaRecorder = createWebmPcmMediaRecorder(this, nativeMediaRecorderConstructor, stream, mimeType);
                }
                else {
                    this._internalMediaRecorder = createWebAudioMediaRecorder(this, stream, mimeType);
                }
            }
            else {
                // This is creating a native MediaRecorder just to provoke it to throw an error.
                if (nativeMediaRecorderConstructor !== null) {
                    createNativeMediaRecorder(nativeMediaRecorderConstructor, stream, options);
                }
                throw createNotSupportedError();
            }
            this._ondataavailable = null;
            this._onerror = null;
        }
        get ondataavailable() {
            return this._ondataavailable === null ? this._ondataavailable : this._ondataavailable[0];
        }
        set ondataavailable(value) {
            if (this._ondataavailable !== null) {
                this.removeEventListener('dataavailable', this._ondataavailable[1]);
            }
            if (typeof value === 'function') {
                const boundListener = value.bind(this);
                this.addEventListener('dataavailable', boundListener);
                this._ondataavailable = [value, boundListener];
            }
            else {
                this._ondataavailable = null;
            }
        }
        get onerror() {
            return this._onerror === null ? this._onerror : this._onerror[0];
        }
        set onerror(value) {
            if (this._onerror !== null) {
                this.removeEventListener('error', this._onerror[1]);
            }
            if (typeof value === 'function') {
                const boundListener = value.bind(this);
                this.addEventListener('error', boundListener);
                this._onerror = [value, boundListener];
            }
            else {
                this._onerror = null;
            }
        }
        get state() {
            return this._internalMediaRecorder.state;
        }
        start(timeslice) {
            return this._internalMediaRecorder.start(timeslice);
        }
        stop() {
            return this._internalMediaRecorder.stop();
        }
        static isTypeSupported(mimeType) {
            return (nativeMediaRecorderConstructor !== null && nativeMediaRecorderConstructor.isTypeSupported(mimeType)) ||
                encoderRegexes.some((regex) => !regex.test(mimeType));
        }
    };
};
//# sourceMappingURL=/build/es2018/factories/media-recorder-constructor.js.map