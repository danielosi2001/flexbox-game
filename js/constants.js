
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
  levelChip:     'level-chip',
  chipSolved:    'is-solved',
  chipCurrent:   'is-current',
  chipLocked:    'is-locked',
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
  tallyTotal:     'סה״כ',
  stars:      (count) => '★'.repeat(count) + '☆'.repeat(3 - count),
  noStars:    '—',

  check: {
    ok:     'עגינה תקינה. אפשר להתקדם לשלב הבא.',
    okLast: 'עגינה תקינה. זה היה השלב האחרון — לחצו "הבא" כדי לסיים.',
    err:    'התאים לא מסודרים לפי ההוראה. תקנו את הערכים ונסו שוב.',
  },

  dataError: {
    where:          (i, id) => `LEVELS[${i}] (שלב ${id}): `,
    unknownControl: (prop) => `הפקד "${prop}" אינו מאפיין נתמך.`,
    noControl:      (prop) => `הפתרון דורש "${prop}" אבל אין פקד כזה — השלב בלתי פתיר.`,
    unknownValue:   (prop, value) => `הערך "${value}" אינו קיים ברשימת האפשרויות של ${prop}.`,
    sizesLength:    (sizes, items) => `itemSizes באורך ${sizes} מול items=${items}.`,
  },
};

const STORAGE = {
  key: 'flexbox-game:v1',
};

const TIMING = {
  flashMs: 600,
};
