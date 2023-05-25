import { displayController } from './displaycontroller.js';
import { playerOne, playerTwo } from './player.js';

export const GameBoard = (() => {
    const gameArray = [
        [null,null,null],
        [null,null,null],
        [null,null,null]
    ];

    const cells = document.querySelectorAll(".grid-button");
    let isTurn = true;

    const mark = (cell, player) => {
    const marker = player.getMarker();
    console.log(cell.id);
    let i = parseInt(cell.id[0]);
    let j = parseInt(cell.id[2]);
    gameArray[i][j] = marker;
    console.table(gameArray);
    cell.classList.remove("valid-move");
    displayController.render();
    cell.disabled = true; 
    }
    
    cells.forEach((cell) => cell.addEventListener("click", () => {
        if (isTurn) {
            mark(cell, playerOne);
            isTurn = false;
        } else {
            mark(cell, playerTwo);
            isTurn = true;
        }
        
    }));
    return { gameArray };
})();




