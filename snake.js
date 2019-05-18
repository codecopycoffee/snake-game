//Set up the snake, fruit, and berry ojbects
var draw = (snakeToDraw, fruit, berry) => {
  var drawableSnake = { color: "#39FF14", pixels: snakeToDraw };
  var drawableFruit = { color: "#00FFFF", pixels: [fruit] };
  var drawableBerry = { color: "#A800FF", pixels: [berry] };
  var drawableObjects = [drawableSnake, drawableFruit, drawableBerry];
  CHUNK.draw(drawableObjects);
}

//Move your snake based on key assignments in CHUNK
var moveSegment = (segment) => {
  if (segment.direction === "up") {
    return {top: segment.top - 1, left: segment.left}
  } else if (segment.direction === "right") {
    return {top: segment.top, left: segment.left + 1}
  } else if (segment.direction === "down") {
    return {top: segment.top + 1, left: segment.left}
  } else if (segment.direction === "left") {
    return {top: segment.top, left: segment.left - 1}
  }
  return segment
}

//Coordinate your snake's segments
var nextSegment = (index, snake) => {
  if (snake[index - 1] === undefined) {
    return snake[index]
  } else {
  return snake[index - 1]
  }
}

var moveSnake = (snake) => {
  return snake.map(function(oldSegment, segmentIndex) {
    var newSegment = moveSegment(oldSegment);
    newSegment.direction = nextSegment(segmentIndex, snake).direction;
    return newSegment;
  });
}

//Grow snake when it eats a fruit
var growSnake = (snake) => {
  var tipOfTailIndex = snake.length - 1;
  var tipOfTail = snake[tipOfTailIndex];
  snake.push({ top: tipOfTail.top, left: tipOfTail.left });
  return snake;
}

//Shrink snake when it eats a berry
var shrinkSnake = (snake) => {
  var tipOfTailIndex = snake.length - 1;
  var tipOfTail = snake[tipOfTailIndex];
  if (snake.length > 1) {
    snake.pop({ top: tipOfTail.top, left: tipOfTail.left });
  } else if (snake.length === 1) {
    CHUNK.endGame();
    CHUNK.flashMessage("You Benjamin Buttoned!");
  }
  return snake;
}

//Detect a collision
var ate = (snake, otherThing) => {
  var head = snake[0];
  return CHUNK.detectCollisionBetween([head], otherThing);
}

//Progresses the game depending on what the snake has come into contact with
var advanceGame = () => {
  var newSnake = moveSnake(snake);

  if (ate(newSnake, snake)) {
    CHUNK.endGame();
    CHUNK.flashMessage("You ate yourself!");
  }

  if (ate(newSnake, [fruit])) {
    newSnake = growSnake(newSnake);
    fruit = CHUNK.randomLocation();
    upScore();
  }

  if(ate(newSnake, [berry])) {
    newSnake = shrinkSnake(newSnake);
    berry = CHUNK.randomLocation();
    downScore();
  }

  if (ate(newSnake, CHUNK.gameBoundaries())) {
    CHUNK.endGame();
    CHUNK.flashMessage("You hit a wall!");
  }

  snake = newSnake;
  draw(snake, fruit, berry);
}

var changeDirection = (direction) => {
  snake[0].direction = direction;
}

var score = 0

var upScore = () => {
  score = score + 5
  return document.getElementById('seeScore').innerHTML = "SCORE: " + score
}

var downScore = () => {
  score = score - 3
  return document.getElementById('seeScore').innerHTML = "SCORE: " + score
}

var resetGame = () => {
  window.location.reload()
}

var fruit = CHUNK.randomLocation();
var berry = CHUNK.randomLocation();
var snake = [{ top: 1, left: 0, direction: "down" }, { top: 0, left: 0, direction: "down" }];

CHUNK.executeNTimesPerSecond(advanceGame, 4);
CHUNK.onArrowKey(changeDirection);
