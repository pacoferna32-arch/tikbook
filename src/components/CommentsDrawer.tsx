import React, { useState } from 'react';
import { X, Heart, Send, MessageSquareQuote, Quote } from 'lucide-react';
import { Book, Comment } from '../types';

interface CommentsDrawerProps {
  book: Book;
  comments: Comment[];
  onClose: () => void;
  onAddComment: (bookId: string, text: string, quotedFragment?: string) => void;
  onToggleCommentLike: (commentId: string) => void;
}

export const CommentsDrawer: React.FC<CommentsDrawerProps> = ({
  book,
  comments,
  onClose,
  onAddComment,
  onToggleCommentLike,
}) => {
  const [newCommentText, setNewCommentText] = useState('');
  const [includeQuote, setIncludeQuote] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    onAddComment(
      book.id,
      newCommentText.trim(),
      includeQuote ? book.excerpt.slice(0, 80) + '...' : undefined
    );
    setNewCommentText('');
    setIncludeQuote(false);
  };

  const bookComments = comments.filter(c => c.bookId === book.id);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-stone-900 border-l border-stone-800 text-stone-100 flex flex-col h-full shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-serif-title text-lg font-bold text-stone-100">Comentarios Literarios</h3>
            <span className="text-xs font-mono bg-stone-800 text-stone-400 px-2 py-0.5 rounded-full tabular-nums">
              {bookComments.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors cursor-pointer"
            aria-label="Cerrar comentarios"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Book Mini Banner */}
        <div className="px-4 py-2.5 bg-stone-950/40 border-b border-stone-800/60 flex items-center gap-3">
          <img
            src={book.coverImage}
            alt={book.title}
            referrerPolicy="no-referrer"
            className="w-10 h-14 object-cover rounded shadow-md ring-1 ring-white/10"
          />
          <div className="min-w-0 flex-1">
            <h4 className="font-serif-title font-bold text-sm text-stone-200 truncate">{book.title}</h4>
            <p className="text-xs text-stone-400 truncate">Por {book.author.name}</p>
          </div>
        </div>

        {/* Comments Feed List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {bookComments.length === 0 ? (
            <div className="py-12 text-center text-stone-500">
              <MessageSquareQuote className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-serif">Sé el primero en iniciar el debate sobre esta obra.</p>
            </div>
          ) : (
            bookComments.map(comment => (
              <div key={comment.id} className="p-3 bg-stone-950/40 border border-stone-800/60 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={comment.userAvatar}
                      alt={comment.userName}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-stone-700"
                    />
                    <span className="text-xs font-semibold text-stone-200">{comment.userName}</span>
                  </div>
                  <span className="text-[11px] text-stone-500">{comment.timestamp}</span>
                </div>

                {comment.quotedFragment && (
                  <div className="p-2 bg-stone-900/90 border border-stone-800 rounded-lg text-xs italic text-amber-300/90 font-serif flex items-start gap-1.5">
                    <Quote className="w-3.5 h-3.5 shrink-0 opacity-60 mt-0.5" />
                    <span>{comment.quotedFragment}</span>
                  </div>
                )}

                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans">{comment.text}</p>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => onToggleCommentLike(comment.id)}
                    className="flex items-center gap-1 text-[11px] text-stone-400 hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${comment.isLiked ? 'fill-rose-500 text-rose-500' : ''}`}
                    />
                    <span className="tabular-nums font-mono">{comment.likes}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Form pinned to bottom */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-stone-800 bg-stone-950">
          {includeQuote && (
            <div className="mb-2 p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs text-amber-300 flex items-center justify-between">
              <span className="truncate italic">Citando: «{book.excerpt.slice(0, 60)}...»</span>
              <button
                type="button"
                onClick={() => setIncludeQuote(false)}
                className="text-stone-400 hover:text-stone-200 ml-2"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIncludeQuote(!includeQuote)}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                includeQuote ? 'bg-amber-400/20 border-amber-400 text-amber-300' : 'border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
              title="Citar fragmento de la obra"
            >
              <Quote className="w-4 h-4" />
            </button>

            <input
              type="text"
              placeholder="Escribe tu reflexión o reseña..."
              value={newCommentText}
              onChange={e => setNewCommentText(e.target.value)}
              className="flex-1 bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-400"
            />

            <button
              type="submit"
              disabled={!newCommentText.trim()}
              className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                newCommentText.trim()
                  ? 'bg-amber-400 text-stone-950 hover:bg-amber-300'
                  : 'bg-stone-800 text-stone-600 cursor-not-allowed'
              }`}
              aria-label="Publicar comentario"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
