import { GameBoard } from './gameboard.js';
import { playerOne, playerTwo } from './player.js';

export const displayController = (() => {
    const _infoBtn = document.getElementById('submit-name');
    const _statsText = document.getElementById('stats-text');
    const _resetBtn = document.getElementById('reset-button');
    _resetBtn.addEventListener('click', _resetGame);
    _infoBtn.addEventListener('click', _submitInfo);

    const render = () => {
        for (let i = 0; i < GameBoard.gameArray.length; i++) {
            for (let j = 0; j < GameBoard.gameArray[i].length; j++) {
                const cellMark = document.getElementById(`${i}-${j}`);
                cellMark.textContent = GameBoard.gameArray[i][j];  
            }
        }     
    }

    const displayGameStats = (player, isOngoing, winner = null) => {
        if (winner && !isOngoing) {
            _statsText.textContent = `${winner} wins!`;
        } else if (!winner && !isOngoing){
            _statsText.textContent = "It's a tie!";
        } else {
            _statsText.textContent = `${player}'s turn:`;
        }
    }
    
    function infoToggle() {
        const infoContainer = document.querySelector('.info-container');
        const gameBoard = document.querySelector('.gameboard-container');
        infoContainer.style.display = "none";
        gameBoard.style.filter = "none";
    }

    function _submitInfo() {
        const playerName = document.getElementById('name-input');
        const difficulty = document.querySelector('input[name="difficulty"]:checked').value;
        playerOne.name = playerName.value;
        GameBoard.setDifficulty(difficulty);
        infoToggle();
        _statsText.textContent = `${GameBoard.currentPlayer.name}'s turn`;
        
    }

    function _resetGame() {
        GameBoard.resetValues();
        render();
        _statsText.textContent = `${GameBoard.currentPlayer.name}'s turn`;
        _resetBtn.style.visibility = 'hidden';
    }
    
    function resetButton() {
        _resetBtn.style.visibility = 'visible';
    }
    return { render, displayGameStats, infoToggle, resetButton };
})();
