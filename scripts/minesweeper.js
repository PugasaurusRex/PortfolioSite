export function minesweeper() {
  const gameContainer = document.getElementById('ms-game');
  const messageElement = document.getElementById('ms-message');
  const startButton = document.getElementById('ms-start');
  const rowsInput = document.getElementById('ms-rows');
  const colsInput = document.getElementById('ms-cols');
  const bombsInput = document.getElementById('ms-bombs');

  let rows, cols, bombs;
  let board = [];
  let revealed = [];
  let flags = [];
  let gameOver = false;

  startButton.addEventListener('click', startGame);

  function startGame() {
    rows = parseInt(rowsInput.value);
    cols = parseInt(colsInput.value);
    bombs = parseInt(bombsInput.value);

    if (bombs >= rows * cols) {
      alert('Too many bombs! Reduce the number of bombs.');
      return;
    }

    initializeBoard();
    placeBombs();
    calculateNumbers();
    renderBoard();
    messageElement.textContent = '';
    gameOver = false;
  }

  function initializeBoard() {
    board = Array.from({ length: rows }, () => Array(cols).fill(0));
    revealed = Array.from({ length: rows }, () => Array(cols).fill(false));
    flags = Array.from({ length: rows }, () => Array(cols).fill(false));
    gameContainer.style.gridTemplateColumns = `repeat(${cols}, 30px)`;
    gameContainer.innerHTML = '';
  }

  function placeBombs() {
    let bombsPlaced = 0;
    while (bombsPlaced < bombs) {
      const row = Math.floor(Math.random() * rows);
      const col = Math.floor(Math.random() * cols);
      if (board[row][col] !== 9) {
        board[row][col] = 9; // 9 represents a bomb
        bombsPlaced++;
      }
    }
  }

  function calculateNumbers() {
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (board[row][col] === 9) continue; // Skip bombs
        let count = 0;
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue; // Skip current cell
            const newRow = row + i;
            const newCol = col + j;
            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && board[newRow][newCol] === 9) {
              count++;
            }
          }
        }
        board[row][col] = count;
      }
    }
  }

  function renderBoard() {
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.row = row;
        cell.dataset.col = col;
        cell.addEventListener('click', handleCellClick);
        cell.addEventListener('contextmenu', handleRightClick);
        gameContainer.appendChild(cell);
      }
    }
  }

  function handleCellClick(event) {
    if (gameOver) return;
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    if (flags[row][col]) return; // Ignore flagged cells
    revealCell(row, col);
    if (board[row][col] === 9) {
      gameOver = true;
      revealAllBombs();
      messageElement.textContent = 'Game Over!';
    } else if (checkWin()) {
      gameOver = true;
      messageElement.textContent = 'You Win!';
    }
  }

  function handleRightClick(event) {
    event.preventDefault();
    if (gameOver) return;
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    if (!revealed[row][col]) {
      flags[row][col] = !flags[row][col];
      event.target.classList.toggle('flagged', flags[row][col]);
    }
  }

  function revealCell(row, col) {
    if (row < 0 || row >= rows || col < 0 || col >= cols || revealed[row][col]) return;
    revealed[row][col] = true;
    const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
    cell.classList.add('revealed');
    if (board[row][col] === 9) {
      cell.style.backgroundImage = "url('../../images/minesweeper/9.png')"; // Bomb image
    } else if (board[row][col] === 0) {
      cell.style.backgroundImage = "url('../../images/minesweeper/0.png')"; // Empty cell image
    } else {
      cell.style.backgroundImage = `url('../../images/minesweeper/${board[row][col]}.png')`; // Numbered cell image
    }
    if (board[row][col] === 0) {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          revealCell(row + i, col + j);
        }
      }
    }
  }

  function revealAllBombs() {
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (board[row][col] === 9) {
          const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
          cell.style.backgroundImage = "url('../../images/minesweeper/9.png')"; // Bomb image
          cell.classList.add('revealed');
        }
      }
    }
  }

  function checkWin() {
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (board[row][col] !== 9 && !revealed[row][col]) {
          return false;
        }
      }
    }
    return true;
  }
}