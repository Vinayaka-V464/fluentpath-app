// Daily English insights — curated tips, idioms, grammar nuggets, fun facts
// Selected deterministically by userId + dayNumber for consistent display

const INSIGHTS = [
  { type: 'idiom', title: 'Break the ice', body: 'Means to start a conversation in a social situation to make people feel comfortable.', example: '"Let me break the ice — I\'m Ravi, and I love cricket!"' },
  { type: 'grammar', title: 'Affect vs Effect', body: '"Affect" is usually a verb (to influence). "Effect" is usually a noun (a result).', example: '"The rain affected our plans. The effect was that we stayed home."' },
  { type: 'tip', title: 'Think in English', body: 'Try thinking your daily thoughts in English instead of translating from your native language. It boosts fluency!', example: '' },
  { type: 'funfact', title: 'Most Common Word', body: 'The word "the" is the most commonly used word in the English language, appearing in about 7% of all words.', example: '' },
  { type: 'idiom', title: 'Piece of cake', body: 'Means something very easy to do.', example: '"The exam was a piece of cake — I finished in 30 minutes!"' },
  { type: 'grammar', title: 'Its vs It\'s', body: '"It\'s" = "it is" or "it has". "Its" = possessive (belonging to it). No apostrophe for possession!', example: '"It\'s raining. The cat licked its paws."' },
  { type: 'tip', title: 'Read Aloud Daily', body: 'Reading English text out loud for 10 minutes daily dramatically improves pronunciation and fluency.', example: '' },
  { type: 'funfact', title: 'Shakespeare\'s Words', body: 'William Shakespeare invented over 1,700 words including "lonely", "generous", and "eyeball".', example: '' },
  { type: 'idiom', title: 'Hit the nail on the head', body: 'Means to describe exactly what is causing a situation or problem.', example: '"You hit the nail on the head — the issue was the deadline."' },
  { type: 'grammar', title: 'Who vs Whom', body: '"Who" is for subjects (does the action). "Whom" is for objects (receives the action). Trick: if you can replace with "he", use "who"; if "him", use "whom".', example: '"Who called? Whom did you call?"' },
  { type: 'tip', title: 'Label Your House', body: 'Put sticky notes with English names on objects around your house — fridge, mirror, window. You\'ll learn vocabulary passively!', example: '' },
  { type: 'funfact', title: 'Longest Word', body: '"Pneumonoultramicroscopicsilicovolcanoconiosis" is the longest word in English at 45 letters. It\'s a lung disease!', example: '' },
  { type: 'idiom', title: 'Under the weather', body: 'Means feeling sick or ill.', example: '"I\'m feeling under the weather today, so I\'ll skip the gym."' },
  { type: 'grammar', title: 'Less vs Fewer', body: '"Less" for uncountable nouns (less water, less time). "Fewer" for countable nouns (fewer books, fewer people).', example: '"There is less traffic today. There are fewer cars on the road."' },
  { type: 'tip', title: 'Watch with Subtitles', body: 'Watch English shows with English subtitles (not your native language). This builds listening + reading simultaneously.', example: '' },
  { type: 'funfact', title: 'No Rhyme', body: 'The words "orange", "purple", "silver", and "month" have no perfect rhyme in English!', example: '' },
  { type: 'idiom', title: 'Bite the bullet', body: 'Means to face a difficult or unpleasant situation with courage.', example: '"I decided to bite the bullet and give the presentation."' },
  { type: 'grammar', title: 'Then vs Than', body: '"Then" is about time (and then, back then). "Than" is for comparison (better than, faster than).', example: '"I ate, then slept. Pizza is better than pasta."' },
  { type: 'tip', title: 'Record Yourself', body: 'Record yourself speaking English and listen back. You\'ll notice mistakes you never hear in real-time.', example: '' },
  { type: 'funfact', title: 'Ambigram', body: 'The word "swims" still reads "swims" when turned upside down!', example: '' },
  { type: 'idiom', title: 'Cost an arm and a leg', body: 'Means something is very expensive.', example: '"That designer bag costs an arm and a leg!"' },
  { type: 'grammar', title: 'Your vs You\'re', body: '"Your" = possessive (your book). "You\'re" = "you are". Always expand the contraction to check!', example: '"You\'re going to love your new phone."' },
  { type: 'tip', title: 'Speak to Yourself', body: 'Narrate your daily activities in English: "I am making breakfast. I am going to work." Great for building fluency!', example: '' },
  { type: 'funfact', title: 'English Everywhere', body: 'English is the official language of 67 countries. More people speak English as a second language than as a first language.', example: '' },
  { type: 'idiom', title: 'Let the cat out of the bag', body: 'Means to accidentally reveal a secret.', example: '"Oops! I let the cat out of the bag about the surprise party."' },
  { type: 'grammar', title: 'There, Their, They\'re', body: '"There" = place. "Their" = possessive. "They\'re" = "they are".', example: '"They\'re going to their house. It\'s over there."' },
  { type: 'tip', title: 'Learn Collocations', body: 'Learn words that go together: "make a decision" (not "do a decision"), "heavy rain" (not "strong rain"). This makes you sound natural.', example: '' },
  { type: 'funfact', title: 'Every 2 Hours', body: 'A new word is added to the English dictionary approximately every two hours. That\'s about 4,000 new words per year!', example: '' },
  { type: 'idiom', title: 'Spill the beans', body: 'Means to reveal secret information.', example: '"Come on, spill the beans! What happened at the meeting?"' },
  { type: 'grammar', title: 'Lay vs Lie', body: '"Lay" needs an object (lay the book down). "Lie" doesn\'t need an object (I lie on the bed). Past: laid / lay.', example: '"I lay the book on the table. I lie down to rest."' },
];

// Get today's insight based on user ID (deterministic per user per day)
export const getDailyInsight = (userId) => {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
  const hash = (userId || 'default').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const index = (dayOfYear + hash) % INSIGHTS.length;
  return INSIGHTS[index];
};

// Get multiple insights for carousel
export const getInsights = (userId, count = 3) => {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
  const hash = (userId || 'default').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const results = [];
  for (let i = 0; i < count; i++) {
    const index = (dayOfYear + hash + i) % INSIGHTS.length;
    results.push(INSIGHTS[index]);
  }
  return results;
};

export const INSIGHT_ICONS = {
  idiom: '💬',
  grammar: '📝',
  tip: '💡',
  funfact: '🎉',
};

export const INSIGHT_COLORS = {
  idiom: '#8B5CF6',
  grammar: '#14B8A6',
  tip: '#F59E0B',
  funfact: '#F472B6',
};
