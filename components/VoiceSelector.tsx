import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Voice, voiceGroups } from '../types';

interface VoiceSelectorProps {
  selectedVoice: Voice;
  onVoiceChange: (voice: Voice) => void;
}

const ChevronDownIcon: React.FC = () => (
    <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({ selectedVoice, onVoiceChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedVoiceLabel = useMemo(() => {
    for (const group of voiceGroups) {
      const option = group.options.find(opt => opt.value === selectedVoice);
      if (option) return option.label;
    }
    return '';
  }, [selectedVoice]);
  
  const filteredGroups = useMemo(() => {
    if (!searchTerm) {
      return voiceGroups;
    }
    return voiceGroups.map(group => ({
      ...group,
      options: group.options.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
        group.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })).filter(group => group.options.length > 0);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  useEffect(() => {
    if (isOpen) {
      // Timeout to allow the element to be visible before focusing
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  const handleSelectVoice = (voice: Voice) => {
    onVoiceChange(voice);
    setSearchTerm('');
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label htmlFor="voice-selector-button" className="block text-sm font-medium text-purple-300">
        Choose a voice
      </label>
      <div className="mt-1 relative">
        <button
          type="button"
          id="voice-selector-button"
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className="relative w-full bg-black/40 border border-purple-800 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
        >
          <span className="block truncate">{selectedVoiceLabel}</span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <ChevronDownIcon />
          </span>
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-[#1e104b] shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            <div className="p-2">
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search language or voice..."
                className="w-full px-3 py-2 bg-black/40 border border-purple-700 rounded-md focus:ring-cyan-500 focus:border-cyan-500 text-purple-200"
              />
            </div>
            <ul
              tabIndex={-1}
              role="listbox"
              aria-labelledby="voice-selector-button"
              className="max-h-60 overflow-auto"
            >
              {filteredGroups.length > 0 ? (
                filteredGroups.map(group => (
                  <li key={group.label}>
                    <div className="px-3 py-2 text-xs font-bold text-purple-400 uppercase tracking-wider">{group.label}</div>
                    <ul>
                      {group.options.map(option => (
                        <li
                          key={option.value}
                          onClick={() => handleSelectVoice(option.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSelectVoice(option.value)}
                          role="option"
                          aria-selected={option.value === selectedVoice}
                          tabIndex={0}
                          className={`cursor-pointer select-none relative py-2 pl-3 pr-9 text-purple-200 hover:bg-purple-800/50 focus:bg-purple-800/50 focus:outline-none ${option.value === selectedVoice ? 'font-semibold' : 'font-normal'}`}
                        >
                          <span className="block truncate">{option.label}</span>
                          {option.value === selectedVoice && (
                            <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-cyan-400">
                              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))
              ) : (
                <li className="text-center py-4 text-purple-400">No voices found.</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};