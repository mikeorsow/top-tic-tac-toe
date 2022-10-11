// Gameboard Module
const gameboard = (() => {
  let _boardMoves = [];
  let _topRow = [];
  let _middleRow = [];
  let _bottomRow = [];

  const _gameboardDivs = document.querySelectorAll('.gameboard div');

  // Clicking on a tic tac toe square triggers a 'move'
  const addClickListeners = (elements) => {
    elements.forEach((element) => {
      element.addEventListener('click', gameFlow.move, { once: true });
    });
  };

  // Slice the moves into rows to more easily calculate winner (visually)
  const _getRows = () => {
    _topRow = _boardMoves.slice(0, 3);
    _middleRow = _boardMoves.slice(3, 6);
    _bottomRow = _boardMoves.slice(6, 9);
  };

  const getRowMoves = (rowNumber) => {
    _getRows();
    switch (rowNumber) {
      case 0:
        return _topRow;
      case 1:
        return _middleRow;
      case 2:
        return _bottomRow;
    }
  };

  const getColumnMoves = (columnNumber) => {
    _getRows();
    const column = [
      _topRow[columnNumber],
      _middleRow[columnNumber],
      _bottomRow[columnNumber],
    ];
    return column;
  };

  const getDiagonalTopLeft = () => {
    _getRows();
    return [_topRow[0], _middleRow[1], _bottomRow[2]];
  };
  const getDiagonalTopRight = () => {
    _getRows();
    return [_topRow[2], _middleRow[1], _bottomRow[0]];
  };

  // Renders the current game moves onto the board
  const render = () => {
    Array.from(_gameboardDivs).map((div, index) => {
      div.textContent = _boardMoves[index];
    });
  };

  const addMove = (index, symbol) => {
    _boardMoves[index] = symbol;
    render();
  };

  const highlightMoves = (moves) => {
    moves.map((move) => {
      document.querySelector(`[data-index="${move}"]`).classList.add('winning');
    });
  };

  const clearHighlightMoves = () => {
    _gameboardDivs.forEach((div) => {
      div.classList.remove('winning');
    });
  };

  const getBoardMoves = () => _boardMoves;

  const reset = () => {
    clearHighlightMoves();
    _boardMoves = [];
    render();
    // reset click listeners
    addClickListeners(_gameboardDivs);
  };

  const endGame = () => {
    _gameboardDivs.forEach((element) => {
      element.removeEventListener('click', gameFlow.move, { once: true });
    });
  };

  return {
    render,
    addMove,
    reset,
    getBoardMoves,
    endGame,
    getColumnMoves,
    getRowMoves,
    getDiagonalTopLeft,
    getDiagonalTopRight,
    highlightMoves,
  };
})();
// End Gameboard Module

// Player Factory
const player = (name, moveSymbol, moveHistory) => {
  const getName = () => name;
  const getMoveSymbol = () => moveSymbol;
  const updateName = (newName) => {
    name = newName;
  };
  const getMoveHistory = () => moveHistory;
  const addMove = (boardIndex) => moveHistory.push(boardIndex);

  return {
    getName,
    getMoveSymbol,
    updateName,
    getMoveHistory,
    addMove,
  };
};

//

// Game Flow Module
const gameFlow = (() => {
  // Players
  let player1 = player('James', 'x', []);
  let player2 = player('Laura', 'o', []);

  let currentPlayer = player1;
  let currentMoveSymbol = currentPlayer.getMoveSymbol();
  let moveCount = 0;
  let winningMoves = [];

  const getCurrentPlayer = () => currentPlayer;
  const getCurrentMoveSymbol = () => currentPlayer.getMoveSymbol();

  const scoreboardController = (() => {
    // Set cursor into player 1 name input field on page load
    window.addEventListener('load', () => {
      player1NameInput.focus();
    });
    const player1MessageDiv = document.querySelector(
      '.player1>.player-message'
    );
    const player2MessageDiv = document.querySelector(
      '.player2>.player-message'
    );
    const player1NameInput = document.querySelector('.player1>.player-name');
    const player2NameInput = document.querySelector('.player2>.player-name');

    const hidePlayerMessage = (player) => {
      if (player === player1) {
        player1NameInput.classList.remove('active-player');
        player1MessageDiv.classList.add('hide-message');
        return;
      }
      player2NameInput.classList.remove('active-player');
      player2MessageDiv.classList.add('hide-message');
    };

    const showPlayerMessage = (player, message, hideOtherPlayerMessage) => {
      if (player === player1) {
        player1MessageDiv.textContent = message;
        player1NameInput.classList.add('active-player');
        player1MessageDiv.classList.remove('hide-message');
        if (hideOtherPlayerMessage) {
          hidePlayerMessage(player2);
        }
        return;
      }
      player2MessageDiv.textContent = message;
      player2NameInput.classList.add('active-player');
      player2MessageDiv.classList.remove('hide-message');
      if (hideOtherPlayerMessage) {
        hidePlayerMessage(player1);
      }
    };

    const showWinningMessage = () => {
      showPlayerMessage(currentPlayer, 'You Win!', true);
    };
    return { showPlayerMessage, showWinningMessage };
  })();

  const switchPlayer = () => {
    if (currentPlayer === player1) {
      currentPlayer = player2;
    } else currentPlayer = player1;
    currentMoveSymbol = currentPlayer.getMoveSymbol();
    scoreboardController.showPlayerMessage(currentPlayer, 'Your Turn!', true);
  };

  const isWinningMove = () => {
    let isWinner = false;
    const isThreeInARow = (arr) => {
      return (
        arr.filter((move) => move === currentPlayer.getMoveSymbol()).length ===
        3
      );
    };
    // See if there is a winning move on the board
    switch (true) {
      case isThreeInARow(gameboard.getRowMoves(0)):
        winningMoves = [0, 1, 2];
        return (isWinner = true);
      case isThreeInARow(gameboard.getRowMoves(1)):
        winningMoves = [3, 4, 5];
        return (isWinner = true);
      case isThreeInARow(gameboard.getRowMoves(2)):
        winningMoves = [6, 7, 8];
        return (isWinner = true);
      case isThreeInARow(gameboard.getColumnMoves(0)):
        winningMoves = [0, 3, 6];
        return (isWinner = true);
      case isThreeInARow(gameboard.getColumnMoves(1)):
        winningMoves = [1, 4, 7];
        return (isWinner = true);
      case isThreeInARow(gameboard.getColumnMoves(2)):
        winningMoves = [2, 5, 8];
        return (isWinner = true);
      case isThreeInARow(gameboard.getDiagonalTopLeft()):
        winningMoves = [0, 4, 8];
        return (isWinner = true);
      case isThreeInARow(gameboard.getDiagonalTopRight()):
        winningMoves = [2, 4, 6];
        return (isWinner = true);
    }
    return isWinner;
  };

  const move = (e) => {
    const index = e.target.dataset.index;
    currentPlayer.addMove(index);
    gameboard.addMove(index, currentMoveSymbol);
    ++moveCount;
    // Don't need to check for a winner until 5 moves
    if (moveCount >= 5) {
      if (isWinningMove()) {
        scoreboardController.showWinningMessage();
        gameboard.highlightMoves(winningMoves);
        gameboard.endGame();
        return;
      }
    }
    if (moveCount < 9) {
      switchPlayer();
      return;
    }
    if (moveCount === 9) {
      scoreboardController.showPlayerMessage(player1, `Tie!`, false);
      scoreboardController.showPlayerMessage(player2, `Tie!`, false);
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
    scoreboardController.showPlayerMessage(player1, 'Your Turn!', true);

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
gameFlow.reset();
