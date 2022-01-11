import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import { createGameState, placeFruit, advanceGameState } from './js/source'
import { Engine } from './lib/library'
import { Graphics } from './js/graphics'
import { GameState } from './js/state'
import { DynamicActionList } from './DynamicActionList';



function App() {
    const [engine] = useState(new Engine<GameState>(
        createGameState([15,15], [7,7], 10), 
        []
    ))
    const [state, setState] = useState(engine.getCurrentState());
    const [gameOver, setGameOver] = useState(false);
    const [graphics, setGraphics] = useState<Graphics>();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // initialize game
    useEffect(() => {
        placeFruit(state.board);

        if (canvasRef.current) {
            console.log(canvasRef.current.width)
            setGraphics(new Graphics(state.board.length, canvasRef.current));
        }
    }, []);

    return (
        <div className="App" style={{display:'flex', justifyContent: 'space-around', alignItems: 'flex-end'}} >
            <canvas id="snake" width="800" height="800" ref={canvasRef}></canvas>
            <button id="advance" onClick={() => {
                if (gameOver) return;

                if (!engine.tick(state)) {
                    return;
                }

                const resultingState = engine.getCurrentState();
                setState(resultingState);

                const result = advanceGameState(resultingState);
                if (result == "collision") {
                    console.log("YOU LOSE!!")
                    setGameOver(true);
                } else if (result == "ate fruit") {
                    placeFruit(resultingState.board);
                }

                if (graphics) {
                    graphics.drawBoard(resultingState)
                }
            }}>advance</button>
            <DynamicActionList engine={engine}/>
        </div>
    );
}

export default App;
