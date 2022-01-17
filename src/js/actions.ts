import { Action, Result } from '../lib/library'
import { GameState, Direction } from './state'

class Turn extends Action<GameState> {

    constructor(private direction: Direction) {
        super();
    }

    __run(state: GameState) {
        state.snakeDirection = this.direction;

        return Result.SUCCESS;
    }
}

class Left extends Turn {
    constructor() {
        super([0, -1]);
    }
}

class Right extends Turn {
    constructor() {
        super([0, 1]);
    }
}

class Up extends Turn {
    constructor() {
        super([-1, 0]);
    }
}

class Down extends Turn {
    constructor() {
        super([1, 0]);
    }
}

class Wait extends Action<GameState> {
    counter : number;

    constructor(private count: number) {
        super();
        this.counter = 0;
    }

    __run(_: GameState) {

        this.counter++;
        if (this.counter < this.count) {
            return Result.RUN_AGAIN;
        }


        return Result.SUCCESS;
    }

    __reset() {
        this.counter = 0;
    }
}


export { Left, Right, Up, Down, Wait }
