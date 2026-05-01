import { useCallback, useEffect, useRef } from 'react';
import { Howl, Howler } from 'howler';
import { useStore } from '../store';

// Placeholder sounds using AudioContext
const playTone = (frequency: number, type: OscillatorType, duration: number, volume: number) => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Ignore audio context errors
  }
};

// Singleton background music Howl instance
let bgmHowl: Howl | null = null;

export function useAudio() {
  const { settings } = useStore();
  
  // Set global Howler volume based on settings
  useEffect(() => {
    Howler.volume(settings.volume);
  }, [settings.volume]);

  // Handle Background Music
  useEffect(() => {
    if (!bgmHowl) {
      // Background music placeholder removed to prevent 403 Forbidden error
      bgmHowl = new Howl({
        src: ['data:audio/mp3;base64,'], // Empty data URI to prevent errors until real audio is added
        loop: true,
        volume: settings.musicVolume,
        html5: true, 
      });
    }

    if (settings.musicVolume > 0 && !bgmHowl.playing()) {
      bgmHowl.volume(settings.musicVolume);
      bgmHowl.play();
    } else if (settings.musicVolume === 0 && bgmHowl.playing()) {
      bgmHowl.pause();
    } else if (bgmHowl.playing()) {
      bgmHowl.volume(settings.musicVolume);
    }
  }, [settings.musicVolume]);

  const speak = useCallback((text: string) => {
    if (settings.volume === 0 || !window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // Stop any ongoing speech
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = settings.volume;
    utterance.rate = 0.9; // Slightly slower for kids
    utterance.pitch = 1.2; // Slightly higher pitch for a friendly tone

    // Try to find a friendly or female voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Samantha') || v.name.includes('Female')) || voices[0];
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    window.speechSynthesis.speak(utterance);
  }, [settings.volume]);

  const playDing = useCallback(() => {
    playTone(800, 'sine', 0.3, settings.volume);
  }, [settings.volume]);

  const playPop = useCallback(() => {
    playTone(400, 'sine', 0.1, settings.volume);
  }, [settings.volume]);

  const playCheer = useCallback(() => {
    playTone(500, 'triangle', 0.5, settings.volume);
    setTimeout(() => playTone(600, 'triangle', 0.5, settings.volume), 150);
    setTimeout(() => playTone(800, 'triangle', 0.8, settings.volume), 300);
  }, [settings.volume]);

  const playBoing = useCallback(() => {
    playTone(200, 'square', 0.4, settings.volume * 0.5);
  }, [settings.volume]);

  return {
    playDing,
    playPop,
    playCheer,
    playBoing,
    speak,
  };
}
