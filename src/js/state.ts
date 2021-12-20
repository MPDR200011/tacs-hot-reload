export type Left = [0, -1];
export type Right = [0, 1];
export type Up = [-1, 0];
export type Down = [1, 0];

export type Direction = Left | Right | Up | Down;
export type GameState = {
    board: Array<Array<number>>;
    snakeHeadPos: [number, number];
    snakeLength: number;
    snakeDirection: Direction;
}
