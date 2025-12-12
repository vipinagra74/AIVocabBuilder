import React from 'react';

interface OnboardingProps {
  onSelectGrade: (grade: number) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onSelectGrade }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to LexiconQuest</h1>
        <p className="text-gray-500 mb-8">Select your class level to begin your journey.</p>
        
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 12 }, (_, i) => i + 1).map((grade) => {
            const isPrimary = grade <= 5;
            const isMiddle = grade > 5 && grade <= 9;
            // const isSenior = grade > 9;

            let colorClass = "bg-gray-100 hover:bg-gray-200 text-gray-800";
            if (isPrimary) colorClass = "bg-orange-100 hover:bg-orange-200 text-orange-700 border-orange-200";
            else if (isMiddle) colorClass = "bg-blue-100 hover:bg-blue-200 text-blue-700 border-blue-200";
            else colorClass = "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200";

            return (
              <button
                key={grade}
                onClick={() => onSelectGrade(grade)}
                className={`aspect-square rounded-2xl flex flex-col items-center justify-center border-2 border-transparent transition-all ${colorClass}`}
              >
                <span className="text-2xl font-bold">{grade}</span>
                <span className="text-[10px] uppercase font-bold opacity-60">Class</span>
              </button>
            );
          })}
        </div>
        
        <p className="mt-8 text-xs text-gray-400">
          This helps AI tailor words to your education level.
        </p>
      </div>
    </div>
  );
};

export default Onboarding;
