const gameBoard = document.querySelector('.game-board');
const cells = document.querySelectorAll('.cell');
const restartButton = document.getElementById('restart-button');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const checkWin = (board) => {
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return true;
        }
    }
    return false;
};

const checkDraw = (board) => {
    return board.every(cell => cell !== '');
};

const evaluate = (board) => {
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (board[a] === 'O' && board[b] === 'O' && board[c] === 'O') {
            return 10;
        } else if (board[a] === 'X' && board[b] === 'X' && board[c] === 'X') {
            return -10;
        }
    }
    return 0;
};

const minimax = (newBoard, depth, isMaximizingPlayer) => {
    const score = evaluate(newBoard);

    if (score === 10) return score - depth;
    if (score === -10) return score + depth;
    if (checkDraw(newBoard)) return 0;

    if (isMaximizingPlayer) {
        let best = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (newBoard[i] === '') {
                newBoard[i] = 'O';
                best = Math.max(best, minimax(newBoard, depth + 1, false));
                newBoard[i] = '';
            }
        }
        return best;
    } else {
        let best = Infinity;
        for (let i = 0; i < 9; i++) {
            if (newBoard[i] === '') {
                newBoard[i] = 'X';
                best = Math.min(best, minimax(newBoard, depth + 1, true));
                newBoard[i] = '';
            }
        }
        return best;
    }
};

const findBestMove = (board) => {
    let bestVal = -Infinity;
    let bestMove = -1;

    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = 'O';
            const moveVal = minimax(board, 0, false);
            board[i] = '';
            if (moveVal > bestVal) {
                bestMove = i;
                bestVal = moveVal;
            }
        }
    }
    return bestMove;
};

const aiMove = () => {
    const bestMove = findBestMove(board);
    board[bestMove] = 'O';
    cells[bestMove].innerText = 'O';
    if (checkWin(board)) {
        alert('AI wins!');
        gameActive = false;
        return;
    }
    if (checkDraw(board)) {
        alert('Draw!');
        gameActive = false;
        return;
    }
    currentPlayer = 'X';
};

const handleCellClick = (e) => {
    const index = e.target.getAttribute('data-index');
    if (board[index] !== '' || !gameActive) {
        return;
    }
    board[index] = currentPlayer;
    e.target.innerText = currentPlayer;

    if (checkWin(board)) {
        alert(`${currentPlayer} wins!`);
        gameActive = false;
        return;
    }
    if (checkDraw(board)) {
        alert('Draw!');
        gameActive = false;
        return;
    }

    currentPlayer = 'O';
    setTimeout(aiMove, 500);
};

const restartGame = () => {
    board = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => cell.innerText = '');
    currentPlayer = 'X';
    gameActive = true;
};

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', restartGame);
