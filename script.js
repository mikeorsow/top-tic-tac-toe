// Gameboard Module
const gameboard = (() => {
  let _boardMoves = [];
  let _topRow = [];
  let _middleRow = [];
  let _bottomRow = [];

  const _gameboardDivs = document.querySelectorAll('.gameboard div');

  const _mouseEnterHandler = (e) => {
    e.target.textContent = gameFlow.getCurrentMoveSymbol();
    e.target.classList.add('hover-preview');
  };
  const _mouseLeaveHandler = (e) => {
    e.target.textContent = '';
    e.target.classList.remove('hover-preview');
  };

  // Clicking on a tic tac toe square triggers a 'move'
  const addClickListeners = () => {
    _gameboardDivs.forEach((div) => {
      div.addEventListener('click', gameFlow.move, { once: true });
      div.addEventListener('click', (e) => {
        e.target.removeEventListener('mouseenter', _mouseEnterHandler);
        e.target.removeEventListener('mouseleave', _mouseLeaveHandler);
        e.target.classList.remove('hover-preview');
      });
    });
  };

  // Hovering over a square displays the move you're about to make

  // Slice the moves into rows to more easily calculate winner (visually)
  const _getRows = () => {
    _topRow = _boardMoves.slice(0, 3);
    _middleRow = _boardMoves.slice(3, 6);
    _bottomRow = _boardMoves.slice(6, 9);
  };

  const getRowMoves = (rowIndex) => {
    _getRows();
    switch (rowIndex) {
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

  // Apply different color to winning moves to make it easier to see on the board
  const highlightMoves = (moves) => {
    moves.map((move) => {
      document.querySelector(`[data-index="${move}"]`).classList.add('winning');
    });
  };

  const _clearHighlightMoves = () => {
    _gameboardDivs.forEach((div) => {
      div.classList.remove('winning');
    });
  };

  const _addHoverListeners = () => {
    _gameboardDivs.forEach((div) => {
      div.addEventListener('mouseenter', _mouseEnterHandler);
      div.addEventListener('mouseleave', _mouseLeaveHandler);
    });
  };
  const reset = () => {
    _clearHighlightMoves();
    _boardMoves = [];
    render();
    // reset click listeners
    addClickListeners();
    _addHoverListeners();
  };

  const endGame = () => {
    _gameboardDivs.forEach((div) => {
      div.removeEventListener('click', gameFlow.move, { once: true });
      div.removeEventListener('mouseenter', _mouseEnterHandler);
      div.removeEventListener('mouseleave', _mouseLeaveHandler);
    });
  };

  return {
    addMove,
    reset,
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
const player = (name, moveSymbol) => {
  const getName = () => name;
  const getMoveSymbol = () => moveSymbol;
  const updateName = (newName) => {
    name = newName;
  };
  return {
    getName,
    getMoveSymbol,
    updateName,
  };
};

// Game Flow Module
const gameFlow = (() => {
  // Players
  let player1 = player('', 'x');
  let player2 = player('', 'o');

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

    const player1NameInput = document.querySelector('.player1>.player-name');
    const player1Message = document.querySelector('.player1>.player-message');
    const player2NameInput = document.querySelector('.player2>.player-name');
    const player2Message = document.querySelector('.player2>.player-message');
    const playerNames = document.querySelectorAll('.player-name');
    const playerMessages = document.querySelectorAll('.player-message');
    const resetButton = document.querySelector('.reset-button');

    // Update player name on blur
    player1NameInput.addEventListener('blur', () => {
      player1.updateName(player1NameInput.value);
    });
    player2NameInput.addEventListener('blur', () => {
      player2.updateName(player2NameInput.value);
    });

    const _getActivePlayerMessage = () => {
      return document.querySelector('.active-player').nextElementSibling;
    };

    // Hide one player message and show the other
    const toggleTurnMessage = () => {
      playerNames.forEach((player) => {
        player.classList.toggle('active-player');
      });
      playerMessages.forEach((player) => {
        player.classList.toggle('hide-message');
      });
    };

    const displayWinningMessage = () => {
      const message = _getActivePlayerMessage();
      message.classList.add('winning');
      message.textContent = 'You Win!';
      resetButton.textContent = 'PLAY AGAIN';
    };

    const displayTieMessage = () => {
      playerMessages.forEach((player) => {
        player.textContent = 'Tie!';
        player.classList.remove('hide-message');
      });
      playerNames.forEach((player) => player.classList.remove('active-player'));
    };

    const reset = () => {
      resetButton.textContent = 'RESET';
      // Hide Messages
      playerMessages.forEach((player) => {
        player.classList.add('hide-message');
      });
      player2Message.classList.add('hide-message');
      // Set Player 1 Active
      player1NameInput.classList.add('active-player');
      // Remove Active Player style
      player2NameInput.classList.remove('active-player');
      // Reset Message Text
      playerMessages.forEach((player) => {
        player.textContent = 'Your Turn!';
      });
      // Remove 'winning' green style from message
      _getActivePlayerMessage().classList.remove('winning');
      // Display Player 1 Message
      player1Message.classList.remove('hide-message');
    };

    return {
      toggleTurnMessage,
      displayWinningMessage,
      displayTieMessage,
      reset,
    };
  })();

  const switchPlayer = () => {
    if (currentPlayer === player1) {
      currentPlayer = player2;
    } else currentPlayer = player1;
    currentMoveSymbol = currentPlayer.getMoveSymbol();
    scoreboardController.toggleTurnMessage();
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
    // WinningMoves values are used to style the winning moves
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
    gameboard.addMove(index, currentMoveSymbol);
    ++moveCount;
    // Don't need to check for a winner until 5 moves
    if (moveCount >= 5) {
      if (isWinningMove()) {
        scoreboardController.displayWinningMessage();
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
      scoreboardController.displayTieMessage();
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
    scoreboardController.reset();
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
gameFlow.reset();
