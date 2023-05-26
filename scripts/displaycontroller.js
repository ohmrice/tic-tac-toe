import { GameBoard } from './gameboard.js';

export const displayController = (() => {
    const render = () => {
        for (let i = 0; i < GameBoard.gameArray.length; i++) {
            for (let j = 0; j < GameBoard.gameArray[i].length; j++) {
                const cellMark = document.getElementById(`${i}-${j}`);
                cellMark.textContent = GameBoard.gameArray[i][j];  
            }
        }     
    }

    const displayGameStats = (player, isOngoing, statsText, winner = null) => {
        if (winner && !isOngoing) {
            statsText.textContent = `${winner} wins!`;
        } else if (!winner && !isOngoing){
            statsText.textContent = "It's a tie!";
        } else {
            statsText.textContent = `${player}'s turn:`;
        }
    }
    
    function infoToggle() {
        const infoContainer = document.querySelector('.info-container');
        const gameBoard = document.querySelector('.gameboard-container');
        infoContainer.style.display = "none";
        gameBoard.style.filter = "none";
    }
    return { render, displayGameStats, infoToggle };
})();
