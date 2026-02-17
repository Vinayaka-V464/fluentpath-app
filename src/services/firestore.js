import { doc, getDoc, setDoc, updateDoc, collection, addDoc, query, where, orderBy, limit, getDocs, increment, serverTimestamp, arrayUnion } from 'firebase/firestore';
import { db } from '../config/firebase';

// ── User Profile ──────────────────────────────────────────────────

export const getUserData = async (uid) => {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
};

export const updateUserData = async (uid, data) => {
  await updateDoc(doc(db, 'users', uid), data);
};

export const updateUserProfile = async (uid, { displayName, nativeLanguage, dailyGoal, focusArea, notifications, sound }) => {
  const updates = {};
  if (displayName !== undefined) updates.displayName = displayName;
  if (nativeLanguage !== undefined) updates.nativeLanguage = nativeLanguage;
  if (dailyGoal !== undefined) updates.dailyGoal = dailyGoal;
  if (focusArea !== undefined) updates.focusArea = focusArea;
  if (notifications !== undefined) updates.notifications = notifications;
  if (sound !== undefined) updates.sound = sound;
  await updateDoc(doc(db, 'users', uid), updates);
};

// ── Onboarding ────────────────────────────────────────────────────

export const completeOnboarding = async (uid, { nativeLanguage, dailyGoal, focusArea, trackDuration, dailyTime }) => {
  await updateDoc(doc(db, 'users', uid), {
    nativeLanguage,
    dailyGoal,
    focusArea,
    trackDuration,   // '1-month' or '2-month'
    dailyTime,       // 30 or 60 (minutes)
    onboardingComplete: true,
    streakLastDate: new Date().toISOString().slice(0, 10),
  });
};

// ── XP & Streak ───────────────────────────────────────────────────

const LEVEL_THRESHOLDS = [
  { level: 'A1', name: 'Beginner', minXP: 0 },
  { level: 'A1+', name: 'Elementary', minXP: 200 },
  { level: 'A2', name: 'Pre-Intermediate', minXP: 500 },
  { level: 'B1', name: 'Intermediate', minXP: 1000 },
  { level: 'B1+', name: 'Upper-Intermediate', minXP: 1800 },
  { level: 'B2', name: 'Advanced', minXP: 2800 },
  { level: 'C1', name: 'Proficiency', minXP: 4000 },
  { level: 'C2', name: 'Master', minXP: 5500 },
];

export const getLevelFromXP = (xp) => {
  let result = LEVEL_THRESHOLDS[0];
  for (const t of LEVEL_THRESHOLDS) {
    if (xp >= t.minXP) result = t;
  }
  const idx = LEVEL_THRESHOLDS.indexOf(result);
  const next = LEVEL_THRESHOLDS[idx + 1];
  const progressToNext = next
    ? Math.round(((xp - result.minXP) / (next.minXP - result.minXP)) * 100)
    : 100;
  return { ...result, progressToNext, nextLevel: next?.level || 'Max' };
};

export const awardXP = async (uid, amount, source) => {
  const userData = await getUserData(uid);
  if (!userData) return;

  const newXP = (userData.xp || 0) + amount;
  const levelInfo = getLevelFromXP(newXP);

  // Streak logic
  const today = new Date().toISOString().slice(0, 10);
  const lastDate = userData.streakLastDate;
  let newStreak = userData.streak || 0;

  if (lastDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    newStreak = lastDate === yesterday ? newStreak + 1 : 1;
  }

  await updateDoc(doc(db, 'users', uid), {
    xp: newXP,
    level: levelInfo.level,
    streak: newStreak,
    streakLastDate: today,
  });

  // Log XP event
  await addDoc(collection(db, 'users', uid, 'xpHistory'), {
    amount,
    source,
    totalAfter: newXP,
    date: today,
    createdAt: new Date().toISOString(),
  });

  return { xp: newXP, level: levelInfo.level, streak: newStreak };
};

// XP amounts per PRD
export const XP_AMOUNTS = {
  LESSON_COMPLETE: 50,
  QUIZ_PERFECT: 75,
  QUIZ_PASS: 30,
  STREAK_BONUS: 10,
  SPEAKING_PRACTICE: 15,
  WRITING_PRACTICE: 20,
  CHAT_SESSION: 10,
  PRONUNCIATION: 15,
};

// ── Lesson Progress ───────────────────────────────────────────────

export const getLessonProgress = async (uid) => {
  const snap = await getDocs(collection(db, 'users', uid, 'lessonProgress'));
  const progress = {};
  snap.forEach(d => { progress[d.id] = d.data(); });
  return progress;
};

export const saveLessonProgress = async (uid, lessonId, data) => {
  await setDoc(doc(db, 'users', uid, 'lessonProgress', lessonId), {
    ...data,
    updatedAt: new Date().toISOString(),
  }, { merge: true });
};

export const completeLessonQuiz = async (uid, lessonId, score, total) => {
  const percentage = Math.round((score / total) * 100);
  const isPerfect = score === total;

  await saveLessonProgress(uid, lessonId, {
    completed: true,
    quizScore: percentage,
    quizScoreRaw: `${score}/${total}`,
    completedAt: new Date().toISOString(),
  });

  // Award XP
  const xpAmount = isPerfect ? XP_AMOUNTS.QUIZ_PERFECT : (percentage >= 60 ? XP_AMOUNTS.QUIZ_PASS : 0);
  const totalXP = XP_AMOUNTS.LESSON_COMPLETE + xpAmount;
  const result = await awardXP(uid, totalXP, `lesson:${lessonId}`);

  // Update lessons completed count
  const userData = await getUserData(uid);
  await updateDoc(doc(db, 'users', uid), {
    lessonsCompleted: (userData.lessonsCompleted || 0) + 1,
  });

  return { xpEarned: totalXP, quizPercentage: percentage, ...result };
};

// ── Quiz Results ──────────────────────────────────────────────────

export const saveQuizResult = async (uid, lessonId, answers, questions) => {
  let correct = 0;
  const results = questions.map((q, i) => {
    const isCorrect = answers[i] === q.answer;
    if (isCorrect) correct++;
    return { question: q.question, userAnswer: answers[i], correctAnswer: q.answer, isCorrect };
  });

  await addDoc(collection(db, 'users', uid, 'quizResults'), {
    lessonId,
    score: correct,
    total: questions.length,
    percentage: Math.round((correct / questions.length) * 100),
    results,
    completedAt: new Date().toISOString(),
  });

  return { correct, total: questions.length };
};

// ── Session Tracking ──────────────────────────────────────────────

export const logSession = async (uid, type, durationMinutes, metadata = {}) => {
  await addDoc(collection(db, 'users', uid, 'sessions'), {
    type, // 'lesson', 'chat', 'pronunciation', 'writing', 'quiz'
    durationMinutes,
    ...metadata,
    date: new Date().toISOString().slice(0, 10),
    createdAt: new Date().toISOString(),
  });
};

export const getRecentSessions = async (uid, days = 7) => {
  const startDate = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
  const q = query(
    collection(db, 'users', uid, 'sessions'),
    where('date', '>=', startDate),
    orderBy('date', 'desc'),
  );
  const snap = await getDocs(q);
  const sessions = [];
  snap.forEach(d => sessions.push({ id: d.id, ...d.data() }));
  return sessions;
};

// ── Daily Activity (for dashboard goals) ──────────────────────────

export const getDailyActivity = async (uid) => {
  const today = new Date().toISOString().slice(0, 10);
  const q = query(
    collection(db, 'users', uid, 'sessions'),
    where('date', '==', today),
  );
  const snap = await getDocs(q);
  const activities = new Set();
  snap.forEach(d => activities.add(d.data().type));
  return {
    lesson: activities.has('lesson'),
    practice: activities.has('pronunciation'),
    quiz: activities.has('quiz'),
    chat: activities.has('chat'),
    writing: activities.has('writing'),
    count: activities.size,
  };
};

// ── Vocabulary Tracking ───────────────────────────────────────────

export const saveLearnedWords = async (uid, words) => {
  for (const word of words) {
    await setDoc(doc(db, 'users', uid, 'vocabulary', word.word), {
      word: word.word,
      meaning: word.meaning,
      example: word.example,
      learnedAt: new Date().toISOString(),
      reviewCount: 0,
      nextReview: new Date(Date.now() + 86400000).toISOString(), // tomorrow
    }, { merge: true });
  }
};

export const getVocabulary = async (uid) => {
  const snap = await getDocs(collection(db, 'users', uid, 'vocabulary'));
  const words = [];
  snap.forEach(d => words.push({ id: d.id, ...d.data() }));
  return words;
};

// ── Achievements ──────────────────────────────────────────────────

export const ACHIEVEMENTS = [
  { id: 'first-lesson', name: 'First Lesson', emoji: '📖', description: 'Complete your first lesson', check: (u) => (u.lessonsCompleted || 0) >= 1 },
  { id: 'streak-3', name: '3-Day Streak', emoji: '🔥', description: 'Practice 3 days in a row', check: (u) => (u.streak || 0) >= 3 },
  { id: 'streak-7', name: '7-Day Streak', emoji: '🔥', description: 'Practice 7 days in a row', check: (u) => (u.streak || 0) >= 7 },
  { id: 'streak-30', name: '30-Day Streak', emoji: '💪', description: 'Practice 30 days in a row', check: (u) => (u.streak || 0) >= 30 },
  { id: 'xp-100', name: 'Getting Started', emoji: '⭐', description: 'Earn 100 XP', check: (u) => (u.xp || 0) >= 100 },
  { id: 'xp-500', name: 'Rising Star', emoji: '🌟', description: 'Earn 500 XP', check: (u) => (u.xp || 0) >= 500 },
  { id: 'xp-1000', name: 'XP Champion', emoji: '🏆', description: 'Earn 1,000 XP', check: (u) => (u.xp || 0) >= 1000 },
  { id: 'lessons-5', name: 'Scholar', emoji: '📚', description: 'Complete 5 lessons', check: (u) => (u.lessonsCompleted || 0) >= 5 },
  { id: 'lessons-10', name: 'Dedicated Learner', emoji: '🎓', description: 'Complete 10 lessons', check: (u) => (u.lessonsCompleted || 0) >= 10 },
  { id: 'level-a2', name: 'Level Up!', emoji: '🚀', description: 'Reach A2 level', check: (u) => getLevelFromXP(u.xp || 0).minXP >= 500 },
  { id: 'level-b1', name: 'Intermediate!', emoji: '💎', description: 'Reach B1 level', check: (u) => getLevelFromXP(u.xp || 0).minXP >= 1000 },
  { id: 'chatter', name: 'Chatter', emoji: '💬', description: 'Have 10 AI conversations', check: () => false },
];

export const getEarnedAchievements = (userData) => {
  return ACHIEVEMENTS.map(a => ({
    ...a,
    earned: a.check(userData || {}),
  }));
};

export { LEVEL_THRESHOLDS };
