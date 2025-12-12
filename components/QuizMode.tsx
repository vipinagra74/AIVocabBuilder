import React, { useState, useEffect } from 'react';
import { QuizQuestion, GradeGroup } from '../types';
import { generateWordSet, generateQuizForWords } from '../services/geminiService';
import { Loader2, Check, X, Award, Zap, Smile, Frown } from 'lucide-react';

interface QuizModeProps {
  grade: number;
  gradeGroup: GradeGroup;
  onComplete: (xpEarned: number) => void;
  onExit: () => void;
}

const QuizMode: React.FC<QuizModeProps> = ({ grade, gradeGroup, onComplete, onExit }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const initQuiz = async () => {
      setLoading(true);
      const words = await generateWordSet(grade, 5, "fun facts and adventure");
      const quizData = await generateQuizForWords(words);
      setQuestions(quizData);
      setLoading(false);
    };
    initQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOptionClick = (option: string) => {
    if (selectedOption) return;

    setSelectedOption(option);
    const correct = option === questions[currentIndex].correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setScore(s => s + 1);
      setCombo(c => {
        const newCombo = c + 1;
        if (newCombo > maxCombo) setMaxCombo(newCombo);
        return newCombo;
      });
    } else {
      setCombo(0);
    }

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelectedOption(null);
        setIsCorrect(null);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const isPrimary = gradeGroup === GradeGroup.PRIMARY;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-purple-600 mb-4" />
        <p className="text-gray-500 font-medium">Preparing challenge...</p>
      </div>
    );
  }

  if (showResult) {
    const baseXP = score * 20;
    const comboBonus = maxCombo * 5;
    const totalXP = baseXP + comboBonus;

    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6 animate-pop">
        <div className="relative">
          <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
          <Award className="w-24 h-24 text-yellow-500 relative z-10 drop-shadow-lg" />
        </div>
        
        <h2 className="text-3xl font-extrabold text-gray-800 mt-6 mb-2">Quest Complete!</h2>
        <p className="text-gray-500 mb-8">You mastered {score} / {questions.length} words</p>
        
        <div className="grid grid-cols-2 gap-4 w-full mb-8">
            <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100">
                <p className="text-xs text-purple-400 uppercase font-bold">Base XP</p>
                <p className="text-2xl font-bold text-purple-700">+{baseXP}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
                <p className="text-xs text-orange-400 uppercase font-bold">Combo Bonus</p>
                <p className="text-2xl font-bold text-orange-700">+{comboBonus}</p>
            </div>
        </div>

        <button 
          onClick={() => onComplete(totalXP)}
          className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transform active:scale-95 transition-all
            ${isPrimary ? 'bg-gradient-to-r from-orange-500 to-pink-500' : 'bg-slate-800'}`}
        >
          Claim Rewards
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-md mx-auto h-full flex flex-col">
      {/* Header Stats */}
      <div className="flex justify-between items-center mb-6 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-gray-400">Question</span>
            <span className="text-lg font-bold text-gray-800">{currentIndex + 1}<span className="text-gray-400 text-sm">/{questions.length}</span></span>
        </div>
        
        {/* Combo Meter */}
        <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full font-bold text-sm transition-all duration-300 ${combo > 1 ? 'bg-orange-100 text-orange-600 scale-110' : 'bg-gray-100 text-gray-400'}`}>
                <Zap className={`w-4 h-4 ${combo > 1 ? 'fill-current' : ''}`} />
                <span>x{combo}</span>
            </div>
            <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase font-bold text-gray-400">Score</span>
                <span className="text-lg font-bold text-purple-600">{score}</span>
            </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 leading-snug">{currentQ.question}</h2>

        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            let stateClass = "bg-white border-gray-200 text-gray-700 hover:border-blue-400 hover:bg-blue-50";
            let icon = null;
            
            if (selectedOption === option) {
              if (isCorrect) {
                stateClass = "bg-green-100 border-green-500 text-green-800 ring-2 ring-green-200";
                icon = <Check className="w-5 h-5 text-green-600" />;
              } else {
                stateClass = "bg-red-100 border-red-500 text-red-800 ring-2 ring-red-200 animate-shake";
                icon = <X className="w-5 h-5 text-red-600" />;
              }
            } else if (selectedOption && option === currentQ.correctAnswer) {
              stateClass = "bg-green-100 border-green-500 text-green-800 opacity-80"; 
              icon = <Check className="w-5 h-5" />;
            } else if (selectedOption) {
                stateClass = "bg-gray-50 border-gray-100 text-gray-400 opacity-50";
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(option)}
                disabled={!!selectedOption}
                className={`w-full p-4 rounded-xl border-2 text-left font-semibold transition-all duration-200 flex justify-between items-center shadow-sm active:scale-95 ${stateClass}`}
              >
                <span>{option}</span>
                {icon}
              </button>
            );
          })}
        </div>

        {/* Feedback Area */}
        {selectedOption && (
            <div className={`mt-6 text-center animate-pop`}>
                {isCorrect ? (
                    <div className="inline-flex items-center gap-2 text-green-600 font-bold text-lg bg-green-50 px-4 py-2 rounded-full">
                        <Smile className="w-6 h-6" /> Awesome!
                    </div>
                ) : (
                    <div className="inline-flex items-center gap-2 text-red-500 font-bold text-lg bg-red-50 px-4 py-2 rounded-full">
                        <Frown className="w-6 h-6" /> Oops!
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default QuizMode;
