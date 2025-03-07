document.addEventListener('DOMContentLoaded', () => {
  const menu = document.getElementById('menu');
  const game = document.getElementById('game');
  const startGameButton = document.getElementById('startGame');
  const menuButton = document.getElementById('menuButton');
  const restartButton = document.getElementById('restartButton');
  const board = document.getElementById('board');
  const numberSelector = document.getElementById('numberSelector');
  const recursiveSolver = document.getElementById('recursiveSolver');
  const intervalSlider = document.getElementById('intervalSlider');
  const mistakesLeft = document.getElementById('mistakesLeft');

  let difficulty = 43;
  let mistakes = 3;
  let currentNumber = 1;
  let numCount = Array(9).fill(0);
  let gameBoard = Array.from({ length: 9 }, () => Array(9).fill(0));
  let filledBoard = Array.from({ length: 9 }, () => Array(9).fill(0));
  let solvedBoard = Array.from({ length: 9 }, () => Array(9).fill(0));
  let activeTiles = Array.from({ length: 9 }, () => Array(9).fill(0));
  let notes = Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => Array(9).fill(0)));

  startGameButton.addEventListener('click', () => {
    difficulty = parseInt(document.getElementById('difficulty').value);
    mistakes = 3;
    mistakesLeft.textContent = `Mistakes Left: ${mistakes}`;
    menu.style.display = 'none';
    game.style.display = 'block';
    initializeGame();
  });

  menuButton.addEventListener('click', () => {
    game.style.display = 'none';
    menu.style.display = 'block';
  });

  restartButton.addEventListener('click', () => {
    initializeGame();
  });

  function initializeGame() {
    board.innerHTML = '';
    numberSelector.innerHTML = '';
    mistakes = 3;
    mistakesLeft.textContent = `Mistakes Left: ${mistakes}`;


    // Initialize the board with zeros
    filledBoard = Array.from({ length: 9 }, () => Array(9).fill(0));
    fillBoard(filledBoard);

    // Generate and print the Sudoku board
    console.log(filledBoard);
    return;
    removeSquares(difficulty);
    solvedBoard = JSON.parse(JSON.stringify(gameBoard)); // Copy of the solved board
    removeTilesBasedOnDifficulty();
    activeTiles = Array.from({ length: 9 }, () => Array(9).fill(0));
    notes = Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => Array(9).fill(0)));
    renderBoard();
    renderNumberSelector();
  }

  function fillBoard(filledBoard) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (filledBoard[row][col] === 0) {
          let numsTested = 0;
          const usedNumbers = [];
          while (numsTested < 9) {
            // Random number between 1 and 9 that is available
            let randomNumber;
            do {
              randomNumber = Math.floor(Math.random() * 9) + 1;
            }
            while (usedNumbers.includes(randomNumber));
            
            if (isValid(filledBoard, row, col, randomNumber)){
              filledBoard[row][col] = randomNumber;

              // Recursively fill the rest of the board
              if (fillBoard(filledBoard)) {
                return true;
              }
            }

            usedNumbers.push(randomNumber);
            
            // If no valid number, backtrack
            filledBoard[row][col] = 0;
            numsTested++; 
          }
          return false;
        }
      }
    }
    return true;
  }

  function isValid(board, row, col, num) {
    // Check row
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num) return false;
    }

    // Check column
    for (let i = 0; i < 9; i++) {
      if (board[i][col] === num) return false;
    }

    // Check 3x3 subgrid
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[startRow + i][startCol + j] === num) return false;
      }
    }

    return true;
  }

  function removeSquares(numRemove) {
    // Matrix for active tiles
    activeTiles = Array.from({ length: 9 }, () => Array(9).fill(0));

    numLeft = numRemove;

    // Create new gameboard from already solved board
    numSolutions = 0;
    let testSpots = [];
    for (let x = 0; x < 9; x++) {
        for (let y = 0; y < 9; y++) {
            gameBoard[x][y] = filledBoard[x][y];
            testSpots.push(`${x},${y}`);
        }
    }

    // Remove first 40 tiles before checking uniqueness
    while (true) {
        // Remove 40 tiles
        for (let num = 0; num < 40; num++) {
            const testIndex = testSpots.splice(Math.floor(Math.random() * testSpots.length), 1)[0];
            const [i, j] = testIndex.split(',').map(Number);
            numCount[gameBoard[i][j] - 1] += 1;
            gameBoard[i][j] = '.';
            activeTiles[i][j] = 1;
        }

        // Check uniqueness with recursion
        solveSudoku(gameBoard, false, true);

        // If not unique, reset gameboard and try again
        if (numSolutions !== 1) {
            activeTiles = Array.from({ length: 9 }, () => Array(9).fill(0));
            numCount = Array(9).fill(0);
            testSpots = [];
            for (let x = 0; x < 9; x++) {
                for (let y = 0; y < 9; y++) {
                    gameBoard[x][y] = filledBoard[x][y];
                    testSpots.push(`${x},${y}`);
                }
            }
        } else if (numSolutions === 1) {
            break;
        }
    }

    // Check board uniqueness after each square removed
    // If the randomly chosen square removes board uniqueness, it is not removed
    for (let num = 0; num < numRemove - 40; num++) {
        const testIndex = testSpots.splice(Math.floor(Math.random() * testSpots.length), 1)[0];
        const [i, j] = testIndex.split(',').map(Number);
        const temp = gameBoard[i][j];
        gameBoard[i][j] = '.';
        solveSudoku(gameBoard, false, true);
        if (numSolutions !== 1) {
            gameBoard[i][j] = filledBoard[i][j];
        } else if (numSolutions === 1) {
            numCount[temp - 1] += 1;
            activeTiles[i][j] = 1;
        }
    }
  }

  function solveSudoku(board, visual, recursive) {
    if (visual) {
      // If visual solve is used, disable all buttons
      recursiveButton.disabled = true;
      noteButton.disabled = true;

      for (let i = 0; i < 9; i++) {
        selectorButtons[i].disabled = true;
        selectorButtons[i].style.backgroundColor = "#0008ff";
        selectorButtons[i].style.color = "white";
        for (let j = 0; j < 9; j++) {
          activeTiles[i][j] = 1;
          buttons[i][j].disabled = true;
        }
      }
    }

    if (recursive) {
        // Lists for storing the contents of rows, columns, and squares
        const rowContains = Array.from({ length: 9 }, () => Array(9).fill(0));
        const colContains = Array.from({ length: 9 }, () => Array(9).fill(0));
        const sqsContains = Array.from({ length: 9 }, () => Array(9).fill(0));

        // Get values for each row, column, and square completion
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (board[i][j] !== '.') {
                    const idx = parseInt(board[i][j]) - 1;
                    rowContains[i][idx] = 1;
                    colContains[j][idx] = 1;
                    sqsContains[getSquare(i, j)][idx] = 1;
                }
            }
        }

        // Start recursive solve
        if (visual) {
            visualSolve(board, rowContains, colContains, sqsContains, 0, 0);
        } else {
            numSolutions = 0;
            recursiveSolve(board, rowContains, colContains, sqsContains, 0, 0);
        }
    }
}

  function recursiveSolve(board, rC, cC, sC, row, col) {
      // Base Case
      if (numSolutions > 1) {
          return true;
      }
      if (row === 9) {
          numSolutions += 1;
          return false;
      }

      // Loop until next unsolved tile
      while (board[row][col] !== '.') {
          row = rowCounter(row, col);
          col = colCounter(col);
          if (row === 9) {
              numSolutions += 1;
              return false;
          }
      }

      // When unsolved tile is found, loop through 1 to 9
      for (let i = 0; i < 9; i++) {
          // If number is valid, set it on the board
          if (rC[row][i] === 0 && cC[col][i] === 0 && sC[getSquare(row, col)][i] === 0) {
              rC[row][i] = 1;
              cC[col][i] = 1;
              sC[getSquare(row, col)][i] = 1;
              board[row][col] = (i + 1).toString();

              // If game is completed, return true; otherwise, reset and try next value
              if (recursiveSolve(board, rC, cC, sC, rowCounter(row, col), colCounter(col))) {
                  return true;
              } else {
                  rC[row][i] = 0;
                  cC[col][i] = 0;
                  sC[getSquare(row, col)][i] = 0;
                  board[row][col] = '.';
              }
          }
      }
      // No valid numbers, return false for backtracking
      return false;
  }

  async function visualSolve(board, rC, cC, sC, row, col) {
      try {
          // Base Case
          if (row === 9) {
              return true;
          }

          // Loop until next unsolved tile
          while (board[row][col] !== '.') {
              row = rowCounter(row, col);
              col = colCounter(col);
              if (row === 9) {
                  return true;
              }
          }

          // When unsolved tile is found, loop through 1 to 9
          for (let i = 0; i < 9; i++) {
              // Update UI
              buttons[row][col].textContent = (i + 1).toString();
              buttons[row][col].style.backgroundColor = "#567f4e";
              buttons[row][col].style.color = "white";

              // Add a delay for visualization
              await new Promise((resolve) => setTimeout(resolve, time));

              // If number is valid, set it on the board
              if (rC[row][i] === 0 && cC[col][i] === 0 && sC[getSquare(row, col)][i] === 0) {
                  board[row][col] = (i + 1).toString();
                  rC[row][i] = 1;
                  cC[col][i] = 1;
                  sC[getSquare(row, col)][i] = 1;

                  // If game is completed, return true; otherwise, reset and try another value
                  if (await visualSolve(board, rC, cC, sC, rowCounter(row, col), colCounter(col))) {
                      return true;
                  } else {
                      rC[row][i] = 0;
                      cC[col][i] = 0;
                      sC[getSquare(row, col)][i] = 0;
                      board[row][col] = '.';
                  }
              }
          }
          // If looped through all values and no valid one found, return false for backtracking
          board[row][col] = '.';
          // Update UI
          buttons[row][col].textContent = "";
          buttons[row][col].style.backgroundColor = "red";
          buttons[row][col].style.color = "white";

          // Add a delay for visualization
          await new Promise((resolve) => setTimeout(resolve, time));

          return false;
      } catch (error) {
          console.log("Forcefully stopping solver due to restart or board wipe.");
      }
  }

  // Helper function to get the square index
  function getSquare(row, col) {
    return Math.floor(row / 3) * 3 + Math.floor(col / 3);
  }

  function removeTilesBasedOnDifficulty() {
      let tilesToRemove = difficulty;
      while (tilesToRemove > 0) {
          const row = Math.floor(Math.random() * 9);
          const col = Math.floor(Math.random() * 9);
          if (gameBoard[row][col] !== 0) {
              gameBoard[row][col] = 0;
              tilesToRemove--;
          }
      }
  }

  function renderBoard() {
      for (let i = 0; i < 9; i++) {
          for (let j = 0; j < 9; j++) {
              const cell = document.createElement('div');
              cell.textContent = gameBoard[i][j] === 0 ? '' : gameBoard[i][j];
              cell.addEventListener('click', () => handleCellClick(i, j));
              cell.addEventListener('contextmenu', (e) => {
                  e.preventDefault();
                  handleRightClick(i, j);
              });
              board.appendChild(cell);
          }
      }
  }

  function renderNumberSelector() {
      for (let i = 1; i <= 9; i++) {
          const button = document.createElement('button');
          button.textContent = i;
          button.addEventListener('click', () => setCurrentNumber(i));
          numberSelector.appendChild(button);
      }
  }

  function handleCellClick(i, j) {
      if (gameBoard[i][j] === 0) {
          const cell = board.children[i * 9 + j];
          cell.textContent = currentNumber;
          if (currentNumber !== solvedBoard[i][j]) {
              mistakes--;
              mistakesLeft.textContent = `Mistakes Left: ${mistakes}`;
              cell.style.color = 'red';
              if (mistakes <= 0) {
                  alert('Game Over!');
                  initializeGame();
              }
          } else {
              gameBoard[i][j] = currentNumber;
              activeTiles[i][j] = 0;
              if (checkVictory()) {
                  alert('Victory!');
                  initializeGame();
              }
          }
      }
  }

  function handleRightClick(i, j) {
      if (gameBoard[i][j] === 0) {
          const cell = board.children[i * 9 + j];
          notes[i][j][currentNumber - 1] = notes[i][j][currentNumber - 1] ? 0 : 1;
          let noteText = '';
          for (let num = 1; num <= 9; num++) {
              noteText += notes[i][j][num - 1] ? num : ' ';
              if (num % 3 === 0) noteText += '\n';
          }
          cell.textContent = noteText.trim();
      }
  }

  function setCurrentNumber(number) {
      currentNumber = number;
  }

  function rowCounter(row, col) {
    if ((col + 1) % 9 == 0)
      return row + 1;
    else
      return row;
  }

  function colCounter(col) {
    return (col + 1) % 9;
  }

  function checkVictory() {
      return gameBoard.every((row, i) => row.every((cell, j) => cell === solvedBoard[i][j]));
  }

  // Solver functions (optional)
  recursiveSolver.addEventListener('click', () => {
      solveSudoku(gameBoard);
      renderBoard();
  });

  intervalSlider.addEventListener('input', () => {
      const interval = intervalSlider.value;
      document.querySelector('#solverControls label').textContent = `Interval Between Iterations: ${interval} milliseconds`;
  });
});