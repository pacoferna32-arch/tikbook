import React, { useState } from 'react';
import { X, Copy, Check, Sparkles, BookOpen, Download } from 'lucide-react';
import { Book } from '../types';

interface ShareQuoteModalProps {
  book: Book;
  quoteText?: string;
  onClose: () => void;
}

export const ShareQuoteModal: React.FC<ShareQuoteModalProps> = ({
  book,
  quoteText,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [cardTheme, setCardTheme] = useState<'midnight' | 'gold' | 'emerald' | 'crimson'>('gold');

  const textToShare = quoteText || book.excerpt;

  const handleCopyText = () => {
    const fullCitation = `«${textToShare}»\n— ${book.author.name}, de "${book.title}". Leído en #Tikbook`;
    navigator.clipboard.writeText(fullCitation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getThemeBackground = () => {
    switch (cardTheme) {
      case 'gold':
        return 'from-amber-950 via-stone-900 to-stone-950 border-amber-500/40 text-amber-100';
      case 'emerald':
        return 'from-emerald-950 via-stone-900 to-stone-950 border-emerald-500/40 text-emerald-100';
      case 'crimson':
        return 'from-rose-950 via-stone-900 to-stone-950 border-rose-500/40 text-rose-100';
      case 'midnight':
      default:
        return 'from-slate-950 via-stone-900 to-stone-950 border-sky-500/40 text-stone-100';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-5 text-stone-100 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif-title text-xl font-bold">Tarjeta de Cita Literaria</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme Picker */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-stone-400 mr-1">Estilo:</span>
          {[
            { id: 'gold', label: 'Oro Antiguo', dot: 'bg-amber-500' },
            { id: 'midnight', label: 'Nocturno', dot: 'bg-sky-500' },
            { id: 'emerald', label: 'Esmeralda', dot: 'bg-emerald-500' },
            { id: 'crimson', label: 'Borgoña', dot: 'bg-rose-500' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setCardTheme(t.id as any)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                cardTheme === t.id
                  ? 'border-amber-400 bg-stone-800 text-stone-100 font-medium'
                  : 'border-stone-800 text-stone-400 hover:bg-stone-800/50'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${t.dot}`}></span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* The Viral Quote Card Preview */}
        <div
          id="viral-quote-card"
          className={`relative p-6 sm:p-8 rounded-2xl border bg-gradient-to-b shadow-2xl overflow-hidden flex flex-col justify-between min-h-[280px] transition-all duration-300 ${getThemeBackground()}`}
        >
          {/* Subtle paper watermarks & ornamental bracket */}
          <div className="absolute top-4 right-5 text-4xl font-serif text-white/10 select-none pointer-events-none">
            ”
          </div>

          {/* Quote Body */}
          <div className="relative z-10 my-auto">
            <p className="font-book-body text-base sm:text-lg leading-relaxed italic text-balance font-medium">
              «{textToShare}»
            </p>
          </div>

          {/* Card Footer: Author + Book + Brand */}
          <div className="relative z-10 pt-6 mt-4 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={book.coverImage}
                alt={book.title}
                referrerPolicy="no-referrer"
                className="w-9 h-12 object-cover rounded shadow-md ring-1 ring-white/20"
              />
              <div>
                <p className="font-serif-title text-sm font-bold text-stone-100 leading-tight">
                  {book.title}
                </p>
                <p className="text-xs opacity-75 font-serif">{book.author.name}</p>
              </div>
            </div>

            {/* Tikbook Brand Wordmark stamp */}
            <div className="flex items-center gap-1.5 text-xs font-semibold opacity-80">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-serif-title tracking-tight text-amber-300">Tikbook</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleCopyText}
            className="flex-1 py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-amber-400/20 active:scale-[0.99]"
          >
            {copied ? <Check className="w-4 h-4 stroke-[3]" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? '¡Copiado con cita completa!' : 'Copiar texto para compartir'}</span>
          </button>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `Cita de ${book.title}`,
                  text: `«${textToShare}» — ${book.author.name} (Leído en Tikbook)`,
                  url: window.location.href,
                }).catch(() => {});
              } else {
                handleCopyText();
              }
            }}
            className="py-3 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Compartir</span>
          </button>
        </div>
      </div>
    </div>
  );
};
