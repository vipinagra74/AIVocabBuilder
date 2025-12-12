import React from 'react';
import { GradeGroup, StudentProfile, User } from '../types';
import { LogOut, User as UserIcon, Shield, Mail } from 'lucide-react';

interface SettingsProps {
  profile: StudentProfile;
  user: User | null;
  onLogout: () => void;
  gradeGroup: GradeGroup;
}

const Settings: React.FC<SettingsProps> = ({ profile, user, onLogout, gradeGroup }) => {
  const isPrimary = gradeGroup === GradeGroup.PRIMARY;

  return (
    <div className="space-y-6 animate-flip-in">
      <h2 className="text-2xl font-bold text-gray-800">Settings</h2>

      {/* Profile Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row items-center gap-6">
        <div className="relative">
          {user?.avatar ? (
            <img src={user.avatar} alt="Avatar" className="w-20 h-20 rounded-full border-4 border-white shadow-md bg-gray-100" />
          ) : (
            <div className={`w-20 h-20 rounded-full flex items-center justify-center border-4 border-white shadow-md ${isPrimary ? 'bg-orange-200' : 'bg-slate-200'}`}>
              <UserIcon className="w-10 h-10 text-gray-600" />
            </div>
          )}
          <span className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></span>
        </div>
        
        <div className="text-center md:text-left flex-1">
          <h3 className="font-bold text-xl text-gray-900">{user?.name || profile.name}</h3>
          <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 mt-1">
             <Mail className="w-4 h-4" />
             <span className="text-sm">{user?.email || 'Guest User'}</span>
          </div>
          <div className="mt-3 inline-block px-3 py-1 bg-gray-100 rounded-lg text-xs font-bold uppercase tracking-wide text-gray-600">
            Class {profile.grade > 0 ? profile.grade : 'Not Selected'}
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="bg-white p-6 rounded-2xl shadow-sm space-y-4">
        <h3 className="font-bold text-gray-700">Learning Stats</h3>
        <div className="flex justify-between border-b border-gray-100 pb-3">
          <span className="text-gray-500">Total XP</span>
          <span className="font-mono font-bold text-lg text-indigo-600">{profile.xp}</span>
        </div>
        <div className="flex justify-between border-b border-gray-100 pb-3">
          <span className="text-gray-500">Words Mastered</span>
          <span className="font-mono font-bold text-lg text-green-600">{profile.completedWords}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Current Streak</span>
          <span className="font-mono font-bold text-lg text-orange-500">{profile.streak} Days</span>
        </div>
      </div>

      {/* Parent Zone Placeholder */}
      <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:bg-gray-50 transition-colors">
        <Shield className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <h3 className="font-bold text-gray-600">Parent Dashboard</h3>
        <p className="text-sm text-gray-400 mt-1">
          Detailed analytics and safety controls are enabled for {user?.email}.
        </p>
      </div>

      <button 
        onClick={onLogout}
        className="w-full p-4 text-red-500 font-bold bg-white rounded-xl shadow-sm border border-red-100 hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
      >
        <LogOut className="w-5 h-5" />
        Sign Out
      </button>

      <div className="text-center text-xs text-gray-400 pt-8">
        LexiconQuest v1.1 • Logged in as {user?.email}
      </div>
    </div>
  );
};

export default Settings;
