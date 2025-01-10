import { encode, instantiate } from 'media-encoder-host';
import { addRecorderAudioWorkletModule, createRecorderAudioWorkletNode } from 'recorder-audio-worklet';
import { AudioBuffer, AudioBufferSourceNode, AudioWorkletNode, MediaStreamAudioSourceNode, MinimalAudioContext, addAudioWorkletModule } from 'standardized-audio-context';
// @todo This should live in a separate file.
const createPromisedAudioNodesEncoderIdAndPort = async (audioContext, mediaStream, mimeType) => {
    const { encoderId, port } = await instantiate(mimeType, audioContext.sampleRate);
    const message = 'Missing AudioWorklet support. Maybe this is not running in a secure context.';
    await addRecorderAudioWorkletModule((url) => {
        if (addAudioWorkletModule === undefined) {
            throw new Error(message);
        }
        return addAudioWorkletModule(audioContext, url);
    });
    if (AudioWorkletNode === undefined) {
        throw new Error(message);
    }
    const mediaStreamAudioSourceNode = new MediaStreamAudioSourceNode(audioContext, { mediaStream });
    const length = Math.max(512, Math.ceil(audioContext.baseLatency * audioContext.sampleRate));
    const audioBuffer = new AudioBuffer({ length, sampleRate: audioContext.sampleRate });
    const audioBufferSourceNode = new AudioBufferSourceNode(audioContext, { buffer: audioBuffer });
    const recorderAudioWorkletNode = createRecorderAudioWorkletNode(AudioWorkletNode, audioContext);
    return { audioBufferSourceNode, encoderId, length, port, mediaStreamAudioSourceNode, recorderAudioWorkletNode };
};
export const createWebAudioMediaRecorderFactory = (createInvalidModificationError, createInvalidStateError, createNotSupportedError) => {
    return (eventTarget, mediaStream, mimeType) => {
        const audioContext = new MinimalAudioContext({ latencyHint: 'playback' });
        const promisedAudioNodesEncoderIdAndPort = createPromisedAudioNodesEncoderIdAndPort(audioContext, mediaStream, mimeType);
        let abortRecording = null;
        let intervalId = null;
        let promisedAudioNodesAndEncoderId = null;
        let promisedPartialRecording = null; // tslint:disable-line:invalid-void
        const dispatchDataAvailableEvent = (arrayBuffers) => {
            eventTarget.dispatchEvent(new BlobEvent('dataavailable', { data: new Blob(arrayBuffers, { type: mimeType }) }));
        };
        const requestNextPartialRecording = async (encoderId, timeslice) => {
            dispatchDataAvailableEvent(await encode(encoderId, timeslice));
            if (promisedAudioNodesAndEncoderId !== null) {
                promisedPartialRecording = requestNextPartialRecording(encoderId, timeslice);
            }
        };
        const stop = () => {
            if (promisedAudioNodesAndEncoderId === null) {
                return;
            }
            if (abortRecording !== null) {
                mediaStream.removeEventListener('addtrack', abortRecording);
                mediaStream.removeEventListener('removetrack', abortRecording);
            }
            if (intervalId !== null) {
                clearTimeout(intervalId);
            }
            if (promisedPartialRecording !== null) {
                promisedPartialRecording.catch(() => { });
            }
            promisedAudioNodesAndEncoderId
                .then(async ({ encoderId, mediaStreamAudioSourceNode, recorderAudioWorkletNode }) => {
                await recorderAudioWorkletNode.stop();
                mediaStreamAudioSourceNode.disconnect(recorderAudioWorkletNode);
                dispatchDataAvailableEvent(await encode(encoderId, null));
            });
            promisedAudioNodesAndEncoderId = null;
        };
        return {
            get state() {
                return (promisedAudioNodesAndEncoderId === null) ? 'inactive' : 'recording';
            },
            start(timeslice) {
                if (promisedAudioNodesAndEncoderId !== null) {
                    throw createInvalidStateError();
                }
                if (mediaStream.getVideoTracks().length > 0) {
                    throw createNotSupportedError();
                }
                promisedAudioNodesAndEncoderId = Promise
                    .all([
                    audioContext.resume(),
                    promisedAudioNodesEncoderIdAndPort
                ])
                    .then(async ([, { audioBufferSourceNode, encoderId, length, port, mediaStreamAudioSourceNode, recorderAudioWorkletNode }]) => {
                    mediaStreamAudioSourceNode.connect(recorderAudioWorkletNode);
                    await new Promise((resolve) => {
                        audioBufferSourceNode.onended = resolve;
                        audioBufferSourceNode.connect(recorderAudioWorkletNode);
                        audioBufferSourceNode.start(audioContext.currentTime + (length / audioContext.sampleRate));
                    });
                    audioBufferSourceNode.disconnect(recorderAudioWorkletNode);
                    await recorderAudioWorkletNode.record(port);
                    if (timeslice !== undefined) {
                        promisedPartialRecording = requestNextPartialRecording(encoderId, timeslice);
                    }
                    return { encoderId, mediaStreamAudioSourceNode, recorderAudioWorkletNode };
                });
                const tracks = mediaStream.getTracks();
                abortRecording = () => {
                    stop();
                    eventTarget.dispatchEvent(new ErrorEvent('error', { error: createInvalidModificationError() }));
                };
                mediaStream.addEventListener('addtrack', abortRecording);
                mediaStream.addEventListener('removetrack', abortRecording);
                intervalId = setInterval(() => {
                    const currentTracks = mediaStream.getTracks();
                    if ((currentTracks.length !== tracks.length || currentTracks.some((track, index) => (track !== tracks[index])))
                        && abortRecording !== null) {
                        abortRecording();
                    }
                }, 1000);
            },
            stop
        };
    };
};
//# sourceMappingURL=/build/es2018/factories/web-audio-media-recorder.js.map