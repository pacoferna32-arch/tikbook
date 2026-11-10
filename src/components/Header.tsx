import React from 'react';
import { PenSquare, BookOpen, Compass, Bookmark, User, ShieldCheck } from 'lucide-react';
import { UserAccount } from '../types';

interface HeaderProps {
  activeTab: 'foryou' | 'trending' | 'micro' | 'library';
  onSelectTab: (tab: 'foryou' | 'trending' | 'micro' | 'library') => void;
  onOpenPublish: () => void;
  onOpenExplore: () => void;
  onOpenAuth: () => void;
  onOpenLegalNotice: () => void;
  currentUser: UserAccount;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenPublish,
  onOpenExplore,
  onOpenAuth,
  onOpenLegalNotice,
  currentUser,
  savedCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-stone-950/85 backdrop-blur-md border-b border-stone-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark (single text element wordmark in display face) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onSelectTab('foryou')}
            className="group flex items-center gap-2 text-left cursor-pointer focus:outline-none"
            aria-label="Ir al inicio de Tikbook"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center text-stone-950 shadow-sm shadow-amber-600/30 group-hover:scale-105 transition-transform">
              <BookOpen className="w-4 h-4 text-stone-950 stroke-[2.5]" />
            </div>
            <span className="font-serif-title text-2xl font-bold tracking-tight text-stone-100 whitespace-nowrap">
              Tikbook
            </span>
          </button>
        </div>

        {/* Zone 2: 4-5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-400">
          <button
            onClick={() => onSelectTab('foryou')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 ${
              activeTab === 'foryou'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                : 'hover:text-stone-200'
            }`}
          >
            Para ti
          </button>

          <button
            onClick={() => onSelectTab('trending')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 ${
              activeTab === 'trending'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                : 'hover:text-stone-200'
            }`}
          >
            Tendencias
          </button>

          <button
            onClick={() => onSelectTab('micro')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 ${
              activeTab === 'micro'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                : 'hover:text-stone-200'
            }`}
          >
            Microrrelatos
          </button>

          <button
            onClick={onOpenExplore}
            className="flex items-center gap-1.5 whitespace-nowrap shrink-0 hover:text-stone-200 transition-colors"
          >
            <Compass className="w-4 h-4 text-stone-400" />
            <span>Explorar</span>
          </button>

          <button
            onClick={() => onSelectTab('library')}
            className={`flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors pb-0.5 ${
              activeTab === 'library'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                : 'hover:text-stone-200'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Mi Biblioteca</span>
            {savedCount > 0 && (
              <span className="text-[11px] font-mono bg-stone-800 text-stone-300 px-1.5 rounded-full">
                {savedCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: Legal Certificate + User Profile + Primary Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Legal Notice & Copyright Certification trigger */}
          <button
            onClick={onOpenLegalNotice}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/15 text-amber-300 text-xs font-medium transition-all cursor-pointer whitespace-nowrap"
            title="Aviso de certificación y propiedad intelectual de las obras"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Obras Certificadas</span>
          </button>

          {/* User Role Profile Trigger */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl border border-stone-800 bg-stone-900/80 hover:border-amber-400/40 transition-all cursor-pointer"
            title={`Perfil: ${currentUser.name} (${currentUser.role === 'author' ? 'Autor' : 'Lector'})`}
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-6 h-6 rounded-full object-cover ring-1 ring-amber-400/40"
            />
            <span className="hidden sm:inline text-xs font-medium text-stone-200 truncate max-w-[85px]">
              {currentUser.role === 'author' ? (currentUser.penName || currentUser.name) : currentUser.name}
            </span>
            <span
              className={`hidden sm:inline text-[10px] px-1.5 py-0.5 rounded-full font-mono uppercase ${
                currentUser.role === 'author'
                  ? 'bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30'
                  : 'bg-stone-800 text-stone-400'
              }`}
            >
              {currentUser.role === 'author' ? 'Autor' : 'Lector'}
            </span>
          </button>

          {/* Primary Action Button */}
          <button
            onClick={onOpenPublish}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 active:scale-[0.98] rounded-xl transition-all shadow-sm shadow-amber-400/20 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <PenSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Publicar Obra</span>
            <span className="sm:hidden">Publicar</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-stone-800/60 bg-stone-950/95 py-2 px-2 text-xs font-medium">
        <button
          onClick={() => onSelectTab('foryou')}
          className={`px-3 py-1.5 rounded-md transition-colors ${
            activeTab === 'foryou' ? 'text-amber-400 font-semibold bg-stone-900' : 'text-stone-400'
          }`}
        >
          Para ti
        </button>
        <button
          onClick={() => onSelectTab('trending')}
          className={`px-3 py-1.5 rounded-md transition-colors ${
            activeTab === 'trending' ? 'text-amber-400 font-semibold bg-stone-900' : 'text-stone-400'
          }`}
        >
          Tendencias
        </button>
        <button
          onClick={() => onSelectTab('micro')}
          className={`px-3 py-1.5 rounded-md transition-colors ${
            activeTab === 'micro' ? 'text-amber-400 font-semibold bg-stone-900' : 'text-stone-400'
          }`}
        >
          Microrrelatos
        </button>
        <button
          onClick={() => onSelectTab('library')}
          className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1 ${
            activeTab === 'library' ? 'text-amber-400 font-semibold bg-stone-900' : 'text-stone-400'
          }`}
        >
          <span>Biblioteca</span>
          {savedCount > 0 && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
          )}
        </button>
        <button
          onClick={onOpenLegalNotice}
          className="px-2 py-1.5 rounded-md text-amber-400 flex items-center gap-1"
          title="Certificación"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Aviso</span>
        </button>
      </div>
    </header>
  );
};
