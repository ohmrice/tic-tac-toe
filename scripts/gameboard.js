import { displayController } from './displaycontroller.js';
import { playerOne, playerTwo } from './player.js';
import { minimax, hasValidMoves, checkWin } from './minimax.js';

export const GameBoard = (() => {
    let _isSinglePlayer = true;
    let currentPlayer = playerOne;
    let _otherPlayer;
    let isOngoing = true;

    const gameArray = [
        [null,null,null],
        [null,null,null],
        [null,null,null]
    ];
    //bind HTML elements
    const cells = document.querySelectorAll(".grid-button");
    
    //add event listeners
    cells.forEach((cell) => cell.addEventListener("click", () => {
        _playGame(cell);
    }));

    function _playGame(cell) {
        if(_isSinglePlayer) {
            currentPlayer = playerOne;
            _otherPlayer = playerTwo;
            _mark(playerOne, cell);
            if (checkWin(gameArray) === playerOne.marker) {
                gameOver();
                displayController.displayGameStats(_otherPlayer.name, isOngoing, currentPlayer.name);
            } else if (checkWin(gameArray) === 'tie'){
                gameOver();
                displayController.displayGameStats(_otherPlayer.name, isOngoing);
            } else {
                displayController.displayGameStats(_otherPlayer.name, isOngoing);
            };
            if (hasValidMoves && isOngoing) {
                disableValidCells();
                setTimeout(() => {
                    _computerTurn();
                    if (checkWin(gameArray) === playerTwo.marker) {
                        gameOver();
                        displayController.displayGameStats(_otherPlayer.name, isOngoing, currentPlayer.name);
                    } else if (checkWin(gameArray) === 'tie'){
                        gameOver();
                        displayController.displayGameStats(_otherPlayer.name, isOngoing);
                    } else {
                        displayController.displayGameStats(_otherPlayer.name, isOngoing);
                    }
                }, 1200);
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
            currentPlayer = playerOne;
            isTurn = false;
        } else {
            currentPlayer = playerTwo;
            isTurn = true;
        }
        _mark(cell, currentPlayer);
    }

    function disableValidCells() {
        const validCells = document.querySelectorAll(".valid-move");
        validCells.forEach((cell) => cell.disabled = true);
    }

    function _enableValidCells() {
        const validCells = document.querySelectorAll(".valid-move");
        validCells.forEach((cell) => cell.disabled = false);
    }
    
    function gameOver() {
        disableValidCells();
        displayController.resetButton();
        isOngoing = false;
    }

    function resetValues() {
        //reset all array values
        for (let i = 0; i < gameArray.length; i++) {
            for (let j = 0; j < gameArray[i].length; j++) {
                gameArray[i][j] = null;  
            }
        }
        
        cells.forEach((cell) => {
            cell.disabled = false;
            cell.classList.add('valid-move');
        });
        isOngoing = true;
        currentPlayer = playerOne;
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
        currentPlayer = playerTwo;
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
                    gameArray[i][j] = currentPlayer.marker;
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
        _mark(currentPlayer, cell);
        _enableValidCells();
    
        /*  let randomI = 0;
            let randomJ = 0;
            do {
                randomI = Math.floor(Math.random() * 3);
                randomJ = Math.floor(Math.random() * 3);
            } while (gameArray[randomI][randomJ]);
            const cell = document.getElementById(`${randomI}-${randomJ}`);
            _mark(currentPlayer, cell);
            _enableValidCells(); */
    }
    return { gameArray, currentPlayer, resetValues };
})();




