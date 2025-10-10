// Holographic 4D Tic Tac Toe - script.js
const cells = Array.from(document.querySelectorAll("[data-cell]"));
const messageEl = document.getElementById("message");
const restartBtn = document.getElementById("restartBtn");
const winLine = document.getElementById("winLine");
const boardEl = document.getElementById("board");

let currentPlayer = "X";
let gameActive = true;

const winningCombinations = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6],
];

// Initialize: add event listeners & ARIA friendly focus
function init(){
  setMessage(`${currentPlayer}'s Turn`);
  cells.forEach((cell, idx) => {
    clearCell(cell);
    cell.addEventListener('click', handleClick, { once: true, passive: true });
    cell.addEventListener('pointerenter', () => cell.classList.add(`hover-${currentPlayer}`));
    cell.addEventListener('pointerleave', () => cell.classList.remove(`hover-${currentPlayer}`));
    cell.addEventListener('keydown', (e) => {
      if(e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!cell.disabled) cell.click();
      }
      // quick nav: arrow keys
      const nav = { ArrowRight:1, ArrowLeft:-1, ArrowDown:3, ArrowUp:-3 };
      if(nav[e.key] !== undefined){
        e.preventDefault();
        const targetIdx = (idx + nav[e.key] + 9) % 9;
        cells[targetIdx].focus();
      }
    });
    // ensure tile is focusable
    cell.tabIndex = 0;
  });
}

function handleClick(e){
  if(!gameActive) return;
  const cell = e.currentTarget;
  placeSymbol(cell, currentPlayer);
  cell.classList.add('placed');
  cell.disabled = true;

  if(checkWin(currentPlayer)){
    setMessage(`${currentPlayer} Wins!`);
    showWinLine(currentPlayer);
    highlightWinningCells(currentPlayer);
    gameActive = false;
    return;
  }
  if(cells.every(c => c.textContent !== "")){
    setMessage("Draw");
    gameActive = false;
    return;
  }
  // swap player
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  setMessage(`${currentPlayer}'s Turn`);
  updateHoverClasses();
}

function placeSymbol(cell, player){
  // create symbol element for better animation control
  const sym = document.createElement('span');
  sym.className = `symbol ${player}`;
  sym.textContent = player;
  cell.appendChild(sym);
  // animation: slight delay for popping effect
  requestAnimationFrame(()=> {
    // force reflow then add placed class (handled on cell)
    sym.style.opacity = '1';
  });
}

function checkWin(player){
  return winningCombinations.some(combo => combo.every(i => cells[i].textContent === player));
}

function highlightWinningCells(player){
  winningCombinations.forEach(combo => {
    if(combo.every(i => cells[i].textContent === player)){
      combo.forEach(i => {
        const c = cells[i];
        c.style.boxShadow = `0 28px 60px ${player === 'X' ? 'rgba(255,107,136,0.12)' : 'rgba(51,240,255,0.12)'} , inset 0 0 40px rgba(255,255,255,0.02)`;
      });
    }
  });
}

function showWinLine(player){
  // find matching combo
  const combo = winningCombinations.find(c => c.every(i => cells[i].textContent === player));
  if(!combo) return;

  // compute positions of first and last cell centers relative to board
  const rectBoard = boardEl.getBoundingClientRect();
  const rectA = cells[combo[0]].getBoundingClientRect();
  const rectB = cells[combo[combo.length-1]].getBoundingClientRect();

  const centerA = { x: rectA.left + rectA.width/2 - rectBoard.left, y: rectA.top + rectA.height/2 - rectBoard.top };
  const centerB = { x: rectB.left + rectB.width/2 - rectBoard.left, y: rectB.top + rectB.height/2 - rectBoard.top };

  const dx = centerB.x - centerA.x;
  const dy = centerB.y - centerA.y;
  const length = Math.sqrt(dx*dx + dy*dy) + rectA.width * 0.35; // little extra to extend beyond center
  const angle = Math.atan2(dy, dx) * (180/Math.PI);

  // position and style winLine
  winLine.style.width = `${length}px`;
  winLine.style.opacity = '1';
  winLine.style.transform = `translate(${(centerA.x + centerB.x)/2}px, ${(centerA.y + centerB.y)/2}px) rotate(${angle}deg) translate(-50%,-50%)`;
  // color neon by player
  const glow = player === 'X' ? 'rgba(255,107,136,0.95)' : 'rgba(51,240,255,0.95)';
  winLine.style.boxShadow = `0 0 40px ${glow}, 0 0 110px ${glow}`;
  winLine.style.background = `linear-gradient(90deg, rgba(255,255,255,0.12), ${glow})`;
}

function clearWinLine(){
  winLine.style.opacity = '0';
  winLine.style.width = '0';
  winLine.style.background = '';
  winLine.style.boxShadow = '';
}

// Update hover classes so pointer shows correct player glow
function updateHoverClasses(){
  cells.forEach(c => {
    c.classList.remove('hover-X','hover-O');
    if(!c.disabled) c.classList.add(`hover-${currentPlayer}`);
  });
}

function setMessage(txt){ messageEl.textContent = txt; }

function clearCell(cell){
  cell.textContent = '';
  cell.disabled = false;
  cell.className = 'cell';
  cell.style.boxShadow = '';
  while(cell.firstChild) cell.removeChild(cell.firstChild);
}

// restart
restartBtn.addEventListener('click', () => {
  currentPlayer = 'X';
  gameActive = true;
  clearWinLine();
  cells.forEach(clearCell);
  setMessage(`${currentPlayer}'s Turn`);
  updateHoverClasses();
  // re-bind click listeners (some were set once)
  cells.forEach((cell, idx) => {
    // remove all listeners by clone trick for simplicity
    const clone = cell.cloneNode(false);
    cell.replaceWith(clone);
    cells[idx] = clone;
  });
  // reinitialize listeners for new DOM nodes:
  init();
});

// initial setup
init();
updateHoverClasses();

/* Optional: Small sound cues for placements & win (uncomment and provide audio files)
const sndPlace = new Audio('place.wav');
const sndWin = new Audio('win.wav');
function playPlace(){ sndPlace.play().catch(()=>{}); }
function playWin(){ sndWin.play().catch(()=>{}); }
*/
