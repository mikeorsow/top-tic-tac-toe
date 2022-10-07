// Gameboard Module
const gameboard = (() => {
  let _boardMoves = [];
  const _gameboardDivs = document.querySelectorAll('.gameboard div');
  const display = () =>
    _boardMoves.map(
      (playerMove, i) => (_gameboardDivs[i].textContent = playerMove)
    );
  const addMove = (index, value) => {
    _boardMoves[index] = value;
    display();
  };
  // Click listener to turn board clicks into moves
  _gameboardDivs.forEach((square) =>
    square.addEventListener('click', (e) => {
      gameFlow.move(e.target.dataset.index);
    })
  );
  return {
    display,
    addMove,
  };
})();

// Player Factory
const player = (name, moveType) => {
  const getName = () => name;
  const getMoveType = () => moveType;
  //   const move = (boardIndex) => {
  //     gameboard.addMove(boardIndex, moveType);
  //     gameFlow.nextMove;
  //   };
  return {
    getName,
    getMoveType,
  };
};

// Players

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

gameboard.display();
