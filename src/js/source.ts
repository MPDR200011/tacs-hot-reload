import { Action, Engine, Result } from '../../lib/library'

type State = {
    value: number;
}

class Add extends Action<State> {

    constructor(private amount: number) {
        super();
    }

    __run() {
        if (!this.state) {
            return Result.INVALID_STATE;
        }

        this.state.value += this.amount;

        return Result.SUCCESS;
    }
}

(() => {
    let counterElement = document.getElementById('counter')

    const engine = new Engine<State>(
        { value: 0 },
        [
            new Add(2),
            new Add(2),
            new Add(2),
            new Add(2),
            new Add(2),
            new Add(2),
            new Add(2),
        ]
    );

    try {
        while(true) {
            engine.tick()
        }
    } catch( error ) { }

    if (counterElement) {
        counterElement.innerHTML = `${ engine.getCurrentState().value }`
    } else {
        console.log(engine.getCurrentState().value)
    }
})();
