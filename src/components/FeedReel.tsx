import React, { useState, useEffect, useRef } from 'react';
import {
  Heart,
  MessageSquare,
  Bookmark,
  Share2,
  BookOpen,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Check,
  UserPlus,
  ShieldCheck,
} from 'lucide-react';
import { Book, AmbientSoundType } from '../types';
import { ambientAudio, speechNarrator } from '../utils/ambientAudio';

interface FeedReelProps {
  books: Book[];
  onOpenReader: (book: Book) => void;
  onOpenComments: (book: Book) => void;
  onOpenShareQuote: (book: Book, quoteText?: string) => void;
  onToggleLike: (bookId: string) => void;
  onToggleSave: (bookId: string) => void;
  onToggleFollow: (authorUsername: string) => void;
  onOpenLegalNotice?: () => void;
}

export const FeedReel: React.FC<FeedReelProps> = ({
  books,
  onOpenReader,
  onOpenComments,
  onOpenShareQuote,
  onToggleLike,
  onToggleSave,
  onToggleFollow,
  onOpenLegalNotice,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isNarrating, setIsNarrating] = useState(false);
  const [activeSoundType, setActiveSoundType] = useState<AmbientSoundType>('silence');
  const containerRef = useRef<HTMLDivElement>(null);

  const activeBook = books[currentIndex] || books[0];

  // Stop narration and switch ambient sound on book index change
  useEffect(() => {
    speechNarrator.stop();
    setIsNarrating(false);

    if (activeBook && isPlayingAudio) {
      ambientAudio.playSound(activeBook.ambientSound || 'rain', 0.4);
      setActiveSoundType(activeBook.ambientSound || 'rain');
    }
  }, [currentIndex, activeBook?.id]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === 'ArrowDown' || e.key === 'j') {
        goToNext();
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        goToPrev();
      } else if (e.key === 'l' || e.key === 'L') {
        if (activeBook) onToggleLike(activeBook.id);
      } else if (e.key === 'b' || e.key === 'B' || e.key === 'Enter') {
        if (activeBook) onOpenReader(activeBook);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, activeBook]);

  const goToNext = () => {
    if (currentIndex < books.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const toggleAmbientSound = () => {
    if (!activeBook) return;
    if (isPlayingAudio) {
      ambientAudio.stopSound();
      setIsPlayingAudio(false);
      setActiveSoundType('silence');
    } else {
      const sound = activeBook.ambientSound || 'rain';
      ambientAudio.playSound(sound, 0.4);
      setIsPlayingAudio(true);
      setActiveSoundType(sound);
    }
  };

  const toggleNarrator = () => {
    if (!activeBook) return;
    if (isNarrating) {
      speechNarrator.stop();
      setIsNarrating(false);
    } else {
      setIsNarrating(true);
      const textToRead = `${activeBook.title}, escrito por ${activeBook.author.name}. ${activeBook.excerpt}`;
      speechNarrator.speak(textToRead, () => {
        setIsNarrating(false);
      });
    }
  };

  const formatCount = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace('.0', '') + 'k';
    }
    return num.toString();
  };

  if (!activeBook) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 text-stone-400">
        <p className="font-serif-title text-xl mb-2 text-stone-200">No hay obras literarias disponibles</p>
        <p className="text-sm">Prueba a publicar tu primera historia en Tikbook.</p>
      </div>
    );
  }

  // Get first letter for drop cap and rest of excerpt
  const firstLetter = activeBook.excerpt.charAt(0);
  const remainingExcerpt = activeBook.excerpt.slice(1);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-5xl mx-auto min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-2 sm:p-4 md:p-6 select-none"
    >
      {/* Background atmospheric ambient glow based on book cover vibe */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 blur-3xl">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-amber-500/30"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 rounded-full bg-stone-700/40"></div>
      </div>

      {/* Main Reel Card Container (TikTok-proportioned editorial card) */}
      <div className="relative w-full max-w-4xl bg-stone-900/90 border border-stone-800 rounded-3xl shadow-2xl backdrop-blur-md overflow-hidden flex flex-col md:flex-row transition-all duration-300">
        {/* Left Side: Visual Book Cover & Editorial Spine */}
        <div className="relative w-full md:w-5/12 bg-stone-950/60 p-4 sm:p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-stone-800/80">
          <div className="relative group cursor-pointer" onClick={() => onOpenReader(activeBook)}>
            {/* 3D Book perspective container */}
            <div className="relative w-48 sm:w-56 md:w-64 aspect-[3/4] rounded-xl overflow-hidden shadow-2xl shadow-black/80 ring-1 ring-white/10 transform transition-transform duration-500 group-hover:scale-[1.02] group-hover:-rotate-1">
              <img
                src={activeBook.coverImage}
                alt={activeBook.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              {/* Subtle realistic book spine highlight shadow */}
              <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/60 via-black/20 to-transparent pointer-events-none"></div>
              <div className="absolute inset-y-0 left-4 w-1 bg-white/10 pointer-events-none"></div>
              {/* Subtle gloss overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/10 pointer-events-none"></div>

              {/* Hover Badge */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="px-3.5 py-1.5 bg-amber-400 text-stone-950 text-xs font-semibold rounded-lg shadow-md flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  Abrir E-Book
                </span>
              </div>
            </div>

            {/* Subtle shadow beneath book */}
            <div className="w-48 sm:w-56 md:w-64 h-4 mx-auto bg-black/60 blur-md rounded-full mt-2"></div>
          </div>

          {/* Quick Audio Bar under cover */}
          <div className="mt-4 flex items-center gap-2 text-xs text-stone-400">
            <button
              onClick={toggleAmbientSound}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                isPlayingAudio
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                  : 'bg-stone-800/60 border-stone-700/60 hover:text-stone-200'
              }`}
              title="Ambiente sonoro para leer"
            >
              {isPlayingAudio ? <Volume2 className="w-3.5 h-3.5 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="capitalize">{activeBook.ambientSound || 'Lluvia'}</span>
            </button>

            <button
              onClick={toggleNarrator}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                isNarrating
                  ? 'bg-amber-400 border-amber-400 text-stone-950 font-medium'
                  : 'bg-stone-800/60 border-stone-700/60 hover:text-stone-200'
              }`}
              title="Escuchar narración de este fragmento"
            >
              {isNarrating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isNarrating ? 'Pausar audio' : 'Audiolibro'}</span>
            </button>
          </div>
        </div>

        {/* Center & Right: Literary Content & Reading Experience */}
        <div className="relative w-full md:w-7/12 p-5 sm:p-7 md:p-8 flex flex-col justify-between">
          {/* Top Metadata: Clean unboxed text with typographic separators (Rule 1.A) */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-stone-400 mb-2.5">
              <span className="text-amber-400 font-medium">{activeBook.genre}</span>
              <span aria-hidden="true">·</span>
              <span>{activeBook.readingTimeMinutes} min de lectura</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{activeBook.wordCount} palabras</span>
              <span aria-hidden="true">·</span>
              <button
                onClick={onOpenLegalNotice}
                className="flex items-center gap-1 text-[11px] text-amber-300 bg-amber-400/10 hover:bg-amber-400/20 px-2 py-0.5 rounded-md border border-amber-400/30 transition-colors cursor-pointer"
                title="Obra Certificada en Tikbook: Prohibida su copia o uso sin autorización"
              >
                <ShieldCheck className="w-3 h-3 text-amber-400" />
                <span>Certificada</span>
              </button>
            </div>

            {/* Book Title & Subtitle */}
            <h1 className="font-serif-title text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-stone-100 leading-tight text-balance mb-1">
              {activeBook.title}
            </h1>
            {activeBook.subtitle && (
              <p className="text-xs sm:text-sm text-stone-400 italic mb-4 font-serif">
                {activeBook.subtitle}
              </p>
            )}

            {/* Author bar */}
            <div className="flex items-center justify-between py-2.5 border-y border-stone-800/70 mb-4">
              <div className="flex items-center gap-3">
                <img
                  src={activeBook.author.avatar}
                  alt={activeBook.author.name}
                  className="w-9 h-9 rounded-full object-cover ring-1 ring-amber-500/30"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-stone-200">{activeBook.author.name}</span>
                    {activeBook.author.isVerified && (
                      <span className="w-3.5 h-3.5 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center text-[9px] font-bold">
                        ✓
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-stone-500">@{activeBook.author.username}</span>
                </div>
              </div>

              {/* Follow Button */}
              <button
                onClick={() => onToggleFollow(activeBook.author.username)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeBook.isFollowingAuthor
                    ? 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                    : 'bg-amber-400/10 text-amber-300 border border-amber-400/30 hover:bg-amber-400 hover:text-stone-950'
                }`}
              >
                {activeBook.isFollowingAuthor ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Siguiendo</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Seguir</span>
                  </>
                )}
              </button>
            </div>

            {/* The Literary Excerpt / Reel Hook with Editorial Drop Cap */}
            <div className="relative my-3 p-4 bg-stone-950/40 rounded-2xl border border-stone-800/50">
              <div className="font-book-body text-stone-300 text-sm sm:text-base leading-relaxed">
                <span className="float-left text-4xl sm:text-5xl font-serif-title font-bold text-amber-400 leading-none pr-3 pt-1 select-none">
                  {firstLetter}
                </span>
                <p className="whitespace-pre-line">{remainingExcerpt}</p>
              </div>

              {/* Quick Quote Highlight Trigger */}
              <div className="mt-3 pt-3 border-t border-stone-800/40 flex items-center justify-between text-xs text-stone-400">
                <span className="italic font-serif">Fragmento del capítulo 1</span>
                <button
                  onClick={() => onOpenShareQuote(activeBook, activeBook.excerpt)}
                  className="flex items-center gap-1 text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Crear tarjeta de cita</span>
                </button>
              </div>
            {/* Legal Notice: Obra certificada y protegida */}
            <div className="mt-3 py-2 px-3 bg-stone-950/70 border border-stone-800 rounded-xl flex items-center justify-between text-[11px] text-stone-400">
              <div className="flex items-center gap-2 truncate">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">Obra certificada: Prohibida su copia, manipulación o uso sin permiso expreso</span>
              </div>
              {onOpenLegalNotice && (
                <button
                  type="button"
                  onClick={onOpenLegalNotice}
                  className="text-amber-400 hover:text-amber-300 font-semibold underline text-[10px] ml-2 shrink-0 cursor-pointer"
                >
                  Aviso Legal
                </button>
              )}
            </div>
          </div>

          {/* Bottom Actions: Ebook Reader CTA Button */}
          <div className="mt-3 pt-3 border-t border-stone-800/70 flex items-center gap-3">
            <button
              onClick={() => onOpenReader(activeBook)}
              className="flex-1 py-3 px-5 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-[0.99] text-stone-950 font-semibold text-sm transition-all shadow-lg shadow-amber-400/10 flex items-center justify-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 stroke-[2.5]" />
              <span>Leer Obra Completa en E-Book</span>
            </button>
          </div>
        </div>

        {/* Floating Right Action Rail (TikTok Vertical Interactions) */}
        <div className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3.5 z-20 bg-stone-950/70 backdrop-blur-md p-2 rounded-2xl border border-stone-800/70 shadow-xl">
          {/* Heart / Like */}
          <button
            onClick={() => onToggleLike(activeBook.id)}
            className="group flex flex-col items-center gap-0.5 focus:outline-none cursor-pointer"
            title="Me gusta"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform active:scale-125 ${
                activeBook.isLiked
                  ? 'bg-rose-500/20 text-rose-500'
                  : 'bg-stone-800/70 text-stone-300 hover:text-rose-400 hover:bg-stone-800'
              }`}
            >
              <Heart
                className={`w-5 h-5 transition-transform ${
                  activeBook.isLiked ? 'fill-rose-500 scale-110' : 'group-hover:scale-110'
                }`}
              />
            </div>
            <span className="text-[11px] font-mono text-stone-300 tabular-nums">
              {formatCount(activeBook.likesCount)}
            </span>
          </button>

          {/* Comments Button */}
          <button
            onClick={() => onOpenComments(activeBook)}
            className="group flex flex-col items-center gap-0.5 focus:outline-none cursor-pointer"
            title="Comentarios y debates"
          >
            <div className="w-10 h-10 rounded-full bg-stone-800/70 text-stone-300 hover:text-amber-300 hover:bg-stone-800 flex items-center justify-center transition-transform group-hover:scale-105">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-mono text-stone-300 tabular-nums">
              {formatCount(activeBook.commentsCount)}
            </span>
          </button>

          {/* Bookmark / Save to Library */}
          <button
            onClick={() => onToggleSave(activeBook.id)}
            className="group flex flex-col items-center gap-0.5 focus:outline-none cursor-pointer"
            title="Guardar en Mi Biblioteca"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform active:scale-110 ${
                activeBook.isSaved
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'bg-stone-800/70 text-stone-300 hover:text-amber-400 hover:bg-stone-800'
              }`}
            >
              <Bookmark
                className={`w-5 h-5 ${activeBook.isSaved ? 'fill-amber-400' : 'group-hover:scale-105'}`}
              />
            </div>
            <span className="text-[11px] font-mono text-stone-300 tabular-nums">
              {formatCount(activeBook.savesCount)}
            </span>
          </button>

          {/* Share / Viral Quote Card Maker */}
          <button
            onClick={() => onOpenShareQuote(activeBook, activeBook.excerpt)}
            className="group flex flex-col items-center gap-0.5 focus:outline-none cursor-pointer"
            title="Compartir o crear tarjeta de cita"
          >
            <div className="w-10 h-10 rounded-full bg-stone-800/70 text-stone-300 hover:text-sky-400 hover:bg-stone-800 flex items-center justify-center transition-transform group-hover:scale-105">
              <Share2 className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-mono text-stone-300 tabular-nums">
              {formatCount(activeBook.sharesCount)}
            </span>
          </button>
        </div>
      </div>

      {/* Floating Vertical Reel Up/Down Controls (Desktop) */}
      <div className="hidden lg:flex flex-col gap-2 absolute right-0 top-1/2 -translate-y-1/2 z-20">
        <button
          onClick={goToPrev}
          disabled={currentIndex === 0}
          className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
            currentIndex === 0
              ? 'opacity-30 border-stone-800 text-stone-600 cursor-not-allowed'
              : 'border-stone-700 bg-stone-900/90 text-stone-200 hover:bg-stone-800 hover:text-amber-400'
          }`}
          aria-label="Obra anterior (Flecha Arriba)"
        >
          <ChevronUp className="w-5 h-5" />
        </button>

        <div className="text-center font-mono text-xs text-stone-400 py-1 tabular-nums">
          {currentIndex + 1} / {books.length}
        </div>

        <button
          onClick={goToNext}
          disabled={currentIndex === books.length - 1}
          className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
            currentIndex === books.length - 1
              ? 'opacity-30 border-stone-800 text-stone-600 cursor-not-allowed'
              : 'border-stone-700 bg-stone-900/90 text-stone-200 hover:bg-stone-800 hover:text-amber-400'
          }`}
          aria-label="Siguiente obra (Flecha Abajo)"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
