import React, { useState } from 'react';
import {
  X,
  Bookmark,
  Sparkles,
  BookOpen,
  Trash2,
  Share2,
  Flame,
  Clock,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { Book, SavedQuote, UserStats } from '../types';

interface UserLibraryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  books: Book[];
  savedQuotes: SavedQuote[];
  userStats: UserStats;
  onSelectBook: (book: Book) => void;
  onDeleteQuote: (quoteId: string) => void;
  onShareQuote: (book: Book, quoteText: string) => void;
  onRemoveSavedBook: (bookId: string) => void;
}

export const UserLibraryDrawer: React.FC<UserLibraryDrawerProps> = ({
  isOpen,
  onClose,
  books,
  savedQuotes,
  userStats,
  onSelectBook,
  onDeleteQuote,
  onShareQuote,
  onRemoveSavedBook,
}) => {
  const [activeTab, setActiveTab] = useState<'saved' | 'quotes' | 'myworks'>('saved');

  if (!isOpen) return null;

  const savedBooks = books.filter(b => b.isSaved);
  const myWorks = books.filter(b => b.id.startsWith('book-user-'));

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-stone-900 border-l border-stone-800 text-stone-100 flex flex-col h-full shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Bookmark className="w-4 h-4 fill-amber-400" />
            </div>
            <div>
              <h3 className="font-serif-title text-xl font-bold">Mi Biblioteca Tikbook</h3>
              <p className="text-xs text-stone-400">Tus lecturas, citas y colecciones guardadas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reader Stats Dashboard Strip */}
        <div className="grid grid-cols-3 gap-2 p-4 bg-stone-950/60 border-b border-stone-800">
          <div className="p-2.5 bg-stone-900/80 rounded-xl border border-stone-800 flex flex-col items-center text-center">
            <span className="flex items-center gap-1 text-xs text-amber-400 font-medium">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span>Racha</span>
            </span>
            <span className="text-lg font-bold font-mono text-stone-100 tabular-nums">
              {userStats.readingStreakDays} días
            </span>
          </div>

          <div className="p-2.5 bg-stone-900/80 rounded-xl border border-stone-800 flex flex-col items-center text-center">
            <span className="flex items-center gap-1 text-xs text-stone-400 font-medium">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Leídos</span>
            </span>
            <span className="text-lg font-bold font-mono text-stone-100 tabular-nums">
              {userStats.booksReadCount}
            </span>
          </div>

          <div className="p-2.5 bg-stone-900/80 rounded-xl border border-stone-800 flex flex-col items-center text-center">
            <span className="flex items-center gap-1 text-xs text-stone-400 font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span>Tiempo</span>
            </span>
            <span className="text-lg font-bold font-mono text-stone-100 tabular-nums">
              {userStats.minutesRead} m
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-800 px-4 pt-2 gap-4 text-xs font-medium">
          <button
            onClick={() => setActiveTab('saved')}
            className={`pb-2.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'saved'
                ? 'border-amber-400 text-amber-400 font-semibold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Libros Guardados ({savedBooks.length})
          </button>
          <button
            onClick={() => setActiveTab('quotes')}
            className={`pb-2.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'quotes'
                ? 'border-amber-400 text-amber-400 font-semibold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Mis Citas ({savedQuotes.length})
          </button>
          <button
            onClick={() => setActiveTab('myworks')}
            className={`pb-2.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'myworks'
                ? 'border-amber-400 text-amber-400 font-semibold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Mis Obras ({myWorks.length})
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* Tab 1: Saved Books */}
          {activeTab === 'saved' && (
            <>
              {savedBooks.length === 0 ? (
                <div className="py-16 text-center text-stone-500">
                  <Bookmark className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm font-serif">Aún no has guardado libros en tu biblioteca.</p>
                  <p className="text-xs mt-1 text-stone-600">Toca el icono de marcapáginas en cualquier obra del feed.</p>
                </div>
              ) : (
                savedBooks.map(book => (
                  <div
                    key={book.id}
                    className="p-3 bg-stone-950/50 border border-stone-800 rounded-2xl flex items-center justify-between gap-3 hover:border-stone-700 transition-colors"
                  >
                    <div
                      className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                      onClick={() => {
                        onSelectBook(book);
                        onClose();
                      }}
                    >
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        referrerPolicy="no-referrer"
                        className="w-12 h-16 object-cover rounded-lg shadow-md ring-1 ring-white/10 shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-[11px] text-amber-400 font-medium block truncate">
                          {book.genre}
                        </span>
                        <h4 className="font-serif-title font-bold text-sm sm:text-base text-stone-100 truncate">
                          {book.title}
                        </h4>
                        <p className="text-xs text-stone-400 truncate">Por {book.author.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => onRemoveSavedBook(book.id)}
                        className="p-2 text-stone-400 hover:text-rose-400 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
                        title="Quitar de guardados"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          onSelectBook(book);
                          onClose();
                        }}
                        className="p-2 text-amber-400 hover:bg-amber-400/10 rounded-lg transition-colors cursor-pointer"
                        title="Abrir E-Book"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {/* Tab 2: Saved Quotes */}
          {activeTab === 'quotes' && (
            <>
              {savedQuotes.length === 0 ? (
                <div className="py-16 text-center text-stone-500">
                  <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm font-serif">Tu libreta de citas está vacía.</p>
                  <p className="text-xs mt-1 text-stone-600">
                    Selecciona cualquier texto mientras lees en el lector e-book para guardarlo aquí.
                  </p>
                </div>
              ) : (
                savedQuotes.map(quote => {
                  const targetBook = books.find(b => b.id === quote.bookId) || books[0];
                  return (
                    <div
                      key={quote.id}
                      className="p-4 bg-stone-950/60 border border-stone-800 rounded-2xl space-y-2 relative group"
                    >
                      <p className="font-book-body text-xs sm:text-sm text-amber-200/90 italic leading-relaxed">
                        «{quote.text}»
                      </p>

                      <div className="pt-2 border-t border-stone-800/60 flex items-center justify-between text-xs text-stone-400">
                        <div>
                          <span className="font-semibold text-stone-300">{quote.bookTitle}</span>
                          <span className="mx-1">·</span>
                          <span className="font-serif italic">{quote.authorName}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onShareQuote(targetBook, quote.text)}
                            className="p-1.5 text-stone-400 hover:text-amber-300 hover:bg-stone-800 rounded-lg transition-colors"
                            title="Crear tarjeta visual para compartir"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteQuote(quote.id)}
                            className="p-1.5 text-stone-400 hover:text-rose-400 hover:bg-stone-800 rounded-lg transition-colors"
                            title="Eliminar cita"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </>
          )}

          {/* Tab 3: My Published Works */}
          {activeTab === 'myworks' && (
            <>
              {myWorks.length === 0 ? (
                <div className="py-16 text-center text-stone-500">
                  <Layers className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm font-serif">No has publicado ninguna obra todavía.</p>
                  <p className="text-xs mt-1 text-stone-600">
                    Pulsa el botón «Publicar Obra» para subir tu primer relato o poema.
                  </p>
                </div>
              ) : (
                myWorks.map(book => (
                  <div
                    key={book.id}
                    className="p-3 bg-stone-950/50 border border-stone-800 rounded-2xl flex items-center justify-between gap-3"
                  >
                    <div
                      className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                      onClick={() => {
                        onSelectBook(book);
                        onClose();
                      }}
                    >
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        referrerPolicy="no-referrer"
                        className="w-12 h-16 object-cover rounded-lg shadow-md ring-1 ring-white/10 shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-[11px] text-amber-400 font-medium block truncate">
                          {book.genre}
                        </span>
                        <h4 className="font-serif-title font-bold text-sm sm:text-base text-stone-100 truncate">
                          {book.title}
                        </h4>
                        <p className="text-xs text-stone-400">
                          {book.likesCount} me gusta · {book.commentsCount} comentarios
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onSelectBook(book);
                        onClose();
                      }}
                      className="p-2 text-amber-400 hover:bg-amber-400/10 rounded-lg transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
