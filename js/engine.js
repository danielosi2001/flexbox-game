// js/engine.js — מצב המשחק והוולידציה. אין כאן DOM. ראו docs/CONTRACT.md

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

  const state = {
    index: 0,
    values: {},
    solved: LEVELS.map(() => false),
  };

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
  const check = () => {
    const ok = Object.entries(current().solution)
      .every(([prop, accepted]) => accepted.includes(state.values[prop]));
    if (ok) state.solved[state.index] = true;
    return ok;
  };

  const goTo = (i) => {
    if (i < 0 || i >= LEVELS.length) return false;
    state.index = i;
    reset();
    return true;
  };

  const next = () => goTo(state.index + 1);
  const prev = () => goTo(state.index - 1);

  const isSolved = (i = state.index) => state.solved[i];
  const isComplete = () => state.solved.every(Boolean);
  const solvedCount = () => state.solved.filter(Boolean).length;
  const isLast = () => state.index === LEVELS.length - 1;

  const restart = () => {
    state.solved = LEVELS.map(() => false);
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
    goTo,
    next,
    prev,
    isSolved,
    isComplete,
    solvedCount,
    isLast,
    restart,
  };
})();
