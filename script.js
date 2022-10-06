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
  return {
    display,
    addMove,
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

gameboard.display();
