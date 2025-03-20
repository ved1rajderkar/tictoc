let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;

function playerMove(index) {
    if (board[index] === "" && gameActive && currentPlayer === "X") {
        board[index] = "X";
        document.getElementsByClassName("cell")[index].innerText = "X";

        if (checkWinner()) {
            document.getElementById("status").innerText = "You Win! 🎉";
            gameActive = false;
            return;
        }

        currentPlayer = "O";
        document.getElementById("status").innerText = "Computer's Turn...";
        
        setTimeout(computerMove, 500);
    }
}

function computerMove() {
    if (!gameActive) return;

    let difficulty = document.getElementById("difficulty").value;
    let moveIndex;

    if (difficulty === "easy") {
        moveIndex = easyAI();
    } else if (difficulty === "medium") {
        moveIndex = mediumAI();
    } else {
        moveIndex = hardAI();
    }

    if (moveIndex !== -1) {
        board[moveIndex] = "O";
        document.getElementsByClassName("cell")[moveIndex].innerText = "O";

        if (checkWinner()) {
            document.getElementById("status").innerText = "Computer Wins! 🤖";
            gameActive = false;
            return;
        }

        currentPlayer = "X";
        document.getElementById("status").innerText = "Your Turn!";
    }
}

function easyAI() {
    let emptyCells = board.map((val, index) => (val === "" ? index : null)).filter(val => val !== null);
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function mediumAI() {
    return Math.random() > 0.5 ? hardAI() : easyAI();
}

function hardAI() {
    let bestMove = -1;
    let bestScore = -Infinity;

    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            board[i] = "O";
            let score = minimax(board, 0, false);
            board[i] = "";
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    return bestMove;
}

function minimax(board, depth, isMaximizing) {
    if (checkWinner() === "O") return 10 - depth;
    if (checkWinner() === "X") return depth - 10;
    if (!board.includes("")) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = "O";
                let score = minimax(board, depth + 1, false);
                board[i] = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = "X";
                let score = minimax(board, depth + 1, true);
                board[i] = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinner() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]
    ];

    for (let combo of winningCombinations) {
        const [a, b, c] = combo;
        if (board[a] !== "" && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }

    if (!board.includes("")) {
        document.getElementById("status").innerText = "It's a Draw! 😐";
        gameActive = false;
        return null;
    }

    return null;
}

function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    currentPlayer = "X";
    document.getElementById("status").innerText = "Your Turn!";
    document.querySelectorAll(".cell").forEach(cell => cell.innerText = "");
}
