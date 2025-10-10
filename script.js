(() => {
  const boardEl = document.getElementById('board');
  const cells = Array.from(document.querySelectorAll('.cell'));
  const playerEl = document.getElementById('player');
  const messageEl = document.getElementById('message');
  const restartBtn = document.getElementById('restart');
  const resetAllBtn = document.getElementById('resetAll');
  const scoreXEl = document.getElementById('scoreX');
  const scoreOEl = document.getElementById('scoreO');
  const scoreDEl = document.getElementById('scoreD');

  const WIN_COMBOS = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  let boardState = Array(9).fill('');
  let current = 'X';
  let running = true;
  let scores = { X:0, O:0, D:0 };

  function startRound() {
    boardState.fill('');
    cells.forEach(cell => {
      cell.disabled = false;
      cell.removeAttribute('data-mark');
    });
    current = 'X';
    running = true;
    updateTurn();
    hideMessage();
  }

  function updateTurn() {
    playerEl.textContent = current;
  }

  function showMessage(text) {
    messageEl.textContent = text;
    messageEl.classList.remove('hidden');
  }
  function hideMessage() {
    messageEl.classList.add('hidden');
  }

  function checkWin() {
    for (const combo of WIN_COMBOS) {
      const [a,b,c] = combo;
      if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
        return boardState[a];
      }
    }
    if (boardState.every(Boolean)) return 'D';
    return null;
  }

  function handleMove(i) {
    if (!running) return;
    if (boardState[i]) return;
    boardState[i] = current;
    const cell = cells[i];
    cell.setAttribute('data-mark', current);
    cell.disabled = true;

    const result = checkWin();
    if (result) {
      running = false;
      if (result === 'D') {
        scores.D++;
        scoreDEl.textContent = scores.D;
        showMessage('Draw!');
      } else {
        scores[result]++;
        scoreXEl.textContent = scores.X;
        scoreOEl.textContent = scores.O;
        showMessage(result + ' wins!');
      }
    } else {
      current = current === 'X' ? 'O' : 'X';
      updateTurn();
    }
  }

  cells.forEach((cell, i) => {
    cell.addEventListener('click', () => handleMove(i));
  });

  restartBtn.addEventListener('click', startRound);
  resetAllBtn.addEventListener('click', () => {
    scores = { X:0, O:0, D:0 };
    scoreXEl.textContent = 0;
    scoreOEl.textContent = 0;
    scoreDEl.textContent = 0;
    startRound();
  });

  startRound();
})();
