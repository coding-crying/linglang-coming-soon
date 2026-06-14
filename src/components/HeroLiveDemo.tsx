import { Loader2, Mic, PhoneOff, Sparkles } from 'lucide-react';
import { useLiveKitDemo } from '@/hooks/useLiveKitDemo';
import type { TranscriptMessage } from '@/hooks/useLiveKitDemo';
import { useEffect } from 'react';

function statusText(state: ReturnType<typeof useLiveKitDemo>['state']) {
  switch (state) {
    case 'requesting-mic':
      return 'Allow microphone access';
    case 'connecting':
      return 'Opening a practice room';
    case 'listening':
      return 'Listening';
    case 'thinking':
      return 'Thinking';
    case 'speaking':
      return 'Speaking';
    case 'error':
      return 'Setup needed';
    default:
      return 'Tap to speak';
  }
}

interface HeroLiveDemoProps {
  onTranscriptChange?: (messages: TranscriptMessage[]) => void;
}

export function HeroLiveDemo({ onTranscriptChange }: HeroLiveDemoProps) {
  const { state, error, agentLevel, userLevel, transcript, connect, disconnect } = useLiveKitDemo();
  const isActive = state !== 'idle' && state !== 'error';
  const level = Math.max(agentLevel, userLevel);
  const showTranscript = transcript.length > 0;

  useEffect(() => {
    onTranscriptChange?.(transcript);
  }, [onTranscriptChange, transcript]);

  return (
    <div className={`live-demo-card state-${state}`} aria-label="LingLang voice demo">
      {isActive || state === 'error' ? (
        <div className="live-demo-topbar">
          <i>{statusText(state)}</i>
        </div>
      ) : null}

      <button
        type="button"
        className="live-orb-button"
        onClick={state === 'idle' || state === 'error' ? connect : undefined}
        disabled={isActive}
        aria-label="Start LingLang voice demo"
      >
        <span className="orb-rings" />
        <span className="orb-face">
          <span className="orb-core" style={{ transform: `scale(${1 + level * 0.22})` }}>
            {state === 'connecting' || state === 'requesting-mic' ? (
              <Loader2 size={30} className="orb-spin" />
            ) : state === 'thinking' ? (
              <Sparkles size={30} />
            ) : (
              <>
                <Mic size={32} />
                {!isActive ? (
                  <span className="orb-core-label">{state === 'error' ? 'Retry' : 'Start speaking'}</span>
                ) : null}
              </>
            )}
          </span>
        </span>
      </button>

      <div className="live-wave" aria-hidden="true">
        {Array.from({ length: 13 }).map((_, index) => (
          <span
            key={index}
            style={{
              height: `${18 + ((index * 13) % 46) + level * 42}%`,
              animationDelay: `${index * 48}ms`,
            }}
          />
        ))}
      </div>

      {showTranscript ? (
        <div className="live-transcript" aria-label="Conversation transcript">
          {transcript.map((message) => (
            <TranscriptBubble key={message.id} message={message} />
          ))}
        </div>
      ) : null}

      {isActive && !showTranscript && state !== 'thinking' ? (
        <p className="live-demo-note">
          Speak naturally. Transcript appears when speech is received.
        </p>
      ) : null}

      {state === 'thinking' ? (
        <p className="live-demo-note thinking">Building the next prompt from memory.</p>
      ) : null}

      {state === 'error' ? (
        <p className="live-demo-note error">{error}</p>
      ) : null}

      {isActive ? (
        <button type="button" className="live-end-button" onClick={disconnect}>
          <PhoneOff size={16} /> End session
        </button>
      ) : null}
    </div>
  );
}

function TranscriptBubble({ message }: { message: TranscriptMessage }) {
  return (
    <div className={`transcript-bubble ${message.role}`}>
      {message.words.map((word, index) => {
        const label = word.note || word.status;
        const isTracked = Boolean(word.status || word.note);
        return (
          <span
            key={`${word.text}-${index}`}
            className={`transcript-word ${isTracked ? 'tracked' : ''} ${word.status || ''}`}
            data-note={label}
            tabIndex={isTracked ? 0 : undefined}
            aria-label={isTracked && label ? `${word.text.trim()}: ${label}` : undefined}
          >
            {word.text}
          </span>
        );
      })}
    </div>
  );
}
