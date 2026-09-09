// js/main.js — חיווט אירועים בלבד. ראו docs/CONTRACT.md

(() => {
  'use strict';

  const { el } = UI;

  el.btnStart.addEventListener('click', () => {
    UI.showScreen(SCREEN.game);
    UI.renderLevel();
  });

  // האזנה על המיכל ולא על כל select: הפקדים נבנים מחדש בכל מעבר שלב.
  el.controls.addEventListener('change', ({ target }) => {
    const select = target.closest(`.${CLASS.controlSelect}`);
    if (!select) return;
    if (!Engine.setValue(select.dataset.prop, select.value)) return;

    UI.applyValues();
    UI.setMessage('');
  });

  el.btnCheck.addEventListener('click', () => {
    const ok = Engine.check();
    const message = ok
      ? (Engine.isLast() ? TEXT.check.okLast : TEXT.check.ok)
      : TEXT.check.err;
    const kind = ok ? FEEDBACK.ok : FEEDBACK.err;

    UI.flashBoard(kind);
    UI.setMessage(message, kind);
    UI.syncNav();
  });

  el.btnReset.addEventListener('click', () => {
    Engine.reset();
    UI.refreshValues();
    UI.setMessage('');
  });

  el.btnNext.addEventListener('click', () => {
    if (Engine.isLast()) {
      UI.renderWin();
      UI.showScreen(SCREEN.win);
      return;
    }
    Engine.next();
    UI.renderLevel();
  });

  el.btnPrev.addEventListener('click', () => {
    Engine.prev();
    UI.renderLevel();
  });

  el.btnReplay.addEventListener('click', () => {
    Engine.restart();
    UI.invalidateBoard();
    UI.renderLevel();
    UI.showScreen(SCREEN.game);
  });

  // הרמז נכנס יחד עם ספירת הניסיונות, בשלב הבא של העבודה.
  el.btnHint.disabled = true;

  UI.showScreen(SCREEN.start);
})();
