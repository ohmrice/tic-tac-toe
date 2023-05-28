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
            if (_checkWin(gameArray) === 'X') {
                _gameOver();
                displayController.displayGameStats(_otherPlayer.name, _isOngoing, _statsText, _currentPlayer.name);
            } else if (_checkWin(gameArray) === 'tie'){
                _gameOver();
                displayController.displayGameStats(_otherPlayer.name, _isOngoing, _statsText);
            } else {
                displayController.displayGameStats(_otherPlayer.name, _isOngoing, _statsText);
            };
            if (_hasValidMoves(gameArray) && _isOngoing) {
                _disableValidCells();
                setTimeout(() => {
                    _computerTurn();
                    if (_checkWin(gameArray) === 'O') {
                        _gameOver();
                        displayController.displayGameStats(_otherPlayer.name, _isOngoing, _statsText, _currentPlayer.name);
                    } else if (_checkWin(gameArray) === 'tie'){
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

    function _hasValidMoves(board) {
        return board.some(row => row.includes(null));
    }

    function _disableValidCells() {
        const validCells = document.querySelectorAll(".valid-move");
        validCells.forEach((cell) => cell.disabled = true);
    }

    function _enableValidCells() {
        const validCells = document.querySelectorAll(".valid-move");
        validCells.forEach((cell) => cell.disabled = false);
    }

    function _checkWin(board) {
        let result = null;
        /* ---CHECK ROWS---
        first check if cell has a marker
        then for all rows,
        check if all cells in the row are the same marker */
        for (let i = 0; i < 3; i++) {
            
            if (board[i][0]
                && board[i][0] === board[i][1]
                && board[i][1] === board[i][2]) {
                    result = (_getScore(board[i][0]));
                }
        }
        /* ---CHECK COLUMNS---
        first check if cell has a marker
        then for all columns,
        check if all cells in the column are the same marker */
        for (let j = 0; j < 3; j++) {
        
            if (board[0][j]
                && board[0][j] === board[1][j]
                && board[1][j] === board[2][j]) {
                    result = (_getScore(board[0][j]));
            }
        }
        /* ---CHECK DIAGONALS---
        first check if cell has a marker
        then check for diagonal patterns
        */
        if ((board[0][0]
            && board[0][0] === board[1][1]
            && board[1][1] === board[2][2])) {
                result = (_getScore(board[0][0]));
            }
        if ((board[0][2]
            && board[0][2] === board[1][1]
            && board[1][1] === board[2][0])) {
                result = (_getScore(board[0][2]));
        }
        //if there is no winning pattern, return tie
        if (result === null && !_hasValidMoves(board)) {
            return 'tie';
        } else {
            return result;
        }
        

        function _getScore(cell) {
            /* get the value of score
            depending on the value of current player's marker */
            if (cell === 'X') {
                return 'X';
            } else {
                return 'O';
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
        _currentPlayer = playerTwo;
        _otherPlayer = playerOne;

        let best = Infinity;
        let bestMove = {
            row: -1,
            col: -1,
        }
        /*  find empty cells
            and find best move for AI
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

    function minimax(boardState, depth, isMax) {
        let winResult = _checkWin(boardState);        
        //if either player wins, return score
        if (winResult === 'X') {
            return 10;
        } else if (winResult === 'O') {
            return -10;
        }
        if (winResult === 'tie') {
            return 0;
        }
        //check if it's X's turn (maximizer)
        if (isMax) {
            let bestScore = -Infinity;
          //  let cellIndices = _findAvailableCell(playerOne.marker);
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (boardState[i][j] === null) {
                        boardState[i][j] = playerOne.marker;
                        bestScore = Math.max(bestScore,
                            minimax(boardState, depth + 1, false));
                        boardState[i][j] = null;
                    } 
                }
            }        
            return bestScore - depth;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (boardState[i][j] === null) {
                        boardState[i][j] = playerTwo.marker;
                        bestScore = Math.min(bestScore,
                            minimax(boardState, depth + 1, true));
                        boardState[i][j] = null;
                    } 
                }
            }        
            return bestScore + depth;
        }
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
        _winner = null;
        _currentPlayer = playerOne;
        _statsText.textContent = `${_currentPlayer.name}'s turn`;
        _resetBtn.style.visibility = 'hidden';
    }
    return { gameArray };
})();




