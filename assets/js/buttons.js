/*
 * Create every button and return an array with them
 */
const createButtons = (colorPallete) => {
  // sharedData is a global variable defined in main.js
  sharedData.buttons = [];
  // :height is a magic variable, no idea where it comes from or
  // why does it work
  const size = Math.floor(height / (2 * colorPallete.length));

  [...range(0, colorPallete.length)].forEach((position) => {
    const color = colorPallete[position];
    const button = createButton(0, position * size, size, size, color);
    sharedData.buttons.push(button);
  });
}


/*
 * Return an object with the desired button attributes
 */
const createButton = (x, y, w, h, color) => {
  return {
    x: x + BUTTON_PADDING,
    y: y + BUTTON_PADDING,
    w: w,
    h: h,
    color: color,
  };
}


/*
 * Iterate over :buttons and draw them
 */
const drawButtons = (colorPallete) => {
  // sharedData is a global variable defined in main.js
  sharedData.buttons.forEach((button) => {
    drawButton(button, colorPallete);
  });
}


/*
 * Draw a :button
 */
const drawButton = (button, colorPallete) => {
  stroke(0);
  strokeWeight(1);
  fill(button.color);
  // sharedData is a global variable defined in main.js
  if (colorPallete[sharedData.selectedColor] === button.color) {
    // This button is selected, make it stand out
    rect(button.x - 5, button.y, button.w + 5, button.h);
  } else {
    rect(button.x, button.y, button.w, button.h);
  }

  writeLabel(button);
}


/*
 * Add an event handler to each button
 */
const handleButtons = () => {
  if (!mouseIsPressed) {
    return;
  }

  // sharedData is a global variable defined in main.js
  sharedData.buttons.forEach((button, idx) => {
    if (pointIsInRect(mouseX, mouseY, button.x, button.y, button.w, button.h)) {
      sharedData.selectedColor = idx;
    }
  });
}


/*
 * Fills the label of a button using its color
 */
const writeLabel = (button) => {
  let labelText = "";
  fill("black");
  noStroke();
  textSize(14);

  switch (button.color) {
    case "white":
      labelText = "Goma";
      break;
    case "lightblue":
      labelText = "Robot";
      break;
    case "pink":
      labelText = "Destino";
      break;
    case "black":
      textSize(11);
      fill("white");
      labelText = "Obstáculo";
      break;
    default:
      break;
  }

  textAlign(CENTER, CENTER);
  text(labelText, button.x + button.w / 2, button.y + button.h / 2);
}


/*
 * Create and enable the copy button. VERY hardcoded
 */
const createCopyButton = () => {
  stroke(0);
  fill(color("lightgreen"));
  rect(10, 500, 100, 75);
  if (pointIsInRect(mouseX, mouseY, 10, 500, 100, 75)) {
    if (mouseIsPressed) {
      const clingoData = mapToClingo();
      copyToClipboard(clingoData);
    }
    fill(color("springgreen"));
    rect(10, 500, 100, 75);
    textSize(10);
    noStroke();
    fill(0);
    text("(Clic para copiar)", 10 + 100 / 2, 500 + 75 / 2 + 20);
  }
  noStroke();
  textSize(13);
  textAlign(CENTER, CENTER);
  fill(0);
  text("Generar ASP", 10 + 100 / 2, 500 + 75 / 2);
  textSize(14);
}


/*
 * Checks if a point is inside a rectangle
 */
const pointIsInRect = (pointX, pointY, rectX, rectY, rectWidth, rectHeight) => {
  return (
    pointX > rectX &&
    pointX < rectX + rectWidth &&
    pointY > rectY &&
    pointY < rectY + rectHeight
  );
}
