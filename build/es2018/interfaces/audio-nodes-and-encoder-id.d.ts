import { IRecorderAudioWorkletNode } from 'recorder-audio-worklet';
import { IMediaStreamAudioSourceNode, IMinimalAudioContext } from 'standardized-audio-context';
export interface IAudioNodesAndEncoderId {
    encoderId: number;
    mediaStreamAudioSourceNode: IMediaStreamAudioSourceNode<IMinimalAudioContext>;
    recorderAudioWorkletNode: IRecorderAudioWorkletNode<IMinimalAudioContext>;
}
//# sourceMappingURL=/build/es2018/interfaces/audio-nodes-and-encoder-id.d.ts.map