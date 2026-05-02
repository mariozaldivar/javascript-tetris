const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const board = Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0));
let boardElement;
let startButton;


let currentRow;
let currentCol;
let currentShape;
const allShapes = [
  [
    [1, 1],
    [1, 1]
  ],

  [
    [0, 0, 0, 0],
    [2, 2, 2, 2],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ],

  [
    [3, 3, 0],
    [0, 3, 3],
    [0, 0, 0]
  ],

  [
    [0, 4, 4],
    [4, 4, 0],
    [0, 0, 0]

  ],

  [
    [5, 0, 0],
    [5, 5, 5],
    [0, 0, 0]
  ],
  [
    [0, 0, 6],
    [6, 6, 6],
    [0, 0, 0]
  ],
  [
    [0, 7, 0],
    [7, 7, 7],
    [0, 0, 0]
  ],

];

function drawBoard() {
  boardElement.replaceChildren();
  let currentBlock;
  let currentRow;
  for (let i = 0; i < BOARD_HEIGHT; i++) {
    currentRow = document.createElement("div");
    currentRow.className = "row";
    for (let j = 0; j < BOARD_WIDTH; j++) {
      currentBlock = document.createElement("div");
      currentBlock.className = "block";
      switch (board[i][j]) {
        case 0:
          break;
        case 1:
          currentBlock.style.backgroundColor = "red";
          break;
        case 2:
          currentBlock.style.backgroundColor = "blue";
          break;
        case 3:
          currentBlock.style.backgroundColor = "yellow";
          break;
        case 4:
          currentBlock.style.backgroundColor = "green";
          break;
        case 5:
          currentBlock.style.backgroundColor = "orange";
          break;
        case 6:
          currentBlock.style.backgroundColor = "pink";
          break;
        case 7:
          currentBlock.style.backgroundColor = "brown";
          break;
        default:
          currentBlock.style.backgroundColor = "black";
          break;
      }


      currentRow.appendChild(currentBlock);
    }
    boardElement.appendChild(currentRow);
  }
}


function checkIfRowFull(row) {
  console.log("Currently checking row: " + row)
  console.log("The board being hecked is: ")
  console.log(board);
  for (let j = 0; j < BOARD_WIDTH; j++) {
    if (board[row][j] == 0) {
      return false;
    }
  }
  return true;
}

function makeLineClears() {
  for (let i = BOARD_HEIGHT - 1; i > 0; i--) {
    if (checkIfRowFull(i)) {
      for (let movingRow = i; movingRow > 0; movingRow--) {
        for (let j = 0; j < BOARD_WIDTH; j++) {
          board[movingRow][j] = board[movingRow - 1][j];
        }
      }
      for (let j = 0; j < BOARD_WIDTH; j++) {
        board[0][j] == 0;
      }
      i = BOARD_HEIGHT - 1
    }
  }
}

function generateNewPiece() {
  makeLineClears()
  currentRow = 0;
  currentCol = 4;
  currentShape = allShapes[Math.floor(Math.random() * allShapes.length)];
  drawBoard();

}
function getNextRotation(shape) {
  let buffer = Array.from({ length: shape.length }, () => Array(shape.length).fill(0));
  ;
  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape.length; j++) {
      buffer[i][j] = shape[j][shape.length - 1 - i];
    }
  }

  return buffer;
}

function undrawCurrentPiece() {
  for (let i = 0; i < currentShape.length; i++) {
    for (let j = 0; j < currentShape.length; j++) {
      if (currentShape[i][j] != 0) {
        board[currentRow + i][currentCol + j] = 0;
      }
    }
  }
}

function canBeDrawn(row, col, shape) {
  undrawCurrentPiece();
  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape.length; j++) {
      if (shape[i][j] != 0) {
        let inBounds = ((row + i >= 0) && (row + i < BOARD_HEIGHT) && (col + j >= 0) && (col + j < BOARD_WIDTH));
        if (inBounds) {
          if (shape[i][j] != 0 && board[row + i][col + j] != 0) {
            return false;
          }
        } else { return false; }
      }

    }
  }
  return true;
}

function drawCurrentPiece(row, col) {
  for (let i = 0; i < currentShape.length; i++) {
    for (let j = 0; j < currentShape.length; j++) {
      if (currentShape[i][j] != 0) {
        board[row + i][col + j] = currentShape[i][j];
      }
    }
  }
  currentRow = row;
  currentCol = col;
  drawBoard();
}

function pieceLower() {
  if (canBeDrawn(currentRow + 1, currentCol, currentShape)) {
    drawCurrentPiece(currentRow + 1, currentCol, currentShape);
  } else {
    drawCurrentPiece(currentRow, currentCol, currentShape);

    generateNewPiece();
  }
}
function hardDrop() {
  while (canBeDrawn(currentRow + 1, currentCol, currentShape)) {
    drawCurrentPiece(currentRow + 1, currentCol, currentShape)
  }
  drawCurrentPiece(currentRow, currentCol, currentShape);
  generateNewPiece();

}

function movePiece(row, col) {
  if (canBeDrawn(row, col, currentShape)) {
    drawCurrentPiece(row, col)
  } else {
    drawCurrentPiece(currentRow, currentCol, currentShape);
  }
}

function attemptRotation() {
  buffer = getNextRotation(currentShape);
  if (canBeDrawn(currentRow, currentCol, buffer)) {
    currentShape = buffer;
    drawCurrentPiece(currentRow, currentCol);
  } else {
    drawCurrentPiece(currentRow, currentCol);
  }
}


function startGame() {
  generateNewPiece();
  drawCurrentPiece(currentRow, currentCol);
  console.log(board);

  drawBoard();


}




document.addEventListener("DOMContentLoaded", () => {
  boardElement = document.getElementById("board");
  startButton = document.getElementsByName("start-button");
  startGame();
  const lowering = setInterval(() => { pieceLower(); }, 500)

  document.addEventListener("keydown", (event) => {
    console.log(event.key);
    if (event.key == "ArrowRight") {
      movePiece(currentRow, currentCol + 1);
    }
    else if (event.key == "ArrowLeft") {
      movePiece(currentRow, currentCol - 1);
    }
    else if (event.key == "ArrowDown") {
      movePiece(currentRow + 1, currentCol);
    }
    else if (event.key == "ArrowUp") {
      attemptRotation()
    }
    else if (event.key == " ") {
      hardDrop();
    }
  })
})




