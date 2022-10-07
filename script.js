// Gameboard Module
const gameboard = (() => {
  let _boardMoves = [];
  const _gameboardDivs = document.querySelectorAll('.gameboard div');

  // Clicking on a tic tac toe square triggers a 'move'
  const addClickListeners = (elements) => {
    elements.forEach((element) => {
      element.addEventListener('click', gameFlow.move, {once: true});
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
    gameFlow.reset();
  };

  return {
    render,
    addMove,
    reset,
  };
})();

// Player Factory
const player = (name, moveSymbol) => {
  const getName = () => name;
  const getMoveSymbol = () => moveSymbol;
  return {
    getName,
    getMoveSymbol,
  };
};

// Game Flow Module
const gameFlow = (() => {
  // Players
  let player1 = player('James', 'x');
  let player2 = player('Laura', 'o');

  let currentPlayer = player1;

  const nextPlayer = () => {
    if (currentPlayer === player1) {
      console.log('next player is player2');
      return (currentPlayer = player2);
    }
    console.log('next player is player1');
    return (currentPlayer = player1);
  };

  const move = (e) => {
    const boardIndex = e.target.dataset.index;
    console.log('move called');
    gameboard.addMove(boardIndex, currentPlayer.getMoveSymbol());
    nextPlayer();
  };

  // Clicking the reset button clears the board
  const resetButton = document.querySelector('.reset-button');
  resetButton.addEventListener('click', () => {
    console.log('reset');
    gameboard.reset();
  });

  const reset = () => {
    currentPlayer = player1;
  };

  return {
    move,
    reset,
  };
})();

gameboard.reset();
gameboard.render();
