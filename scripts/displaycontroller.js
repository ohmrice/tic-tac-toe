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

    const displayWinner = (winnerName) => {
        console.log(`The winner is ${winnerName}!`);
    }
    return { render, displayWinner };
})();
