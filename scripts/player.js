const Player = (name, marker) => {
    const getName = () => name;
    const getMarker = () => marker;
    
    return { getName, getMarker };
};

const playerOne = Player('Player X', 'X');
const playerTwo = Player('Player O', 'O');

export { playerOne, playerTwo };