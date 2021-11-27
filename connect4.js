/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const width = 7;
const height = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])
let gameOver = false;

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

// TODO: set "board" to empty height x width matrix array
function makeBoard() {
	for (let y = 0; y < height; y++) {
		board.push(Array.from({ length: width }));
	}
}
/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
	// TODO: get "htmlBoard" letiable from the item in HTML w/ID of "board"
	const htmlBoard = document.getElementById('board');
	// TODO: create top table row that once clicked will play the piece on the board.
	let top = document.createElement('tr');
	top.setAttribute('id', 'column-top');
	top.addEventListener('click', handleClick);

	// Create cells, set ID equal to x which is width of board. Starting with 0 -> 6. Append top column to board
	for (let x = 0; x < width; x++) {
		const headCell = document.createElement('td');
		headCell.setAttribute('id', x);
		top.append(headCell);
	}
	htmlBoard.append(top);

	// TODO: create table row and cells below the headcell. Apply an ID based on the height/width
	for (let y = 0; y < height; y++) {
		const row = document.createElement('tr');
		for (let x = 0; x < width; x++) {
			const cell = document.createElement('td');
			cell.setAttribute('id', `${y}-${x}`);
			row.append(cell);
		}
		htmlBoard.append(row);
	}
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
	// TODO: write the real version of this, rather than always returning 0
	for (let y = height - 1; y >= 0; y--) {
		if (!board[y][x]) {
			return y;
		}
	}
	return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
	// TODO: make a div and insert into correct table cell
	const boardPiece = document.createElement('div');
	boardPiece.classList.add('piece');
	boardPiece.classList.add(`Player${currPlayer}`);

	const slot = document.getElementById(`${y}-${x}`);
	slot.append(boardPiece);
}

/** endGame: announce game end */

function endGame(msg) {
	// TODO: pop up alert message
	setTimeout(function() {
		alert(msg);
	}, 1000);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
	if (gameOver) {
		return;
	}
	// get x from ID of clicked cell
	let x = +evt.target.id;

	// get next spot in column (if none, ignore click)
	let y = findSpotForCol(x);
	if (y === null) {
		return;
	}

	// place piece in board and add to HTML table
	// TODO: add line to update in-memory board
	board[y][x] = currPlayer;
	placeInTable(y, x);

	// check for win
	if (checkForWin()) {
		gameOver = true;
		return endGame(`Player ${currPlayer} won!`);
	}

	// check for tie
	// TODO: check if all cells in board are filled; if so call, call endGame
	if (board.every(row => row.every(cell => cell))) {
		return endGame("It's a tie!");
	}

	// switch players
	// TODO: switch currPlayer 1 <-> 2
	currPlayer = currPlayer === 1 ? 2 : 1;

	//update the Current Player text to show the player's turn
	document.getElementById('CurrentPlayer').innerHTML = `Current Player is Player${currPlayer}`;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
	function _win(cells) {
		// Check four cells to see if they're all color of current player
		//  - cells: list of four (y, x) cells
		//  - returns true if all are legal coordinates & all match currPlayer

		return cells.every(([ y, x ]) => y >= 0 && y < height && x >= 0 && x < width && board[y][x] === currPlayer);
	}

	// TODO: read and understand this code. Add comments to help you.

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			// horiz win by adding 1 to the x axis until there are 4 matches
			let horiz = [ [ y, x ], [ y, x + 1 ], [ y, x + 2 ], [ y, x + 3 ] ];
			// horiz win by adding 1 to the y axis until there are 4 matches
			let vert = [ [ y, x ], [ y + 1, x ], [ y + 2, x ], [ y + 3, x ] ];
			// diagonal right win by adding 1 to the x and y axis until there are 4 matches
			let diagDR = [ [ y, x ], [ y + 1, x + 1 ], [ y + 2, x + 2 ], [ y + 3, x + 3 ] ];
			// diagonal left win by adding 1 to the y axis and subtracting 1 to the x axis until there are 4 matches
			let diagDL = [ [ y, x ], [ y + 1, x - 1 ], [ y + 2, x - 2 ], [ y + 3, x - 3 ] ];

			if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
				return true;
			}
		}
	}
}

makeBoard();
makeHtmlBoard();
