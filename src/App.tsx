import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { FeedReel } from './components/FeedReel';
import { EbookReaderModal } from './components/EbookReaderModal';
import { CommentsDrawer } from './components/CommentsDrawer';
import { ShareQuoteModal } from './components/ShareQuoteModal';
import { PublishBookModal } from './components/PublishBookModal';
import { UserLibraryDrawer } from './components/UserLibraryDrawer';
import { ExploreModal } from './components/ExploreModal';
import { AuthModal } from './components/AuthModal';
import { LegalNoticeModal } from './components/LegalNoticeModal';
import { INITIAL_BOOKS, INITIAL_COMMENTS } from './data/initialBooks';
import { Book, Comment, SavedQuote, UserStats, UserAccount } from './types';

const DEFAULT_USER: UserAccount = {
  id: 'user-current',
  name: 'Clara Navarro',
  penName: 'C. Navarro Vance',
  username: 'clara_letras',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  email: 'clara@tikbook.app',
  role: 'author',
  bio: 'Escritora de ficciones especulativas y lectora empedernida de poesía marina.',
  favoriteGenres: ['Misterio & Gótico', 'Fantasía Épica', 'Microrrelato'],
  joinedDate: 'Noviembre 2026',
};

export default function App() {
  // User Profile Account (Reader or Author)
  const [currentUser, setCurrentUser] = useState<UserAccount>(() => {
    try {
      const saved = localStorage.getItem('tikbook_user');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return DEFAULT_USER;
  });

  // Books state with localStorage persistence
  const [books, setBooks] = useState<Book[]>(() => {
    try {
      const saved = localStorage.getItem('tikbook_books');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_BOOKS;
  });

  // Comments state with localStorage persistence
  const [comments, setComments] = useState<Comment[]>(() => {
    try {
      const saved = localStorage.getItem('tikbook_comments');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_COMMENTS;
  });

  // Saved quotes
  const [savedQuotes, setSavedQuotes] = useState<SavedQuote[]>(() => {
    try {
      const saved = localStorage.getItem('tikbook_quotes');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return [
      {
        id: 'q1',
        bookId: 'book-gothic-mystery',
        bookTitle: 'Sombras en los Adoquines',
        authorName: 'Eleanor Vance',
        text: '«El silencio de los justos es el mejor mortero para las tumbas de los culpables».',
        date: 'Ayer',
        genre: 'Misterio & Gótico',
      },
      {
        id: 'q2',
        bookId: 'book-ocean-poetry',
        bookTitle: 'El Eco del Atlántico',
        authorName: 'Valeria Montenegro',
        text: '«Hay una forma de quedarse que se parece a la marea: retroceder con lentitud y volver en la noche cuando nadie nos espera».',
        date: 'Hace 3 días',
        genre: 'Poesía',
      },
    ];
  });

  // User stats
  const [userStats, setUserStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem('tikbook_userstats');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return {
      booksReadCount: 4,
      readingStreakDays: 6,
      minutesRead: 48,
      savedQuotes: [],
    };
  });

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'foryou' | 'trending' | 'micro' | 'library'>('foryou');

  // Modal & Drawer states
  const [selectedBookForReader, setSelectedBookForReader] = useState<Book | null>(null);
  const [selectedBookForComments, setSelectedBookForComments] = useState<Book | null>(null);
  const [shareQuoteConfig, setShareQuoteConfig] = useState<{ book: Book; text?: string } | null>(null);
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLegalNoticeOpen, setIsLegalNoticeOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tikbook_user', JSON.stringify(currentUser));
    } catch {
      // Ignore
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('tikbook_books', JSON.stringify(books));
    } catch {
      // Ignore
    }
  }, [books]);

  useEffect(() => {
    try {
      localStorage.setItem('tikbook_comments', JSON.stringify(comments));
    } catch {
      // Ignore
    }
  }, [comments]);

  useEffect(() => {
    try {
      localStorage.setItem('tikbook_quotes', JSON.stringify(savedQuotes));
    } catch {
      // Ignore
    }
  }, [savedQuotes]);

  useEffect(() => {
    try {
      localStorage.setItem('tikbook_userstats', JSON.stringify(userStats));
    } catch {
      // Ignore
    }
  }, [userStats]);

  // Handle Tab changes
  const handleSelectTab = (tab: 'foryou' | 'trending' | 'micro' | 'library') => {
    if (tab === 'library') {
      setIsLibraryOpen(true);
    } else {
      setActiveTab(tab);
    }
  };

  // Interactions
  const handleToggleLike = (bookId: string) => {
    setBooks(prev =>
      prev.map(book => {
        if (book.id === bookId) {
          const isLiked = !book.isLiked;
          return {
            ...book,
            isLiked,
            likesCount: isLiked ? book.likesCount + 1 : Math.max(0, book.likesCount - 1),
          };
        }
        return book;
      })
    );
  };

  const handleToggleSave = (bookId: string) => {
    setBooks(prev =>
      prev.map(book => {
        if (book.id === bookId) {
          const isSaved = !book.isSaved;
          return {
            ...book,
            isSaved,
            savesCount: isSaved ? book.savesCount + 1 : Math.max(0, book.savesCount - 1),
          };
        }
        return book;
      })
    );
  };

  const handleToggleFollow = (authorUsername: string) => {
    setBooks(prev =>
      prev.map(book => {
        if (book.author.username === authorUsername) {
          const isFollowing = !book.isFollowingAuthor;
          return {
            ...book,
            isFollowingAuthor: isFollowing,
            author: {
              ...book.author,
              followersCount: isFollowing
                ? book.author.followersCount + 1
                : Math.max(0, book.author.followersCount - 1),
            },
          };
        }
        return book;
      })
    );
  };

  // Reader Launch & Stats increment
  const handleOpenReader = (book: Book) => {
    setSelectedBookForReader(book);
    setUserStats(prev => ({
      ...prev,
      minutesRead: prev.minutesRead + Math.max(2, book.readingTimeMinutes),
      booksReadCount: prev.booksReadCount + 1,
    }));
  };

  // Comments
  const handleAddComment = (bookId: string, text: string, quotedFragment?: string) => {
    const newComment: Comment = {
      id: 'c-' + Date.now(),
      bookId,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      text,
      timestamp: 'Justo ahora',
      likes: 0,
      isLiked: false,
      quotedFragment,
    };

    setComments(prev => [newComment, ...prev]);
    setBooks(prev =>
      prev.map(b => (b.id === bookId ? { ...b, commentsCount: b.commentsCount + 1 } : b))
    );
  };

  const handleToggleCommentLike = (commentId: string) => {
    setComments(prev =>
      prev.map(c => {
        if (c.id === commentId) {
          const isLiked = !c.isLiked;
          return {
            ...c,
            isLiked,
            likes: isLiked ? c.likes + 1 : Math.max(0, c.likes - 1),
          };
        }
        return c;
      })
    );
  };

  // Quotes
  const handleSaveQuote = (quote: SavedQuote) => {
    setSavedQuotes(prev => [quote, ...prev]);
  };

  const handleDeleteQuote = (quoteId: string) => {
    setSavedQuotes(prev => prev.filter(q => q.id !== quoteId));
  };

  // Upgrade user role to author
  const handleUpgradeToAuthor = () => {
    setCurrentUser(prev => ({
      ...prev,
      role: 'author',
      penName: prev.penName || prev.name,
    }));
    setIsPublishOpen(true);
  };

  // Publish
  const handlePublishBook = (newBook: Book) => {
    setBooks(prev => [newBook, ...prev]);
    setIsPublishOpen(false);
    setSelectedBookForReader(newBook); // Automatically open the author's published work in e-reader!
  };

  // Filter books according to active tab
  let displayedBooks = books;
  if (activeTab === 'trending') {
    displayedBooks = [...books].sort((a, b) => b.likesCount - a.likesCount);
  } else if (activeTab === 'micro') {
    displayedBooks = books.filter(b => b.genre === 'Microrrelato' || b.readingTimeMinutes <= 3);
  }

  const savedBooksCount = books.filter(b => b.isSaved).length;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-400 selection:text-stone-950">
      {/* Top Header conforming to Top Bar contract */}
      <Header
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onOpenPublish={() => setIsPublishOpen(true)}
        onOpenExplore={() => setIsExploreOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenLegalNotice={() => setIsLegalNoticeOpen(true)}
        currentUser={currentUser}
        savedCount={savedBooksCount}
      />

      {/* Main TikTok-style Vertical Literary Feed Reel */}
      <main className="flex-1 flex flex-col items-center justify-center">
        <FeedReel
          books={displayedBooks}
          onOpenReader={handleOpenReader}
          onOpenComments={book => setSelectedBookForComments(book)}
          onOpenShareQuote={(book, quoteText) => setShareQuoteConfig({ book, text: quoteText })}
          onToggleLike={handleToggleLike}
          onToggleSave={handleToggleSave}
          onToggleFollow={handleToggleFollow}
          onOpenLegalNotice={() => setIsLegalNoticeOpen(true)}
        />
      </main>

      {/* E-Book Reader Modal */}
      {selectedBookForReader && (
        <EbookReaderModal
          book={selectedBookForReader}
          onClose={() => setSelectedBookForReader(null)}
          onSaveQuote={handleSaveQuote}
          onShareQuoteCard={(book, quoteText) =>
            setShareQuoteConfig({ book, text: quoteText })
          }
        />
      )}

      {/* Comments Drawer */}
      {selectedBookForComments && (
        <CommentsDrawer
          book={selectedBookForComments}
          comments={comments}
          onClose={() => setSelectedBookForComments(null)}
          onAddComment={handleAddComment}
          onToggleCommentLike={handleToggleCommentLike}
        />
      )}

      {/* Viral Quote Card Modal */}
      {shareQuoteConfig && (
        <ShareQuoteModal
          book={shareQuoteConfig.book}
          quoteText={shareQuoteConfig.text}
          onClose={() => setShareQuoteConfig(null)}
        />
      )}

      {/* Publish Book Studio Modal (Author only, with AI/upload cover and orthotypography) */}
      {isPublishOpen && (
        <PublishBookModal
          currentUser={currentUser}
          onClose={() => setIsPublishOpen(false)}
          onPublish={handlePublishBook}
          onUpgradeToAuthor={handleUpgradeToAuthor}
        />
      )}

      {/* User Library & Reading Stats Drawer */}
      <UserLibraryDrawer
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        books={books}
        savedQuotes={savedQuotes}
        userStats={userStats}
        onSelectBook={book => setSelectedBookForReader(book)}
        onDeleteQuote={handleDeleteQuote}
        onShareQuote={(book, quoteText) => setShareQuoteConfig({ book, text: quoteText })}
        onRemoveSavedBook={handleToggleSave}
      />

      {/* Explore & Search Modal */}
      <ExploreModal
        isOpen={isExploreOpen}
        onClose={() => setIsExploreOpen(false)}
        books={books}
        onSelectBook={book => setSelectedBookForReader(book)}
      />

      {/* User Registration & Role Modal (Author / Reader) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onUpdateUser={updatedUser => setCurrentUser(updatedUser)}
      />

      {/* Official Legal & Copyright Certification Notice Modal */}
      <LegalNoticeModal
        isOpen={isLegalNoticeOpen}
        onClose={() => setIsLegalNoticeOpen(false)}
      />
    </div>
  );
}
