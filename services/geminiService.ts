import { GoogleGenAI, Modality } from '@google/genai';
import { Voice } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const detectLanguage = async (text: string): Promise<string> => {
  if (!text.trim()) {
    return 'English';
  }
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Detect the primary language of the following text. Respond with only the name of the language in English (e.g., "Hindi", "Japanese", "English"). Text: "${text}"`,
    });
    return response.text.trim();
  } catch (error) {
    console.error('Error detecting language:', error);
    return 'English'; // Fallback
  }
};

export const generateSpeech = async (text: string, voice: Voice): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });

    const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!audioData) {
      console.error("API response did not contain audio data.", response);
      throw new Error("No audio data returned from the API.");
    }
    
    return audioData;

  } catch (error) {
    console.error('Error generating speech with Gemini API:', error);
    throw error;
  }
};