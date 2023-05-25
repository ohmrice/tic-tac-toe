const Player = (name, marker) => {    
    return { name, marker };
};

const playerOne = Player('Billy', 'X');
const playerTwo = Player('Goat', 'O');

export { playerOne, playerTwo };