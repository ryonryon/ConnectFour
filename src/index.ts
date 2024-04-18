enum PieceColor {
    RED = 'RED',
    YELLOW = 'YELLOW',
}

class Grid {
    #column: number;
    #row: number;
    #grid: Array<Array<PieceColor | null>>;

    constructor(column: number, row: number) {
        this.#column = column;
        this.#row = row;
        this.initGrid();
    }

    initGrid() {
        this.#grid = Array.from({ length: this.#row }, () => Array(this.#column).fill(null));
    }

    getGrid(): Array<Array<PieceColor | null>> {
        return this.#grid;
    }

    getColumn(): number {
        return this.#column;
    }

    placePiece(column: number, piece: PieceColor): number {
        if (column < 0 || column >= this.#column) {
            throw new Error(`column should be 0 to ${this.#column}`);
        }

        for (let row = this.#row - 1; 0 <= row; row++) {
            if (this.#grid[row][column] === null) {
                this.#grid[row][column] = piece;

                return row;
            }
        }

        throw new Error("there isn't empty row in the column");
    }

    checkWin(connectCount: number, row: number, col: number, piece: PieceColor): boolean {
        // check horizontal
        let count = 0;
        for (let c = 0; c <= this.#column; c++) {
            if (this.#grid[row][c] === piece) {
                count++;
            } else {
                count = 0;
            }

            if (count === connectCount) {
                return true;
            }
        }

        // check vertical
        count = 0;
        for (let r = 0; r <= this.#row; r++) {
            if (this.#grid[r][col] === piece) {
                count++;
            } else {
                count = 0;
            }

            if (count === connectCount) {
                return true;
            }
        }

        // check right diagonal
        count = 0;
        for (let r = 0; r <= this.#row; r++) {
            let c = row + col - r;

            if (this.#grid[r][c] === piece) {
                count++;
            } else {
                count = 0;
            }

            if (count === connectCount) {
                return true;
            }
        }

        // check left diagonal
        count = 0;
        for (let r = 0; r <= this.#row; r++) {
            let c = col - row + r;

            if (this.#grid[r][c] === piece) {
                count++;
            } else {
                count = 0;
            }

            if (count === connectCount) {
                return true;
            }
        }

        return false;
    }
}

class Player {
    #name: string;
    #piece: PieceColor;

    constructor(name: string, piece: PieceColor) {
        this.#name = name;
        this.#piece = piece;
    }

    getName(): string {
        return this.#name;
    }

    getPiece(): PieceColor {
        return this.#piece;
    }
}

class Game {
    #grid: Grid;
    #connectCount: number;
    #players: Array<Player>;
    #score: Map<Player, number>;
    #targetScore: number;

    constructor(grid: Grid, connectCount: number, targetScore: number) {
        this.#grid = grid;
        this.#connectCount = connectCount;
        this.#players = [
            new Player('Player 1', PieceColor.RED),
            new Player('Player 2', PieceColor.YELLOW),
        
        ];
        this.#targetScore = targetScore;
        this.#initScore();
    }

    #initScore() {
        this.#score = new Map();
        
        this.#players.forEach(player => this.#score.set(player, 0));
    }

    #printBoard(): void {
        console.log('Board:\n');
        for (let row of this.#grid.getGrid()) {
            let rowStr = "";

            for (let value of row) {
                rowStr += value === null ? "0 " : value === PieceColor.RED ? "R " : "Y ";
            }

            console.log(rowStr);
        }
        console.log('');
    }

    #playMove(player: Player): [number, number] {
        this.#printBoard();
        console.log(`${player.getName()}'s turn`);
        const columnCount = this.#grid.getColumn();
        const moveColumn = (Number(prompt(`Enter column between ${0} and ${columnCount - 1} to add piece: `)));
        const moveRow = this.#grid.placePiece(moveColumn, player.getPiece());

        return [moveRow, moveColumn];
    }

    #playRound(): Player {
        while (true) {
            for (const player of this.#players) {
                const [row, col] = this.#playMove(player);
                const piece = player.getPiece();
                const isWin = this.#grid.checkWin(this.#connectCount, row, col, piece);

                if (isWin) {
                    this.#score.set(player, this.#score.get(player)! + 1);

                    return player;
                }
            }
        }
    }

    public play() {
        let maxScore = 0;
        let winner: Player | null = null;

        while (maxScore < this.#targetScore) {
            const winner = this.#playRound();

            console.log(`Winner is ${winner!.getName()} in this round!`);
        
            maxScore = Math.max(maxScore, this.#score.get(winner)!);
            this.#grid.initGrid();
        }

        console.log(`Winner is ${winner!.getName()}`);
    }
}

const grid = new Grid(6, 7);
const game = new Game(grid, 4, 2);

game.play();