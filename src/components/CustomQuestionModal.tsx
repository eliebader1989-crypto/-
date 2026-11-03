import React, { useState } from 'react';
import { DifficultyTier, Language, QuestionItem } from '../game/rules';
import { getText } from '../game/translations';
import { X, PlusCircle, Check } from 'lucide-react';

interface CustomQuestionModalProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
  onAddQuestion: (q: QuestionItem) => void;
}

export const CustomQuestionModal: React.FC<CustomQuestionModalProps> = ({
  lang,
  isOpen,
  onClose,
  onAddQuestion,
}) => {
  const t = getText(lang);
  const isRtl = lang === 'ar';

  const [questionAr, setQuestionAr] = useState('');
  const [questionEn, setQuestionEn] = useState('');
  const [category, setCategory] = useState(lang === 'ar' ? 'ثقافة عامة' : 'General Knowledge');
  const [tier, setTier] = useState<DifficultyTier>(1);
  const [options, setOptions] = useState<[string, string, string, string]>(['', '', '', '']);
  const [correctIndex, setCorrectIndex] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleOptionChange = (idx: number, val: string) => {
    const next = [...options] as [string, string, string, string];
    next[idx] = val;
    setOptions(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mainText = questionAr.trim();
    if (!mainText) {
      setErrorMsg(lang === 'ar' ? 'يرجى إدخال نص السؤال.' : 'Please enter the question text.');
      return;
    }
    if (options.some((opt) => !opt.trim())) {
      setErrorMsg(
        lang === 'ar'
          ? 'يرجى تعبئة جميع الخيارات الأربعة.'
          : 'Please fill in all 4 answer options.'
      );
      return;
    }

    const cleanOptions = options.map((o) => o.trim()) as [string, string, string, string];
    const newQuestion: QuestionItem = {
      id: `custom_${Date.now()}`,
      tier,
      correctIndex,
      ar: {
        question: mainText,
        options: cleanOptions,
        category: category.trim() || 'ثقافة عامة',
      },
      en: {
        question: questionEn.trim() || mainText,
        options: cleanOptions,
        category: category.trim() || 'General Knowledge',
      },
      isCustom: true,
    };

    onAddQuestion(newQuestion);
    setQuestionAr('');
    setQuestionEn('');
    setOptions(['', '', '', '']);
    setErrorMsg(null);
    onClose();
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
      role="dialog"
      aria-modal="true"
      aria-label={t.customModalTitle}
    >
      <div className="millionaire-hex-box rounded-2xl max-w-xl w-full p-6 text-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
          <div className="flex items-center gap-2 text-amber-300 font-extrabold text-lg">
            <PlusCircle className="w-5 h-5" />
            <h3>{t.customModalTitle}</h3>
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

        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500 text-rose-200 text-xs font-bold">
              {errorMsg}
            </div>
          )}

          <div>
            <label htmlFor="custom-q-ar" className="block text-xs font-bold text-amber-200 mb-1.5">
              {t.customQuestionArLabel}
            </label>
            <input
              id="custom-q-ar"
              type="text"
              required
              value={questionAr}
              onChange={(e) => setQuestionAr(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="custom-q-cat" className="block text-xs font-bold text-slate-300 mb-1.5">
                {t.customCategoryLabel}
              </label>
              <input
                id="custom-q-cat"
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label htmlFor="custom-q-tier" className="block text-xs font-bold text-slate-300 mb-1.5">
                {t.customTierLabel}
              </label>
              <select
                id="custom-q-tier"
                value={tier}
                onChange={(e) => setTier(Number(e.target.value) as DifficultyTier)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
              >
                <option value={1}>{t.tier1Name}</option>
                <option value={2}>{t.tier2Name}</option>
                <option value={3}>{t.tier3Name}</option>
              </select>
            </div>
          </div>

          <div>
            <span className="block text-xs font-bold text-amber-200 mb-2">
              {t.customOptionsLabel}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {options.map((opt, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2 p-2 rounded-xl border ${
                    correctIndex === idx
                      ? 'bg-emerald-950/50 border-emerald-400'
                      : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setCorrectIndex(idx)}
                    aria-label={`Mark Option ${t.optionLetters[idx]} Correct`}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 cursor-pointer ${
                      correctIndex === idx
                        ? 'bg-emerald-400 text-slate-950'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {correctIndex === idx ? <Check className="w-4 h-4" /> : t.optionLetters[idx]}
                  </button>
                  <input
                    type="text"
                    required
                    aria-label={`Option ${t.optionLetters[idx]}`}
                    placeholder={`${t.optionLetters[idx]}...`}
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    className="w-full bg-transparent text-sm text-white focus:outline-none"
                  />
                </div>
              ))}
            </div>
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
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black cursor-pointer"
            >
              {t.saveQuestionBtn}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
