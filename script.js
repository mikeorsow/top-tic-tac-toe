// Gameboard Module
const gameboard = (() => {
  let _boardMoves = [];
  const _gameboardDivs = document.querySelectorAll('.gameboard div');

  // Clicking on a tic tac toe square triggers a 'move'
  const addClickListeners = (elements) => {
    elements.forEach((element) => {
      element.addEventListener('click', gameFlow.move, { once: true });
    });
  };

  // Renders the current game moves onto the board
  const render = () => {
    Array.from(_gameboardDivs).map((div, index) => {
      div.textContent = _boardMoves[index];
    });
  };

  const addMove = (index, value) => {
    _boardMoves[index] = value;
    render();
  };

  const reset = () => {
    _boardMoves = [];
    render();
    addClickListeners(_gameboardDivs);
  };

  const checkWinner = (currentMoveSymbol, moveCount) => {
    let winnerFound = false;
    const youWinMessage = () => {
      winnerFound = true;
      console.log('Winner!!!!');
      // Users should not be able to add more moves to the board once a winner is set
      _gameboardDivs.forEach((element) => {
        element.removeEventListener('click', gameFlow.move, { once: true });
      });
      return winnerFound;
    };

    const isThreeInARow = (arr) => {
      return arr.filter((move) => move === currentMoveSymbol).length === 3;
    };

    const isTie = () => {
      if (moveCount < 9) {
        return;
      }
      return winnerFound === false;
    };

    // Slice the moves into rows to easily calculate winner
    const topRow = _boardMoves.slice(0, 3);
    const middleRow = _boardMoves.slice(3, 6);
    const bottomRow = _boardMoves.slice(6, 9);

    const getColumnMoves = (index) => {
      const column = [topRow[index], middleRow[index], bottomRow[index]];
      return column;
    };

    // Create columns for readability in the switch statement below
    const column1 = getColumnMoves(0);
    const column2 = getColumnMoves(1);
    const column3 = getColumnMoves(2);
    const diagonalTopLeft = [topRow[0], middleRow[1], bottomRow[2]];
    const diagonalTopRight = [topRow[2], middleRow[1], bottomRow[0]];

    switch (true) {
      case isThreeInARow(topRow):
      case isThreeInARow(middleRow):
      case isThreeInARow(bottomRow):
      case isThreeInARow(column1):
      case isThreeInARow(column2):
      case isThreeInARow(column3):
      case isThreeInARow(diagonalTopLeft):
      case isThreeInARow(diagonalTopRight):
        youWinMessage();
        break;
      case isTie():
        console.log(`It's a bloody tie!`);
    }
  };

  return {
    render,
    addMove,
    reset,
    checkWinner,
  };
})();

// Player Factory
const player = (name, moveSymbol) => {
  const getName = () => name;
  const getMoveSymbol = () => moveSymbol;
  const updateName = (newName) => (name = newName);
  return {
    getName,
    getMoveSymbol,
    updateName,
  };
};

// Game Flow Module
const gameFlow = (() => {
  // Players
  let player1 = player('James', 'x');
  let player2 = player('Laura', 'o');

  let currentPlayer = player1;
  let moveCount = 0;

  const player1MessageDiv = document.querySelector('.player1-message');
  const player2MessageDiv = document.querySelector('.player2-message');
  const player1NameDiv = document.querySelector('.player1-name');
  const player2NameDiv = document.querySelector('.player2-name');

  const switchPlayer = () => {
    const toggleClass = (target, className) => {
      target.classList.toggle(className);
    };

    toggleClass(player1MessageDiv, 'hide-message');
    toggleClass(player2MessageDiv, 'hide-message');
    toggleClass(player1NameDiv, 'active-player');
    toggleClass(player2NameDiv, 'active-player');

    if (currentPlayer === player1) {
      return (currentPlayer = player2);
    }
    return (currentPlayer = player1);
  };

  const move = (e) => {
    const currentMoveSymbol = currentPlayer.getMoveSymbol();
    const boardIndex = e.target.dataset.index;
    // console.log('move called');
    gameboard.addMove(boardIndex, currentMoveSymbol);
    ++moveCount;
    gameboard.checkWinner(currentMoveSymbol, moveCount);
    switchPlayer();
    // Don't check for winner until it's even possible to win (5 moves min.)
    // if (moveCount >= 5) {
    //   gameboard.checkWinner(currentMoveSymbol);
    // }
  };

  // Clicking the reset button clears the board
  const resetButton = document.querySelector('.reset-button');
  resetButton.addEventListener('click', () => {
    console.log('reset');
    gameboard.reset();
    reset();
  });

  const reset = () => {
    
    player1NameDiv.classList.add('active-player');
    player1MessageDiv.classList.remove('hide-message');
    player2NameDiv.classList.remove('active-player');
    player2MessageDiv.classList.add('hide-message');

    currentPlayer = player1;
    moveCount = 0;

  };

  return {
    move,
    reset,
    player1,
    player2,
  };
})();

gameboard.reset();
gameboard.render();
