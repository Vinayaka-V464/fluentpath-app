// Speech services using Web Speech API (free, browser-built-in)

// ── Text-to-Speech (TTS) ─────────────────────────────────────────

export const speak = (text, options = {}) => {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      reject(new Error('Speech synthesis not supported'));
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options.lang || 'en-US';
    utterance.rate = options.rate || 0.9;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;

    // Try to get a natural English voice
    const voices = window.speechSynthesis.getVoices();
    const englishVoices = voices.filter(v => v.lang.startsWith('en'));
    const preferred = englishVoices.find(v => v.name.includes('Google') || v.name.includes('Natural')) || englishVoices[0];
    if (preferred) utterance.voice = preferred;

    utterance.onend = () => resolve();
    utterance.onerror = (e) => reject(e);

    window.speechSynthesis.speak(utterance);
  });
};

export const stopSpeaking = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

export const isSpeaking = () => {
  return 'speechSynthesis' in window && window.speechSynthesis.speaking;
};

// ── Speech-to-Text (STT) ─────────────────────────────────────────

let recognition = null;

export const startListening = (options = {}) => {
  return new Promise((resolve, reject) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      reject(new Error('Speech recognition not supported. Try Chrome or Edge.'));
      return;
    }

    recognition = new SpeechRecognition();
    recognition.lang = options.lang || 'en-US';
    recognition.interimResults = options.interim || false;
    recognition.continuous = options.continuous || false;
    recognition.maxAlternatives = 1;

    let finalTranscript = '';

    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (options.onInterim) {
        const interim = Array.from(event.results)
          .filter(r => !r.isFinal)
          .map(r => r[0].transcript)
          .join('');
        options.onInterim(interim, finalTranscript);
      }
    };

    recognition.onend = () => {
      resolve(finalTranscript.trim());
    };

    recognition.onerror = (event) => {
      if (event.error === 'no-speech') {
        resolve('');
      } else {
        reject(new Error(`Speech recognition error: ${event.error}`));
      }
    };

    recognition.start();
  });
};

export const stopListening = () => {
  if (recognition) {
    recognition.stop();
    recognition = null;
  }
};

export const isListeningSupported = () => {
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
};

export const isSpeakingSupported = () => {
  return 'speechSynthesis' in window;
};

// ── Pronunciation Scoring ─────────────────────────────────────────

export const comparePronunciation = (spoken, target) => {
  const clean = (s) => s.toLowerCase().replace(/[^a-z\s]/g, '').trim();
  const spokenClean = clean(spoken);
  const targetClean = clean(target);

  if (!spokenClean) return { score: 0, feedback: 'No speech detected. Please try again.' };

  // Exact match
  if (spokenClean === targetClean) {
    return { score: 100, feedback: 'Perfect pronunciation!' };
  }

  // Calculate similarity using Levenshtein-based approach
  const similarity = calculateSimilarity(spokenClean, targetClean);
  const score = Math.round(similarity * 100);

  let feedback;
  if (score >= 90) feedback = 'Excellent! Nearly perfect pronunciation.';
  else if (score >= 75) feedback = 'Good effort! Minor pronunciation differences detected.';
  else if (score >= 50) feedback = 'Keep practicing! Focus on the stressed syllables.';
  else feedback = 'Try listening again carefully and repeat slowly.';

  return { score, feedback, spoken: spokenClean, target: targetClean };
};

function calculateSimilarity(a, b) {
  if (a.length === 0) return b.length === 0 ? 1 : 0;
  if (b.length === 0) return 0;

  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  const maxLen = Math.max(a.length, b.length);
  return 1 - matrix[b.length][a.length] / maxLen;
}
