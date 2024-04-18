import { Grid } from "./Grid";
import { PieceColor } from "./PieceColor";
import { Player } from "./Player";
import { prompt } from "./utils/prompt";

export class Game {
  #grid: Grid;
  #connectCount: number;
  #players: Array<Player>;
  #score: Map<Player, number>;
  #targetScore: number;

  constructor(grid: Grid, connectCount: number, targetScore: number) {
    this.#grid = grid;
    this.#connectCount = connectCount;
    this.#players = [
      new Player("Player 1", PieceColor.RED),
      new Player("Player 2", PieceColor.YELLOW),
    ];
    this.#targetScore = targetScore;
    this.#score = new Map();
    this.#players.forEach((player) => this.#score.set(player, 0));
  }

  #printBoard(): void {
    console.log("Board:\n");
    for (let row of this.#grid.getGrid()) {
      let rowStr = "";

      for (let value of row) {
        rowStr +=
          value === null ? "0 " : value === PieceColor.RED ? "R " : "Y ";
      }

      console.log(rowStr);
    }
    console.log("");
  }

  async #playMove(player: Player): Promise<[number, number]> {
    this.#printBoard();
    console.log(`${player.getName()}'s turn`);
    const columnCount = this.#grid.getColumn();

    const moveColumn = Number(
      await prompt(
        `Enter column between ${0} and ${columnCount - 1} to add piece: `
      )
    );
    const moveRow = this.#grid.placePiece(moveColumn, player.getPiece());

    console.log("board", this.#grid.getGrid());
    console.log("moveRow", moveRow);

    return [moveRow, moveColumn];
  }

  async #playRound(): Promise<Player> {
    while (true) {
      for (const player of this.#players) {
        const [row, col] = await this.#playMove(player);
        const piece = player.getPiece();
        const isWin = this.#grid.checkWin(this.#connectCount, row, col, piece);

        if (isWin) {
          this.#score.set(player, this.#score.get(player)! + 1);

          return player;
        }
      }
    }
  }

  public async play() {
    let maxScore = 0;
    let winner: Player | null = null;

    while (maxScore <= this.#targetScore) {
      winner = await this.#playRound();

      console.log(`Winner is ${winner!.getName()} in this round!`);

      maxScore = Math.max(maxScore, this.#score.get(winner)!);
      this.#grid.initGrid();
    }

    console.log(`Winner is ${winner!.getName()}`);
  }
}
