import { Grid } from "./Grid";
import { Game } from "./Game";

const grid = new Grid(6, 7);
const game = new Game(grid, 4, 2);

game.play();
