import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  LocalAudioTrack,
  Participant,
  RemoteAudioTrack,
  RemoteTrackPublication,
  Room as LiveKitRoom,
  TranscriptionSegment,
} from 'livekit-client';
import { getLiveKitToken } from '@/lib/livekit-token';

export type VoiceDemoState =
  | 'idle'
  | 'requesting-mic'
  | 'connecting'
  | 'listening'
  | 'thinking'
  | 'speaking'
  | 'error';

export type TranscriptWord = {
  text: string;
  status?: 'known' | 'new' | 'review' | 'grammar';
  note?: string;
};

export type TranscriptMessage = {
  id: string;
  role: 'agent' | 'user';
  words: TranscriptWord[];
  final?: boolean;
};

type LevelMonitor = {
  stop: () => void;
};

function makeId(prefix: string) {
  const random = crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);
  return `${prefix}-${random}`;
}

function splitWords(text: string): TranscriptWord[] {
  return text.split(/(\s+)/).filter(Boolean).map((word) => ({ text: word }));
}

function upsertTranscriptMessage(
  messages: TranscriptMessage[],
  message: TranscriptMessage
): TranscriptMessage[] {
  const index = messages.findIndex((existing) => existing.id === message.id);
  if (index === -1) {
    return [...messages.slice(-7), message];
  }

  return messages.map((existing, currentIndex) => (
    currentIndex === index ? { ...existing, ...message } : existing
  ));
}

function monitorTrack(
  track: MediaStreamTrack,
  onLevel: (level: number) => void,
  onSpeakingChange?: (speaking: boolean) => void
): LevelMonitor {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  const audioContext = new AudioContextClass();
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 512;

  const source = audioContext.createMediaStreamSource(new MediaStream([track]));
  source.connect(analyser);

  const data = new Uint8Array(analyser.frequencyBinCount);
  let frame = 0;
  let speaking = false;
  let aboveCount = 0;
  let belowCount = 0;
  let stopped = false;

  const tick = () => {
    if (stopped) return;

    analyser.getByteFrequencyData(data);
    const average = data.reduce((sum, value) => sum + value, 0) / data.length;
    const level = Math.min(1, average / 128);
    onLevel(level);

    if (onSpeakingChange) {
      if (level > 0.12) {
        aboveCount += 1;
        belowCount = 0;
      } else {
        belowCount += 1;
        aboveCount = 0;
      }

      if (!speaking && aboveCount > 5) {
        speaking = true;
        onSpeakingChange(true);
      }

      if (speaking && belowCount > 18) {
        speaking = false;
        onSpeakingChange(false);
      }
    }

    frame = requestAnimationFrame(tick);
  };

  tick();

  return {
    stop: () => {
      stopped = true;
      cancelAnimationFrame(frame);
      source.disconnect();
      analyser.disconnect();
      void audioContext.close();
    },
  };
}

export function useLiveKitDemo() {
  const [state, setState] = useState<VoiceDemoState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [agentLevel, setAgentLevel] = useState(0);
  const [userLevel, setUserLevel] = useState(0);
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);

  const roomRef = useRef<LiveKitRoom | null>(null);
  const remoteMonitorRef = useRef<LevelMonitor | null>(null);
  const localMonitorRef = useRef<LevelMonitor | null>(null);
  const audioElsRef = useRef<HTMLAudioElement[]>([]);
  const hasUserSpokenRef = useRef(false);
  const stateRef = useRef<VoiceDemoState>('idle');

  const setDemoState = useCallback((next: VoiceDemoState) => {
    stateRef.current = next;
    setState(next);
  }, []);

  const cleanup = useCallback(() => {
    remoteMonitorRef.current?.stop();
    localMonitorRef.current?.stop();
    remoteMonitorRef.current = null;
    localMonitorRef.current = null;

    audioElsRef.current.forEach((el) => {
      el.pause();
      el.srcObject = null;
      el.remove();
    });
    audioElsRef.current = [];

    roomRef.current?.disconnect();
    roomRef.current = null;
    hasUserSpokenRef.current = false;
    setAgentLevel(0);
    setUserLevel(0);
    setTranscript([]);
  }, []);

  const disconnect = useCallback(() => {
    cleanup();
    setError(null);
    setDemoState('idle');
  }, [cleanup, setDemoState]);

  const connect = useCallback(async () => {
    if (stateRef.current !== 'idle' && stateRef.current !== 'error') return;

    cleanup();
    setError(null);
    setDemoState('requesting-mic');

    try {
      const livekitUrl = import.meta.env.VITE_LIVEKIT_URL;
      if (!livekitUrl) {
        throw new Error('Set VITE_LIVEKIT_URL to enable the live demo.');
      }

      const permissionStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      permissionStream.getTracks().forEach((track) => track.stop());

      setDemoState('connecting');

      const { Room, RoomEvent, Track } = await import('livekit-client');
      const roomName = makeId('linglang-demo');
      const identity = makeId('visitor');
      const token = await getLiveKitToken(identity, roomName);
      const room = new Room({ adaptiveStream: true, dynacast: true });

      roomRef.current = room;

      room.on(RoomEvent.TrackSubscribed, (track, publication: RemoteTrackPublication) => {
        if (publication.kind !== Track.Kind.Audio) return;

        const audioTrack = track as RemoteAudioTrack;
        const audioElement = audioTrack.attach() as HTMLAudioElement;
        audioElement.autoplay = true;
        audioElement.setAttribute('playsinline', 'true');
        audioElsRef.current.push(audioElement);
        document.body.appendChild(audioElement);

        remoteMonitorRef.current?.stop();
        remoteMonitorRef.current = monitorTrack(audioTrack.mediaStreamTrack, (level) => {
          setAgentLevel(level);
          if (level > 0.08) {
            setDemoState('speaking');
          } else if (hasUserSpokenRef.current && stateRef.current === 'speaking') {
            setDemoState('listening');
          }
        });
      });

      room.on(RoomEvent.TranscriptionReceived, (
        segments: TranscriptionSegment[],
        participant?: Participant
      ) => {
        const role: TranscriptMessage['role'] = participant?.identity === identity ? 'user' : 'agent';

        setTranscript((messages) => {
          let nextMessages = messages;
          for (const segment of segments) {
            nextMessages = upsertTranscriptMessage(nextMessages, {
              id: segment.id || makeId('segment'),
              role,
              words: splitWords(segment.text),
              final: segment.final,
            });
          }
          return nextMessages.slice(-8);
        });
      });

      room.on(RoomEvent.DataReceived, (payload) => {
        const text = new TextDecoder().decode(payload);
        try {
          const event = JSON.parse(text);
          if (event.type === 'transcript' && event.role && Array.isArray(event.words)) {
            setTranscript((messages) => upsertTranscriptMessage(
              messages,
              {
                id: event.id || makeId('message'),
                role: event.role === 'user' ? 'user' : 'agent',
                words: event.words.map((word: string | TranscriptWord) =>
                  typeof word === 'string' ? { text: word } : word
                ),
                final: event.final ?? true,
              }
            ).slice(-8));
          }
        } catch {
          setTranscript((messages) => [
            ...messages.slice(-7),
            {
              id: makeId('message'),
              role: 'agent',
              words: splitWords(text),
              final: true,
            },
          ]);
        }
      });

      room.on(RoomEvent.Disconnected, () => {
        if (stateRef.current !== 'idle') {
          setDemoState('idle');
        }
      });

      await room.connect(livekitUrl, token);
      await room.localParticipant.setMicrophoneEnabled(true);

      const localAudioTrack = Array.from(room.localParticipant.audioTrackPublications.values())
        .map((publication) => publication.track)
        .find(Boolean) as LocalAudioTrack | undefined;

      if (localAudioTrack?.mediaStreamTrack) {
        localMonitorRef.current = monitorTrack(
          localAudioTrack.mediaStreamTrack,
          setUserLevel,
          (speaking) => {
            if (speaking) {
              hasUserSpokenRef.current = true;
              if (stateRef.current !== 'speaking') setDemoState('listening');
            } else if (hasUserSpokenRef.current && stateRef.current === 'listening') {
              setDemoState('thinking');
            }
          }
        );
      }

      setDemoState('listening');
    } catch (err) {
      cleanup();
      setError(err instanceof Error ? err.message : 'Could not start the voice demo.');
      setDemoState('error');
    }
  }, [cleanup, setDemoState]);

  useEffect(() => disconnect, [disconnect]);

  return {
    state,
    error,
    agentLevel,
    userLevel,
    transcript,
    connect,
    disconnect,
  };
}

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}
