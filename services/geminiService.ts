import { GoogleGenAI, Type } from "@google/genai";
import { WordData, QuizQuestion, GradeGroup } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to determine model based on complexity needed
const getModel = (grade: number) => {
  // Use flash for everything for speed and cost, unless complex logic needed
  return 'gemini-2.5-flash';
};

export const generateWordSet = async (grade: number, count: number = 5, topic?: string): Promise<WordData[]> => {
  const modelId = getModel(grade);
  
  let promptContext = "";
  if (topic && topic.length > 0) {
    if (topic.includes(" ")) {
       // Treating as a specific topic or list of words
       promptContext = `The user has provided this specific topic or list of words to focus on: "${topic}". Generate words ONLY related to this or from this list if provided.`;
    } else {
       promptContext = `Focus specifically on the topic: ${topic}.`;
    }
  } else {
    promptContext = 'Choose a mix of useful academic and daily life words suitable for this age group.';
  }

  const prompt = `Generate ${count} vocabulary words suitable for a Grade ${grade} student. 
  ${promptContext}
  Ensure the definitions are age-appropriate and easy to understand.`;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              word: { type: Type.STRING },
              pronunciation: { type: Type.STRING, description: "Phonetic spelling" },
              meaning: { type: Type.STRING },
              partOfSpeech: { type: Type.STRING },
              synonyms: { type: Type.ARRAY, items: { type: Type.STRING } },
              antonyms: { type: Type.ARRAY, items: { type: Type.STRING } },
              exampleSentence: { type: Type.STRING },
              difficultyLevel: { type: Type.INTEGER, description: "1 to 10 scale" }
            },
            required: ["word", "meaning", "exampleSentence", "partOfSpeech"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as WordData[];
  } catch (error) {
    console.error("Gemini API Error generating words:", error);
    return [];
  }
};

export const generateQuizForWords = async (words: WordData[]): Promise<QuizQuestion[]> => {
  if (words.length === 0) return [];
  
  // Create a quiz with 5-10 questions depending on word count
  const wordList = words.map(w => w.word).join(", ");
  const prompt = `Create a gamified quiz for these words: ${wordList}. Generate 1 question per word. Make the questions fun and situational.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "4 options" },
              correctAnswer: { type: Type.STRING },
              type: { type: Type.STRING, enum: ["meaning", "synonym", "sentence"] }
            },
            required: ["question", "options", "correctAnswer", "type"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as QuizQuestion[];
  } catch (error) {
    console.error("Gemini API Error generating quiz:", error);
    return [];
  }
};

export const generateDailyWord = async (grade: number): Promise<WordData | null> => {
  const words = await generateWordSet(grade, 1, "Word of the day, interesting and educational");
  return words.length > 0 ? words[0] : null;
};
