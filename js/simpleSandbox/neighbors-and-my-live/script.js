// Constants
const RIGHT_END = 'RIGHT_END';
const LEFT_END = 'LEFT_END';
const CENTER = 'CENTER';
const START = 'START';
const END = 'END';
const FIRST_RIGHT_CORNER = 'FIRST_RIGHT_CORNER';
const LAST_LEFT_CORNER = 'LAST_LEFT_CORNER';
const width = 20;
const height = 20;
// Selects

let grid = customGreed('#grid', width, height, '20');
const nextGeneration = getEl('#next');
const reset = getEl('#reset');

let steps = 0;
let result = getEl('#result');

makeField(grid, width, height);
  
  
nextGeneration.addEventListener('click', () => {
  generateGeneration(grid, width, height);
  result.innerText = steps;
});

reset.addEventListener('click', () => {
  cleanGrid(grid);
  makeField(grid, width, height);
  steps = 0;
  result.innerText = '';
});


function cleanGrid(grid) {
  while (grid.childNodes.length !== 0)
    grid.removeChild(grid.lastChild);
}
function makeField(grid, width, height) {
  let id = 1, x, y;

  for (y = 0; y < height; y++) {
    for (x = 0; x < width; x++) {
      let entity = createEl('input');   
      entity.type = 'checkbox';

      // id of a some checkbox
      entity.value = id;
      entity.title = id;
      
      entity.onclick = (e) => {
        divineJob(grid, width, e.target);
      }
    
      grid.appendChild(entity);
      id += 1;
    }
  }
}

function generateGeneration(grid, width, height) {
  const entitiesLength = grid.childNodes.length;

    for (let i = 1; i < entitiesLength; i++) {
        // При генерации не изменяются умершие клетки.
        let entity = grid.childNodes[i];
        if (!steps) {
          entity.checked = entity.type == 'checkbox' &&
              Math.round(Math.random()) ?
                  true :
                  false;
        }
        else {
          if (entity.disabled){
            entity.checked = true;
          }
          else{
            entity.checked = entity.type == 'checkbox' &&
                Math.round(Math.random()) ?
                    true :
                    false;
          }
        }
      }

  steps += 1;
  
  divineJob(grid, width, height)
  
};

function divineJob (grid, width, height) {
  let entities = grid.childNodes;
  entities.forEach((entity) => {
      // An empty entity is not an entity.
      if (entity.checked)
        liveOrDie(grid, entity, width, height);
  });
}
// If an entity has 2 or 3 neighbors, it will live, otherwise it will die.             
function liveOrDie(grid, entity, width, heigth) {
  const neighborsLength = checkNeighbors(grid, entity, width, heigth);

  if (neighborsLength === 2 || neighborsLength === 3) {
    entity.disabled = false;
  } else {
    entity.disabled = true;
  }
    
};

// Return amount of neighbors new an entity.
function checkNeighbors(grid, element, width, heigth) {
  let people = grid.childNodes;
  let entityId = element.value;
  // ids of neigthborses
  let right = +entityId + 1, 
      left = entityId - 1,
      top = entityId - width,
      bottom = +entityId + width,
      topRight = entityId - width + 1,
      topLeft = entityId - width - 1,
      bottomRight = +entityId + width + 1,
      bottomLeft = +entityId + width - 1;

  const position = geolocate(entityId, width, heigth);
  switch (position) {
    case LEFT_END:
      left = -1;
      topLeft = -1;
      bottomLeft = -1;
      break;
    case RIGHT_END:
      right = -1;
      topRight = -1;   
      bottomRight = -1;
      break;
    case START:
      left = -1;
      bottomLeft = -1;
      topLeft = -1;
      top = -1;
      topRight = -1;
      break;
    case END:
      bottomLeft = -1;
      bottom = -1;
      bottomRight = -1;
      right = -1;
      topRight = -1;
      break;
    case LAST_LEFT_CORNER:
      left = -1;
      bottomLeft = -1;
      topLeft = -1;
      bottom = -1;
      bottomRight = -1;
      break;
    case FIRST_RIGHT_CORNER:
      topLeft = -1;
      top = -1;
      topRight = -1;
      right = -1;
      bottomRight = -1;
      break;
    default:
      // It is CENTER, it means to pass
      break;
  }

  const neighborsIds = [
    top,
    left, 
    right, 
    topRight,
    topLeft,
    bottomLeft,
    bottom,
    bottomRight
  ];

  return neighborsIds
    .map(id => {
      // If id equil -1, than an entity doesn't exist.
      let entity = people[id - 1];

      return id > 0 && entity && entity.type === 'checkbox' ? 
            entity.checked :
            false;
    })
    // Neighbor is boolean value.
    .filter(neighbor => (neighbor)).length;
}
function geolocate(entityId, width, height) {
  /* Ячейка может находится.
   * 1. В начале.
   * 2. Справа в первой строке.
   * 3. Слева в каждой строке, кроме верхней и последней.
   * 4. Справа в каждой строке, кроме верхней и последней.
   * 5. Слева в самой последней строке.
   * 6. В конце.
   * 7. Где-то в центре.
   */
  
  // У 3 и 4 пункта априорная вероятность больше, чем у остальных.
  const square = width * height;
  // Для начала проверяется первый элемент.
  if (+entityId === 1) {
    return START;
  } else if (entityId % width === 1) {
    // Левый конец строки.
    return LEFT_END;
  } else if (entityId % width === 0) {
    // Правый конец строки.
    return RIGHT_END;
  } else if (+entityId === width) {
    // Правый угол в последней строке.
    return FIRST_RIGHT_CORNER;
  } else if (+entityId === square) {
    return END;
  } else if (+entityId === (square - width) ){ 
    // Левый угол в последней строке.
    return LAST_LEFT_CORNER;
  } else {
    return CENTER;
  }
}

function createEl(tag) {
  return document.createElement(tag); 
}

function getEl(name) {
  return document.querySelector(name); 
}

function customGreed(grid, width, height, sizeCell) {

  let el = getEl(grid);
  let styles = el.style;
  let i;

  for (let i = 0; i < height; i++) 
    styles.gridTemplateRows += ` ${sizeCell}px`
  for (let i = 0; i < width; i++) 
    styles.gridTemplateColumns += ` ${sizeCell}px`

  return el;
}  