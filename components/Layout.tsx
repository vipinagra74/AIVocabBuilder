import React from 'react';
import { GradeGroup, AppView } from '../types';
import { Settings, Home, BookOpen, Trophy } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  gradeGroup: GradeGroup;
  currentView: AppView;
  onChangeView: (view: AppView) => void;
  xp: number;
}

const Layout: React.FC<LayoutProps> = ({ children, gradeGroup, currentView, onChangeView, xp }) => {
  // Theme logic
  const isPrimary = gradeGroup === GradeGroup.PRIMARY;
  
  const baseColors = isPrimary 
    ? "bg-yellow-50 text-gray-900 font-comic" 
    : gradeGroup === GradeGroup.MIDDLE 
      ? "bg-blue-50 text-slate-800 font-sans" 
      : "bg-gray-50 text-gray-900 font-sans";

  const navColor = isPrimary ? "bg-orange-400" : gradeGroup === GradeGroup.MIDDLE ? "bg-teal-600" : "bg-slate-800";

  return (
    <div className={`min-h-screen flex flex-col ${baseColors} transition-colors duration-500`}>
      {/* Header */}
      <header className={`${navColor} text-white p-4 shadow-lg sticky top-0 z-50`}>
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onChangeView(AppView.DASHBOARD)}>
            <BookOpen className={isPrimary ? "w-8 h-8" : "w-6 h-6"} />
            <h1 className={`font-bold ${isPrimary ? "text-2xl tracking-wide" : "text-xl tracking-tight"}`}>
              LexiconQuest
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-black/20 px-3 py-1 rounded-full">
              <Trophy className="w-4 h-4 text-yellow-300" />
              <span className="font-bold">{xp} XP</span>
            </div>
            <button onClick={() => onChangeView(AppView.SETTINGS)}>
              <Settings className="w-6 h-6 hover:rotate-90 transition-transform" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto p-4 pb-24">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 p-2 pb-6 md:pb-2 shadow-lg md:hidden z-40">
        <div className="flex justify-around items-center text-xs font-bold text-gray-500">
          <button 
            className={`flex flex-col items-center p-2 rounded-lg ${currentView === AppView.DASHBOARD ? 'text-blue-600 bg-blue-50' : ''}`}
            onClick={() => onChangeView(AppView.DASHBOARD)}
          >
            <Home className="w-6 h-6 mb-1" />
            Home
          </button>
          <button 
            className={`flex flex-col items-center p-2 rounded-lg ${currentView === AppView.LEARN ? 'text-green-600 bg-green-50' : ''}`}
            onClick={() => onChangeView(AppView.LEARN)}
          >
            <BookOpen className="w-6 h-6 mb-1" />
            Learn
          </button>
          <button 
            className={`flex flex-col items-center p-2 rounded-lg ${currentView === AppView.QUIZ ? 'text-purple-600 bg-purple-50' : ''}`}
            onClick={() => onChangeView(AppView.QUIZ)}
          >
            <Trophy className="w-6 h-6 mb-1" />
            Quiz
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Layout;
