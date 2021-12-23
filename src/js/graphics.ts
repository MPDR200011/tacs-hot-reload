
import { GameState} from './state'


class Graphics {
    canvasSize: number;
    ctx: any;
    BoardSize: number;
    sizeRec: number;

    constructor(size: number) {
        let canvas: any = document.getElementById('snake');
        this.BoardSize = size;
        this.canvasSize = canvas.width;
        this.sizeRec = this.canvasSize / this.BoardSize;

        this.ctx = canvas.getContext("2d");
        this.clearBoard();
    }

    drawBoard(state: GameState) {
        this.clearBoard()
        this.ctx.fillStyle = "rgb(0,200,0)";
        for (let i = 0; i < this.BoardSize; i++) {
            for (let k = 0; k < this.BoardSize; k++) {
                if (state.board[k][i] > 1) {
                    this.ctx.fillRect(i * this.sizeRec, k * this.sizeRec, this.sizeRec, this.sizeRec);
                }
                else if(state.board[k][i] < 0){
                    console.log("fruti")
                    this.ctx.fillStyle = "rgb(200,0,0)";
                    this.ctx.fillRect(i * this.sizeRec, k * this.sizeRec, this.sizeRec, this.sizeRec);
                    this.ctx.fillStyle = "rgb(0,200,0)";
                }else if(state.board[k][i] == 1){
                    this.ctx.fillStyle = "rgb(0,153,51)";
                    this.ctx.fillRect(i * this.sizeRec, k * this.sizeRec, this.sizeRec, this.sizeRec);
                    this.ctx.fillStyle = "rgb(0,200,0)";
                }

            }
        }
        
    }


    clearBoard() {
        this.ctx.clearRect(0, 0, this.canvasSize, this.canvasSize);
        for (let i = 0; i < this.BoardSize; i++) {
            for (let k = 0; k < this.BoardSize; k++) {
                this.ctx.strokeRect(i * this.sizeRec, k * this.sizeRec, this.sizeRec, this.sizeRec);
            }
        }
    }



}
export { Graphics }
