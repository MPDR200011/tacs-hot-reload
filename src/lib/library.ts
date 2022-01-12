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

    reset() {}
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
        const result = action.run(cloneDeep(state ?? this.currentState));

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

    getCurrentActionId() {
        return this.currentActionIdx;
    }

    rollback(idx: number = 0) {
        if (idx < 0) {
            throw new Error("Negative Index")
        }
        if (idx > this.actions.length) {
            throw new Error("Index out of ranger")
        }

        if (idx > this.currentActionIdx) {
            throw new Error(
                `Can't rollback to future, current: ${this.currentActionIdx}, destination: ${idx}`
            );
        }

        this.currentActionIdx--;
        for (; this.currentActionIdx > idx; this.currentActionIdx--) {
            console.log(this.currentActionIdx)
            this.actions[this.currentActionIdx].reset();
        }
        this.actions[this.currentActionIdx].reset();

        this.currentActionIdx = idx;
        if (this.currentActionIdx === 0) {
            this.currentState = this.initialState;
        } else {
            this.currentState = this.actions[this.currentActionIdx - 1].resultingState();
        }
        
    }

    insertActionAt(idx: number, action: Action<T>) {
        this.actions = [...this.actions.slice(0,idx), action, ...this.actions.slice(idx)]
        if (idx < this.currentActionIdx) {
            this.rollback(idx)
        }
    }

    setActionAt(idx: number, action: Action<T>) {
        this.actions[idx] = action;
        if (idx < this.currentActionIdx) {
            this.rollback(idx)
        }
    }

    appendAction(action: Action<T>) {
        this.actions.push(action);
    }

    removeActionAt(idx: number) {
        this.actions = [...this.actions.slice(0,idx), ...this.actions.slice(idx + 1)];
        if (idx < this.currentActionIdx) {
            this.currentActionIdx--;
            if (idx >= this.actions.length) {
                // in case we are removing the last element
                this.rollback(this.actions.length-1)
            } else {
                this.rollback(idx)
            }
        }
    }

    commit(state?: T) {
        this.currentState = state ? cloneDeep(state) : this.currentState;
        this.initialState = cloneDeep(this.currentState);
        this.actions = this.actions.splice(this.currentActionIdx);
        this.currentActionIdx = 0;
    }
}

export { Result, Action, Engine }
