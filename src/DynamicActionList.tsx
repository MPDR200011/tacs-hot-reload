import { Dispatch, FormEventHandler, useState } from "react";
import { Down, Left, Right, Up, Wait } from "./js/actions";
import { Graphics } from "./js/graphics";
import { GameState } from "./js/state";
import { Engine } from "./lib/library";

export type DynamicActionListProps = {
    engine: Engine<GameState>;
    state: GameState;
    setState: Dispatch<GameState>;
    graphics: Graphics | undefined
}

export const DynamicActionList = ({ engine, state, setState, graphics }: DynamicActionListProps) => {

    const [actions, setActions] = useState<string[]>([]);
    const [input, setInput] = useState('');

    const updateGraphics = () => {
        setState(engine.getCurrentState());
        if (graphics) graphics.drawBoard(state);
        console.log(engine.actions, engine.getCurrentActionId());
    }

    const onUp = (index: number) => {
        // cant go up
        if (index === 0) return;

        // display array
        // index-1 <-> index
        let arr = [...actions];
        [arr[index], arr[index-1]] = [arr[index-1], arr[index]]
        setActions(arr);

        // engine array
        const action = engine.actions[index];
        engine.removeActionAt(index);
        engine.insertActionAt(index-1, action);
        updateGraphics();
    }

    const onDown = (index: number) => {
        // cant go down
        if (index+1 >= actions.length) return;

        // display array
        // index <-> index+1
        let arr = [...actions];
        [arr[index], arr[index+1]] = [arr[index+1], arr[index]]
        setActions(arr);

        // engine array
        const action = engine.actions[index];
        engine.removeActionAt(index);
        engine.insertActionAt(index+1, action);
        updateGraphics();
    }

    const onDelete = (index: number) => {
        // display array
        // index <-> index+1
        let arr = [...actions];
        arr.splice(index, 1);
        setActions(arr);

        // engine array
        engine.removeActionAt(index);
        updateGraphics();
    }

    const actionValidator = (action:string) => {
        const wait = /wait ([0-9]+)/i;
        const left = /left/i;
        const right = /right/i;
        const up = /up/i;
        const down = /down/i;

        if (wait.test(action)) {
            const num = parseInt(wait.exec(action)![1]);
            setActions([...actions, 'wait ' + num]);
            engine.appendAction(new Wait(num));
        } else if (left.test(action)) {
            setActions([...actions, 'left']);
            engine.appendAction(new Left());
        } else if (right.test(action)) {
            setActions([...actions, 'right']);
            engine.appendAction(new Right());
        } else if (down.test(action)) {
            setActions([...actions, 'down']);
            engine.appendAction(new Down());
        } else if (up.test(action)) {
            setActions([...actions, 'up']);
            engine.appendAction(new Up());
        }
    }

    const handleSubmit:FormEventHandler = (evt) => {
        actionValidator((' ' + input).slice(1));
        setInput('');
        evt.preventDefault();
    }

    return (
        <div>
            <ol>
                {actions.map((item, index) => (
                    <li key={index}>
                        {item + '  '}
                        <button onClick={() => onUp(index)}>Up</button>
                        <button onClick={() => onDown(index)}>Down</button>
                        <button onClick={() => onDelete(index)}>Delete</button>
                    </li>
                ))}
            </ol>
            <form onSubmit={handleSubmit}>
                <label>
                    New action:

                    <input autoFocus type={'text'} value={input} onChange={evt => setInput(evt.target.value)} />
                </label>
                <input type="submit" value="Add" />
            </form>
        </div>
    );
}