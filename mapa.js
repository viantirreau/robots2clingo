const noRows = 16;
const noCols = 16;
const squareSize = 26;

const canvasHeight = 600;
const canvasWidth = 700;

let pallete = ["white", "black", "lightblue", "pink"];

let map = new Array(noRows);
let robots = new Array(noRows);
let destinations = new Array(noRows);
let usedRobots = new Object();
let usedDestinations = new Object();

let buttons = [];
let selectedColor = 1;

let editorX = 100;
let editorY = 10;

let showNumbers = true;

function init(map, robots, usedRobots) {
  for (let i = 0; i < noRows; i++) {
    let row = new Array(noCols);
    for (let j = 0; j < noCols; j++) {
      row[j] = 0;
    }
    map[i] = row;
  }
  for (let i = 0; i < noRows; i++) {
    let row = new Array(noCols);
    for (let j = 0; j < noCols; j++) {
      row[j] = 0;
    }
    robots[i] = row;
  }
  for (let i = 0; i < noRows; i++) {
    let row = new Array(noCols);
    for (let j = 0; j < noCols; j++) {
      row[j] = 0;
    }
    destinations[i] = row;
  }

  for (let i = 1; i < noRows * noCols + 1; i++) {
    usedRobots[i] = false;
    usedDestinations[i] = false;
  }
}

function setup() {
  clear();
  frameRate(25);
  createCanvas(canvasWidth, canvasHeight);
  pixelDensity(1);
  addButtons();
  init(map, robots, usedRobots);
}

function draw() {
  clear();
  drawButtons();
  drawCopyButton();
  displayMap();
  handleButtons();
  handleCellClick();
  displayInstructions();
}

function keyPressed() {
  if (key.toUpperCase() === "Z") showNumbers = !showNumbers;
}

function handleCellClick() {
  if (!mouseIsPressed) return;

  let col = floor((mouseX - editorX) / squareSize);
  let row = floor((mouseY - editorY) / squareSize);

  if (col < 0 || col >= noCols || row < 0 || row >= noRows) return;

  let color = selectedColor;
  if (color === 0 || color === 1) {
    if (robots[row][col] !== 0) {
      usedRobots[robots[row][col]] = false;
      robots[row][col] = 0;
    }
    if (destinations[row][col] !== 0) {
      usedDestinations[destinations[row][col]] = false;
      destinations[row][col] = 0;
    }
  } else if (color === 2 && robots[row][col] === 0) {
    let lowestIndex = findLowestUnusedId(usedRobots);
    robots[row][col] = lowestIndex;
    usedRobots[lowestIndex] = true;
  } else if (color === 3 && destinations[row][col] === 0) {
    let lowestIndex = findLowestUnusedId(usedDestinations);
    destinations[row][col] = lowestIndex;
    usedDestinations[lowestIndex] = true;
  }
  if (destinations[row][col] !== 0 && robots[row][col] !== 0) {
    color = 5;
  }
  map[row][col] = color;
}

function findLowestUnusedId(usedList) {
  for (let i = 1; i < noRows * noRows + 1; i++) {
    if (usedList[i] === false) return i;
  }
}

function displayMap() {
  for (let row = 0; row < noRows; row++) {
    for (let col = 0; col < noCols; col++) {
      let cellX = editorX + col * squareSize;
      let cellY = editorY + row * squareSize;
      let color = map[row][col];

      if (color < pallete.length) {
        fill(pallete[color]);
        stroke(0);
        rect(cellX, cellY, squareSize, squareSize);
      } else {
        fill(pallete[2]);
        triangle(
          cellX + 1,
          cellY + 1,
          cellX + 1,
          cellY + squareSize,
          cellX + squareSize + 1,
          cellY + 1
        );
        fill(pallete[3]);
        triangle(
          cellX,
          cellY + squareSize,
          cellX + squareSize,
          cellY + squareSize,
          cellX + squareSize,
          cellY
        );
      }

      if (showNumbers) {
        textAlign(CENTER, CENTER);
        fill(0);
        noStroke();
        if (color === 2) {
          text(
            robots[row][col],
            cellX + squareSize / 2,
            cellY + squareSize / 2
          );
        } else if (color === 3) {
          text(
            destinations[row][col],
            cellX + squareSize / 2,
            cellY + squareSize / 2
          );
        } else if (color == 5) {
          robots[row][col] > 99 || destinations[row][col] > 99
            ? textSize(8)
            : textSize(10);
          fill(0);
          text(
            robots[row][col],
            cellX + 1 + squareSize / 4,
            cellY + 1 + squareSize / 4
          );
          text(
            destinations[row][col],
            cellX + (3 * squareSize) / 4,
            cellY + (3 * squareSize) / 4
          );
          textSize(14);
        }
      }
    }
  }
}

function displayInstructions() {
  noStroke();
  fill(0);
  textAlign(LEFT, CENTER);

  text(
    "Usa el mouse para dibujar celdas. Presiona Z para mostrar/ocultar los números",
    25,
    canvasHeight - 10
  );
}

function addButtons() {
  let w = floor(height / (2 * pallete.length));

  for (i = 0; i < pallete.length; i++) {
    let color = pallete[i];
    addButton(1, i * w, w, w, color);
  }
}

function addButton(x, y, w, h, color) {
  let btn = { x: x + 10, y: y + 10, w: w, h: h, color: color };

  buttons.push(btn);

  return btn;
}

function handleButtons() {
  if (!mouseIsPressed) return;

  buttons.forEach((btn, idx) => {
    if (collisionPointRect(mouseX, mouseY, btn.x, btn.y, btn.w, btn.h)) {
      selectedColor = idx;
    }
  });
}

function drawButtons() {
  for (let btn of buttons) {
    drawButton(btn);
  }
}

function drawButton(btn) {
  stroke(0);
  strokeWeight(1);
  fill(btn.color);
  if (pallete[selectedColor] === btn.color) {
    rect(btn.x - 5, btn.y, btn.w + 5, btn.h);
  } else {
    rect(btn.x, btn.y, btn.w, btn.h);
  }

  writeLabel(btn);
}

function drawCopyButton() {
  stroke(0);
  fill(color("lightgreen"));
  rect(10, 450, 75, 75);
  textAlign(CENTER, CENTER);
  fill(0);
  noStroke();
  textSize(10);
  text("Generar ASP", 10 + 75 / 2, 450 + 75 / 2);
  textSize(14);
  if (collisionPointRect(mouseX, mouseY, 10, 450, 75, 75) && mouseIsPressed) {
    mapToClingo();
  }
}

function writeLabel(btn) {
  let t = "";
  fill("black");
  noStroke();
  textSize(14);

  switch (btn.color) {
    case "white":
      t = "Goma";
      break;
    case "lightblue":
      t = "Robot";
      break;
    case "pink":
      t = "Destino";
      break;
    case "black":
      textSize(11);
      fill("white");
      t = "Obstáculo";
      break;
    default:
      break;
  }

  textAlign(CENTER, CENTER);
  text(t, btn.x + btn.w / 2, btn.y + btn.h / 2);
}

function collisionPointRect(
  pointX,
  pointY,
  rectX,
  rectY,
  rectWidth,
  rectHeight
) {
  return (
    pointX > rectX &&
    pointX < rectX + rectWidth &&
    pointY > rectY &&
    pointY < rectY + rectHeight
  );
}

const copyToClipboard = (str) => {
  const el = document.createElement("textarea");
  el.value = str;
  el.setAttribute("readonly", "");
  el.style.position = "absolute";
  el.style.left = "-9999px";
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
};

const mapToClingo = () => {
  let output = [`rangeX(0..${noCols - 1}).`, `rangeY(0..${noRows - 1}).`];
  Object.entries(usedRobots).forEach(([robot, present]) => {
    present ? output.push(`robot(${robot}).`) : "";
  });
  for (let row = 0; row < noRows; row++) {
    for (let col = 0; col < noCols; col++) {
      switch (map[row][col]) {
        case 1:
          output.push(`obstacle(${col},${row}).`);
          break;
        case 2:
          idRobot = robots[row][col];
          output.push(`on(${idRobot},${col},${row},0).`);
          break;
        case 3:
          idDest = destinations[row][col];
          output.push(`goal(${idDest},${col},${row}).`);
          break;
        case 5:
          idRobot = robots[row][col];
          output.push(`on(${idRobot},${col},${row},0).`);
          idDest = destinations[row][col];
          output.push(`goal(${idDest},${col},${row}).`);
          break;
      }
    }
  }
  copyToClipboard(output.join("\n"));
};
