export type Genre =
  | 'Misterio & Gótico'
  | 'Fantasía Épica'
  | 'Ciencia Ficción'
  | 'Poesía'
  | 'Microrrelato'
  | 'Romance'
  | 'Ensayo & Filosofía';

export type AmbientSoundType = 'rain' | 'fireplace' | 'library' | 'coffee' | 'silence';

export type UserRole = 'reader' | 'author';

export interface UserAccount {
  id: string;
  name: string;
  username: string;
  avatar: string;
  email: string;
  role: UserRole;
  bio: string;
  penName?: string;
  favoriteGenres: Genre[];
  joinedDate: string;
}

export interface Author {
  name: string;
  username: string;
  avatar: string;
  bio: string;
  isVerified: boolean;
  followersCount: number;
}

export interface Chapter {
  number: number;
  title: string;
  content: string[]; // paragraphs
}

export interface Book {
  id: string;
  title: string;
  subtitle?: string;
  author: Author;
  genre: Genre;
  coverImage: string;
  excerpt: string; // The hook displayed on the TikTok feed
  fullContent: {
    synopsis: string;
    chapters: Chapter[];
  };
  readingTimeMinutes: number;
  wordCount: number;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  savesCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  isFollowingAuthor?: boolean;
  publishedAt: string;
  ambientSound: AmbientSoundType;
  tags: string[];
}

export interface Comment {
  id: string;
  bookId: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
  quotedFragment?: string;
}

export interface SavedQuote {
  id: string;
  bookId: string;
  bookTitle: string;
  authorName: string;
  text: string;
  date: string;
  genre: Genre;
}

export interface UserStats {
  booksReadCount: number;
  readingStreakDays: number;
  minutesRead: number;
  savedQuotes: SavedQuote[];
}

export type PaperTheme =
  | 'dark'
  | 'sepia'
  | 'alabaster'
  | 'forest'
  | 'midnight'
  | 'parchment'
  | 'rose'
  | 'custom';

export type ReaderFontFamily =
  | 'book'
  | 'serif'
  | 'literata'
  | 'merriweather'
  | 'sans'
  | 'mono';

export type ReaderLineHeight = 'normal' | 'relaxed' | 'loose';

export interface ReaderSettings {
  paperTheme: PaperTheme;
  customBgColor: string;
  customTextColor: string;
  fontSize: number; // 14 to 32
  lineHeight: ReaderLineHeight;
  fontFamily: ReaderFontFamily;
  textAlign: 'justify' | 'left';
  marginWidth: 'compact' | 'standard' | 'wide';
  showBookSpine: boolean;
  ambientSound: AmbientSoundType;
  ambientVolume: number; // 0 to 1
  continuousScroll: boolean;
  narratorVoiceURI: string;
  narratorSpeed: number; // 0.75 to 1.5
  narratorPitch: number; // 0.8 to 1.3
}

