import { playerOne, playerTwo } from './player.js';
export { minimax, hasValidMoves, checkWin };

function checkWin(board) {
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
    if (result === null && !hasValidMoves(board)) {
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

function hasValidMoves(board) {
    return board.some(row => row.includes(null));
}

function minimax(boardState, depth, isMax) {
    let winResult = checkWin(boardState);        
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