import { GameState, Direction } from './state'

type AdvanceRsult = "collision" | "ate fruit" | "ok"; 

// javascrip modulo is broken
function mod(n: number, m: number) {
    return ((n % m) + m) % m;
}

function advanceGameState(state: GameState): AdvanceRsult {
    const { snakeHeadPos, snakeDirection, board } = state;

    const nextRow = mod((snakeHeadPos[0] + snakeDirection[0]), board.length);
    const nextColumn = mod((snakeHeadPos[1] + snakeDirection[1]), board[nextRow].length);
    const nextCellVal = board[nextRow][nextColumn];

    if (nextCellVal > 0) {
        return "collision"
    }

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] > 0) {
                board[i][j]--;
            }
        }
    }

    let result: AdvanceRsult = "ok";
    if (nextCellVal < 0) {
        // fruit
        state.snakeLength++;
        result = "ate fruit";
    }

    board[nextRow][nextColumn] = state.snakeLength;
    state.snakeHeadPos = [nextRow, nextColumn];

    return result;
}

function placeFruit(board: Array<Array<number>>) {
    function rand(min: number, max: number) {
        return Math.floor(Math.random() * (max - min) + min);
    }
    let row = 0;
    let column = 0;

    do {
        row = rand(0, board.length)
        column = rand(0, board[row].length)
    } while(board[row][column] > 0);

    board[row][column] = -1
}

function createGameState(
    boardDimensions: [number, number] = [15,15], 
    startingPos: [number, number] = [7,7], 
    snakeLength: number = 1,
    startingDirection: Direction = [-1, 0]
) {
    const state: GameState = {
        board: Array.from({length: boardDimensions[0]}, _ => Array.from({length: boardDimensions[1]}, _ => 0)),
        snakeLength,
        snakeHeadPos: startingPos,
        snakeDirection: startingDirection,
    };

    state.board[startingPos[0]][startingPos[1]] = state.snakeLength;

    placeFruit(state.board);

    return state;
}

function printGameState(state: GameState) {
    let boardString = ""
    for (const row of state.board) {
        let rowString = ""
        for (const cell of row) {
            if (cell === 0) {
                rowString += cell + " "
            } else if (cell < 0) {
                rowString += cell + " "
            } else if (cell > 0) {
                rowString += cell + " "
            }
        }
        boardString += rowString + "\n"
    }
    console.log(boardString)
}

export { createGameState, printGameState,  placeFruit, advanceGameState };
