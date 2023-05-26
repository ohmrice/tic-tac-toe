const Player = (name, marker) => {    
    return { name, marker };
};

let playerOne = Player('Player', 'X');
const playerTwo = Player('Computer', 'O');

export { playerOne, playerTwo };