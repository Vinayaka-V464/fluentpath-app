import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY');

export const getAIResponse = async (messages, systemPrompt) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const chat = model.startChat({
      history: messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      })),
      systemInstruction: systemPrompt,
    });

    const result = await chat.sendMessage(messages[messages.length - 1].content);
    return result.response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    return "I'm having trouble connecting right now. Please try again in a moment.";
  }
};

export const TUTOR_SYSTEM_PROMPT = `You are FluentPath AI Tutor, a friendly, encouraging English language tutor. 
Your role:
- Help users practice English through natural conversations
- Gently correct grammar and vocabulary mistakes
- Provide explanations when asked
- Adapt to the user's proficiency level
- Use scenario-based conversations (ordering at cafés, job interviews, travel, etc.)
- Be warm, supportive, and never condescending
- After each user message, provide brief feedback on grammar if needed
- Use emojis occasionally to keep the tone friendly

Format your responses naturally. When correcting grammar, use a format like:
💡 Grammar tip: [correction and explanation]`;

export const WRITING_SYSTEM_PROMPT = `You are FluentPath Writing Assistant, an expert English writing coach.
Your role:
- Review and provide feedback on user's writing
- Score their writing on Grammar (A-F), Tone (A-F), and Style (A-F)
- Provide specific suggestions for improvement
- Be encouraging while being constructive
- Format feedback clearly with scores and actionable tips`;

export const PRONUNCIATION_WORDS = [
  { word: 'Photography', phonetic: '/fəˈtɒɡrəfi/', tips: 'Stress the second syllable: pho-TOG-ra-phy' },
  { word: 'Comfortable', phonetic: '/ˈkʌmftəbəl/', tips: 'Only 3 syllables: COMF-ter-ble' },
  { word: 'Entrepreneur', phonetic: '/ˌɒntrəprəˈnɜːr/', tips: 'Stress the last syllable: on-truh-pruh-NUR' },
  { word: 'Specifically', phonetic: '/spəˈsɪfɪkli/', tips: 'Stress the second syllable: spuh-SIF-ik-lee' },
  { word: 'Hierarchical', phonetic: '/haɪəˈrɑːrkɪkəl/', tips: 'Stress the third syllable: hi-uh-RAR-ki-kul' },
  { word: 'Aesthetically', phonetic: '/iːsˈθɛtɪkli/', tips: 'Start with "ees": ees-THET-ik-lee' },
  { word: 'Phenomenon', phonetic: '/fɪˈnɒmɪnən/', tips: 'Stress the second syllable: fih-NOM-ih-non' },
  { word: 'Miscellaneous', phonetic: '/ˌmɪsəˈleɪniəs/', tips: 'Stress the third syllable: mis-uh-LAY-nee-us' },
];
