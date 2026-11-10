import React, { useState } from 'react';
import { X, Feather, BookOpen, Check, Sparkles, User, ShieldCheck } from 'lucide-react';
import { UserAccount, UserRole, Genre } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  onUpdateUser: (user: UserAccount) => void;
}

const GENRE_OPTIONS: Genre[] = [
  'Misterio & Gótico',
  'Fantasía Épica',
  'Ciencia Ficción',
  'Poesía',
  'Microrrelato',
  'Romance',
  'Ensayo & Filosofía',
];

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
}) => {
  const [role, setRole] = useState<UserRole>(currentUser.role);
  const [name, setName] = useState(currentUser.name);
  const [penName, setPenName] = useState(currentUser.penName || currentUser.name);
  const [username, setUsername] = useState(currentUser.username);
  const [email, setEmail] = useState(currentUser.email);
  const [bio, setBio] = useState(currentUser.bio);
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [favoriteGenres, setFavoriteGenres] = useState<Genre[]>(currentUser.favoriteGenres || ['Misterio & Gótico']);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const toggleGenre = (g: Genre) => {
    if (favoriteGenres.includes(g)) {
      setFavoriteGenres(favoriteGenres.filter(item => item !== g));
    } else {
      setFavoriteGenres([...favoriteGenres, g]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserAccount = {
      ...currentUser,
      name: name.trim() || 'Lector Tikbook',
      penName: role === 'author' ? (penName.trim() || name.trim()) : undefined,
      username: username.trim().replace(/^@/, '') || 'usuario_tikbook',
      email: email.trim() || 'usuario@tikbook.app',
      role,
      bio: bio.trim(),
      avatar,
      favoriteGenres,
    };

    onUpdateUser(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-stone-900 border border-stone-800 rounded-3xl p-5 sm:p-7 text-stone-100 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif-title text-xl font-bold">Registro de Usuario</h2>
              <p className="text-xs text-stone-400">Personaliza tu perfil literario en Tikbook</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Selector Tabs (Core request: Registrar como Autor o Lector) */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-3 space-y-4 text-xs pr-1">
          <div>
            <label className="text-xs font-medium text-stone-300 block mb-2">
              ¿Cómo deseas participar en Tikbook? *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Lector Option */}
              <button
                type="button"
                onClick={() => setRole('reader')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  role === 'reader'
                    ? 'border-amber-400 bg-amber-400/10 text-amber-300 ring-2 ring-amber-400/30'
                    : 'border-stone-800 bg-stone-950/60 text-stone-400 hover:bg-stone-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center text-amber-400">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  {role === 'reader' && <Check className="w-4 h-4 stroke-[3] text-amber-400" />}
                </div>
                <div className="font-bold text-sm text-stone-100">Perfil de Lector</div>
                <p className="text-[11px] text-stone-400 mt-1 leading-snug">
                  Descubre obras, lee en e-book, subraya citas y participa en debates.
                </p>
              </button>

              {/* Autor Option */}
              <button
                type="button"
                onClick={() => setRole('author')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  role === 'author'
                    ? 'border-amber-400 bg-amber-400/10 text-amber-300 ring-2 ring-amber-400/30'
                    : 'border-stone-800 bg-stone-950/60 text-stone-400 hover:bg-stone-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center text-amber-400">
                    <Feather className="w-4 h-4" />
                  </div>
                  {role === 'author' && <Check className="w-4 h-4 stroke-[3] text-amber-400" />}
                </div>
                <div className="font-bold text-sm text-stone-100">Perfil de Autor</div>
                <p className="text-[11px] text-stone-400 mt-1 leading-snug">
                  Publica novelas, poemas, crea portadas con IA y maqueta tus obras.
                </p>
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">Nombre Completo *</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ej. Clara Vidal"
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-400"
              />
            </div>

            {role === 'author' ? (
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Seudónimo Literario (Firma) *
                </label>
                <input
                  type="text"
                  required
                  value={penName}
                  onChange={e => setPenName(e.target.value)}
                  placeholder="Ej. C. V. de la Serna"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-400 font-serif"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="tucorreo@ejemplo.com"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-400"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">Nombre de Usuario (@)</label>
              <div className="flex items-center bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 focus-within:border-amber-400">
                <span className="text-stone-500 mr-1">@</span>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="usuario_literario"
                  className="w-full bg-transparent text-stone-100 focus:outline-none"
                />
              </div>
            </div>

            {role === 'author' && (
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="autor@editorial.com"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-400"
                />
              </div>
            )}
          </div>

          {/* Avatar Selection */}
          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1.5">Foto de Perfil</label>
            <div className="flex items-center gap-3">
              {AVATAR_OPTIONS.map((av, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAvatar(av)}
                  className={`relative w-10 h-10 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                    avatar === av ? 'border-amber-400 ring-2 ring-amber-400/40 scale-105' : 'border-stone-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={av} alt="Avatar" className="w-full h-full object-cover" />
                  {avatar === av && (
                    <div className="absolute inset-0 bg-amber-400/20 flex items-center justify-center">
                      <Check className="w-4 h-4 text-amber-400 stroke-[3]" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">
              {role === 'author' ? 'Biografía de Autor (reseña de tu estilo)' : 'Sobre ti (gustos lectores)'}
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder={role === 'author' ? 'Escritor de novelas góticas y microficción...' : 'Lector empedernido de fantasía y ensayo clásico...'}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Genres of interest */}
          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1.5">
              {role === 'author' ? 'Géneros que escribes' : 'Géneros que te apasiona leer'}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {GENRE_OPTIONS.map(g => (
                <button
                  key={g}
                  type="button"
                  onClick={() => toggleGenre(g)}
                  className={`px-2.5 py-1 rounded-lg border text-xs transition-colors cursor-pointer ${
                    favoriteGenres.includes(g)
                      ? 'bg-amber-400/20 border-amber-400 text-amber-300 font-semibold'
                      : 'border-stone-800 text-stone-400 hover:text-stone-200 bg-stone-950/60'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-amber-400/20 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>¡Perfil Actualizado!</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Guardar como {role === 'author' ? 'Autor' : 'Lector'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
