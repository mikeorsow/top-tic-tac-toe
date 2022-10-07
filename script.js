// Gameboard Module
const gameboard = (() => {
  let _boardMoves = [];
  const _gameboardDivs = document.querySelectorAll('.gameboard div');

  // Clicking on a tic tac toe square triggers a 'move'
  const addClickListeners = (elements) => {
    elements.forEach((element) =>
      element.addEventListener(
        'click',
        (e) => {
          gameFlow.move(e.target.dataset.index);
        },
        { once: true }
      )
    );
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

  // Clicking the reset button clears the board
  const resetButton = document.querySelector('.reset-button');
  resetButton.addEventListener('click', reset);

  return {
    render,
    addMove,
    reset,
  };
})();

// Player Factory
const player = (name, moveType) => {
  const getName = () => name;
  const getMoveType = () => moveType;
  return {
    getName,
    getMoveType,
  };
};

// Game Flow Module
const gameFlow = (() => {
  // Players
  const player1 = player('James', 'x');
  const player2 = player('Laura', 'o');

  // Move Count
  let moveCount = 0;
  const nextMove = () => {
    moveCount++;
  };

  const getCurrentMoveType = () => {
    if (moveCount % 2 === 0) {
      return player1.getMoveType();
    }
    return player2.getMoveType();
  };

  const move = (boardIndex) => {
    gameboard.addMove(boardIndex, getCurrentMoveType());
    nextMove();
  };

  return {
    nextMove,
    move,
  };
})();

gameboard.reset();
gameboard.render();
