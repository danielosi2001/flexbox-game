// js/constants.js — כל המחרוזות של הקוד במקום אחד. ראו docs/CONTRACT.md
//
// מזהים ושמות מחלקות הם חוזה מול index.html ומול css/style.css, ולכן הם
// מרוכזים כאן: אפשר להשוות אותם מול docs/CONTRACT.md בקריאת קובץ אחד.
// טקסט השלבים עצמם יושב ב-js/levels.js, כי הוא נתון ולא ממשק.

const DOM = {
  screens: {
    start: 'screen-start',
    game:  'screen-game',
    win:   'screen-win',
  },
  board:          'board',
  controls:       'controls',
  instruction:    'instruction',
  levelIndicator: 'level-indicator',
  msg:            'msg',
  hint:           'hint',
  levelMap:       'level-map',
  finalScore:     'final-score',
  scoreBreakdown: 'score-breakdown',
  btnStart:       'btn-start',
  btnContinue:    'btn-continue',
  btnCheck:       'btn-check',
  btnReset:       'btn-reset',
  btnHint:        'btn-hint',
  btnPrev:        'btn-prev',
  btnNext:        'btn-next',
  btnReplay:      'btn-replay',

  // מזהה ה-select של מאפיין (חוזה §3)
  controlId: (prop) => `ctl-${prop}`,
};

const SCREEN = {
  start: 'start',
  game:  'game',
  win:   'win',
};

const FEEDBACK = {
  ok:  'ok',
  err: 'err',
};

const CLASS = {
  hidden:        'hidden',
  pod:           'pod',
  podSize:       (size) => `pod--${size}`,
  control:       'control',
  controlLabel:  'control__label',
  controlSelect: 'control__select',
  msgOk:         'msg--ok',
  msgErr:        'msg--err',
  boardSuccess:  'is-success',
  boardError:    'is-error',
};

const TEXT = {
  levelIndicator: (current, total) => `שלב ${current} מתוך ${total}`,
  finalScore:     (solved, total) => `${solved} / ${total} שלבים הושלמו`,

  check: {
    ok:     'עגינה תקינה. אפשר להתקדם לשלב הבא.',
    okLast: 'עגינה תקינה. זה היה השלב האחרון — לחצו "הבא" כדי לסיים.',
    err:    'התאים לא מסודרים לפי ההוראה. תקנו את הערכים ונסו שוב.',
  },

  // שגיאות נתונים — לקונסולה בזמן הטעינה, לא לשחקן.
  dataError: {
    where:          (i, id) => `LEVELS[${i}] (שלב ${id}): `,
    unknownControl: (prop) => `הפקד "${prop}" אינו מאפיין נתמך.`,
    noControl:      (prop) => `הפתרון דורש "${prop}" אבל אין פקד כזה — השלב בלתי פתיר.`,
    unknownValue:   (prop, value) => `הערך "${value}" אינו קיים ברשימת האפשרויות של ${prop}.`,
    sizesLength:    (sizes, items) => `itemSizes באורך ${sizes} מול items=${items}.`,
  },
};

const TIMING = {
  // הסרת מחלקת המצב מהלוח. ה-CSS מתחייב שכל האנימציות מסתיימות עד אז
  // (bay-success 560ms, bay-error 460ms). חוזה §4.
  flashMs: 600,
};
