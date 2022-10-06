const gameboard = ['x','o','x','o','x','o','x','o','x']

const gameboardDivs = document.querySelectorAll('.gameboard div');

gameboard.map((playerMove, i) => gameboardDivs[i].textContent = playerMove);
