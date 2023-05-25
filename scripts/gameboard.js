import { displayController } from './displaycontroller.js';
import { playerOne, playerTwo } from './player.js';

export const GameBoard = (() => {

    let _isTurn = true;
    let _currentPlayer;

    const gameArray = [
        [null,null,null],
        [null,null,null],
        [null,null,null]
    ];
    //bind grid elements
    const cells = document.querySelectorAll(".grid-button");
    cells.forEach((cell) => cell.addEventListener("click", () => {
        _checkTurn(cell);
        cell.classList.remove('valid-move');
        _checkWin();
    }));
    const resetBtn = document.getElementById('reset-button');
    resetBtn.addEventListener('click', _resetGame);
    
    function _checkTurn(cell) {
        if (_isTurn) {
            _currentPlayer = playerOne;
            _isTurn = false;
        } else {
            _currentPlayer = playerTwo;
            _isTurn = true;
        }
        _mark(cell, _currentPlayer);
    }

    function _checkWin() {
        let validPattern = false;
        if (_checkRows() || _checkColumns() || _checkDiagonals()) {
            displayController.displayWinner(_currentPlayer.name);
            resetBtn.style.visibility = 'visible';
            const validCells = document.querySelectorAll(".valid-move");
            validCells.forEach((cell) => cell.disabled = true);
            return true;
        } else {
            return false;
        }

        function _checkRows() {
            for (let i = 0; i < gameArray.length; i++) {
                for (let j = 0; j < gameArray[i].length; j++) {
                    if (gameArray[i][j]) {
                        if (j+1 < gameArray.length && j+2 < gameArray.length) {
                            if (gameArray[i][j] === gameArray[i][j+1] && gameArray[i][j] === gameArray[i][j+2]) {
                                validPattern = true;
                                return validPattern;
                            }
                        }
                    }
                }
            }
        }

        function _checkColumns() {
            for (let i = 0; i < gameArray.length; i++) {
                for (let j = 0; j < gameArray[i].length; j++) {
                    if (gameArray[i][j]) {
                        if (i+1 < gameArray.length && i+2 < gameArray.length) {
                            if (gameArray[i][j] === gameArray[i+1][j] && gameArray[i+2][j] === gameArray[i][j]) {
                                validPattern = true;
                                return validPattern;
                            }
                        }
                    }
                }
            }
        }

        function _checkDiagonals() {
            if ((gameArray[0][0] === gameArray[1][1] && gameArray[1][1] === gameArray[2][2] && gameArray[0][0] !== null)
            || (gameArray[0][2] === gameArray[1][1] && gameArray[1][1] === gameArray[2][0] && gameArray[0][2] !== null)) {
                validPattern = true;
                return validPattern;
            }
        }
    }    

    function _mark(cell, player) {
        const marker = player.marker;
        let i = parseInt(cell.id[0]);
        let j = parseInt(cell.id[2]);
        gameArray[i][j] = marker;
        displayController.render();
        cell.disabled = true; 
    }

    function _resetGame() {
        _resetValues();
        resetBtn.style.visibility = 'hidden';
    }

    function _resetValues() {
        for (let i = 0; i < GameBoard.gameArray.length; i++) {
            for (let j = 0; j < GameBoard.gameArray[i].length; j++) {
                gameArray[i][j] = null;  
            }
        }
        displayController.render();
        cells.forEach((cell) => {
            cell.disabled = false;
            cell.classList.add('valid-move');
        });
        _isTurn = true;
    }
    return { gameArray };
})();




