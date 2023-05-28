const Player = (name, marker) => {    
    return { name, marker };
};

let playerOne = Player('Player', 'X');
const playerTwo = Player('Buddy Boy', 'O');

export { playerOne, playerTwo };