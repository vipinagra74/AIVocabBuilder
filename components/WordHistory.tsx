import React from 'react';
import { WordData, GradeGroup } from '../types';
import { Search, Volume2 } from 'lucide-react';

interface WordHistoryProps {
  words: WordData[];
  gradeGroup: GradeGroup;
  onBack: () => void;
}

const WordHistory: React.FC<WordHistoryProps> = ({ words, gradeGroup, onBack }) => {
  const [filter, setFilter] = React.useState('');

  const filteredWords = words.filter(w => 
    w.word.toLowerCase().includes(filter.toLowerCase()) || 
    w.meaning.toLowerCase().includes(filter.toLowerCase())
  );

  const handleSpeak = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const isPrimary = gradeGroup === GradeGroup.PRIMARY;

  return (
    <div className="h-full flex flex-col animate-flip-in">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">My Vocabulary</h2>
        <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input 
                type="text" 
                placeholder="Search your words..." 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-0 outline-none bg-white shadow-sm"
            />
        </div>
      </div>

      {words.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 text-center p-8">
            <p>No words mastered yet.</p>
            <p className="text-sm mt-2">Complete a learning session to see words here!</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-3 pb-20">
            {filteredWords.slice().reverse().map((word, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-bold text-lg text-gray-900">{word.word}</h3>
                            <span className="text-xs text-gray-500 italic">{word.partOfSpeech}</span>
                        </div>
                        <button 
                             onClick={(e) => handleSpeak(e, word.word)}
                             className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 text-blue-500"
                        >
                            <Volume2 className="w-4 h-4" />
                        </button>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{word.meaning}</p>
                    <div className={`text-xs p-2 rounded-lg mt-1 ${isPrimary ? 'bg-orange-50 text-orange-700' : 'bg-blue-50 text-blue-700'}`}>
                        "{word.exampleSentence}"
                    </div>
                </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default WordHistory;
