const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const board = Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0));
let boardElement;
let startButtonElement;
let scoreElement;
let levelElement;
let holdPieceElement;
let gameOverElement;

let currentRow;
let currentCol;
let currentShape;


let ghostPieceRow;
let ghostPieceCol;
let ghostPieceShape;


let lineClearCount = 0;
let lastClearedLinesCounter;
let score = 0;
let multiplyer;
let level;

let holdShape;
let holdedThisTurn;


let playing;


const allShapes = [
  [[1, 1],
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
      if (board[i][j] < 0) {
        currentBlock.style.opacity = .5;
      }


      currentRow.appendChild(currentBlock);
    }
    boardElement.appendChild(currentRow);
  }
}


function checkIfRowFull(row) {
  for (let j = 0; j < BOARD_WIDTH; j++) {
    if (board[row][j] == 0) {
      return false;
    }
  }
  return true;
}

function clearLine(line) {
  for (let movingRow = line; movingRow > 0; movingRow--) {
    for (let j = 0; j < BOARD_WIDTH; j++) {
      board[movingRow][j] = board[movingRow - 1][j];
    }
  }
  for (let j = 0; j < BOARD_WIDTH; j++) {
    board[0][j] == 0;
  }

}

function makeLineClears() {
  let clears = 0;
  for (let i = BOARD_HEIGHT - 1; i > 0; i--) {
    if (checkIfRowFull(i)) {
      clearLine(i);
      i = BOARD_HEIGHT;
      clears++;
    }
  }

  lastClearedLinesCounter = clears;
  lineClearCount += clears;
  updateScore(clears);

}

function updateScore(lines) {
  let points;
  switch (lines) {
    case 0:
      points = 0;
      break;
    case 1:
      points = 100;
      break;
    case 2:
      points = 200;
      break;
    case 3:
      points = 300;
      break;
    case 4:
      points = 400;
      break;
    default:
      console.log("There's been a problem with lines");
      break;
  }
  console.log("Lines: " + lines);
  level = Math.floor((lineClearCount / 10) + 1);
  console.log("Level: " + level)
  console.log("Points:" + points);
  score += (points * level)
  console.log(score);

  scoreElement.textContent = "Score: " + score;

  levelElement.textContent = "Level: " + level;

}

function calculateGhostPiece() {
  // Si ya existe una ghostPiece, eliminarla 

  if (ghostPieceShape != undefined) {
    undrawPiece(ghostPieceRow, ghostPieceCol, ghostPieceShape);
  }
  undrawCurrentPiece();

  // Clona la currentPiece 
  ghostPieceRow = currentRow;
  ghostPieceCol = currentCol;
  ghostPieceShape = makeGhostPiece(structuredClone(currentShape));


  while (canGhostPieceBeDrawn(ghostPieceRow + 1, ghostPieceCol, ghostPieceShape)) {
    ghostPieceRow++;
    console.log("Se verificó que se podía bajar la Ghostpiece a la row: " + ghostPieceRow);
  }
  drawGhostPiece(ghostPieceRow, ghostPieceCol);

  console.log("Ghost Piece is currently at: x: " + ghostPieceCol + "  y: " + ghostPieceRow);


  drawCurrentPiece(currentRow, currentCol);
  drawBoard();
  /*
   * Estructura del algoritmo: 
   * Desdibuja la currentPiece -> Clona la currentPieceShape pero con números negativos ->
   * Simula un PieceLower pero con la GhostPiece -> La función es llamada al generar una nueva pieza, 
   * -> La función es llamada al mover manualmente una pieza, o rotarla 
   *
   * CanBeDrawn debe estar modificado para que no tome en cuenta las piezas menores que 0, y permita dibujar encima de ellos
   *
   * */

}

function drawGhostPiece(row, col) {
  for (let i = 0; i < ghostPieceShape.length; i++) {
    for (let j = 0; j < ghostPieceShape.length; j++) {
      if (ghostPieceShape[i][j] != 0) {
        board[row + i][col + j] = ghostPieceShape[i][j];
      }
    }
  }
  ghostPieceRow = row;
  ghostPieceCol = col;
}

function canGhostPieceBeDrawn(row, col, shape) {
  undrawPiece(ghostPieceRow, ghostPieceCol, ghostPieceShape)
  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape.length; j++) {
      if (shape[i][j] != 0) {
        let inBounds = ((row + i >= 0) && (row + i < BOARD_HEIGHT) && (col + j >= 0) && (col + j < BOARD_WIDTH));
        if (inBounds) {
          if (shape[i][j] != 0 && board[row + i][col + j] != 0) {
            console.log("La ghost piece ya no puede bajar en: " + ghostPieceRow + "porque " + shape[i][j] + "choca con " + board[row + i][col + j] + " en x: " + (col + j) + "  y: " + (row + i))
            return false;

          }
        } else {
          return false;
        }
      }

    }
  }
  return true;

}

function undrawPiece(row, col, shape) {
  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape.length; j++) {
      if (shape[i][j] != 0 && shape[i][j] == board[row + i][col + j]) {
        board[row + i][col + j] = 0;
      }
    }
  }
}

function makeGhostPiece(shape) {
  let buffer = shape;
  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape.length; j++) {
      if (shape[i][j] != 0) {
        buffer[i][j] = 0 - shape[i][j];
      }
    }
  }
  console.log(buffer);
  return buffer;
}




function generateNewPiece() {
  makeLineClears()
  currentRow = 0;
  currentCol = 4;
  currentShape = allShapes[Math.floor(Math.random() * allShapes.length)];

  if (canBeDrawnWithoutUndrawing(currentRow, currentCol, currentShape)) {
    console.log("La nueva pieza puede ser dibujada");
    drawCurrentPiece(currentRow, currentCol);
    drawBoard();
  } else {
    console.log("La nueva pieza no debería poder ser dibujada");

    gameOver();
    drawBoard();
    return;

  }

  // calculateGhostPiece(currentShape);

  holdedThisTurn = false;
  calculateGhostPiece();
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
      if (currentShape[i][j] != 0 && currentShape[i][j] == board[currentRow + i][currentCol + j]) {
        board[currentRow + i][currentCol + j] = 0;
      }
    }
  }
}

// Esto definitivamente es mala práctica, pero lo corregiré después 
//
function canBeDrawnWithoutUndrawing(row, col, shape) {
  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape.length; j++) {
      if (shape[i][j] != 0) {

        let inBounds = ((row + i < BOARD_HEIGHT) && (col + j >= 0) && (col + j < BOARD_WIDTH));
        if (inBounds) {
          // console.log("Comparing: " + shape[i][j] + " and " + board[row + i][row + j]);
          if (shape[i][j] != 0 && board[row + i][col + j] > 0) {
            // console.log("Se ha retornado false porque hay una piza en donde debería estar")

            return false;
          }
        } else {
          // console.log("Se ha retornado false porque está out of bounds")
          return false;
        }
      }
    }
  }
  return true;
}
function canBeDrawn(row, col, shape) {
  undrawCurrentPiece();
  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape.length; j++) {
      if (shape[i][j] != 0) {
        let inBounds = ((row + i >= 0) && (row + i < BOARD_HEIGHT) && (col + j >= 0) && (col + j < BOARD_WIDTH));
        if (inBounds) {
          if (shape[i][j] != 0 && board[row + i][col + j] > 0) {
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

    score += 2;
  }
  drawCurrentPiece(currentRow, currentCol, currentShape);

  scoreElement.textContent = "Score: " + score;
  generateNewPiece();

}

function movePiece(row, col) {
  if (canBeDrawn(row, col, currentShape)) {
    drawCurrentPiece(row, col)
    calculateGhostPiece();
  } else {
    drawCurrentPiece(currentRow, currentCol, currentShape);
  }
}

function attemptRotation() {
  buffer = getNextRotation(currentShape);
  if (canBeDrawn(currentRow, currentCol, buffer)) {
    currentShape = buffer;
    drawCurrentPiece(currentRow, currentCol);
    calculateGhostPiece();
  } else {
    drawCurrentPiece(currentRow, currentCol);
  }
}

function drawHoldPiece(shape) {

  holdPieceElement.replaceChildren();
  let currentBlock;
  let currentRow;
  for (let i = 0; i < shape.length; i++) {
    currentRow = document.createElement("div");
    currentRow.className = "row";
    for (let j = 0; j < shape.length; j++) {
      currentBlock = document.createElement("div");
      currentBlock.className = "block";
      switch (shape[i][j]) {
        case 0:
          currentBlock.style.opacity = 0;
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
    holdPieceElement.appendChild(currentRow);
  }
}

function holdPiece() {
  if (!holdedThisTurn) {
    undrawCurrentPiece();
    let buffer;
    buffer = holdShape;
    holdShape = currentShape;
    if (buffer != undefined) {
      currentShape = buffer;

    } else {
      currentShape = allShapes[Math.floor(Math.random() * allShapes.length)];
    }

    drawHoldPiece(holdShape)


    currentRow = 0;
    currentCol = 4;
    drawCurrentPiece(currentRow, currentCol, currentShape);
    calculateGhostPiece();
    holdedThisTurn = true;
  }


}


const handleInput = (event) => {
  if (playing) {
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
      attemptRotation();
    }
    else if (event.key == "c") {
      holdPiece();
    }
    else if (event.key == " ") {
      hardDrop();
    }
  }
}

// TODO: Limpiar la lógica del lowering
function startGame() {
  for (let i = 0; i < BOARD_HEIGHT; i++) {
    for (let j = 0; j < BOARD_WIDTH; j++) {
      board[i][j] = 0;
    }
  }
  playing = true;
  console.log("Se ha llamado startGame")


  generateNewPiece();

  drawCurrentPiece(currentRow, currentCol);
  console.log(board);

  drawBoard();

  if (globalThis.lowering != undefined) {
    clearInterval(lowering)
  }
  const lowering = setInterval(() => { pieceLower(); }, 500)
  globalThis.lowering = lowering;

  score = 0;
  level = 1;
}

function gameOver() {
  if (globalThis.lowering != undefined) {
    clearInterval(globalThis.lowering);
  }
  let gameOverText = document.createElement("h2");
  gameOverText.textContent = "¡¡Game Over!!";
  gameOverElement.appendChild(gameOverText);
  playing = false;
  document.removeEventListener("keydown", handleInput);



}



document.addEventListener("DOMContentLoaded", () => {
  boardElement = document.getElementById("board");
  startButtonElement = document.getElementById("start-button");
  scoreElement = document.getElementById("score")
  levelElement = document.getElementById("level")
  holdPieceElement = document.getElementById("hold-piece")
  gameOverElement = document.getElementById("game-over")
  document.addEventListener("keydown", handleInput)
  drawBoard();


})




