import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
        Mantra
      </h1>
      <p className="mt-3 text-lg text-purple-300">
        Your words, their voice. Multilingual TTS with an anime soul.
      </p>
    </header>
  );
};
