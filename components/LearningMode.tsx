import React, { useState } from 'react';
import { WordData, GradeGroup } from '../types';
import { generateWordSet } from '../services/geminiService';
import { Volume2, RotateCw, CheckCircle, ArrowRight, Loader2, BookOpen, Edit3, Settings2 } from 'lucide-react';

interface LearningModeProps {
  grade: number;
  gradeGroup: GradeGroup;
  onComplete: (words: WordData[]) => void;
  onExit: () => void;
}

const LearningMode: React.FC<LearningModeProps> = ({ grade, gradeGroup, onComplete, onExit }) => {
  // Setup State
  const [isSetup, setIsSetup] = useState(true);
  const [wordCount, setWordCount] = useState(5);
  const [customTopic, setCustomTopic] = useState("");
  
  // Learning State
  const [words, setWords] = useState<WordData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(false);

  const startLearning = async () => {
    setIsSetup(false);
    setLoading(true);
    const data = await generateWordSet(grade, wordCount, customTopic);
    setWords(data);
    setLoading(false);
  };

  const handleSpeak = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev + 1), 300);
    } else {
      onComplete(words);
    }
  };

  const isPrimary = gradeGroup === GradeGroup.PRIMARY;

  // 1. SETUP SCREEN
  if (isSetup) {
    return (
      <div className="flex flex-col h-full bg-white rounded-3xl shadow-lg p-6 animate-flip-in">
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-3 rounded-full ${isPrimary ? 'bg-orange-100' : 'bg-blue-100'}`}>
            <Settings2 className={`w-6 h-6 ${isPrimary ? 'text-orange-600' : 'text-blue-600'}`} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Customize Lesson</h2>
        </div>

        <div className="space-y-6 flex-1">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Number of Words: <span className="text-blue-600 text-lg">{wordCount}</span>
            </label>
            <input 
              type="range" 
              min="3" 
              max="15" 
              step="1"
              value={wordCount}
              onChange={(e) => setWordCount(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>3</span>
              <span>15</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Topic or Word List (Optional)
            </label>
            <div className="relative">
              <Edit3 className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
              <textarea
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="e.g. 'Space Exploration', or paste a list like 'apple, banana, cherry'..."
                className="w-full pl-10 p-3 bg-gray-50 border-2 border-gray-200 rounded-xl h-32 focus:border-blue-500 focus:ring-0 resize-none text-sm"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Teachers/Parents: Paste a list of words here to generate a custom lesson!
            </p>
          </div>
        </div>

        <button 
          onClick={startLearning}
          className={`mt-6 w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2
            ${isPrimary ? 'bg-orange-500 hover:bg-orange-600' : 'bg-slate-800 hover:bg-slate-700'}`}
        >
          <BookOpen className="w-5 h-5" />
          Start Learning
        </button>
      </div>
    );
  }

  // 2. LOADING SCREEN
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8">
        <Loader2 className={`w-12 h-12 animate-spin mb-4 ${isPrimary ? 'text-orange-500' : 'text-blue-600'}`} />
        <h2 className="text-xl font-bold text-gray-700">Generating Lesson...</h2>
        <p className="text-gray-500 mt-2">Crafting {wordCount} words for you.</p>
      </div>
    );
  }

  // 3. ERROR SCREEN
  if (words.length === 0) {
    return (
      <div className="text-center p-8 bg-white rounded-2xl shadow-md">
        <p className="mb-4">Could not load words. Please check your connection.</p>
        <button onClick={() => setIsSetup(true)} className="text-blue-600 font-bold">Try Again</button>
      </div>
    );
  }

  const currentWord = words[currentIndex];

  // 4. LEARNING CARD
  return (
    <div className="flex flex-col h-full max-w-lg mx-auto">
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${isPrimary ? 'bg-orange-400' : 'bg-blue-600'}`}
          style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
        ></div>
      </div>

      {/* Flashcard Area - Fixed for Mobile/iOS */}
      <div className="flex-1 relative min-h-[450px] perspective-container">
        <div 
          className="relative w-full h-full transition-transform duration-700 preserve-3d"
          style={{ 
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          {/* Front Face */}
          {/* Added z-index logic and moved onClick here to prevent backface scrolling issues */}
          <div 
            className="absolute inset-0 w-full h-full backface-hidden"
            style={{ 
               zIndex: isFlipped ? 0 : 10,
               visibility: isFlipped ? 'hidden' : 'visible', // Explicit visibility toggle for robustness
               transition: 'visibility 0s linear 0.35s' // Delay visibility toggle until halfway through flip
            }}
            onClick={() => setIsFlipped(true)}
          >
             <div className="w-full h-full bg-white rounded-3xl shadow-xl flex flex-col items-center justify-center p-6 border-2 border-gray-100 cursor-pointer">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Word {currentIndex + 1} of {words.length}</span>
                <h2 className={`text-4xl sm:text-5xl font-extrabold mb-6 text-center break-words max-w-full ${isPrimary ? 'font-comic' : ''}`}>{currentWord.word}</h2>
                <button 
                  onClick={(e) => handleSpeak(e, currentWord.word)}
                  className="p-4 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors shadow-sm active:scale-95"
                >
                  <Volume2 className="w-8 h-8 text-blue-500" />
                </button>
                <p className="mt-8 text-gray-400 text-sm font-medium animate-bounce">Tap to flip</p>
            </div>
          </div>

          {/* Back Face - Fixed Visibility & Scrolling */}
          {/* Nested the overflow container to prevent WebKit rendering bugs */}
          <div 
            className="absolute inset-0 w-full h-full rotate-y-180 backface-hidden"
            style={{ 
                zIndex: isFlipped ? 10 : 0,
                visibility: isFlipped ? 'visible' : 'hidden', // Explicit visibility toggle for robustness
                transition: 'visibility 0s linear 0.35s'
            }}
          >
            <div className="w-full h-full bg-white rounded-3xl shadow-xl border-2 border-gray-100 overflow-hidden flex flex-col">
                {/* Scrollable Content Container */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                <div className="flex justify-between items-center mb-4 sticky top-0 bg-white/95 py-2 backdrop-blur-sm z-10">
                    <h3 className="text-2xl font-bold text-gray-900">{currentWord.word}</h3>
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase">{currentWord.partOfSpeech}</span>
                </div>

                <div className="space-y-6">
                    <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 relative">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="text-xs font-bold text-orange-400 uppercase">Meaning</h4>
                        <button 
                          onClick={(e) => handleSpeak(e, currentWord.meaning)}
                          className="p-1 hover:bg-orange-100 rounded-full transition-colors active:scale-95"
                          aria-label="Listen to meaning"
                        >
                          <Volume2 className="w-4 h-4 text-orange-500" />
                        </button>
                      </div>
                      <p className="text-lg font-medium text-gray-800 leading-snug">{currentWord.meaning}</p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <h4 className="text-xs font-bold text-blue-400 uppercase mb-1">Example</h4>
                    <p className="text-gray-700 italic">"{currentWord.exampleSentence}"</p>
                    </div>

                    <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Synonyms</h4>
                    <div className="flex flex-wrap gap-2">
                        {currentWord.synonyms.slice(0, 4).map(syn => (
                        <span key={syn} className="px-3 py-1 bg-gray-100 rounded-lg text-sm text-gray-700 border border-gray-200">{syn}</span>
                        ))}
                    </div>
                    </div>

                    <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Antonyms</h4>
                    <div className="flex flex-wrap gap-2">
                        {currentWord.antonyms.slice(0, 3).map(ant => (
                        <span key={ant} className="px-3 py-1 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">{ant}</span>
                        ))}
                    </div>
                    </div>
                </div>
                </div>
                
                {/* Bottom Gradient for scroll hint */}
                <div className="h-4 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-6 flex justify-center gap-4 pb-4">
        <button 
          onClick={() => setIsFlipped(!isFlipped)}
          className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 active:bg-gray-100"
        >
          <RotateCw className="w-5 h-5" />
          Flip
        </button>
        <button 
          onClick={handleNext}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white shadow-lg transform active:scale-95 transition-all
            ${isPrimary ? 'bg-orange-500 hover:bg-orange-600' : 'bg-slate-800 hover:bg-slate-700'}`}
        >
          {currentIndex === words.length - 1 ? (
             <>Finish <CheckCircle className="w-5 h-5" /></>
          ) : (
             <>Next <ArrowRight className="w-5 h-5" /></>
          )}
        </button>
      </div>
      
      <style>{`
        .perspective-container {
          perspective: 1000px;
        }
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default LearningMode;
