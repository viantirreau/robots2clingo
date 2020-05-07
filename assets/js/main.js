const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 900;
const COLOR_PALLETE = ["white", "black", "lightblue", "pink"];
const BUTTON_PADDING = 10;


const sharedData = { // BEWARE. Global variable
  selectedColor: 1,
  showNumbers: true,
  editorX: 200,
  editorY: 10,
};


// Disable right click
window.oncontextmenu = (e) => {
  e.preventDefault();
}

selectorSetUp();


/*
 * p5 setup function
 */
function setup() {
  clear();

  // Canvas stuff
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  pixelDensity(1);

  // Generate map
  generateMap(selectorValue());

  // Logic stuff
  createButtons(COLOR_PALLETE);
}


/*
 * p5 draw function
 */
function draw() {
  clear();

  // Buttons
  drawButtons(COLOR_PALLETE);
  handleButtons();
  createCopyButton();

  // Display map
  const blockSize = getBlockSize(sharedData.mapSize, CANVAS_HEIGHT);
  displayMap(blockSize, COLOR_PALLETE);

  // Interactive stuff
  handleCellClick(blockSize);
}


/*
 * Catch key presses
 */
function keyPressed() {
  if (key.toUpperCase() === "Z") {
    // Reverse the show numbers boolean
    sharedData.showNumbers = !sharedData.showNumbers;
  }
}
