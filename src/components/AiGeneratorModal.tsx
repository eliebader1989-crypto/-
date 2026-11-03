import React, { useState } from 'react';
import { Language, QuestionItem } from '../game/rules';
import { getText } from '../game/translations';
import { Sparkles, X, Loader2, CheckCircle2 } from 'lucide-react';

interface AiGeneratorModalProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
  onAddQuestions: (questions: QuestionItem[]) => void;
}

export const AiGeneratorModal: React.FC<AiGeneratorModalProps> = ({
  lang,
  isOpen,
  onClose,
  onAddQuestions,
}) => {
  const t = getText(lang);
  const isRtl = lang === 'ar';

  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(6);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.trim(), count }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate questions.');
      }

      if (Array.isArray(data.questions) && data.questions.length > 0) {
        onAddQuestions(data.questions);
        setSuccessMsg(`${t.aiSuccessMsg} (+${data.questions.length})`);
        setTopic('');
      } else {
        throw new Error('No valid questions returned.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error connecting to Gemini API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
      role="dialog"
      aria-modal="true"
      aria-label={t.aiModalTitle}
    >
      <div className="millionaire-hex-box rounded-2xl max-w-lg w-full p-6 text-slate-100 space-y-4">
        <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
          <div className="flex items-center gap-2 text-amber-300 font-extrabold text-lg">
            <Sparkles className="w-5 h-5" />
            <h3>{t.aiModalTitle}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.cancelBtn}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500 text-rose-200 text-xs font-bold">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-400 text-emerald-200 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <div>
            <label htmlFor="ai-topic-input" className="block text-xs font-bold text-amber-200 mb-1.5">
              {t.aiTopicLabel}
            </label>
            <input
              id="ai-topic-input"
              type="text"
              required
              placeholder={t.aiTopicPlaceholder}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label htmlFor="ai-count-select" className="block text-xs font-bold text-slate-300 mb-1.5">
              {t.aiCountLabel}
            </label>
            <select
              id="ai-count-select"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
            >
              <option value={3}>3 Questions (1 per tier)</option>
              <option value={6}>6 Questions (2 per tier)</option>
              <option value={9}>9 Questions (3 per tier)</option>
              <option value={15}>15 Questions (Full 15-Level Set)</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
            >
              {t.cancelBtn}
            </button>
            <button
              type="submit"
              disabled={loading || !topic.trim()}
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 text-xs font-black flex items-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t.aiGenerating}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{t.aiGenerateSubmit}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
