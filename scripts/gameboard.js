import { displayController } from './displaycontroller.js';
import { playerOne, playerTwo } from './player.js';
import { minimax, hasValidMoves, checkWin } from './minimax.js';

export const GameBoard = (() => {
    let _isSinglePlayer = true;
    let _currentPlayer = playerOne;
    let _otherPlayer;
    let _isOngoing = true;

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
            if (checkWin(gameArray) === 'X') {
                _gameOver();
                displayController.displayGameStats(_otherPlayer.name, _isOngoing, _statsText, _currentPlayer.name);
            } else if (checkWin(gameArray) === 'tie'){
                _gameOver();
                displayController.displayGameStats(_otherPlayer.name, _isOngoing, _statsText);
            } else {
                displayController.displayGameStats(_otherPlayer.name, _isOngoing, _statsText);
            };
            if (hasValidMoves(gameArray) && _isOngoing) {
                _disableValidCells();
                setTimeout(() => {
                    _computerTurn();
                    if (checkWin(gameArray) === 'O') {
                        _gameOver();
                        displayController.displayGameStats(_otherPlayer.name, _isOngoing, _statsText, _currentPlayer.name);
                    } else if (checkWin(gameArray) === 'tie'){
                        _gameOver();
                        displayController.displayGameStats(_otherPlayer.name, _isOngoing, _statsText);
                    } else {
                        displayController.displayGameStats(_otherPlayer.name, _isOngoing, _statsText);
                    }
                }, 1000);
            }
        } else {
            let _isTurn = true;
            _checkTurn(cell, _isTurn);
            checkWin();
        }
    }
    //for two human players
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

    function _disableValidCells() {
        const validCells = document.querySelectorAll(".valid-move");
        validCells.forEach((cell) => cell.disabled = true);
    }

    function _enableValidCells() {
        const validCells = document.querySelectorAll(".valid-move");
        validCells.forEach((cell) => cell.disabled = false);
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
        _currentPlayer = playerTwo;
        _otherPlayer = playerOne;

        let best = Infinity;
        let bestMove = {
            row: -1,
            col: -1,
        }
        /*  find empty cells and find best move for AI
            using the minimax function
        */
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (gameArray[i][j] === null) {
                    //mark the board to set board state
                    gameArray[i][j] = _currentPlayer.marker;
                    //pass the current state of the board be evaluated by minimax function
                    let currentMove = minimax(gameArray, 0, true);
                    //undo the state
                    gameArray[i][j] = null;
                    //check if the move value is better than best value
                    if (currentMove < best) {
                        bestMove.row = i;
                        bestMove.col = j;
                        best = currentMove;
                    }
                }
            }
        }
        const cell = document.getElementById(`${bestMove.row}-${bestMove.col}`);
        _mark(_currentPlayer, cell);
        _enableValidCells();
    
        /*  let randomI = 0;
            let randomJ = 0;
            do {
                randomI = Math.floor(Math.random() * 3);
                randomJ = Math.floor(Math.random() * 3);
            } while (gameArray[randomI][randomJ]);
            const cell = document.getElementById(`${randomI}-${randomJ}`);
            _mark(_currentPlayer, cell);
            _enableValidCells(); */
    }

    function _gameOver() {
        _disableValidCells();
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
        _currentPlayer = playerOne;
        _statsText.textContent = `${_currentPlayer.name}'s turn`;
        _resetBtn.style.visibility = 'hidden';
    }
    return { gameArray };
})();




