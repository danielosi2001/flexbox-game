
const UI = (() => {
  'use strict';

  const byId = (id) => document.getElementById(id);

  const el = {
    screens: {
      [SCREEN.start]: byId(DOM.screens.start),
      [SCREEN.game]:  byId(DOM.screens.game),
      [SCREEN.win]:   byId(DOM.screens.win),
    },
    board:       byId(DOM.board),
    controls:    byId(DOM.controls),
    instruction: byId(DOM.instruction),
    indicator:   byId(DOM.levelIndicator),
    msg:         byId(DOM.msg),
    hint:        byId(DOM.hint),
    levelMap:    byId(DOM.levelMap),
    finalScore:  byId(DOM.finalScore),
    tally:       byId(DOM.scoreBreakdown),
    btnStart:    byId(DOM.btnStart),
    btnContinue: byId(DOM.btnContinue),
    btnCheck:    byId(DOM.btnCheck),
    btnReset:    byId(DOM.btnReset),
    btnHint:     byId(DOM.btnHint),
    btnPrev:     byId(DOM.btnPrev),
    btnNext:     byId(DOM.btnNext),
    btnReplay:   byId(DOM.btnReplay),
  };

  let renderedIndex = null;

  const showScreen = (name) => {
    Object.entries(el.screens).forEach(([key, screen]) => {
      screen.classList.toggle(CLASS.hidden, key !== name);
    });
  };

  const buildPod = (size, i) => {
    const pod = document.createElement('div');
    pod.className = size ? `${CLASS.pod} ${CLASS.podSize(size)}` : CLASS.pod;
    pod.dataset.index = String(i);
    return pod;
  };

  const renderBoard = (level) => {
    const pods = Array.from({ length: level.items }, (_, i) =>
      buildPod(level.itemSizes ? level.itemSizes[i] : null, i));
    el.board.replaceChildren(...pods);
  };

  const buildOption = (value) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    return option;
  };

  const buildControl = (prop, value) => {
    const wrap = document.createElement('div');
    wrap.className = CLASS.control;

    const label = document.createElement('label');
    label.className = CLASS.controlLabel;
    label.setAttribute('for', DOM.controlId(prop));
    label.textContent = prop;

    const select = document.createElement('select');
    select.className = CLASS.controlSelect;
    select.id = DOM.controlId(prop);
    select.dataset.prop = prop;
    select.append(...Engine.OPTIONS[prop].map(buildOption));
    select.value = value;

    wrap.append(label, select);
    return wrap;
  };

  const renderControls = (level) => {
    const values = Engine.values();
    el.controls.replaceChildren(
      ...level.controls.map((prop) => buildControl(prop, values[prop]))
    );
  };

  const syncControls = () => {
    const values = Engine.values();
    el.controls.querySelectorAll(`.${CLASS.controlSelect}`).forEach((select) => {
      select.value = values[select.dataset.prop];
    });
  };

  const applyValues = () => {
    const values = Engine.values();
    Engine.PROPS.forEach((prop) => {
      if (Object.hasOwn(values, prop)) {
        el.board.style.setProperty(prop, values[prop]);
      } else {
        el.board.style.removeProperty(prop);
      }
    });
  };

  const setMessage = (text, kind) => {
    el.msg.textContent = text ?? '';
    el.msg.classList.toggle(CLASS.msgOk, kind === FEEDBACK.ok);
    el.msg.classList.toggle(CLASS.msgErr, kind === FEEDBACK.err);
  };

  let flashTimer = null;
  const flashBoard = (kind) => {
    clearTimeout(flashTimer);
    el.board.classList.remove(CLASS.boardSuccess, CLASS.boardError);
    void el.board.offsetWidth;
    el.board.classList.add(kind === FEEDBACK.ok ? CLASS.boardSuccess : CLASS.boardError);
    flashTimer = setTimeout(() => {
      el.board.classList.remove(CLASS.boardSuccess, CLASS.boardError);
    }, TIMING.flashMs);
  };

  const buildChip = (i) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = CLASS.levelChip;
    chip.dataset.level = String(i);
    chip.textContent = String(i + 1);

    if (Engine.isSolved(i)) chip.classList.add(CLASS.chipSolved);
    if (i === Engine.index()) chip.classList.add(CLASS.chipCurrent);
    if (!Engine.isUnlocked(i)) {
      chip.classList.add(CLASS.chipLocked);
      chip.disabled = true;
    }
    return chip;
  };

  const renderLevelMap = () => {
    el.levelMap.replaceChildren(
      ...Array.from({ length: Engine.count() }, (_, i) => buildChip(i))
    );
  };

  const showHint = (text) => {
    el.hint.textContent = text;
    el.hint.classList.remove(CLASS.hidden);
    el.btnHint.disabled = true;
  };

  const hideHint = () => {
    el.hint.textContent = '';
    el.hint.classList.add(CLASS.hidden);
    el.btnHint.disabled = false;
  };

  const toggleContinue = (show) => {
    el.btnContinue.classList.toggle(CLASS.hidden, !show);
  };

  const syncNav = () => {
    el.btnPrev.disabled = Engine.index() === 0;
    el.btnNext.disabled = !Engine.isSolved();
  };

  const renderLevel = () => {
    const level = Engine.current();
    const index = Engine.index();

    el.instruction.textContent = level.instruction;
    el.indicator.textContent = TEXT.levelIndicator(index + 1, Engine.count());

    if (renderedIndex !== index) {
      renderBoard(level);
      renderedIndex = index;
    }

    renderControls(level);
    applyValues();
    setMessage('');
    el.board.classList.remove(CLASS.boardSuccess, CLASS.boardError);

    if (Engine.hintUsed()) showHint(level.hint);
    else hideHint();

    renderLevelMap();
    syncNav();
  };
  const refreshValues = () => {
    syncControls();
    applyValues();
  };

  const buildTallyRow = (i) => {
    const row = document.createElement('tr');
    const cells = [
      String(i + 1),
      String(Engine.attempts(i)),
      Engine.isSolved(i) ? TEXT.stars(Engine.rating(i)) : TEXT.noStars,
    ];
    row.append(...cells.map((text) => {
      const cell = document.createElement('td');
      cell.textContent = text;
      return cell;
    }));
    return row;
  };

  const buildTotalRow = () => {
    const row = document.createElement('tr');
    row.append(...[TEXT.tallyTotal, String(Engine.totalAttempts()), ''].map((text) => {
      const cell = document.createElement('td');
      cell.textContent = text;
      return cell;
    }));
    return row;
  };

  const renderWin = () => {
    el.finalScore.textContent = TEXT.finalScore(Engine.solvedCount(), Engine.count());
    el.tally.replaceChildren(
      ...Array.from({ length: Engine.count() }, (_, i) => buildTallyRow(i)),
      buildTotalRow()
    );
  };

  return {
    el,
    showScreen,
    renderLevel,
    refreshValues,
    applyValues,
    setMessage,
    flashBoard,
    syncNav,
    renderLevelMap,
    showHint,
    toggleContinue,
    renderWin,
    invalidateBoard: () => { renderedIndex = null; },
  };
})();
