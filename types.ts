export enum GradeGroup {
  PRIMARY = 'PRIMARY', // Class 1-5
  MIDDLE = 'MIDDLE',   // Class 6-9
  SENIOR = 'SENIOR'    // Class 10-12
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface StudentProfile {
  name: string;
  grade: number;
  xp: number;
  streak: number;
  completedWords: number;
  masteredWordsList: WordData[]; // Added to store details
  badges: string[];
}

export interface WordData {
  word: string;
  pronunciation: string; // Phonetic
  meaning: string;
  partOfSpeech: string;
  synonyms: string[];
  antonyms: string[];
  exampleSentence: string;
  difficultyLevel: number; // 1-10 inside the grade
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  type: 'meaning' | 'synonym' | 'sentence';
}

export enum AppView {
  LOGIN = 'LOGIN',
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD',
  LEARN = 'LEARN',
  QUIZ = 'QUIZ',
  HISTORY = 'HISTORY', // New view
  SETTINGS = 'SETTINGS'
}
