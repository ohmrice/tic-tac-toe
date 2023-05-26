import { displayController } from './displaycontroller.js';
import { playerOne, playerTwo } from './player.js';

export const GameBoard = (() => {
    let _isSinglePlayer = true;
    let _currentPlayer = playerOne;
    let _otherPlayer;
    let _isOngoing = true;
    let _winner = null;

    const gameArray = [
        [null,null,null],
        [null,null,null],
        [null,null,null]
    ];
    //bind HTML elements
    const cells = document.querySelectorAll(".grid-button");
    const _resetBtn = document.getElementById('reset-button');
    const _infoBtn = document.getElementById('submit-name');
    const _statsText = document.getElementById('stats-text');
    //add event listeners
    cells.forEach((cell) => cell.addEventListener("click", () => {
        _playGame(cell);
    }));
    _resetBtn.addEventListener('click', _resetGame);
    _infoBtn.addEventListener('click', _submitName);
    
    function _submitName() {
        const playerName = document.getElementById('name-input');
        playerOne.name = playerName.value;
        displayController.infoToggle();
        _statsText.textContent = `${_currentPlayer.name}'s turn`;
    }

    function _playGame(cell) {
        if(_isSinglePlayer) {
            _currentPlayer = playerOne;
            _otherPlayer = playerTwo;
            _mark(playerOne, cell);
            _checkWin();
            if (_checkValidCells() && _isOngoing) {
                _disableValidCells();
                setTimeout(() => {
                    _computerTurn();
                    _checkWin();
                }, 1000);
            }
        } else {
            let _isTurn = true;
            _checkTurn(cell, _isTurn);
            _checkWin();
        }
    }

    function _checkTurn(cell, isTurn) {
        if (isTurn) {
            _currentPlayer = playerOne;
            isTurn = false;
        } else {
            _currentPlayer = playerTwo;
            isTurn = true;
        }
        _mark(cell, _currentPlayer);
    }

    function _checkValidCells() {
        return gameArray.some(row => row.includes(null));
    }

    function _disableValidCells() {
        const validCells = document.querySelectorAll(".valid-move");
        validCells.forEach((cell) => cell.disabled = true);
    }

    function _enableValidCells() {
        const validCells = document.querySelectorAll(".valid-move");
        validCells.forEach((cell) => cell.disabled = false);
    }

    function _checkWin() {
        //check if there are any winning patterns
        if (_checkRows() || _checkColumns() || _checkDiagonals()) {
            _winner = _currentPlayer.name;
            _gameOver();
            _disableValidCells();
        } else if (!_checkValidCells()) {
            //all cells are filled and there is no winner
            _gameOver();
        }
            displayController.displayGameStats(_otherPlayer.name, _isOngoing, _statsText, _winner);

        function _checkRows() {
            for (let i = 0; i < gameArray.length; i++) {
                for (let j = 0; j < gameArray[i].length; j++) {
                    if (gameArray[i][j]) {
                        if (j+1 < gameArray.length && j+2 < gameArray.length) {
                            if (gameArray[i][j] === gameArray[i][j+1] && gameArray[i][j] === gameArray[i][j+2]) {                         
                                return true;
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
                                return true;
                            }
                        }
                    }
                }
            }
        }

        function _checkDiagonals() {
            if ((gameArray[0][0] === gameArray[1][1] && gameArray[1][1] === gameArray[2][2] && gameArray[0][0] !== null)
            || (gameArray[0][2] === gameArray[1][1] && gameArray[1][1] === gameArray[2][0] && gameArray[0][2] !== null)) {
                return true;
            }
        }
    }    

    function _mark(player, cell) {
        let i = parseInt(cell.id[0]);
        let j = parseInt(cell.id[2]);
        const marker = player.marker;
            
        gameArray[i][j] = marker;
        displayController.render();
        cell.classList.remove('valid-move');
        cell.disabled = true;
    }

    function _computerTurn() {
        let randomI = 0;
        let randomJ = 0;
        _currentPlayer = playerTwo;
        _otherPlayer = playerOne;
        do {
            randomI = Math.floor(Math.random() * 3);
            randomJ = Math.floor(Math.random() * 3);
        } while (gameArray[randomI][randomJ]);
        const cell = document.getElementById(`${randomI}-${randomJ}`);
        _mark(_currentPlayer, cell);
        _enableValidCells();
    }

    function _gameOver() {
        _resetBtn.style.visibility = 'visible';
        _isOngoing = false;
    }

    function _resetGame() {
        //reset all array values
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
        _isOngoing = true;
        _winner = null;
        _statsText.textContent = `${_currentPlayer.name}'s turn`;
        _resetBtn.style.visibility = 'hidden';
    }
    return { gameArray };
})();




