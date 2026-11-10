import React, { useState, useEffect } from 'react';
import {
  X,
  Settings2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  List,
  Sparkles,
  Type,
  Share2,
  Check,
  RotateCcw,
  Palette,
  Mic,
  AlignJustify,
  AlignLeft,
  BookOpen,
  ArrowRight,
  Image as ImageIcon,
  ShieldCheck,
} from 'lucide-react';
import {
  Book,
  PaperTheme,
  ReaderFontFamily,
  ReaderLineHeight,
  SavedQuote,
  AmbientSoundType,
} from '../types';
import { ambientAudio, speechNarrator } from '../utils/ambientAudio';

interface EbookReaderModalProps {
  book: Book;
  onClose: () => void;
  onSaveQuote: (quote: SavedQuote) => void;
  onShareQuoteCard: (book: Book, quoteText: string) => void;
}

// Preset color palettes designed for comfortable reading
const PRESET_PALETTES = [
  {
    id: 'sepia',
    name: 'Sepia Cálido',
    bg: '#f6eedb',
    text: '#2b241b',
    border: '#d6cebe',
    desc: 'Papel clásico que reduce la fatiga visual',
  },
  {
    id: 'alabaster',
    name: 'Alabastro',
    bg: '#fbf9f5',
    text: '#1c1917',
    border: '#e7e2d8',
    desc: 'Blanco cálido de alta fidelidad editorial',
  },
  {
    id: 'dark',
    name: 'Noche Ónix',
    bg: '#161514',
    text: '#e5e0d8',
    border: '#2c2a28',
    desc: 'Grafito profundo ideal para oscuridad',
  },
  {
    id: 'parchment',
    name: 'Pergamino',
    bg: '#ede3cd',
    text: '#342617',
    border: '#cbbda5',
    desc: 'Tono manuscrito dorado e histórico',
  },
  {
    id: 'midnight',
    name: 'Cosmos',
    bg: '#0b0f19',
    text: '#dbeafe',
    border: '#1e293b',
    desc: 'Azul nocturno profundo de bajo contraste',
  },
  {
    id: 'forest',
    name: 'Bosque',
    bg: '#131c17',
    text: '#d1ded6',
    border: '#24352b',
    desc: 'Verde papiro relajante para la vista',
  },
  {
    id: 'rose',
    name: 'Crepúsculo',
    bg: '#22161b',
    text: '#fae8f3',
    border: '#3b2530',
    desc: 'Tono rosáceo suave para el atardecer',
  },
];

type ReaderView = 'cover' | 'toc' | 'chapter';

export const EbookReaderModal: React.FC<EbookReaderModalProps> = ({
  book,
  onClose,
  onSaveQuote,
  onShareQuoteCard,
}) => {
  // Navigation: Cover -> Table of Contents (Índice de Capítulos) -> Chapters
  const [currentView, setCurrentView] = useState<ReaderView>('cover');
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(0);

  // Appearance & Typography Settings
  const [paperTheme, setPaperTheme] = useState<PaperTheme>('dark');
  const [customBgColor, setCustomBgColor] = useState<string>('#161514');
  const [customTextColor, setCustomTextColor] = useState<string>('#e5e0d8');
  const [fontSize, setFontSize] = useState<number>(18);
  const [fontFamily, setFontFamily] = useState<ReaderFontFamily>('book');
  const [lineHeight, setLineHeight] = useState<ReaderLineHeight>('relaxed');
  const [textAlign, setTextAlign] = useState<'justify' | 'left'>('justify');
  const [marginWidth, setMarginWidth] = useState<'compact' | 'standard' | 'wide'>('standard');
  const [showBookSpine, setShowBookSpine] = useState<boolean>(true);

  // Voices & Narration
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');
  const [narrationSpeed, setNarrationSpeed] = useState<number>(1.0);
  const [narrationPitch, setNarrationPitch] = useState<number>(1.0);
  const [isNarrating, setIsNarrating] = useState<boolean>(false);
  const [isTestingVoice, setIsTestingVoice] = useState<boolean>(false);

  // Ambient sound
  const [ambientSound, setAmbientSound] = useState<AmbientSoundType>(book.ambientSound || 'rain');
  const [isAmbientPlaying, setIsAmbientPlaying] = useState<boolean>(true);
  const [ambientVolume, setAmbientVolume] = useState<number>(0.5);

  // UI Panels
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [settingsTab, setSettingsTab] = useState<'typography' | 'colors' | 'voice' | 'ambient'>('typography');
  const [showTocDrawer, setShowTocDrawer] = useState<boolean>(false);
  const [selectedText, setSelectedText] = useState<string>('');
  const [selectionPosition, setSelectionPosition] = useState<{ x: number; y: number } | null>(null);
  const [showQuoteSavedFeedback, setShowQuoteSavedFeedback] = useState<boolean>(false);

  const chapters = book.fullContent.chapters || [];
  const currentChapter = chapters[currentChapterIndex] || {
    number: 1,
    title: 'Capítulo I',
    content: [book.excerpt],
  };

  // Start ambient audio on mount & load voices
  useEffect(() => {
    ambientAudio.playSound(ambientSound, ambientVolume);
    setIsAmbientPlaying(true);

    const initVoices = () => {
      const allVoices = speechNarrator.getVoices();
      if (allVoices.length > 0) {
        setVoices(allVoices);
        const es = allVoices.find(v => v.lang.startsWith('es') || v.lang.includes('ES'));
        if (es && !selectedVoiceURI) {
          setSelectedVoiceURI(es.voiceURI || es.name);
        } else if (!selectedVoiceURI && allVoices[0]) {
          setSelectedVoiceURI(allVoices[0].voiceURI || allVoices[0].name);
        }
      }
    };

    initVoices();
    speechNarrator.onVoicesReady(allVoices => {
      setVoices(allVoices);
      const es = allVoices.find(v => v.lang.startsWith('es') || v.lang.includes('ES'));
      if (es && !selectedVoiceURI) {
        setSelectedVoiceURI(es.voiceURI || es.name);
      }
    });

    return () => {
      ambientAudio.stopSound();
      speechNarrator.stop();
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        handleNextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        handlePrevPage();
      } else if (e.key === 'Escape') {
        if (showSettings) setShowSettings(false);
        else if (showTocDrawer) setShowTocDrawer(false);
        else onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentView, currentChapterIndex, chapters.length, showSettings, showTocDrawer]);

  // Audio Ambiance Handlers
  const handleToggleAmbient = () => {
    if (isAmbientPlaying) {
      ambientAudio.stopSound();
      setIsAmbientPlaying(false);
    } else {
      ambientAudio.playSound(ambientSound, ambientVolume);
      setIsAmbientPlaying(true);
    }
  };

  const handleChangeAmbientSound = (sound: AmbientSoundType) => {
    setAmbientSound(sound);
    if (sound === 'silence') {
      ambientAudio.stopSound();
      setIsAmbientPlaying(false);
    } else {
      ambientAudio.playSound(sound, ambientVolume);
      setIsAmbientPlaying(true);
    }
  };

  const handleVolumeChange = (vol: number) => {
    setAmbientVolume(vol);
    ambientAudio.setVolume(vol);
  };

  // Speech narrator controls
  const handleToggleNarrator = () => {
    if (isNarrating) {
      speechNarrator.stop();
      setIsNarrating(false);
    } else {
      setIsNarrating(true);
      let textToRead = '';
      if (currentView === 'cover') {
        textToRead = `${book.title}, por ${book.author.name}. ${book.subtitle || ''}. ${book.excerpt}`;
      } else if (currentView === 'toc') {
        textToRead = `Índice de capítulos de ${book.title}. Consta de ${chapters.length} capítulos: ${chapters.map(c => c.title).join(', ')}.`;
      } else {
        textToRead = `${currentChapter.title}. ${currentChapter.content.join(' ')}`;
      }

      speechNarrator.speak(
        textToRead,
        () => setIsNarrating(false),
        narrationSpeed,
        narrationPitch,
        selectedVoiceURI
      );
    }
  };

  const handleTestVoice = (voiceURI: string) => {
    setIsTestingVoice(true);
    speechNarrator.testVoice(voiceURI, narrationPitch, narrationSpeed);
    setTimeout(() => setIsTestingVoice(false), 3000);
  };

  // Text Selection
  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 5) {
      const text = selection.toString().trim();
      setSelectedText(text);
      try {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setSelectionPosition({
          x: Math.max(16, rect.left + rect.width / 2),
          y: Math.max(70, rect.top - 10),
        });
      } catch {
        setSelectionPosition({ x: window.innerWidth / 2, y: 150 });
      }
    } else {
      setSelectedText('');
      setSelectionPosition(null);
    }
  };

  const handleSaveHighlightedQuote = () => {
    if (!selectedText) return;
    const newQuote: SavedQuote = {
      id: 'quote-' + Date.now(),
      bookId: book.id,
      bookTitle: book.title,
      authorName: book.author.name,
      text: selectedText,
      date: 'Hoy',
      genre: book.genre,
    };
    onSaveQuote(newQuote);
    setShowQuoteSavedFeedback(true);
    setTimeout(() => {
      setShowQuoteSavedFeedback(false);
      setSelectedText('');
      setSelectionPosition(null);
    }, 1500);
  };

  // Page turns: Portada -> Índice de Capítulos -> Capítulos
  const handleNextPage = () => {
    ambientAudio.playPageTurn();
    if (currentView === 'cover') {
      setCurrentView('toc');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentView === 'toc') {
      setCurrentView('chapter');
      setCurrentChapterIndex(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentView === 'chapter') {
      if (currentChapterIndex < chapters.length - 1) {
        setCurrentChapterIndex(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handlePrevPage = () => {
    ambientAudio.playPageTurn();
    if (currentView === 'chapter') {
      if (currentChapterIndex > 0) {
        setCurrentChapterIndex(prev => prev - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setCurrentView('toc');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (currentView === 'toc') {
      setCurrentView('cover');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Jump directly to a chapter
  const handleJumpToChapter = (index: number) => {
    ambientAudio.playPageTurn();
    setCurrentChapterIndex(index);
    setCurrentView('chapter');
    setShowTocDrawer(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Current active colors
  const getActiveColors = () => {
    if (paperTheme === 'custom') {
      return { bg: customBgColor, text: customTextColor };
    }
    const found = PRESET_PALETTES.find(p => p.id === paperTheme);
    if (found) {
      return { bg: found.bg, text: found.text };
    }
    return { bg: '#161514', text: '#e5e0d8' };
  };

  const activeColors = getActiveColors();

  // Invert custom colors
  const handleInvertColors = () => {
    const tempBg = activeColors.bg;
    const tempText = activeColors.text;
    setPaperTheme('custom');
    setCustomBgColor(tempText);
    setCustomTextColor(tempBg);
  };

  // Typography class
  const getFontFamilyClass = () => {
    switch (fontFamily) {
      case 'serif':
        return 'font-book-garamond';
      case 'literata':
        return 'font-book-literata';
      case 'merriweather':
        return 'font-book-merriweather';
      case 'sans':
        return 'font-book-sans';
      case 'mono':
        return 'font-book-mono';
      case 'book':
      default:
        return 'font-book-lora';
    }
  };

  const getLineHeightClass = () => {
    switch (lineHeight) {
      case 'normal':
        return 'leading-normal';
      case 'loose':
        return 'leading-loose';
      case 'relaxed':
      default:
        return 'leading-relaxed';
    }
  };

  const getMarginWidthClass = () => {
    switch (marginWidth) {
      case 'compact':
        return 'max-w-xl';
      case 'wide':
        return 'max-w-3xl';
      case 'standard':
      default:
        return 'max-w-2xl';
    }
  };

  // Reading progress calculation
  const totalPages = chapters.length + 2; // Portada (1) + Índice (2) + Capítulos
  let currentPageNumber = 1;
  let progressPercent = 0;

  if (currentView === 'cover') {
    currentPageNumber = 1;
    progressPercent = 0;
  } else if (currentView === 'toc') {
    currentPageNumber = 2;
    progressPercent = Math.round((1 / Math.max(1, totalPages)) * 100);
  } else {
    currentPageNumber = currentChapterIndex + 3;
    progressPercent = Math.round(((currentChapterIndex + 2) / Math.max(1, totalPages)) * 100);
  }

  const chapterWordCount = currentChapter.content.join(' ').split(/\s+/).filter(Boolean).length;
  const minutesLeftInChapter = Math.max(1, Math.round(chapterWordCount / 200));

  const sortedVoices = [...voices].sort((a, b) => {
    const aIsEs = a.lang.startsWith('es');
    const bIsEs = b.lang.startsWith('es');
    if (aIsEs && !bIsEs) return -1;
    if (!aIsEs && bIsEs) return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div
      style={{
        backgroundColor: activeColors.bg,
        color: activeColors.text,
      }}
      className="fixed inset-0 z-50 flex flex-col transition-colors duration-300 select-text overflow-hidden"
      onMouseUp={handleTextSelection}
      onTouchEnd={handleTextSelection}
    >
      {/* Top Header Bar - Minimalist Running Header */}
      <header
        style={{
          borderColor: `${activeColors.text}15`,
          backgroundColor: `${activeColors.bg}f0`,
        }}
        className="sticky top-0 z-30 flex items-center justify-between px-3 sm:px-6 h-14 border-b backdrop-blur-md transition-colors"
      >
        {/* Left: Close, Portada, and Índice Quick Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={onClose}
            className="p-2 rounded-lg opacity-80 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-all cursor-pointer"
            title="Volver a Tikbook"
            aria-label="Cerrar libro"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Quick Portada Jump */}
          <button
            onClick={() => {
              ambientAudio.playPageTurn();
              setCurrentView('cover');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              currentView === 'cover'
                ? 'bg-amber-400/20 text-amber-400 font-bold'
                : 'opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10'
            }`}
            title="Ver Portada del libro"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Portada</span>
          </button>

          {/* Quick Índice de Capítulos Jump (Core requested feature!) */}
          <button
            onClick={() => {
              ambientAudio.playPageTurn();
              setCurrentView('toc');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              currentView === 'toc'
                ? 'bg-amber-400/20 text-amber-400 font-bold'
                : 'opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10'
            }`}
            title="Ver Índice de Capítulos"
          >
            <List className="w-3.5 h-3.5" />
            <span>Índice</span>
          </button>
        </div>

        {/* Center: Running Title & Current View indicator */}
        <div className="text-center px-2 max-w-xs sm:max-w-md truncate">
          <h2 className="font-serif-title text-sm sm:text-base font-bold tracking-tight truncate">
            {book.title}
          </h2>
          <p className="text-[11px] opacity-70 truncate font-serif">
            {currentView === 'cover' && 'Portada de la Obra'}
            {currentView === 'toc' && `Índice de Capítulos · ${chapters.length} partes`}
            {currentView === 'chapter' && `${currentChapter.title} · ${progressPercent}% leído`}
          </p>
        </div>

        {/* Right: Ambient Sound, Narrator, Settings */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Ambient Sound Toggle */}
          <button
            onClick={handleToggleAmbient}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              isAmbientPlaying
                ? 'text-amber-500 bg-amber-500/10 opacity-100'
                : 'opacity-60 hover:opacity-100'
            }`}
            title={`Sonido de fondo: ${ambientSound}`}
          >
            {isAmbientPlaying ? <Volume2 className="w-5 h-5 animate-pulse" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {/* Narrator Play / Pause */}
          <button
            onClick={handleToggleNarrator}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              isNarrating
                ? 'bg-amber-400 text-stone-950 shadow-md shadow-amber-400/20'
                : 'border border-current/20 opacity-80 hover:opacity-100'
            }`}
            title="Escuchar narración de audiolibro"
          >
            {isNarrating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{isNarrating ? 'Pausar' : 'Voz'}</span>
          </button>

          {/* Appearance & Settings Trigger */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg transition-all cursor-pointer ${
              showSettings ? 'bg-amber-400/20 text-amber-400' : 'opacity-80 hover:opacity-100'
            }`}
            title="Ajustes de apariencia, tipografía, color y voz"
            aria-label="Ajustes de lectura"
          >
            <Settings2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Thin reading progress bar */}
      <div style={{ backgroundColor: `${activeColors.text}10` }} className="w-full h-1">
        <div
          className="h-full bg-amber-500 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="absolute right-4 top-16 z-40 w-96 max-h-[85vh] p-5 rounded-3xl shadow-2xl border border-stone-800 bg-stone-900 text-stone-100 backdrop-blur-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800 shrink-0">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Type className="w-4 h-4 text-amber-400" />
              <span>Personalización del E-Book</span>
            </h3>
            <button
              onClick={() => setShowSettings(false)}
              className="p-1 text-stone-400 hover:text-stone-100 rounded-lg hover:bg-stone-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex border-b border-stone-800 text-xs font-medium pt-2 shrink-0">
            <button
              onClick={() => setSettingsTab('typography')}
              className={`flex-1 pb-2 text-center transition-colors border-b-2 cursor-pointer ${
                settingsTab === 'typography'
                  ? 'border-amber-400 text-amber-400 font-semibold'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              Tipografía
            </button>
            <button
              onClick={() => setSettingsTab('colors')}
              className={`flex-1 pb-2 text-center transition-colors border-b-2 cursor-pointer ${
                settingsTab === 'colors'
                  ? 'border-amber-400 text-amber-400 font-semibold'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              Página & Color
            </button>
            <button
              onClick={() => setSettingsTab('voice')}
              className={`flex-1 pb-2 text-center transition-colors border-b-2 cursor-pointer ${
                settingsTab === 'voice'
                  ? 'border-amber-400 text-amber-400 font-semibold'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              Voz
            </button>
            <button
              onClick={() => setSettingsTab('ambient')}
              className={`flex-1 pb-2 text-center transition-colors border-b-2 cursor-pointer ${
                settingsTab === 'ambient'
                  ? 'border-amber-400 text-amber-400 font-semibold'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              Ambiente
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs pr-1">
            {settingsTab === 'typography' && (
              <div className="space-y-4">
                <div>
                  <label className="text-stone-400 block mb-2 font-medium">Familia Tipográfica</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'book', name: 'Lora', label: 'Narrativa Libro', fontClass: 'font-book-lora' },
                      { id: 'literata', name: 'Literata', label: 'Google E-Reader', fontClass: 'font-book-literata' },
                      { id: 'serif', name: 'Cormorant', label: 'Serifa Clásica', fontClass: 'font-book-garamond' },
                      { id: 'merriweather', name: 'Merriweather', label: 'Prosa Suave', fontClass: 'font-book-merriweather' },
                      { id: 'sans', name: 'Jakarta Sans', label: 'Sin Serifa', fontClass: 'font-book-sans' },
                      { id: 'mono', name: 'Space Mono', label: 'Máquina de Escribir', fontClass: 'font-book-mono' },
                    ].map(f => (
                      <button
                        key={f.id}
                        onClick={() => setFontFamily(f.id as ReaderFontFamily)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          fontFamily === f.id
                            ? 'border-amber-400 bg-amber-400/10 text-amber-300 ring-1 ring-amber-400/40'
                            : 'border-stone-800 bg-stone-950/60 text-stone-300 hover:bg-stone-800'
                        }`}
                      >
                        <div className={`text-sm font-semibold mb-0.5 ${f.fontClass}`}>{f.name}</div>
                        <div className="text-[10px] text-stone-500">{f.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-stone-400 font-medium">Tamaño de la Fuente</label>
                    <span className="font-mono text-amber-400 font-bold tabular-nums text-sm">
                      {fontSize}px
                    </span>
                  </div>

                  <div className="flex items-center gap-3 bg-stone-950/60 p-2.5 rounded-xl border border-stone-800">
                    <button
                      onClick={() => setFontSize(prev => Math.max(14, prev - 1))}
                      className="w-8 h-8 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center font-bold text-stone-300 hover:bg-stone-800 cursor-pointer"
                    >
                      A-
                    </button>
                    <input
                      type="range"
                      min="14"
                      max="32"
                      value={fontSize}
                      onChange={e => setFontSize(Number(e.target.value))}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                    <button
                      onClick={() => setFontSize(prev => Math.min(32, prev + 1))}
                      className="w-8 h-8 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center font-bold text-stone-300 hover:bg-stone-800 cursor-pointer text-sm"
                    >
                      A+
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-stone-400 block mb-1.5 font-medium">Interlineado</label>
                    <div className="grid grid-cols-3 gap-1">
                      {[
                        { id: 'normal', label: '1.5' },
                        { id: 'relaxed', label: '1.75' },
                        { id: 'loose', label: '2.0' },
                      ].map(lh => (
                        <button
                          key={lh.id}
                          onClick={() => setLineHeight(lh.id as ReaderLineHeight)}
                          className={`py-1.5 rounded-lg border text-center transition-all cursor-pointer font-mono ${
                            lineHeight === lh.id
                              ? 'border-amber-400 bg-amber-400/10 text-amber-300 font-semibold'
                              : 'border-stone-800 bg-stone-950/60 text-stone-400 hover:bg-stone-800'
                          }`}
                        >
                          {lh.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-stone-400 block mb-1.5 font-medium">Alineación</label>
                    <div className="grid grid-cols-2 gap-1">
                      <button
                        onClick={() => setTextAlign('justify')}
                        className={`py-1.5 rounded-lg border flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          textAlign === 'justify'
                            ? 'border-amber-400 bg-amber-400/10 text-amber-300 font-semibold'
                            : 'border-stone-800 bg-stone-950/60 text-stone-400 hover:bg-stone-800'
                        }`}
                      >
                        <AlignJustify className="w-3.5 h-3.5" />
                        <span>Justificar</span>
                      </button>
                      <button
                        onClick={() => setTextAlign('left')}
                        className={`py-1.5 rounded-lg border flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          textAlign === 'left'
                            ? 'border-amber-400 bg-amber-400/10 text-amber-300 font-semibold'
                            : 'border-stone-800 bg-stone-950/60 text-stone-400 hover:bg-stone-800'
                        }`}
                      >
                        <AlignLeft className="w-3.5 h-3.5" />
                        <span>Izquierda</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-stone-400 block mb-1.5 font-medium">Ancho de Página & Márgenes</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'compact', label: 'Estrecho' },
                      { id: 'standard', label: 'Estándar' },
                      { id: 'wide', label: 'Amplio' },
                    ].map(m => (
                      <button
                        key={m.id}
                        onClick={() => setMarginWidth(m.id as any)}
                        className={`py-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                          marginWidth === m.id
                            ? 'border-amber-400 bg-amber-400/10 text-amber-300 font-semibold'
                            : 'border-stone-800 bg-stone-950/60 text-stone-400 hover:bg-stone-800'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>

                  <div className="mt-3 flex items-center justify-between p-2.5 bg-stone-950/60 border border-stone-800 rounded-xl">
                    <span className="text-stone-300">Sombra de lomo de libro físico</span>
                    <button
                      onClick={() => setShowBookSpine(!showBookSpine)}
                      className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                        showBookSpine ? 'bg-amber-400' : 'bg-stone-700'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 w-4 h-4 rounded-full bg-stone-950 transition-transform ${
                          showBookSpine ? 'left-5' : 'left-0.5'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {settingsTab === 'colors' && (
              <div className="space-y-4">
                <div>
                  <label className="text-stone-400 block mb-2 font-medium">
                    Paletas Predefinidas para la Lectura
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {PRESET_PALETTES.map(p => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setPaperTheme(p.id as PaperTheme);
                          setCustomBgColor(p.bg);
                          setCustomTextColor(p.text);
                        }}
                        style={{
                          backgroundColor: p.bg,
                          color: p.text,
                          borderColor: p.border,
                        }}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          paperTheme === p.id
                            ? 'ring-2 ring-amber-400 scale-[1.02] shadow-lg'
                            : 'opacity-85 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-center justify-between font-serif font-bold text-sm">
                          <span>{p.name}</span>
                          {paperTheme === p.id && <Check className="w-4 h-4 stroke-[3]" />}
                        </div>
                        <p className="text-[10px] opacity-75 mt-1">{p.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 bg-stone-950/80 rounded-2xl border border-stone-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-200 flex items-center gap-1.5">
                      <Palette className="w-4 h-4 text-amber-400" />
                      <span>Colores Personalizados</span>
                    </span>
                    <button
                      onClick={handleInvertColors}
                      className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Invertir</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="text-[11px] text-stone-400 block mb-1">Color de la Página</label>
                      <div className="flex items-center gap-2 bg-stone-900 border border-stone-800 p-1.5 rounded-xl">
                        <input
                          type="color"
                          value={customBgColor}
                          onChange={e => {
                            setCustomBgColor(e.target.value);
                            setPaperTheme('custom');
                          }}
                          className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent"
                        />
                        <span className="font-mono text-xs text-stone-300 uppercase">
                          {customBgColor}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-stone-400 block mb-1">Color del Texto</label>
                      <div className="flex items-center gap-2 bg-stone-900 border border-stone-800 p-1.5 rounded-xl">
                        <input
                          type="color"
                          value={customTextColor}
                          onChange={e => {
                            setCustomTextColor(e.target.value);
                            setPaperTheme('custom');
                          }}
                          className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent"
                        />
                        <span className="font-mono text-xs text-stone-300 uppercase">
                          {customTextColor}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      backgroundColor: activeColors.bg,
                      color: activeColors.text,
                    }}
                    className="p-3 rounded-xl border border-white/10 text-center font-serif text-xs transition-colors"
                  >
                    «Vista previa del texto sobre la página en Tikbook»
                  </div>
                </div>
              </div>
            )}

            {settingsTab === 'voice' && (
              <div className="space-y-4">
                <div>
                  <label className="text-stone-400 block mb-1.5 font-medium flex items-center justify-between">
                    <span>Seleccionar Voz del Narrador</span>
                    <span className="font-mono text-[10px] text-stone-500">{voices.length} disponibles</span>
                  </label>

                  <select
                    value={selectedVoiceURI}
                    onChange={e => setSelectedVoiceURI(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-xs text-stone-200 focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    {sortedVoices.map(v => {
                      const isEs = v.lang.startsWith('es');
                      return (
                        <option key={v.voiceURI || v.name} value={v.voiceURI || v.name}>
                          {isEs ? '🌟 ' : ''}{v.name} ({v.lang})
                        </option>
                      );
                    })}
                  </select>
                </div>

                <button
                  onClick={() => handleTestVoice(selectedVoiceURI)}
                  disabled={isTestingVoice}
                  className="w-full py-2.5 px-3 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer text-xs font-semibold"
                >
                  <Mic className="w-4 h-4 text-amber-400" />
                  <span>{isTestingVoice ? 'Reproduciendo muestra...' : 'Probar esta voz'}</span>
                </button>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-stone-400 font-medium">Velocidad de Lectura</label>
                    <span className="font-mono text-amber-400 font-bold tabular-nums">
                      {narrationSpeed.toFixed(2)}x
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.7"
                    max="1.6"
                    step="0.05"
                    value={narrationSpeed}
                    onChange={e => setNarrationSpeed(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-stone-500 font-mono mt-1">
                    <button onClick={() => setNarrationSpeed(0.8)} className="hover:text-stone-300 cursor-pointer">0.8x</button>
                    <button onClick={() => setNarrationSpeed(1.0)} className="hover:text-stone-300 cursor-pointer">1.0x (Normal)</button>
                    <button onClick={() => setNarrationSpeed(1.25)} className="hover:text-stone-300 cursor-pointer">1.25x</button>
                    <button onClick={() => setNarrationSpeed(1.5)} className="hover:text-stone-300 cursor-pointer">1.5x</button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-stone-400 font-medium">Tono de la Voz</label>
                    <span className="font-mono text-stone-300 tabular-nums text-xs">
                      {narrationPitch < 1 ? 'Más grave' : narrationPitch > 1 ? 'Más agudo' : 'Natural'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.7"
                    max="1.4"
                    step="0.05"
                    value={narrationPitch}
                    onChange={e => setNarrationPitch(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {settingsTab === 'ambient' && (
              <div className="space-y-4">
                <div>
                  <label className="text-stone-400 block mb-2 font-medium">Sonido Ambiental de Lectura</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'rain', label: '🌧️ Lluvia Suave', desc: 'Gotas en la ventana' },
                      { id: 'fireplace', label: '🔥 Chimenea', desc: 'Crepitar de leña' },
                      { id: 'library', label: '📚 Biblioteca', desc: 'Eco de estanterías' },
                      { id: 'silence', label: '🔇 Silencio', desc: 'Sin ambientación' },
                    ].map(snd => (
                      <button
                        key={snd.id}
                        onClick={() => handleChangeAmbientSound(snd.id as any)}
                        className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                          ambientSound === snd.id
                            ? 'border-amber-400 bg-amber-400/10 text-amber-300 font-semibold'
                            : 'border-stone-800 bg-stone-950/60 text-stone-300 hover:bg-stone-800'
                        }`}
                      >
                        <div className="text-xs font-semibold mb-0.5">{snd.label}</div>
                        <div className="text-[10px] text-stone-500">{snd.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-stone-400 font-medium">Volumen Ambiental</label>
                    <span className="font-mono text-stone-300 tabular-nums">
                      {Math.round(ambientVolume * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={ambientVolume}
                    onChange={e => handleVolumeChange(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Slide-out Table of Contents Drawer */}
      {showTocDrawer && (
        <div className="fixed inset-y-0 left-0 z-40 w-72 sm:w-80 p-6 bg-stone-900 border-r border-stone-800 text-stone-100 shadow-2xl flex flex-col justify-between animate-in slide-in-from-left duration-200">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
              <h3 className="font-serif-title text-lg font-bold flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Navegación de Obra</span>
              </h3>
              <button onClick={() => setShowTocDrawer(false)} className="text-stone-400 hover:text-stone-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1.5 overflow-y-auto max-h-[70vh] pr-1">
              {/* Cover page entry */}
              <button
                onClick={() => {
                  ambientAudio.playPageTurn();
                  setCurrentView('cover');
                  setShowTocDrawer(false);
                }}
                className={`w-full text-left p-3 rounded-xl text-xs sm:text-sm font-medium transition-colors flex items-center justify-between cursor-pointer ${
                  currentView === 'cover'
                    ? 'bg-amber-400/15 text-amber-400 font-semibold'
                    : 'text-stone-300 hover:bg-stone-800'
                }`}
              >
                <span>Portada del Libro</span>
                {currentView === 'cover' && <Check className="w-4 h-4 text-amber-400" />}
              </button>

              {/* TOC page entry */}
              <button
                onClick={() => {
                  ambientAudio.playPageTurn();
                  setCurrentView('toc');
                  setShowTocDrawer(false);
                }}
                className={`w-full text-left p-3 rounded-xl text-xs sm:text-sm font-medium transition-colors flex items-center justify-between cursor-pointer ${
                  currentView === 'toc'
                    ? 'bg-amber-400/15 text-amber-400 font-semibold'
                    : 'text-stone-300 hover:bg-stone-800'
                }`}
              >
                <span>Índice General</span>
                {currentView === 'toc' && <Check className="w-4 h-4 text-amber-400" />}
              </button>

              <div className="pt-2 pb-1 text-[11px] font-mono text-stone-500 uppercase tracking-wider">
                Capítulos
              </div>

              {chapters.map((ch, idx) => (
                <button
                  key={idx}
                  onClick={() => handleJumpToChapter(idx)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors flex items-center justify-between cursor-pointer ${
                    currentView === 'chapter' && currentChapterIndex === idx
                      ? 'bg-amber-400/15 text-amber-400 font-semibold'
                      : 'text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  <span className="truncate">{ch.title}</span>
                  {currentView === 'chapter' && currentChapterIndex === idx && (
                    <Check className="w-4 h-4 shrink-0 text-amber-400" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-stone-800 text-xs text-stone-400 flex items-center justify-between">
            <span>{chapters.length} capítulos</span>
            <span>{book.wordCount} palabras</span>
          </div>
        </div>
      )}

      {/* Floating Selection Tooltip for Highlighting */}
      {selectedText && selectionPosition && (
        <div
          style={{
            left: `${selectionPosition.x}px`,
            top: `${selectionPosition.y}px`,
            transform: 'translate(-50%, -100%)',
          }}
          className="fixed z-50 flex items-center gap-1 p-1.5 rounded-xl bg-stone-900/95 text-stone-100 border border-amber-500/40 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150"
        >
          <button
            onClick={handleSaveHighlightedQuote}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-400 text-stone-950 rounded-lg hover:bg-amber-300 transition-colors cursor-pointer"
          >
            <Bookmark className="w-3.5 h-3.5 fill-stone-950" />
            <span>Guardar cita</span>
          </button>

          <button
            onClick={() => onShareQuoteCard(book, selectedText)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-200 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Crear tarjeta</span>
          </button>
        </div>
      )}

      {/* Quote Saved Toast */}
      {showQuoteSavedFeedback && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-amber-400 text-stone-950 text-xs font-semibold rounded-full shadow-xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>¡Cita guardada en tu biblioteca!</span>
        </div>
      )}

      {/* Main Reading Canvas */}
      <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 md:py-12 flex justify-center relative">
        {/* Subtle realistic book spine gutter shadow on wide screens */}
        {showBookSpine && (
          <div className="hidden lg:block absolute inset-y-0 left-1/2 -translate-x-1/2 w-16 pointer-events-none opacity-20 bg-gradient-to-r from-transparent via-black/40 to-transparent"></div>
        )}

        {/* =========================================================================
            VIEW 1: LA PORTADA DEL LIBRO (Book Cover Page / Front Matter)
           ========================================================================= */}
        {currentView === 'cover' && (
          <div className={`w-full mx-auto flex flex-col items-center justify-center text-center ${getMarginWidthClass()} animate-in fade-in duration-300`}>
            {/* 3D Book Cover Artwork Presentation */}
            <div className="relative group mb-6">
              <div className="relative w-52 sm:w-64 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl shadow-black/80 ring-1 ring-white/10 mx-auto transform transition-transform duration-500 hover:scale-[1.02]">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                {/* Book spine lighting */}
                <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/60 to-transparent pointer-events-none" />
                <div className="absolute inset-y-0 left-4 w-0.5 bg-white/10 pointer-events-none" />
              </div>
              <div className="w-52 sm:w-64 h-4 mx-auto bg-black/60 blur-md rounded-full mt-2" />
            </div>

            {/* Frontispiece Typography */}
            <span className="text-xs uppercase tracking-widest font-sans font-semibold text-amber-500 mb-2 block">
              {book.genre}
            </span>

            <h1 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-2 text-balance">
              {book.title}
            </h1>

            {book.subtitle && (
              <p className="text-sm sm:text-base font-serif italic opacity-80 mb-4 max-w-lg">
                {book.subtitle}
              </p>
            )}

            <div className="flex items-center justify-center gap-2 mb-6">
              <img
                src={book.author.avatar}
                alt={book.author.name}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-amber-400/40"
              />
              <span className="font-serif text-sm font-semibold">Por {book.author.name}</span>
              {book.author.isVerified && (
                <span className="w-3.5 h-3.5 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center text-[9px] font-bold">
                  ✓
                </span>
              )}
            </div>

            {/* Metadata strip */}
            <div
              style={{ borderColor: `${activeColors.text}15` }}
              className="py-3 px-6 border-y flex items-center justify-center gap-4 text-xs font-mono opacity-75 mb-8"
            >
              <span>{chapters.length} Capítulos</span>
              <span>·</span>
              <span>{book.wordCount} Palabras</span>
              <span>·</span>
              <span>~{book.readingTimeMinutes} Minutos</span>
            </div>

            {/* Synopsis Card */}
            {book.fullContent.synopsis && (
              <div
                style={{
                  borderColor: `${activeColors.text}15`,
                  backgroundColor: `${activeColors.text}06`,
                }}
                className="p-5 rounded-2xl border text-left font-book-body text-xs sm:text-sm leading-relaxed max-w-xl mb-8"
              >
                <span className="font-sans text-[11px] uppercase tracking-wider font-bold text-amber-500 block mb-1.5">
                  Sinopsis de la Obra
                </span>
                <p className="opacity-90">{book.fullContent.synopsis}</p>
              </div>
            )}

            {/* Legal Notice: Certified Intellectual Property */}
            <div
              style={{
                borderColor: `${activeColors.text}20`,
                backgroundColor: `${activeColors.text}08`,
              }}
              className="p-4 rounded-2xl border text-center font-book-body text-xs max-w-xl mb-6 space-y-1.5"
            >
              <div className="flex items-center justify-center gap-1.5 font-bold text-amber-500 font-sans text-xs">
                <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
                <span>OBRA CERTIFICADA · DERECHOS DE AUTOR PROTEGIDOS</span>
              </div>
              <p className="opacity-80 leading-relaxed text-[11px]">
                Esta obra literaria está debidamente certificada en Tikbook. Queda expresamente prohibido manipular, copiar, alterar, reproducir o utilizar este texto sin el permiso previo y por escrito de su autor/a ({book.author.name}).
              </p>
            </div>

            {/* Primary Action: Go to Table of Contents (después de la portada!) */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => {
                  ambientAudio.playPageTurn();
                  setCurrentView('toc');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="py-3 px-7 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-sm transition-all shadow-lg shadow-amber-400/20 active:scale-[0.98] flex items-center gap-2 cursor-pointer"
              >
                <List className="w-4 h-4" />
                <span>Ir al Índice de Capítulos</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={() => {
                  ambientAudio.playPageTurn();
                  setCurrentView('chapter');
                  setCurrentChapterIndex(0);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                style={{ borderColor: `${activeColors.text}25` }}
                className="py-3 px-5 rounded-xl border opacity-80 hover:opacity-100 text-xs font-semibold transition-all cursor-pointer"
              >
                Comenzar Lectura Directa
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            VIEW 2: ÍNDICE DE CAPÍTULOS (Table of Contents - Justo después de la portada!)
           ========================================================================= */}
        {currentView === 'toc' && (
          <div className={`w-full mx-auto ${getMarginWidthClass()} animate-in fade-in duration-300`}>
            {/* Editorial Header for Table of Contents */}
            <div
              style={{ borderColor: `${activeColors.text}15` }}
              className="text-center pb-6 mb-8 border-b"
            >
              <span className="text-xs uppercase tracking-widest font-sans font-semibold text-amber-500 mb-1.5 block">
                SUMARIO EDITORIAL
              </span>
              <h1 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-2">
                Índice de Capítulos
              </h1>
              <p className="text-xs sm:text-sm opacity-75 font-serif italic max-w-md mx-auto">
                {book.title} · Por {book.author.name}
              </p>
              <div className="flex items-center justify-center gap-3 text-xs font-mono opacity-60 mt-3 tabular-nums">
                <span>{chapters.length} Capítulos maquetados</span>
                <span>·</span>
                <span>{book.wordCount} palabras</span>
              </div>
            </div>

            {/* Chapters Index List with Editorial Dotted Leaders & Metadata */}
            <div className="space-y-3 mb-10">
              {chapters.map((chap, idx) => {
                const words = chap.content.join(' ').split(/\s+/).filter(Boolean).length;
                const estMin = Math.max(1, Math.round(words / 200));
                const firstSentence = chap.content[0] ? chap.content[0].slice(0, 100) + '…' : '';

                return (
                  <div
                    key={idx}
                    onClick={() => handleJumpToChapter(idx)}
                    style={{
                      borderColor: `${activeColors.text}15`,
                      backgroundColor: `${activeColors.text}04`,
                    }}
                    className="group p-4 sm:p-5 rounded-2xl border hover:border-amber-400/50 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:scale-[1.01]"
                  >
                    <div className="flex items-start gap-3.5 flex-1 min-w-0">
                      {/* Chapter index badge */}
                      <span className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-amber-400 group-hover:text-stone-950 transition-colors">
                        {(idx + 1).toString().padStart(2, '0')}
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-serif-title font-bold text-base sm:text-lg tracking-tight group-hover:text-amber-400 transition-colors truncate">
                            {chap.title}
                          </h3>
                        </div>

                        {firstSentence && (
                          <p className="font-book-body text-xs opacity-65 truncate mt-1">
                            {firstSentence}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Metadata & Arrow */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-current/10">
                      <div className="text-right text-[11px] font-mono opacity-60 tabular-nums">
                        <span className="block">{estMin} min lectura</span>
                        <span className="text-[10px] opacity-75">{words} palabras</span>
                      </div>

                      <div className="w-8 h-8 rounded-xl border border-current/15 flex items-center justify-center group-hover:bg-amber-400 group-hover:text-stone-950 group-hover:border-amber-400 transition-all">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions of Table of Contents */}
            <div
              style={{ borderColor: `${activeColors.text}15` }}
              className="pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3"
            >
              <button
                onClick={() => {
                  ambientAudio.playPageTurn();
                  setCurrentView('cover');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                style={{ borderColor: `${activeColors.text}25` }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border opacity-80 hover:opacity-100 text-xs font-semibold transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Volver a la Portada</span>
              </button>

              <button
                onClick={() => handleJumpToChapter(0)}
                className="w-full sm:w-auto py-3 px-6 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs sm:text-sm transition-all shadow-lg shadow-amber-400/20 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Comenzar Lectura (Capítulo 1)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            VIEW 3: CAPÍTULOS DE LA OBRA (Chapter Reading Mode)
           ========================================================================= */}
        {currentView === 'chapter' && (
          <div
            className={`w-full mx-auto transition-all duration-200 ${getMarginWidthClass()} ${getFontFamilyClass()} ${getLineHeightClass()} ${
              textAlign === 'justify' ? 'text-justify' : 'text-left'
            } animate-in fade-in duration-300`}
            style={{ fontSize: `${fontSize}px` }}
          >
            {/* Chapter Title & Header */}
            <div
              style={{ borderColor: `${activeColors.text}15` }}
              className="text-center mb-8 pb-6 border-b"
            >
              <div className="flex items-center justify-center gap-2 mb-1.5">
                <span className="text-xs uppercase tracking-widest opacity-60 font-sans">
                  {book.genre}
                </span>
                <span className="opacity-40 font-mono">·</span>
                <button
                  onClick={() => {
                    ambientAudio.playPageTurn();
                    setCurrentView('toc');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-xs text-amber-500 hover:underline font-serif cursor-pointer"
                >
                  Ver Índice
                </button>
              </div>

              <h1 className="font-serif-title text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-2">
                {currentChapter.title}
              </h1>
              <p className="text-xs opacity-75 font-serif italic">
                Por {book.author.name}
              </p>
            </div>

            {/* Chapter Paragraphs with Drop Cap on first letter */}
            <div className="space-y-6">
              {currentChapter.content.map((paragraph, pIdx) => {
                if (pIdx === 0) {
                  const firstChar = paragraph.charAt(0);
                  const restOfP = paragraph.slice(1);
                  return (
                    <p key={pIdx} className="leading-relaxed">
                      <span className="float-left text-5xl font-serif-title font-bold text-amber-500 mr-3 mt-1 leading-none select-none">
                        {firstChar}
                      </span>
                      {restOfP}
                    </p>
                  );
                }
                return (
                  <p key={pIdx} className="leading-relaxed whitespace-pre-line">
                    {paragraph}
                  </p>
                );
              })}
            </div>

            {/* Chapter Navigation Buttons */}
            <div
              style={{ borderColor: `${activeColors.text}15` }}
              className="mt-14 pt-8 border-t flex items-center justify-between"
            >
              <button
                onClick={handlePrevPage}
                style={{ borderColor: `${activeColors.text}20` }}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer hover:bg-black/5 dark:hover:bg-white/10"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>
                  {currentChapterIndex === 0 ? 'Índice de Capítulos' : 'Capítulo anterior'}
                </span>
              </button>

              <button
                onClick={() => {
                  ambientAudio.playPageTurn();
                  setCurrentView('toc');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-xs font-mono opacity-60 tabular-nums hover:underline hover:opacity-100 cursor-pointer"
                title="Abrir Índice de Capítulos"
              >
                Capítulo {currentChapterIndex + 1} de {chapters.length}
              </button>

              <button
                onClick={handleNextPage}
                disabled={currentChapterIndex === chapters.length - 1}
                style={{ borderColor: `${activeColors.text}20` }}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                  currentChapterIndex === chapters.length - 1
                    ? 'opacity-30 cursor-not-allowed'
                    : 'hover:bg-black/5 dark:hover:bg-white/10'
                }`}
              >
                <span>Siguiente capítulo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Minimalist Kindle / E-Reader Bottom Bar */}
      <footer
        style={{
          borderColor: `${activeColors.text}15`,
          backgroundColor: `${activeColors.bg}f0`,
        }}
        className="h-10 border-t px-4 sm:px-6 flex items-center justify-between text-[11px] opacity-70 font-mono select-none"
      >
        <div className="flex items-center gap-2 truncate">
          {currentView === 'cover' && <span>Portada de la Obra</span>}
          {currentView === 'toc' && <span>Índice de Capítulos ({chapters.length})</span>}
          {currentView === 'chapter' && (
            <span>Capítulo {currentChapterIndex + 1} de {chapters.length}</span>
          )}
        </div>

        <div className="hidden sm:flex items-center gap-1.5 truncate">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>Obra Certificada</span>
          <span>·</span>
          {currentView === 'chapter' && (
            <span>{minutesLeftInChapter} min restantes</span>
          )}
          {currentView === 'toc' && (
            <span>~{book.readingTimeMinutes} min de lectura</span>
          )}
          {currentView === 'cover' && <span>Edición Protegida</span>}
        </div>

        <div className="tabular-nums">
          <span>Pág. {currentPageNumber} de {totalPages} · {progressPercent}%</span>
        </div>
      </footer>
    </div>
  );
};
