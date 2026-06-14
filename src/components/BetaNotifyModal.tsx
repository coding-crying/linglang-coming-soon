import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowRight, Check, LoaderCircle, X } from 'lucide-react';

type BetaNotifyModalProps = {
  isOpen: boolean;
  source: string;
  onClose: () => void;
};

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

export function BetaNotifyModal({ isOpen, source, onClose }: BetaNotifyModalProps) {
  const [email, setEmail] = useState('');
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    setSubmitState('idle');
    setMessage('');
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitState('submitting');
    setMessage('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source,
          page: window.location.pathname,
        }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error || 'Could not save this email.');
      }

      setSubmitState('success');
      setMessage('You are on the list.');
      setEmail('');
    } catch (error) {
      setSubmitState('error');
      setMessage(error instanceof Error ? error.message : 'Could not save this email.');
    }
  };

  return (
    <div
      className="notify-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="notify-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="notify-modal-title"
      >
        <button className="notify-close" type="button" aria-label="Close" onClick={onClose}>
          <X size={18} />
        </button>

        <div className="notify-modal-copy">
          <h2 id="notify-modal-title">Get beta notice.</h2>
          <p>Email only. One note when LingLang Cloud opens.</p>
        </div>

        {submitState === 'success' ? (
          <div className="notify-success" role="status">
            <span>
              <Check size={18} />
            </span>
            {message}
          </div>
        ) : (
          <form className="notify-form" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="notify-email">
              Email
            </label>
            <input
              id="notify-email"
              className="notify-input"
              name="email"
              type="email"
              autoComplete="email"
              required
              autoFocus
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <button className="button primary" type="submit" disabled={submitState === 'submitting'}>
              {submitState === 'submitting' ? (
                <>
                  Saving <LoaderCircle className="orb-spin" size={17} />
                </>
              ) : (
                <>
                  Notify me <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>
        )}

        {submitState === 'error' && (
          <p className="notify-status" role="alert">
            {message}
          </p>
        )}
      </section>
    </div>
  );
}
