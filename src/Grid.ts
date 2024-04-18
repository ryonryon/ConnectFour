import { PieceColor } from "./PieceColor";

export class Grid {
  #column: number;
  #row: number;
  #grid: Array<Array<PieceColor | null>>;

  constructor(column: number, row: number) {
    this.#column = column;
    this.#row = row;
    this.#grid = this.initGrid();
  }

  initGrid(): Array<Array<PieceColor | null>> {
    return Array.from({ length: this.#row }, () =>
      Array(this.#column).fill(null)
    );
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

    for (let row = this.#row - 1; 0 <= row; row--) {
      if (this.#grid[row][column] === null) {
        this.#grid[row][column] = piece;

        return row;
      }
    }

    throw new Error("there isn't empty row in the column");
  }

  checkWin(
    connectCount: number,
    row: number,
    col: number,
    piece: PieceColor
  ): boolean {
    // check horizontal
    let count = 0;
    for (let c = 0; c < this.#column; c++) {
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
    for (let r = 0; r < this.#row; r++) {
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
    for (let r = 0; r < this.#row; r++) {
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
    for (let r = 0; r < this.#row; r++) {
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
