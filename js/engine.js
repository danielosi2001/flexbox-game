// js/engine.js — מצב המשחק, הוולידציה והשמירה. אין כאן DOM.
// ראו docs/CONTRACT.md

const Engine = (() => {
  'use strict';

  const PROPS = ['display', 'flex-direction', 'justify-content', 'align-items', 'flex-wrap'];

  const OPTIONS = {
    'display':         ['block', 'flex'],
    'flex-direction':  ['row', 'row-reverse', 'column', 'column-reverse'],
    'justify-content': ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'],
    'align-items':     ['stretch', 'flex-start', 'flex-end', 'center'],
    'flex-wrap':       ['nowrap', 'wrap', 'wrap-reverse'],
  };

  // display מתחיל ב-block ולא ב-flex: שלב 1 מלמד שבלי display: flex שאר
  // המאפיינים לא עושים כלום, וזה עובד רק אם הלוח באמת מתחיל כבוי.
  const DEFAULTS = {
    'display':         'block',
    'flex-direction':  'row',
    'justify-content': 'flex-start',
    'align-items':     'stretch',
    'flex-wrap':       'nowrap',
  };

  const blankProgress = () => LEVELS.map(() => ({ solved: false, attempts: 0, hintUsed: false }));

  const state = {
    index: 0,
    values: {},
    progress: blankProgress(),
  };

  // כל גישה ל-localStorage עטופה: בגלישה פרטית ובדפדפן שחוסם אחסון
  // הקריאה עצמה זורקת, ומשחק שקורס בגלל שמירה גרוע משמירה שלא עבדה.
  const storage = {
    read: () => {
      try { return localStorage.getItem(STORAGE.key); } catch { return null; }
    },
    write: (value) => {
      try { localStorage.setItem(STORAGE.key, value); } catch { /* אין אחסון — משחקים בלי שמירה */ }
    },
    clear: () => {
      try { localStorage.removeItem(STORAGE.key); } catch { /* כנ"ל */ }
    },
  };

  // שמירה פגומה, ישנה, או כזו שנכתבה כשהיו פחות שלבים — נזרקת ומתחילים
  // מחדש. עדיף מלנסות לתקן אותה ולשחק עם מצב לא עקבי.
  const readSave = () => {
    const raw = storage.read();
    if (!raw) return null;
    try {
      const save = JSON.parse(raw);
      if (!Array.isArray(save?.progress) || save.progress.length !== LEVELS.length) return null;

      return save.progress.map((entry) => ({
        solved: entry?.solved === true,
        attempts: Number.isInteger(entry?.attempts) && entry.attempts >= 0 ? entry.attempts : 0,
        hintUsed: entry?.hintUsed === true,
      }));
    } catch {
      return null;
    }
  };

  const persist = () => storage.write(JSON.stringify({ progress: state.progress }));

  // שלב שדורש ערך שאין לו פקד פשוט לא נפתר לעולם, ועל המסך זה לא נראה
  // כמו תקלה. לכן הבדיקה רצה בטעינה וצועקת לקונסולה.
  const validateLevels = () => {
    LEVELS.forEach((level, i) => {
      const fail = (message) => console.error(TEXT.dataError.where(i, level.id) + message);

      level.controls
        .filter((prop) => !Object.hasOwn(OPTIONS, prop))
        .forEach((prop) => fail(TEXT.dataError.unknownControl(prop)));

      Object.entries(level.solution).forEach(([prop, accepted]) => {
        if (!level.controls.includes(prop)) {
          fail(TEXT.dataError.noControl(prop));
          return;
        }
        accepted
          .filter((value) => !OPTIONS[prop].includes(value))
          .forEach((value) => fail(TEXT.dataError.unknownValue(prop, value)));
      });

      if (level.itemSizes && level.itemSizes.length !== level.items) {
        fail(TEXT.dataError.sizesLength(level.itemSizes.length, level.items));
      }
    });
  };

  const current = () => LEVELS[state.index];
  const entry = (i = state.index) => state.progress[i];

  const values = () => ({ ...state.values });

  // מחזיק רק את המאפיינים שהשלב חושף. מאפיין שאין לו פקד לא נכתב ללוח
  // בכלל, וה-CSS של #board נותן לו את ערך ברירת המחדל.
  const reset = () => {
    state.values = {};
    current().controls.forEach((prop) => {
      state.values[prop] = DEFAULTS[prop];
    });
  };

  const setValue = (prop, value) => {
    if (!Object.hasOwn(state.values, prop)) return false;
    if (!OPTIONS[prop].includes(value)) return false;
    state.values[prop] = value;
    return true;
  };

  // מאפיין שאינו ב-solution לא נבדק, ולכן פקד נוסף לניסויים לא חוסם מעבר.
  // ניסיונות נספרים רק עד הפתרון: בדיקה חוזרת בשלב פתור לא מורידה ניקוד.
  const check = () => {
    const ok = Object.entries(current().solution)
      .every(([prop, accepted]) => accepted.includes(state.values[prop]));

    if (!entry().solved) {
      entry().attempts += 1;
      entry().solved = ok;
    }
    persist();
    return ok;
  };

  const useHint = () => {
    entry().hintUsed = true;
    persist();
    return current().hint;
  };

  const goTo = (i) => {
    if (i < 0 || i >= LEVELS.length) return false;
    state.index = i;
    reset();
    // שומרים גם במעבר שלב, כדי שריצה שהתחילה תהיה ניתנת להמשך עוד לפני
    // הבדיקה הראשונה. השמירה לא מכילה את השלב הנצפה אלא התקדמות בלבד,
    // ולכן כתיבה כאן היא אותה כתיבה בדיוק ולא מזיזה את נקודת החזרה.
    persist();
    return true;
  };

  const next = () => goTo(state.index + 1);
  const prev = () => goTo(state.index - 1);

  // ההתקדמות ליניארית: שלב נפתח רק אחרי שקודמו נפתר.
  const isUnlocked = (i) => i === 0 || state.progress[i - 1].solved;

  const isSolved = (i = state.index) => entry(i).solved;
  const attempts = (i = state.index) => entry(i).attempts;
  const hintUsed = (i = state.index) => entry(i).hintUsed;

  const solvedCount = () => state.progress.filter((p) => p.solved).length;
  const totalAttempts = () => state.progress.reduce((sum, p) => sum + p.attempts, 0);
  const isComplete = () => state.progress.every((p) => p.solved);
  const isLast = () => state.index === LEVELS.length - 1;

  const rating = (i = state.index) => {
    if (!entry(i).solved) return 0;
    const base = entry(i).attempts <= 1 ? 3 : entry(i).attempts <= 3 ? 2 : 1;
    return entry(i).hintUsed ? Math.max(1, base - 1) : base;
  };

  const hasSave = () => readSave() !== null;

  // השלב הראשון שטרם נפתר — קצה ההתקדמות. זה מה ש"המשיכו מהשלב האחרון"
  // מחזיר אליו, ולא השלב שבמקרה נצפה אחרון: הצצה אחורה בשלב פתור היא
  // חלק מהמשחק ואסור שתשנה את נקודת החזרה.
  const frontier = (progress = state.progress) => {
    const firstUnsolved = progress.findIndex((entry) => !entry.solved);
    return firstUnsolved === -1 ? LEVELS.length - 1 : firstUnsolved;
  };

  const resume = () => {
    const progress = readSave();
    if (!progress) return false;
    state.progress = progress;
    return goTo(frontier());
  };

  // גם "התחלת המשימה" וגם "שחקו שוב": מוחקים את השמירה ומתחילים מאפס.
  const startFresh = () => {
    storage.clear();
    state.progress = blankProgress();
    goTo(0);
  };

  validateLevels();
  reset();

  return {
    PROPS,
    OPTIONS,
    DEFAULTS,
    count: () => LEVELS.length,
    index: () => state.index,
    current,
    values,
    setValue,
    reset,
    check,
    useHint,
    goTo,
    next,
    prev,
    isUnlocked,
    isSolved,
    attempts,
    hintUsed,
    rating,
    solvedCount,
    totalAttempts,
    isComplete,
    isLast,
    hasSave,
    resume,
    startFresh,
  };
})();
