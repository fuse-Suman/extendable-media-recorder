export const createNativeMediaRecorderConstructor = (window) => {
    if (window === null) {
        return null;
    }
    return (window.hasOwnProperty('MediaRecorder')) ? window.MediaRecorder : null;
};
//# sourceMappingURL=/build/es2018/factories/native-media-recorder-constructor.js.map