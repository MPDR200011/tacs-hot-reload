import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import { createGameState, placeFruit, advanceGameState } from './js/source'
import { Engine } from './lib/library'
import { Graphics } from './js/graphics'
import { Game, GameState } from './js/state'
import { DynamicActionList } from './DynamicActionList';

function createGameStuff() : Game {
    const engine = new Engine<GameState>(
        createGameState([15,15], [7,7], 1), 
        []
    );
    const state = engine.getCurrentState();
    
    return {
        engine, state, gameOver: false
    }
}

function App() {
    const [game] = useState(createGameStuff());
    const [graphics, setGraphics] = useState<Graphics>();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // initialize game
    useEffect(() => {
        if (canvasRef.current) {
            console.log(canvasRef.current.width)
            let graphics = new Graphics(game.state.board.length, canvasRef.current); 
            setGraphics(graphics);
            graphics.drawBoard(game.state);
        }
    }, []);

    function tickGame() {
        if (game.gameOver) return false;

        if (!game.engine.tick(game.state)) {
            return false;
        }

        const resultingState = game.engine.getCurrentState();
        game.state = resultingState;

        const result = advanceGameState(resultingState);
        if (result == "collision") {
            console.log("YOU LOSE!!");
            game.gameOver = true;
        } else if (result == "ate fruit") {
            placeFruit(resultingState.board);
        }

        if (graphics) {
            graphics.drawBoard(resultingState)
        }

        return true;
    }

    return (
        <div className="App" style={{display:'flex', justifyContent: 'space-around', alignItems: 'flex-end'}} >
            <canvas id="snake" width="800" height="800" ref={canvasRef}></canvas>
            <button id="advance" onClick={tickGame}>advance</button>
            <button onClick={() => {
                const intervalId = setInterval(() => {
                    if (!tickGame()) {
                        clearInterval(intervalId)
                        return;
                    }
                }, 50)
            }}>
                play
            </button>
            <DynamicActionList game={game} graphics={graphics}  />
        </div>
    );
}

export default App;
