
(() => {
  'use strict';

  const { el } = UI;

  const openLevel = () => {
    UI.showScreen(SCREEN.game);
    UI.renderLevel();
  };

  el.btnStart.addEventListener('click', () => {
    Engine.startFresh();
    UI.invalidateBoard();
    openLevel();
  });

  el.btnContinue.addEventListener('click', () => {
    Engine.resume();
    UI.invalidateBoard();
    openLevel();
  });

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
    UI.renderLevelMap();
    UI.syncNav();
  });

  el.btnReset.addEventListener('click', () => {
    Engine.reset();
    UI.refreshValues();
    UI.setMessage('');
  });

  el.btnHint.addEventListener('click', () => {
    UI.showHint(Engine.useHint());
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

  // מפת השלבים נבנית מחדש בכל רינדור, ולכן ההאזנה על המיכל.
  el.levelMap.addEventListener('click', ({ target }) => {
    const chip = target.closest(`.${CLASS.levelChip}`);
    if (!chip) return;

    const index = Number(chip.dataset.level);
    if (!Engine.isUnlocked(index)) return;

    Engine.goTo(index);
    UI.renderLevel();
  });

  el.btnReplay.addEventListener('click', () => {
    Engine.startFresh();
    UI.invalidateBoard();
    openLevel();
  });

  UI.toggleContinue(Engine.hasSave());
  UI.showScreen(SCREEN.start);
})();
