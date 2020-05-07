const DEFAULT_SELECTOR_VALUE = 12;
const MIN_SELECTOR_VALUE = 5;
const MAX_SELECTOR_VALUE = 25;


/*
 * Set up the map size selector
 */
const selectorSetUp = () => {
  const $selector = document.getElementById('select');

  // Create options using the :range function from helpers.js
  [...range(MIN_SELECTOR_VALUE, MAX_SELECTOR_VALUE + 1)].forEach((value) => {
    const $option = document.createElement('option');
    $option.value = value;
    $option.text = value;
    if (value == DEFAULT_SELECTOR_VALUE) {
      $option.selected = true;
    }
    $selector.add($option);
  });


  $selector.addEventListener('change', function (event) {
    // Redraw the map with the new size
    setup(); // Quite illegal, but hey, it's an imperfect world
    redraw();
  });
}


/*
 * Get the map size selector value
 */
const selectorValue = () => {
  const $selector = document.getElementById('select');
  return $selector.options[$selector.selectedIndex].value;
}
