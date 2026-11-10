import React, { useState } from 'react';
import { X, Search, Trophy, BookOpen, Flame, Compass } from 'lucide-react';
import { Book, Genre } from '../types';

interface ExploreModalProps {
  isOpen: boolean;
  onClose: () => void;
  books: Book[];
  onSelectBook: (book: Book) => void;
}

const ALL_GENRES: (Genre | 'Todos')[] = [
  'Todos',
  'Misterio & Gótico',
  'Fantasía Épica',
  'Ciencia Ficción',
  'Poesía',
  'Microrrelato',
  'Romance',
  'Ensayo & Filosofía',
];

export const ExploreModal: React.FC<ExploreModalProps> = ({
  isOpen,
  onClose,
  books,
  onSelectBook,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<Genre | 'Todos'>('Todos');

  if (!isOpen) return null;

  const filteredBooks = books.filter(book => {
    const matchesGenre = selectedGenre === 'Todos' || book.genre === selectedGenre;
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesGenre && matchesSearch;
  });

  // Top trending sorted by likes
  const trendingBooks = [...books].sort((a, b) => b.likesCount - a.likesCount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-stone-900 border border-stone-800 rounded-3xl p-5 sm:p-7 text-stone-100 shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif-title text-xl sm:text-2xl font-bold">Explorar Tikbook</h2>
              <p className="text-xs text-stone-400">Descubre nuevas voces, géneros y los títulos más leídos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="my-4 relative">
          <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por título, autor o palabra clave (ej. farol, dragón, niebla)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Genre Interactive Filter Controls (Rule 1.A: segmented button controls allowed for client filtering) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar text-xs">
          {ALL_GENRES.map(g => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                selectedGenre === g
                  ? 'bg-amber-400 text-stone-950 font-semibold shadow-sm'
                  : 'bg-stone-800/60 text-stone-300 hover:bg-stone-800 hover:text-stone-100'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Results List / Grid */}
        <div className="flex-1 overflow-y-auto my-3 pr-1 space-y-4">
          {filteredBooks.length === 0 ? (
            <div className="py-16 text-center text-stone-500">
              <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-serif">No se encontraron obras con ese criterio.</p>
              <p className="text-xs mt-1 text-stone-600">Prueba con otro género o término de búsqueda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredBooks.map((book, idx) => {
                const rank = trendingBooks.findIndex(b => b.id === book.id) + 1;
                return (
                  <div
                    key={book.id}
                    onClick={() => {
                      onSelectBook(book);
                      onClose();
                    }}
                    className="p-3 bg-stone-950/60 border border-stone-800 hover:border-stone-700 rounded-2xl flex gap-3 transition-all cursor-pointer group hover:bg-stone-950/80"
                  >
                    <div className="relative shrink-0">
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        referrerPolicy="no-referrer"
                        className="w-16 h-22 object-cover rounded-lg shadow-md ring-1 ring-white/10 group-hover:scale-105 transition-transform"
                      />
                      {rank <= 3 && (
                        <div className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-amber-400 text-stone-950 font-bold text-[10px] flex items-center justify-center shadow">
                          #{rank}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 text-[11px] text-amber-400 font-medium mb-0.5">
                          <span>{book.genre}</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-stone-500">{book.readingTimeMinutes} min</span>
                        </div>
                        <h4 className="font-serif-title font-bold text-sm text-stone-100 group-hover:text-amber-300 transition-colors line-clamp-1">
                          {book.title}
                        </h4>
                        <p className="text-xs text-stone-400 truncate">Por {book.author.name}</p>
                        <p className="text-[11px] text-stone-500 line-clamp-2 mt-1 font-book-body">
                          {book.excerpt}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-stone-500 pt-2 border-t border-stone-800/40 mt-1 font-mono tabular-nums">
                        <span className="flex items-center gap-1 text-stone-400">
                          <Flame className="w-3 h-3 text-rose-400" />
                          <span>{book.likesCount.toLocaleString()}</span>
                        </span>
                        <span>{book.commentsCount} comentarios</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
