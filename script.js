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
    console.log('checkWinner called');

    const topRow = _boardMoves.slice(0, 3);
    const middleRow = _boardMoves.slice(3, 6);
    const bottomRow = _boardMoves.slice(6, 9);

    const getColumnMoves = (index) => {
      const column = [topRow[index], middleRow[index], bottomRow[index]];
      return column;
    };

    const column1 = getColumnMoves(0);
    const column2 = getColumnMoves(1);
    const column3 = getColumnMoves(2);

    const diagonalTopLeft = [topRow[0], middleRow[1], bottomRow[2]];
    const diagonalTopRight = [topRow[2], middleRow[1], bottomRow[0]];

    let winnerFound = false;
    
    const youWinMessage = () => {
      winnerFound = true;
      console.log('Winner!!!!');
      _gameboardDivs.forEach((element) => {
        element.removeEventListener('click', gameFlow.move, { once: true });
      });
    };
    const isThreeInARow = (arr) => {
      return arr.filter((move) => move === currentMoveSymbol).length === 3;
    };
    const isTie = () => {
      console.log(moveCount);
      if (moveCount === 9 && winnerFound === false) {
        return console.log(`It's a tie!!!!!`);
      }
    };

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
      default:
        console.log(topRow);
        console.log(middleRow);
        console.log(bottomRow);
        isTie();
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

  const nextPlayer = () => {
    if (currentPlayer === player1) {
      console.log('next player is player2');
      return (currentPlayer = player2);
    }
    console.log('next player is player1');
    return (currentPlayer = player1);
  };

  const move = (e) => {
    const currentMoveSymbol = currentPlayer.getMoveSymbol();
    const boardIndex = e.target.dataset.index;
    console.log('move called');
    gameboard.addMove(boardIndex, currentMoveSymbol);
    nextPlayer();
    ++moveCount;
    // Don't check for winner until it's even possible to win (5 moves min.)
    // if (moveCount >= 5) {
    //   gameboard.checkWinner(currentMoveSymbol);
    // }
    gameboard.checkWinner(currentMoveSymbol, moveCount);
  };

  // Clicking the reset button clears the board
  const resetButton = document.querySelector('.reset-button');
  resetButton.addEventListener('click', () => {
    console.log('reset');
    gameboard.reset();
    reset();
  });

  const reset = () => {
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
