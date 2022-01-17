import { cloneDeep } from 'lodash';

enum Result { SUCCESS, FAIL, RUN_AGAIN, INVALID_STATE };

abstract class Action<T> {

    private initialState?: T;
    public state?: T;

    constructor() { }

    protected abstract __run(state: T) : Result;

    run(state: T) : Result {
        this.initialState = this.initialState ? this.initialState : cloneDeep(state);
        this.state = cloneDeep(state);
        return this.__run(this.state);
    }

    resultingState() {
        if (!this.state) {
            throw new Error("State is null.")
        }
        return cloneDeep(this.state);
    }

    getInitialState() {
        if (!this.initialState) {
            throw new Error("Initial State is null.")
        }
        return cloneDeep(this.initialState);
    }

    __reset() {}

    reset() {
        this.__reset();
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

    getNumberOfActions() {
        return this.actions.length;
    }

    resetUntil(idx: number) {
        this.currentActionIdx--;
        for (; this.currentActionIdx > idx; this.currentActionIdx--) {
            console.log(this.currentActionIdx)
            this.actions[this.currentActionIdx].reset();
        }
        console.log(this.currentActionIdx)
        this.actions[this.currentActionIdx].reset();
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
        
        if (idx == this.currentActionIdx) {
            // rolling back to present do nothing
            return;
        }
        
        if (this.actions.length === 0) {
            this.currentActionIdx = 0;
            this.currentState = this.initialState;
            return;
        }

        this.resetUntil(idx);

        this.currentActionIdx = idx;
        this.currentState = this.actions[this.currentActionIdx].getInitialState();
    }

    insertActionAt(idx: number, action: Action<T>) {
        this.actions = [...this.actions.slice(0,idx), action, ...this.actions.slice(idx)]
        if (idx < this.currentActionIdx) {
            this.currentActionIdx++;
            const newState = this.actions[idx+1].getInitialState();
            this.resetUntil(idx);
            this.currentState = newState;
            this.currentActionIdx = idx;
        }
    }

    setActionAt(idx: number, action: Action<T>) {
        if (idx < this.currentActionIdx) {
            const newState = this.actions[idx].getInitialState();
            this.currentActionIdx++;
            this.resetUntil(idx);
            this.currentState = newState;
            this.currentActionIdx = idx;
        }
        this.actions[idx] = action;
    }

    appendAction(action: Action<T>) {
        this.actions.push(action);
    }

    removeActionAt(idx: number) {
        const newState = this.actions[idx].getInitialState();
        if (idx < this.currentActionIdx) {
            this.currentActionIdx--;
            if (idx > 0) {
                this.resetUntil(idx);
            }
            this.currentState = newState;
            this.currentActionIdx = idx;
        }

        this.actions = [...this.actions.slice(0,idx), ...this.actions.slice(idx + 1)];
    }

    swapActions(idx1: number, idx2: number) {
        const minIdx = Math.min(idx1, idx2);
        if (minIdx < this.currentActionIdx) {
            this.actions[idx1].reset();
            this.actions[idx2].reset();
            this.resetUntil(minIdx);
            this.currentState = this.actions[minIdx].getInitialState();
            this.currentActionIdx = minIdx;
        }

        [this.actions[idx1], this.actions[idx2]] = [this.actions[idx2], this.actions[idx1]]
    }

    commit(state?: T) {
        this.currentState = state ? cloneDeep(state) : this.currentState;
        this.initialState = cloneDeep(this.currentState);
        this.actions = this.actions.splice(this.currentActionIdx);
        this.currentActionIdx = 0;
    }
}

export { Result, Action, Engine }
