/*
 * Create a generator object from :start to :end, not including :end
 */
function* range(start, end) {
  for (let iii = start; iii < end; iii++) {
      yield iii;
  }
}


/*
 * Given an amount of blocks and the canvas size,
 * returns the size of each block to use 80% of
 * the canvas height
 */
const getBlockSize = (blocks, canvasHeight) => {
  const maxSize = canvasHeight * 0.8; // Use just part of the canvas
  return Math.floor(maxSize / blocks);
}


/*
 * Generate a squared zero-filled matrix of size :size
 */
const zeroFilledMatrix = (size) => {
  return Array.from([...range(0, size)], () => {
    return [...range(0, size)].fill(0);
  });
}


/*
 * Finds the id of the first false element. Notice that
 * this function DOES NOT return the index of the
 * element, but rather its id (index + 1)
 */
const findFirstFalseElement = (data, mapSize) => {
  for (let iii = 1; iii < mapSize * mapSize + 1; iii++) {
    if (data[iii] === false) {
      return iii;
    }
  }
}


/*
 * Copies a string to the clipboard. SO hacky
 */
const copyToClipboard = (string) => {
  // Create container
  const $invisibleContainer = document.createElement("textarea");

  // Hide container
  $invisibleContainer.setAttribute("readonly", "");
  $invisibleContainer.style.position = "absolute";
  $invisibleContainer.style.left = "-9999px";

  // Fill container
  $invisibleContainer.value = string;

  // **Magic**
  document.body.appendChild($invisibleContainer);
  $invisibleContainer.select();
  document.execCommand("copy");
  document.body.removeChild($invisibleContainer);
};
