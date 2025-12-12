import React, { useEffect, useState } from 'react';
import { StudentProfile, GradeGroup, WordData, AppView } from '../types';
import { generateDailyWord } from '../services/geminiService';
import { Flame, Star, Play, Volume2, ArrowRight, Book } from 'lucide-react';

interface DashboardProps {
  profile: StudentProfile;
  gradeGroup: GradeGroup;
  onChangeView: (view: AppView) => void;
}

const mockData = [
  { day: 'M', xp: 120 },
  { day: 'T', xp: 200 },
  { day: 'W', xp: 150 },
  { day: 'T', xp: 300 },
  { day: 'F', xp: 180 },
  { day: 'S', xp: 100 },
  { day: 'S', xp: 50 },
];

const Dashboard: React.FC<DashboardProps> = ({ profile, gradeGroup, onChangeView }) => {
  const [dailyWord, setDailyWord] = useState<WordData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Only fetch if we haven't already (in a real app, check date)
    const fetchWord = async () => {
      setLoading(true);
      const word = await generateDailyWord(profile.grade);
      setDailyWord(word);
      setLoading(false);
    };
    fetchWord();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSpeak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const isPrimary = gradeGroup === GradeGroup.PRIMARY;
  const maxVal = Math.max(...mockData.map(d => d.xp));

  return (
    <div className="space-y-6 animate-flip-in pb-4">
      {/* Welcome & Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className={`p-4 rounded-2xl ${isPrimary ? 'bg-orange-100' : 'bg-white'} shadow-sm`}>
          <div className="flex items-center gap-2 mb-1">
            <Flame className="text-orange-500 w-5 h-5" />
            <span className="font-bold text-gray-600 text-sm">Streak</span>
          </div>
          <p className="text-3xl font-extrabold text-gray-800">{profile.streak} Days</p>
        </div>
        <button 
            onClick={() => onChangeView(AppView.HISTORY)}
            className={`p-4 rounded-2xl ${isPrimary ? 'bg-yellow-100 hover:bg-yellow-200' : 'bg-white hover:bg-gray-50'} shadow-sm transition-colors text-left`}
        >
          <div className="flex items-center gap-2 mb-1">
            <Star className="text-yellow-500 w-5 h-5" />
            <span className="font-bold text-gray-600 text-sm">Mastered</span>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-extrabold text-gray-800">{profile.completedWords}</p>
            <ArrowRight className="w-5 h-5 text-gray-400 mb-1" />
          </div>
        </button>
      </div>

      {/* Word of the Day */}
      <section className="bg-white rounded-3xl p-6 shadow-md border border-gray-100 relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-2 h-full ${isPrimary ? 'bg-orange-400' : 'bg-teal-600'}`}></div>
        <h2 className={`text-lg font-bold mb-4 ${isPrimary ? 'text-orange-500 uppercase tracking-wider' : 'text-teal-600'}`}>
          Word of the Day
        </h2>
        
        {loading ? (
          <div className="h-24 flex items-center justify-center text-gray-400">Loading AI Content...</div>
        ) : dailyWord ? (
          <div>
            <div className="flex justify-between items-start">
              <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">{dailyWord.word}</h3>
              <button 
                onClick={() => handleSpeak(dailyWord.word)}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                <Volume2 className="w-6 h-6 text-gray-700" />
              </button>
            </div>
            <p className="text-gray-500 italic mb-4 text-lg">/{dailyWord.pronunciation}/ • {dailyWord.partOfSpeech}</p>
            <p className="text-gray-700 font-medium text-lg leading-relaxed mb-4">{dailyWord.meaning}</p>
            <div className="bg-gray-50 p-4 rounded-xl border-l-4 border-gray-300">
              <p className="text-gray-600">"{dailyWord.exampleSentence}"</p>
            </div>
          </div>
        ) : (
          <div className="text-red-500">Unable to load word. Check connection.</div>
        )}
      </section>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button 
          onClick={() => onChangeView(AppView.LEARN)}
          className={`p-6 rounded-2xl shadow-lg flex items-center justify-between group
            ${isPrimary 
              ? 'bg-gradient-to-r from-orange-400 to-pink-500 text-white hover:scale-105' 
              : 'bg-slate-800 text-white hover:bg-slate-700'} 
            transition-all duration-300`}
        >
          <div className="text-left">
            <h3 className="font-bold text-xl mb-1">Start Learning</h3>
            <p className="opacity-90 text-sm">Today's vocabulary set</p>
          </div>
          <div className="bg-white/20 p-2 rounded-full">
            <Play className="w-6 h-6 fill-current" />
          </div>
        </button>

        <button 
          onClick={() => onChangeView(AppView.QUIZ)}
          className={`p-6 rounded-2xl shadow-lg flex items-center justify-between
             bg-white text-gray-800 border border-gray-200 hover:border-gray-300
            transition-all duration-300`}
        >
          <div className="text-left">
            <h3 className="font-bold text-xl mb-1">Take a Quiz</h3>
            <p className="opacity-70 text-sm">Boost your XP</p>
          </div>
          <ArrowRight className="w-6 h-6 text-gray-400" />
        </button>
      </div>

      {/* Progress Chart (Custom CSS) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h3 className="font-bold text-gray-700 mb-6">Weekly Progress</h3>
        <div className="h-48 w-full flex items-end justify-between gap-2">
          {mockData.map((d, i) => {
             const heightPct = (d.xp / maxVal) * 100;
             return (
               <div key={i} className="flex flex-col items-center flex-1 h-full justify-end group">
                 <div className="relative w-full flex justify-center items-end h-[85%]">
                   {/* Tooltip */}
                   <div className="absolute -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                     {d.xp} XP
                   </div>
                   {/* Bar */}
                   <div 
                     className={`w-full max-w-[20px] rounded-t-md transition-all duration-500 ${isPrimary ? 'bg-orange-400 hover:bg-orange-500' : 'bg-slate-800 hover:bg-slate-700'}`}
                     style={{ height: `${heightPct}%` }}
                   ></div>
                 </div>
                 <div className="mt-2 text-xs font-bold text-gray-400">{d.day}</div>
               </div>
             );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
