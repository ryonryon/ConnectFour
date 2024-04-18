import { PieceColor } from "./PieceColor";
export class Player {
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
