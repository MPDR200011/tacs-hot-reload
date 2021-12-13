import { cloneDeep } from 'lodash';

enum Result { SUCCESS, FAIL, RUN_AGAIN, INVALID_STATE };

abstract class Action<T> {

    public state?: T;

    constructor() { }

    protected abstract __run() : Result;

    run(state: T) : Result {
        this.state = state;
        return this.__run();
    }

    resultingState() {
        if (!this.state) {
            throw new Error("State is null.")
        }
        return cloneDeep(this.state);
    }
}

class Engine<T> {

    initialState: T;
    currentState: T;
    actions: Array<Action<T>>
    currentActionIdx = 0;

    constructor(initialState: T, actions?: Array<Action<T>>) {
        this.initialState = initialState;
        this.currentState = initialState;
        this.actions = actions ?? [];
    }

    tick(state?: T) {
        if (this.currentActionIdx >= this.actions.length) {
            return false;
        }

        const action = this.actions[this.currentActionIdx];
        const result = action.run(state ?? this.currentState);

        if (result == Result.FAIL) {
            throw new Error("Something went wrong.");
        }

        if (result == Result.INVALID_STATE) {
            throw new Error("Invalid state.");
        }

        this.currentState = action.resultingState();

        if (result == Result.SUCCESS) {
            this.currentActionIdx++;
        }

        return true;
    }

    getCurrentState() {
        return cloneDeep(this.currentState);
    }

    rollback(idx: number = 0) {
        if (idx > this.actions.length) {
            throw new Error("Index out of ranger")
        }

        this.currentActionIdx = idx;
        this.currentState = this.actions[this.currentActionIdx].resultingState();
    }

    commit() {
        this.currentActionIdx = 0;
        this.initialState = cloneDeep(this.currentState);
        this.actions = this.actions.splice(this.currentActionIdx);
    }
}

export { Result, Action, Engine }
