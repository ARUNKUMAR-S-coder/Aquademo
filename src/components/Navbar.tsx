import React from 'react';
import { Fish, History, BookOpen, Info, Sparkles, ShieldCheck } from 'lucide-react';
import { AppView } from '../types';

interface NavbarProps {
  currentView: AppView;
  onSelectView: (view: AppView) => void;
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSelectView,
  historyCount
}) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div
          id="nav-brand"
          onClick={() => onSelectView('screen')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Fish className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base sm:text-lg tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                AquaScan AI
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium bg-cyan-950/80 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-800/60">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                ViT 7-Class
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden xs:block">
              Fish Disease Screening • panda992/fish_disease_datasets
            </p>
          </div>
        </div>

        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            id="nav-btn-screen"
            onClick={() => onSelectView('screen')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              currentView === 'screen' || currentView === 'result'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Screen</span>
          </button>

          <button
            id="nav-btn-diseases"
            onClick={() => onSelectView('diseases')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              currentView === 'diseases'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Disease</span> Library
          </button>

          <button
            id="nav-btn-history"
            onClick={() => onSelectView('history')}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              currentView === 'history'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <History className="w-4 h-4" />
            <span>History</span>
            {historyCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 bg-cyan-500 text-slate-950 font-bold rounded-full text-[10px]">
                {historyCount}
              </span>
            )}
          </button>

          <button
            id="nav-btn-about"
            onClick={() => onSelectView('about')}
            className={`p-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              currentView === 'about'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Model Info & Specifications"
          >
            <Info className="w-4 h-4" />
          </button>
        </nav>
      </div>
    </header>
  );
};
