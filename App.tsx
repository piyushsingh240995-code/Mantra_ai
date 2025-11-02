import React, { useState, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { VoiceSelector } from './components/VoiceSelector';
import { generateSpeech, detectLanguage } from './services/geminiService';
import { playAudio, stopAudio } from './utils/audio';
import { Voice, voiceGroups } from './types';
import { SpinnerIcon } from './components/icons/SpinnerIcon';
import { PlayIcon } from './components/icons/PlayIcon';
import { StopIcon } from './components/icons/StopIcon';

const App: React.FC = () => {
  const [text, setText] = useState<string>("I can speak like Goku, Gojo Satoru, and other anime characters. Try something like 'नमस्ते दुनिया' in Hindi, or 'こんにちは世界' in Japanese. Auto-language detection is on!");
  const [selectedVoice, setSelectedVoice] = useState<Voice>(Voice.Zephyr);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [autoDetect, setAutoDetect] = useState<boolean>(true);


  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const handleStopAudio = useCallback(() => {
    if (audioSourceRef.current) {
      stopAudio(audioSourceRef.current);
      audioSourceRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
    setIsPlaying(false);
  }, []);

  const handleGenerateSpeech = async () => {
    if (isLoading || !text.trim()) {
      return;
    }
    
    const restrictedKeywords = ["piyush", "piyu", "piyush gaming", "piyush2302", "piyush singh", "creator of mantra"];
    const lowerCaseText = text.toLowerCase();

    if (restrictedKeywords.some(keyword => lowerCaseText.includes(keyword))) {
        setError('⚠️ Restricted content detected. Mantra AI respects privacy and cannot process this request.');
        return;
    }

    handleStopAudio();
    setIsLoading(true);
    setError(null);

    let voiceToUse = selectedVoice;

    if (autoDetect) {
      try {
        const detectedLanguage = await detectLanguage(text);
        const language = detectedLanguage.toLowerCase();
        let newVoice: Voice | undefined;

        const findGroup = (search: string) => voiceGroups.find(g => g.label.toLowerCase().includes(search));

        if (language.includes('hindi') || language.includes('hinglish')) {
          newVoice = findGroup('hindi')?.options[0].value;
        } else if (language.includes('japanese')) {
          newVoice = findGroup('japanese')?.options[0].value;
        } else if (language.includes('sanskrit')) {
          newVoice = findGroup('sanskrit')?.options[0].value;
        } else if (language.includes('english')) {
          newVoice = findGroup('english')?.options[0].value;
        }

        if (newVoice && newVoice !== selectedVoice) {
          setSelectedVoice(newVoice);
          voiceToUse = newVoice;
        }
      } catch (err) {
        console.error("Language detection failed:", err);
      }
    }


    try {
      const audioData = await generateSpeech(text, voiceToUse);
      if (audioData) {
        const { source, context } = await playAudio(audioData);
        audioSourceRef.current = source;
        audioContextRef.current = context;
        setIsPlaying(true);
        source.onended = () => {
          setIsPlaying(false);
          audioSourceRef.current = null;
        };
      } else {
        throw new Error('No audio data received.');
      }
    } catch (err) {
      setError(err instanceof Error ? `Failed to generate speech: ${err.message}` : 'An unknown error occurred.');
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  };

  const ActionButton: React.FC = () => {
    if (isLoading) {
      return (
        <button
          disabled
          className="w-full flex justify-center items-center px-6 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-cyan-700 opacity-50 cursor-not-allowed"
        >
          <SpinnerIcon />
          Generating...
        </button>
      );
    }

    if (isPlaying) {
      return (
        <button
          onClick={handleStopAudio}
          className="w-full flex justify-center items-center px-6 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1a0c3d] focus:ring-red-500 transition-colors"
        >
          <StopIcon />
          Stop
        </button>
      );
    }
    
    return (
      <button
        onClick={handleGenerateSpeech}
        disabled={!text.trim()}
        className="w-full flex justify-center items-center px-6 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1a0c3d] focus:ring-cyan-500 disabled:bg-cyan-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <PlayIcon />
        Generate & Play
      </button>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl mx-auto">
        <Header />
        <main className="mt-8">
          <div className="bg-black/30 backdrop-blur-sm border border-purple-900/50 rounded-lg shadow-2xl shadow-purple-900/20 p-6 space-y-6">
            <div className="space-y-4">
              <label htmlFor="text-input" className="block text-sm font-medium text-purple-300">
                Enter text to synthesize
              </label>
              <textarea
                id="text-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type something here..."
                className="w-full h-48 p-4 bg-black/40 border border-purple-800 rounded-md focus:ring-cyan-500 focus:border-cyan-500 text-purple-200 transition resize-none"
                rows={6}
              />
            </div>
            
            <div className="flex items-end justify-between space-x-4">
              <div className="flex-grow">
                <VoiceSelector
                  selectedVoice={selectedVoice}
                  onVoiceChange={(voice) => {
                    setSelectedVoice(voice);
                    setAutoDetect(false);
                  }}
                />
              </div>
              <div className="flex flex-col items-center space-y-1 pb-1">
                <label htmlFor="auto-detect-toggle" className="text-xs font-medium text-purple-300 whitespace-nowrap">
                    Auto-Detect
                </label>
                <button
                    id="auto-detect-toggle"
                    role="switch"
                    aria-checked={autoDetect}
                    onClick={() => setAutoDetect(!autoDetect)}
                    className={`${autoDetect ? 'bg-cyan-500' : 'bg-gray-600'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-[#12082b]`}
                >
                    <span className={`${autoDetect ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}/>
                </button>
              </div>
            </div>
            
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <div className="pt-2">
              <ActionButton />
            </div>
          </div>
        </main>
        <footer className="text-center mt-8 text-purple-600 text-sm">
          <p>Powered by Gemini. Built with React & Tailwind CSS.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;