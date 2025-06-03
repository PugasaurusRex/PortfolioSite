// Things to improve:
// 1: Highlight currentNumber in notes
// 2: Remove number from notes when in conflicts with a correctly placed number

export function sudoku() {
  const menu = document.getElementById("sudoku-menu");
  const game = document.getElementById("sudoku-game");
  const startGameButton = document.getElementById("sudoku-startGame");
  const menuButton = document.getElementById("sudoku-menuButton");
  const restartButton = document.getElementById("sudoku-restartButton");
  const toggleButton = document.getElementById('sudoku-toggleHighlight');
  const board = document.getElementById("sudoku-board");
  const numberSelector = document.getElementById("sudoku-numberSelector");
  const recursiveSolver = document.getElementById("sudoku-recursiveSolver");
  const intervalSlider = document.getElementById("sudoku-intervalSlider");
  const mistakesLeft = document.getElementById("sudoku-mistakesLeft");

  let difficulty = 43;
  let mistakes = 3;
  let currentNumber = 1;

  let isSolving = false;
  let wrongAnswerButton;
  let isHighlightEnabled = true;

  let numSolutions = 0;
  let bestBoard = null; // Stores the best board state
  let maxRemoved = 0; // Tracks the maximum number of tiles removed

  let gameBoard = Array.from({ length: 9 }, () => Array(9).fill(0));
  let filledBoard = Array.from({ length: 9 }, () => Array(9).fill(0));

  let notes = Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => Array(9).fill(0)));

  startGameButton.addEventListener("click", () => {
    difficulty = parseInt(document.getElementById("sudoku-difficulty").value);
    mistakes = 3;
    mistakesLeft.textContent = `Mistakes Left: ${mistakes}`;
    menu.style.display = "none";
    game.style.display = "block";
    initializeGame();
  });

  menuButton.addEventListener("click", () => {
    game.style.display = "none";
    menu.style.display = "block";
    isSolving = false;
  });

  restartButton.addEventListener("click", () => { 
    initializeGame();
  });

  toggleButton.addEventListener('click', () => {
    isHighlightEnabled = !isHighlightEnabled; // Toggle the state
    toggleButton.textContent = isHighlightEnabled ? "Disable Highlighting" : "Enable Highlighting";

    // Reset highlights when disabling
    if (!isHighlightEnabled) {
      resetHighlight();
    } else {
      highlightNumbers(currentNumber.toString());
    }
  });

  function initializeGame() {
    isSolving = false;
    recursiveSolver.disabled = false;
    toggleButton.disabled = false;

    board.innerHTML = "";
    numberSelector.innerHTML = "";
    mistakes = 3;
    mistakesLeft.textContent = `Mistakes Left: ${mistakes}`;

    // Initialize the board with zeros
    filledBoard = Array.from({ length: 9 }, () => Array(9).fill(0));
    fillBoard(filledBoard);

    removeSquares(difficulty);
    gameBoard = bestBoard;

    notes = Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => Array(9).fill(0)));
    
    renderBoard();
    renderNumberSelector();

    setCurrentNumber(1);
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
            } while (usedNumbers.includes(randomNumber));

            if (isValid(filledBoard, row, col, randomNumber)) {
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
    // Create a new gameboard from the already solved board
    let testSpots = [];
    for (let x = 0; x < 9; x++) {
      for (let y = 0; y < 9; y++) {
        gameBoard[x][y] = filledBoard[x][y];
        testSpots.push(`${x},${y}`);
      }
    }

    // Initialize bestBoard and maxRemoved
    bestBoard = JSON.parse(JSON.stringify(gameBoard)); // Deep copy of the initial board
    maxRemoved = 0;

    // Start the recursive process
    rs(gameBoard, 0, numRemove, testSpots);

    // After recursion, log the best solution found
    console.log("Best solution found with", maxRemoved, "tiles removed:");
  }

  function rs(gameBoard, counter, numRemove, testSpots) {
    // Update the best solution if the current state is better
    if (counter > maxRemoved) {
      maxRemoved = counter;
      bestBoard = JSON.parse(JSON.stringify(gameBoard)); // Save the current board state
    }

    if (counter >= numRemove) {
      console.log("Successfully removed", numRemove, "tiles.");
      return true; // Successfully removed the desired number of tiles
    }

    if (testSpots.length === 0) {
      return false; // No more spots to try
    }

    // Try removing a tile
    const testIndex = testSpots.splice(Math.floor(Math.random() * testSpots.length),1)[0];
    const [i, j] = testIndex.split(",").map(Number);

    const originalValue = gameBoard[i][j];
    gameBoard[i][j] = 0; // Remove the tile

    // Check if the board still has a unique solution
    numSolutions = 0; // Reset the number of solutions
    solveSudoku(gameBoard, false); // Solve the board and count solutions

    if (numSolutions === 1) {
      // If the solution is still unique, continue removing more tiles
      if (rs(gameBoard, counter + 1, numRemove, testSpots)) {
        return true;
      }
    }

    // If removing this tile leads to multiple solutions, backtrack
    gameBoard[i][j] = originalValue; // Restore the original value
    return rs(gameBoard, counter, numRemove, testSpots); // Try other spots
  }

  function solveSudoku(solvingBoard, visual) {
    if (visual) {
      resetHighlight();
      toggleButton.disabled = true;
      isHighlightEnabled = false;

      setCurrentNumber(0);

      // If visual solve is used, disable all buttons
      for (let i = 0; i < numberSelector.children.length; i++) {
        numberSelector.children[i].disabled = true;
      }

      recursiveSolver.disabled = true;

      // Disable all cells
      for (let i = 0; i < board.children.length; i++) {
        board.children[i].disabled = true;
      }

      // Enable solving
      isSolving = true;
    }

    // Lists for storing the contents of rows, columns, and squares
    const rowContains = Array.from({ length: 9 }, () => Array(9).fill(0));
    const colContains = Array.from({ length: 9 }, () => Array(9).fill(0));
    const sqsContains = Array.from({ length: 9 }, () => Array(9).fill(0));

    // Get values for each row, column, and square completion
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (solvingBoard[i][j] !== ".") {
          const idx = parseInt(solvingBoard[i][j]) - 1;
          rowContains[i][idx] = 1;
          colContains[j][idx] = 1;
          sqsContains[getSquare(i, j)][idx] = 1;
        }
      }
    }

    // Start recursive solve
    if (visual) {
      visualSolve(solvingBoard, rowContains, colContains, sqsContains, 0, 0);
    } else {
      numSolutions = 0;
      recursiveSolve(solvingBoard, rowContains, colContains, sqsContains, 0, 0);
      return numSolutions;
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
    while (board[row][col] !== ".") {
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
      if (
        rC[row][i] === 0 &&
        cC[col][i] === 0 &&
        sC[getSquare(row, col)][i] === 0
      ) {
        rC[row][i] = 1;
        cC[col][i] = 1;
        sC[getSquare(row, col)][i] = 1;
        board[row][col] = (i + 1).toString();

        // If game is completed, return true; otherwise, reset and try next value
        if (
          recursiveSolve(
            board,
            rC,
            cC,
            sC,
            rowCounter(row, col),
            colCounter(col)
          )
        ) {
          return true;
        } else {
          rC[row][i] = 0;
          cC[col][i] = 0;
          sC[getSquare(row, col)][i] = 0;
          board[row][col] = ".";
        }
      }
    }
    // No valid numbers, return false for backtracking
    return false;
  }

  async function visualSolve(solvingBoard, rC, cC, sC, row, col) {
    try {
      // Base Case: If all rows are processed, the board is solved
      if (row === 9) {
        return true;
      }

      // Move to the next cell if the current cell is already filled
      while (solvingBoard[row][col] !== 0) {
        row = rowCounter(row, col);
        col = colCounter(col);

        if (row === 9) {
          return true;
        }
      }

      // Try numbers from 1 to 9 in the current cell
      for (let i = 0; i < 9; i++) {
        // Stop when game is reset
        if (!isSolving)
          return false;

        // Get the cell element from the DOM
        const cell = board.children[row * 9 + col];

        // Update the cell's text and style
        cell.textContent = (i + 1).toString();
        cell.style.backgroundColor = "#567f4e";
        cell.style.color = "white";

        // Add a delay for visualization
        await new Promise((resolve) => setTimeout(resolve, intervalSlider.value));

        // Check if the number is valid in the current cell
        if (rC[row][i] === 0 && cC[col][i] === 0 && sC[getSquare(row, col)][i] === 0) {
          // Mark the number as used in the current row, column, and square
          rC[row][i] = 1;
          cC[col][i] = 1;
          sC[getSquare(row, col)][i] = 1;
          solvingBoard[row][col] = (i + 1).toString();

          // Recursively solve the next cell
          if (await visualSolve(solvingBoard, rC, cC, sC, rowCounter(row, col), colCounter(col))) {
            return true;
          } else {
            // Backtrack: Reset the cell and mark the number as unused
            rC[row][i] = 0;
            cC[col][i] = 0;
            sC[getSquare(row, col)][i] = 0;
            solvingBoard[row][col] = 0;
          }
        }

        // Reset the cell's text and style if the number is invalid
        cell.textContent = "";
        cell.style.backgroundColor = "#017acc";
        cell.style.color = "white";
      }

      // If no number is valid, backtrack
      return false;
    } catch (error) {
      console.log(error);
    }
  }

  function getSquare(row, col) {
    return Math.floor(row / 3) * 3 + Math.floor(col / 3);
  }

  function renderBoard() {
    // Clear the board
    board.innerHTML = '';

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        const cell = document.createElement('div');
        cell.textContent = gameBoard[i][j] === 0 ? '' : gameBoard[i][j];

        // Add thicker borders for 3x3 squares
        if (i % 3 === 0) {
          cell.style.borderTop = '5px solid black'; // Top border for 3x3 squares
        }
        if (j % 3 === 0) {
          cell.style.borderLeft = '5px solid black'; // Left border for 3x3 squares
        }
        if (i === 8) {
          cell.style.borderBottom = '5px solid black'; // Bottom border for the last row
        }
        if (j === 8) {
          cell.style.borderRight = '5px solid black'; // Right border for the last column
        }

        cell.setAttribute('data-row', i);
        cell.setAttribute('data-col', j);

        // Add event listeners
        cell.addEventListener('click', () => handleCellClick(i, j));
        cell.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          handleRightClick(i, j);
        });

        // Add event listener for hover
        cell.addEventListener('mouseenter', (event) => {
          const hoveredCell = event.target; // The cell being hovered
          const hoveredRow = parseInt(hoveredCell.getAttribute('data-row'));
          const hoveredCol = parseInt(hoveredCell.getAttribute('data-col'));
          highlightCells(hoveredRow, hoveredCol); // Highlight related cells
        });

        // Add event listener for mouse leave
        cell.addEventListener('mouseleave', () => {
          resetHighlight(); // Reset highlights
          highlightNumbers(currentNumber.toString());
        });

        // Append the cell to the board
        board.appendChild(cell);
      }
    }
}

  function renderNumberSelector() {
    for (let i = 1; i <= 9; i++) {
      const button = document.createElement("button");
      button.textContent = i;
      button.addEventListener("click", () => setCurrentNumber(i, button));
      numberSelector.appendChild(button);
    }
  }

  function handleCellClick(i, j) {
    if (isSolving)
      return;

    // Remove wrong answer styling
    if (wrongAnswerButton) {
      wrongAnswerButton.style.color = "white";
      wrongAnswerButton.textContent = '';
      wrongAnswerButton = undefined;
    }

    if (gameBoard[i][j] === 0) {
      const cell = board.children[i * 9 + j];
      cell.textContent = currentNumber;
      if (currentNumber !== filledBoard[i][j]) {
        mistakes--;
        mistakesLeft.textContent = `Mistakes Left: ${mistakes}`;
        cell.style.color = "red";
        wrongAnswerButton = cell;
        if (mistakes <= 0) {
          alert("Game Over!");
          initializeGame();
        }
      } else {
        gameBoard[i][j] = currentNumber;
        determineAllNumberFilled(currentNumber);

        if (checkVictory()) {
          alert("Victory!");
          initializeGame();
        }
      }
    }
  }

  function determineAllNumberFilled(number) {
    let count = 0;
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (gameBoard[row][col] === number) {
          count++;

          // Set all selected number cells to highlighted
          board.children[row * 9 + col].style.color = 'black';

          if (count >= 9) { // number complete
            numberSelector.children[number - 1].disabled = true;
            numberSelector.children[number - 1].style.visibility = 'hidden';

            // Select the lowest non-complete number
            for (let i = 0; i < 9; i++) {
              if (!numberSelector.children[i].disabled) {
                setCurrentNumber(i + 1);
                return;
              }
            }

            // Return if game is over
            return;
          }
        }
      }
    }
  }

  function handleRightClick(i, j) {
    if (isSolving)
      return;

    if (gameBoard[i][j] === 0) {
      const cell = board.children[i * 9 + j];

      notes[i][j][currentNumber - 1] = notes[i][j][currentNumber - 1] ? 0 : 1;

      const hasNotes = notes[i][j].some(note => note === 1);
      if (hasNotes) {
        // Create a 3x3 grid for notes
        const gridContainer = document.createElement('div');
        gridContainer.style.display = 'grid';
        gridContainer.style.gridTemplateColumns = 'repeat(3, 1fr)';
        gridContainer.style.gridTemplateRows = 'repeat(3, 1fr)';
        gridContainer.style.width = '100%';
        gridContainer.style.height = '100%';
        gridContainer.style.textAlign = 'center';
        gridContainer.style.alignItems = 'center';

        // Populate the grid with numbers 1 through 9
        for (let num = 1; num <= 9; num++) {
          const numberDiv = document.createElement('div');
          numberDiv.textContent = notes[i][j][num - 1] ? num : '';
          numberDiv.style.fontSize = '12px'; // Adjust font size for better visibility
          numberDiv.style.color = notes[i][j][num - 1] ? 'white' : 'transparent'; // Hide numbers that are not part of the note
          numberDiv.style.backgroundColor = 'rgba(0,0,0,0)';
          gridContainer.appendChild(numberDiv);
        }

        // Clear the cell's content and add the grid
        cell.innerHTML = '';
        cell.appendChild(gridContainer);
      } else {
        // Remove the grid if no notes exist
        cell.innerHTML = '';
      }
    }
  }

  function setCurrentNumber(number) {
    // Remove highlight from last selected button
    if (currentNumber <= 9 && currentNumber > 0) {
      const lastButton = numberSelector.children[currentNumber - 1];
      if (lastButton){
        lastButton.style.backgroundColor = "";
      }
    }
    
    // Highlight selected number
    if (number <= 9 && number > 0) {
      const button = numberSelector.children[number - 1];
      button.style.backgroundColor = "#567f4e";
    }

    currentNumber = number;

    resetHighlight();
    highlightNumbers(currentNumber.toString());
  }

  function highlightCells(hoveredRow, hoveredCol) {
    // Reset all cells to default color
    resetHighlight();

    if (!isHighlightEnabled)
      return;

    // Highlight cells in the same row
    for (let col = 0; col < 9; col++) {
      const cell = board.children[hoveredRow * 9 + col];
      cell.style.backgroundColor = "#50a8d3"; // Highlight color for same row
      if (cell.style.color !== 'red')
        cell.style.color = 'black';
    }

    // Highlight cells in the same column
    for (let row = 0; row < 9; row++) {
      const cell = board.children[row * 9 + hoveredCol];
      cell.style.backgroundColor = "#50a8d3"; // Highlight color for same column

      if (cell.style.color !== 'red')
        cell.style.color = 'black';
    }

    // Highlight cells in the same 3x3 square
    const startRow = Math.floor(hoveredRow / 3) * 3;
    const startCol = Math.floor(hoveredCol / 3) * 3;
    for (let row = startRow; row < startRow + 3; row++) {
      for (let col = startCol; col < startCol + 3; col++) {
        const cell = board.children[row * 9 + col];
        cell.style.backgroundColor = "#50a8d3"; // Highlight color for same square
        
        if (cell.style.color !== 'red')
          cell.style.color = 'black';
      }
    }

    // Highlight the hovered cell with a different color
    const hoveredCell = board.children[hoveredRow * 9 + hoveredCol];
    hoveredCell.style.backgroundColor = "#50a8d3"; // Highlight color for hovered cell
    
    if (hoveredCell.style.color !== 'red')
      hoveredCell.style.color = 'black';

    if (hoveredCell.textContent !== '')
      highlightNumbers(hoveredCell.textContent);
    else
      highlightNumbers(currentNumber.toString());
  }

  function resetHighlight() {
    if (isSolving)
      return;

    // Reset all cells to default color
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const cell = board.children[row * 9 + col];
        cell.style.backgroundColor = "#017acc"; // Default cell color
        if (cell.style.color !== 'red')
          cell.style.color = 'white';
      }
    }
  }

  function highlightNumbers(number) {
    if (!isHighlightEnabled)
      return;

    // Reset all cells to default color
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const cell = board.children[row * 9 + col];
        if (cell.textContent === number) {
          cell.style.backgroundColor = "#50a8d3"; // Highlight color for same square
          if (cell.style.color !== 'red')
            cell.style.color = 'black';
        }
      }
    }
  }

  function rowCounter(row, col) {
    if ((col + 1) % 9 == 0) return row + 1;
    else return row;
  }

  function colCounter(col) {
    return (col + 1) % 9;
  }

  function checkVictory() {
    return gameBoard.every((row, i) =>
      row.every((cell, j) => cell === filledBoard[i][j])
    );
  }

  recursiveSolver.addEventListener("click", () => {
    solveSudoku(gameBoard, true);
    renderBoard();
  });

  intervalSlider.addEventListener("input", () => {
    const interval = intervalSlider.value;
    document.querySelector(
      "#sudoku-solverControls label"
    ).textContent = `Interval Between Iterations: ${interval} milliseconds`;
  });
}