/*
 * Reset the state of the map if it exists and generate
 * a completely clean new map state
 */
const generateMap = (mapSize) => {
  // sharedData is a global variable defined in main.js
  sharedData.mapSize = mapSize;
  sharedData.map = zeroFilledMatrix(mapSize);
  sharedData.robots = zeroFilledMatrix(mapSize);
  sharedData.destinations = zeroFilledMatrix(mapSize);

  // Weird robots and destinations fillup
  sharedData.usedRobots = new Object();
  sharedData.usedDestinations = new Object();
  [...range(1, mapSize * mapSize + 1)].forEach((position) => {
    sharedData.usedRobots[position] = false;
    sharedData.usedDestinations[position] = false;
  });

  return map;
}


/*
 * Displays the map. HORRIBLY hardcoded and long function
 */
const displayMap = (blockSize, colorPallete) => {
  // sharedData is a global variable defined in main.js
  [...range(0, sharedData.mapSize)].forEach((row) => {
    [...range(0, sharedData.mapSize)].forEach((column) => {
      const cellX = sharedData.editorX + column * blockSize;
      const cellY = sharedData.editorY + row * blockSize;
      const color = sharedData.map[row][column];

      // Color
      if (color < colorPallete.length) {
        fill(colorPallete[color]);
        stroke(0);
        rect(cellX, cellY, blockSize, blockSize);
      } else { // Half and half
        // First half
        fill(colorPallete[2]);
        triangle(
          cellX + 1,
          cellY + 1,
          cellX + 1,
          cellY + blockSize,
          cellX + blockSize + 1,
          cellY + 1,
        );

        // Second half
        fill(colorPallete[3]);
        triangle(
          cellX,
          cellY + blockSize,
          cellX + blockSize,
          cellY + blockSize,
          cellX + blockSize,
          cellY,
        );
      }

      // Show numbers
      if (sharedData.showNumbers) {
        textAlign(CENTER, CENTER);
        fill(0);
        noStroke();
        if (color === 2) {
          text(
            sharedData.robots[row][column],
            cellX + blockSize / 2,
            cellY + blockSize / 2
          );
        } else if (color === 3) {
          text(
            sharedData.destinations[row][column],
            cellX + blockSize / 2,
            cellY + blockSize / 2
          );
        } else if (color == 5) {
          sharedData.robots[row][column] > 99 || sharedData.destinations[row][column] > 99
            ? textSize(8)
            : textSize(10);
          fill(0);
          text(
            sharedData.robots[row][column],
            cellX + 1 + blockSize / 4,
            cellY + 1 + blockSize / 4
          );
          text(
            sharedData.destinations[row][column],
            cellX + (3 * blockSize) / 4,
            cellY + (3 * blockSize) / 4
          );
          textSize(14);
        }
      }
    });
  });
}


/*
 * Handles the cell click logic. Quite tangly
 */
const handleCellClick = (blockSize) => {
  if (!mouseIsPressed) {
    return;
  }

  // sharedData is a global variable defined in main.js
  const column = Math.floor((mouseX - sharedData.editorX) / blockSize);
  const row = Math.floor((mouseY - sharedData.editorY) / blockSize);

  if (column < 0 || column >= sharedData.mapSize || row < 0 || row >= sharedData.mapSize) {
    // Out of bounds
    return;
  }

  if (sharedData.selectedColor === 0 || sharedData.selectedColor === 1) {
    if (sharedData.robots[row][column] !== 0) {
      sharedData.usedRobots[sharedData.robots[row][column]] = false;
      sharedData.robots[row][column] = 0;
    }
    if (sharedData.destinations[row][column] !== 0) {
      sharedData.usedDestinations[sharedData.destinations[row][column]] = false;
      sharedData.destinations[row][column] = 0;
    }
  } else if (sharedData.selectedColor === 2 && sharedData.robots[row][column] === 0) {
    const lowestIndex = findFirstFalseElement(sharedData.usedRobots, sharedData.mapSize);
    console.log(lowestIndex);
    sharedData.robots[row][column] = lowestIndex;
    sharedData.usedRobots[lowestIndex] = true;
  } else if (sharedData.selectedColor === 3 && sharedData.destinations[row][column] === 0) {
    const lowestIndex = findFirstFalseElement(sharedData.usedDestinations, sharedData.mapSize);
    sharedData.destinations[row][column] = lowestIndex;
    sharedData.usedDestinations[lowestIndex] = true;
  }

  sharedData.map[row][column] = (
    sharedData.destinations[row][column] !== 0 && sharedData.robots[row][column] !== 0 ?
    5 : sharedData.selectedColor
  );
}


/*
 * Returns a giant string representing
 * the whole clingo file
 */
const mapToClingo = () => {
  // sharedData is a global variable defined in main.js
  const output = [`rangeX(0..${sharedData.mapSize - 1}).`, `rangeY(0..${sharedData.mapSize - 1}).`];
  Object.entries(sharedData.usedRobots).forEach(([robot, present]) => {
    present ? output.push(`robot(${robot}).`) : "";
  });
  [...range(0, sharedData.mapSize)].forEach((row) => {
    [...range(0, sharedData.mapSize)].forEach((column) => {
      switch (sharedData.map[row][column]) {
        case 1:
          output.push(`obstacle(${column},${row}).`);
          break;
        case 2:
          output.push(`on(${sharedData.robots[row][column]},${column},${row},0).`);
          break;
        case 3:
          output.push(`goal(${sharedData.destinations[row][column]},${column},${row}).`);
          break;
        case 5:
          output.push(`on(${sharedData.robots[row][column]},${column},${row},0).`);
          output.push(`goal(${sharedData.destinations[row][column]},${column},${row}).`);
          break;
      }
    });
  });

  return output.join("\n");
};
