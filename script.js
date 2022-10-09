// Gameboard Module
const gameboard = (() => {
  let _boardMoves = [];
  const _gameboardDivs = document.querySelectorAll('.gameboard div');

  // Clicking on a tic tac toe square triggers a 'move'
  const addClickListeners = (elements) => {
    elements.forEach((element) => {
      element.addEventListener('click', addMove, { once: true });
    });
  };

  // Renders the current game moves onto the board
  const render = () => {
    Array.from(_gameboardDivs).map((div, index) => {
      div.textContent = _boardMoves[index];
    });
  };

  const addMove = (e) => {
    const index = e.target.dataset.index;
    const currentMoveSymbol = gameFlow.getCurrentMoveSymbol()
    _boardMoves[index] = currentMoveSymbol;
    render();
    gameFlow.move();
  };

  const getBoardMoves = () => _boardMoves;

  const reset = () => {
    _boardMoves = [];
    render();
    addClickListeners(_gameboardDivs);
  };

  const endGame = () => {
    _gameboardDivs.forEach((element) => {
      element.removeEventListener('click', addMove, { once: true });
    });
  };

  return {
    render,
    addMove,
    reset,
    getBoardMoves,
    endGame,
  };
})();
// End Gameboard Module

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
  let currentMoveSymbol = currentPlayer.getMoveSymbol();
  let moveCount = 0;

  const getCurrentPlayer = () => currentPlayer;
  const getCurrentMoveSymbol = () => currentMoveSymbol;

  const player1MessageDiv = document.querySelector('.player1-message');
  const player2MessageDiv = document.querySelector('.player2-message');
  const player1NameDiv = document.querySelector('.player1-name');
  const player2NameDiv = document.querySelector('.player2-name');

  const switchPlayer = () => {
    console.log('switchPlayer called!');
    const toggleClass = (target, className) => {
      target.classList.toggle(className);
    };

    // Switch UI element showing 'Your Turn!' message
    toggleClass(player1MessageDiv, 'hide-message');
    toggleClass(player2MessageDiv, 'hide-message');
    toggleClass(player1NameDiv, 'active-player');
    toggleClass(player2NameDiv, 'active-player');

    // Switch current player value
    if (currentPlayer === player1) {
      currentPlayer = player2;
    } else currentPlayer = player1;

    return (currentMoveSymbol = currentPlayer.getMoveSymbol());
  };

  const isWinningMove = () => {
    // Slice the moves into rows to more easily calculate winner (visually)
    const boardMoves = gameboard.getBoardMoves();
    const topRow = boardMoves.slice(0, 3);
    const middleRow = boardMoves.slice(3, 6);
    const bottomRow = boardMoves.slice(6, 9);

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

    const isThreeInARow = (arr) => {
      return arr.filter((move) => move === currentMoveSymbol).length === 3;
    };

    let isWinner = false;

    // See if there is a winning move on the board
    switch (true) {
      case isThreeInARow(topRow):
      case isThreeInARow(middleRow):
      case isThreeInARow(bottomRow):
      case isThreeInARow(column1):
      case isThreeInARow(column2):
      case isThreeInARow(column3):
      case isThreeInARow(diagonalTopLeft):
      case isThreeInARow(diagonalTopRight):
        isWinner = true;
    }

    return isWinner;
  };

  const showWinningMessage = () => {
    if (currentPlayer === player1) {
      player1MessageDiv.textContent = 'You Win!'
    }
    player2MessageDiv.textContent = 'You Win!'
  }

  const move = () => {
    ++moveCount;
    if (isWinningMove()) {
      console.log('isWinningMove returns true')
      console.log(isWinningMove())
      showWinningMessage();
      gameboard.endGame();
      return;
    }
    if (moveCount < 9) {
      switchPlayer();
    }

  };

  // Clicking the reset button clears the board
  const resetButton = document.querySelector('.reset-button');
  resetButton.addEventListener('click', () => {
    console.log('reset');
    gameboard.reset();
    reset();
  });

  const reset = () => {
    // reset player 1
    player1NameDiv.classList.add('active-player');
    player1MessageDiv.textContent = 'Your Turn!'
    player1MessageDiv.classList.remove('hide-message');

    // reset player2
    player2NameDiv.classList.remove('active-player');
    player2MessageDiv.classList.add('hide-message');
    player2MessageDiv.textContent = 'Your Turn!'

    // reset game flow
    currentPlayer = player1;
    currentMoveSymbol = currentPlayer.getMoveSymbol();
    moveCount = 0;
  };

  return {
    move,
    reset,
    player1,
    player2,
    getCurrentPlayer,
    getCurrentMoveSymbol,
  };
})();

gameboard.reset();
gameboard.render();
