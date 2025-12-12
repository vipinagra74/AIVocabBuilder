import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import LearningMode from './components/LearningMode';
import QuizMode from './components/QuizMode';
import Settings from './components/Settings';
import Login from './components/Login';
import WordHistory from './components/WordHistory';
import { GradeGroup, StudentProfile, AppView, User, WordData } from './types';

const INITIAL_PROFILE: StudentProfile = {
  name: 'Student',
  grade: 0,
  xp: 0,
  streak: 1,
  completedWords: 0,
  masteredWordsList: [],
  badges: []
};

const App: React.FC = () => {
  // Session User State
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('lq_session_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      console.error("Failed to parse session user", e);
      return null;
    }
  });

  // Profile State
  const [profile, setProfile] = useState<StudentProfile>(INITIAL_PROFILE);

  // View State
  const [currentView, setCurrentView] = useState<AppView>(AppView.LOGIN);

  // 1. On User Change: Load or Initialize Profile
  useEffect(() => {
    if (user) {
      // Persist session
      localStorage.setItem('lq_session_user', JSON.stringify(user));

      // Load specific profile for this user ID
      const storageKey = `lq_profile_${user.id}`;
      try {
        const savedProfile = localStorage.getItem(storageKey);
        if (savedProfile) {
          const parsed = JSON.parse(savedProfile);
          // Migrate old profiles that lack masteredWordsList
          if (!parsed.masteredWordsList) parsed.masteredWordsList = [];
          setProfile(parsed);
          // If they have a grade, go to dashboard, else onboarding
          setCurrentView(parsed.grade > 0 ? AppView.DASHBOARD : AppView.ONBOARDING);
        } else {
          // New user profile
          setProfile({ ...INITIAL_PROFILE, name: user.name });
          setCurrentView(AppView.ONBOARDING);
        }
      } catch (e) {
        console.error("Failed to parse profile", e);
        setProfile({ ...INITIAL_PROFILE, name: user.name });
        setCurrentView(AppView.ONBOARDING);
      }
    } else {
      // No user, go to login
      localStorage.removeItem('lq_session_user');
      setCurrentView(AppView.LOGIN);
      setProfile(INITIAL_PROFILE);
    }
  }, [user]);

  // 2. On Profile Change: Save to User Storage
  useEffect(() => {
    if (user && profile) {
      const storageKey = `lq_profile_${user.id}`;
      localStorage.setItem(storageKey, JSON.stringify(profile));
    }
  }, [profile, user]);

  // Handlers
  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleGradeSelect = (grade: number) => {
    setProfile(prev => ({ ...prev, grade }));
    setCurrentView(AppView.DASHBOARD);
  };

  const handleLearningComplete = (learnedWords: WordData[]) => {
    setProfile(prev => {
        // Avoid duplicates in history
        const existingWords = new Set(prev.masteredWordsList.map(w => w.word));
        const newUniqueWords = learnedWords.filter(w => !existingWords.has(w.word));
        
        return {
            ...prev,
            completedWords: prev.completedWords + learnedWords.length,
            masteredWordsList: [...prev.masteredWordsList, ...newUniqueWords],
            xp: prev.xp + (learnedWords.length * 10)
        };
    });
    setCurrentView(AppView.DASHBOARD);
  };

  const handleQuizComplete = (xpEarned: number) => {
    setProfile(prev => ({
      ...prev,
      xp: prev.xp + xpEarned
    }));
    setCurrentView(AppView.DASHBOARD);
  };

  const handleLogout = () => {
    setUser(null);
  };

  // Derived state for styling
  const gradeGroup = 
    profile.grade <= 5 ? GradeGroup.PRIMARY :
    profile.grade <= 9 ? GradeGroup.MIDDLE :
    GradeGroup.SENIOR;

  // Render Logic
  if (currentView === AppView.LOGIN) {
    return <Login onLogin={handleLogin} />;
  }

  if (currentView === AppView.ONBOARDING) {
    return <Onboarding onSelectGrade={handleGradeSelect} />;
  }

  return (
    <Layout 
      gradeGroup={gradeGroup} 
      currentView={currentView} 
      onChangeView={setCurrentView}
      xp={profile.xp}
    >
      {currentView === AppView.DASHBOARD && (
        <Dashboard 
          profile={profile} 
          gradeGroup={gradeGroup}
          onChangeView={setCurrentView}
        />
      )}
      
      {currentView === AppView.LEARN && (
        <LearningMode 
          grade={profile.grade} 
          gradeGroup={gradeGroup}
          onComplete={handleLearningComplete}
          onExit={() => setCurrentView(AppView.DASHBOARD)}
        />
      )}

      {currentView === AppView.QUIZ && (
        <QuizMode
          grade={profile.grade}
          gradeGroup={gradeGroup}
          onComplete={handleQuizComplete}
          onExit={() => setCurrentView(AppView.DASHBOARD)}
        />
      )}

      {currentView === AppView.HISTORY && (
        <WordHistory
          words={profile.masteredWordsList}
          gradeGroup={gradeGroup}
          onBack={() => setCurrentView(AppView.DASHBOARD)}
        />
      )}

      {currentView === AppView.SETTINGS && (
        <Settings 
          profile={profile} 
          user={user}
          gradeGroup={gradeGroup}
          onLogout={handleLogout}
        />
      )}
    </Layout>
  );
};

export default App;
