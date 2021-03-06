var simpleLevelPlan = [
  "                      ",
  "                      ",
  "  x              = x  ",
  "  x         o o    x  ",
  "  x @      xxxxx   x  ",
  "  xxxxx            x  ",
  "      x!!!!!!!!!!!!x  ",
  "      xxxxxxxxxxxxxx  ",
  "                      "
];

function Level(plan) {
  this.width = plan[0].length;
  this.height = plan.length;
  this.grid = [];
  this.actors = [];

  for (var y = 0; y < this.height; y++) {
    var line = plan[y], gridLine = [];
    for (var x = 0; x < this.width; x++) {
      var ch = line[x], fieldType = null;
      var Actor = actorChars[ch];
      if (Actor)
        this.actors.push(new Actor(new Vector(x, y), ch));
      else if (ch == "x")
        fieldType = "wall";
      else if (ch == "!")
        fieldType = "lava";
      gridLine.push(fieldType);
    }
    this.grid.push(gridLine);
  }

  this.player = this.actors.filter(function(actor) {
    return actor.type == "player";
  })[0];
  this.status = this.finishDelay = null;
}

Level.prototype.isFinished = function() {
  return this.status != null && this.finishDelay < 0;
};

function Vector(x, y) {
  this.x = x; this.y = y;
}
Vector.prototype.plus = function(other) {
  return new Vector(this.x + other.x, this.y + other.y);
};
Vector.prototype.times = function(factor) {
  return new Vector(this.x * factor, this.y * factor);
};

var actorChars = {
  "@": Player,
  "o": Coin,
  "=": Lava, "|": Lava, "v": Lava
};

function Player(pos) {
  this.pos = pos.plus(new Vector(0, -0.5));
  this.size = new Vector(0.8, 1.5);
  this.speed = new Vector(0, 0);
}
Player.prototype.type = "player";

function Lava(pos, ch) {
  this.pos = pos;
  this.size = new Vector(1, 1);
  if (ch == "=") {
    this.speed = new Vector(2, 0);
  } else if (ch == "|") {
    this.speed = new Vector(0, 2);
  } else if (ch == "v") {
    this.speed = new Vector(0, 3);
    this.repeatPos = pos;
  }
}
Lava.prototype.type = "lava";

function Coin(pos) {
  this.basePos = this.pos = pos.plus(new Vector(0.2, 0.1));
  this.size = new Vector(0.6, 0.6);
  this.wobble = Math.random() * Math.PI * 2;
}
Coin.prototype.type = "coin";

var simpleLevel = new Level(simpleLevelPlan);

function elt(name, className) {
  var elt = document.createElement(name);
  if (className) elt.className = className;
  return elt;
}


function DOMDisplay(parent, level) {
  this.wrap = parent.appendChild(elt("div", "game"));
  this.level = level;

  this.wrap.appendChild(this.drawBackground());
  this.actorLayer = null;
  this.drawFrame();
}

var scale = 20;

DOMDisplay.prototype.drawBackground = function() {
  var table = elt("table", "background");
  table.style.width = this.level.width * scale + "px";
  this.level.grid.forEach(function(row) {
    var rowElt = table.appendChild(elt("tr"));
    rowElt.style.height = scale + "px";
    row.forEach(function(type) {
      rowElt.appendChild(elt("td", type));
    });
  });
  return table;
};

DOMDisplay.prototype.drawActors = function() {
  var wrap = elt("div");
  this.level.actors.forEach(function(actor) {
    var rect = wrap.appendChild(elt("div",
                                    "actor " + actor.type));
    rect.style.width = actor.size.x * scale + "px";
    rect.style.height = actor.size.y * scale + "px";
    rect.style.left = actor.pos.x * scale + "px";
    rect.style.top = actor.pos.y * scale + "px";
  });
  return wrap;
};

DOMDisplay.prototype.drawFrame = function() {
  if (this.actorLayer)
    this.wrap.removeChild(this.actorLayer);
  this.actorLayer = this.wrap.appendChild(this.drawActors());
  this.wrap.className = "game " + (this.level.status || "");
  this.scrollPlayerIntoView();
};

DOMDisplay.prototype.scrollPlayerIntoView = function() {
  var width = this.wrap.clientWidth;
  var height = this.wrap.clientHeight;
  var margin = width / 3;

  // The viewport
  var left = this.wrap.scrollLeft, right = left + width;
  var top = this.wrap.scrollTop, bottom = top + height;

  var player = this.level.player;
  var center = player.pos.plus(player.size.times(0.5))
                 .times(scale);

  if (center.x < left + margin)
    this.wrap.scrollLeft = center.x - margin;
  else if (center.x > right - margin)
    this.wrap.scrollLeft = center.x + margin - width;
  if (center.y < top + margin)
    this.wrap.scrollTop = center.y - margin;
  else if (center.y > bottom - margin)
    this.wrap.scrollTop = center.y + margin - height;
};

DOMDisplay.prototype.clear = function() {
  this.wrap.parentNode.removeChild(this.wrap);
};

Level.prototype.obstacleAt = function(pos, size) {
  var xStart = Math.floor(pos.x);
  var xEnd = Math.ceil(pos.x + size.x);
  var yStart = Math.floor(pos.y);
  var yEnd = Math.ceil(pos.y + size.y);

  if (xStart < 0 || xEnd > this.width || yStart < 0)
    return "wall";
  if (yEnd > this.height)
    return "lava";
  for (var y = yStart; y < yEnd; y++) {
    for (var x = xStart; x < xEnd; x++) {
      var fieldType = this.grid[y][x];
      if (fieldType) return fieldType;
    }
  }
};

Level.prototype.actorAt = function(actor) {
  for (var i = 0; i < this.actors.length; i++) {
    var other = this.actors[i];
    if (other != actor &&
        actor.pos.x + actor.size.x > other.pos.x &&
        actor.pos.x < other.pos.x + other.size.x &&
        actor.pos.y + actor.size.y > other.pos.y &&
        actor.pos.y < other.pos.y + other.size.y)
      return other;
  }
};

var maxStep = 0.05;

Level.prototype.animate = function(step, keys) {
  if (this.status != null)
    this.finishDelay -= step;

  while (step > 0) {
    var thisStep = Math.min(step, maxStep);
    this.actors.forEach(function(actor) {
      actor.act(thisStep, this, keys);
    }, this);
    step -= thisStep;
  }
};

Lava.prototype.act = function(step, level) {
  var newPos = this.pos.plus(this.speed.times(step));
  if (!level.obstacleAt(newPos, this.size))
    this.pos = newPos;
  else if (this.repeatPos)
    this.pos = this.repeatPos;
  else
    this.speed = this.speed.times(-1);
};

var wobbleSpeed = 8, wobbleDist = 0.07;

Coin.prototype.act = function(step) {
  this.wobble += step * wobbleSpeed;
  var wobblePos = Math.sin(this.wobble) * wobbleDist;
  this.pos = this.basePos.plus(new Vector(0, wobblePos));
};

var playerXSpeed = 7;

Player.prototype.moveX = function(step, level, keys) {
  this.speed.x = 0;
  if (keys.left) this.speed.x -= playerXSpeed;
  if (keys.right) this.speed.x += playerXSpeed;

  var motion = new Vector(this.speed.x * step, 0);
  var newPos = this.pos.plus(motion);
  var obstacle = level.obstacleAt(newPos, this.size);
  if (obstacle)
    level.playerTouched(obstacle);
  else
    this.pos = newPos;
};

var gravity = 30;
var jumpSpeed = 17;

Player.prototype.moveY = function(step, level, keys) {
  this.speed.y += step * gravity;
  var motion = new Vector(0, this.speed.y * step);
  var newPos = this.pos.plus(motion);
  var obstacle = level.obstacleAt(newPos, this.size);
  if (obstacle) {
    level.playerTouched(obstacle);
    if (keys.up && this.speed.y > 0)
      this.speed.y = -jumpSpeed;
    else
      this.speed.y = 0;
  } else {
    this.pos = newPos;
  }
};

Player.prototype.act = function(step, level, keys) {
  this.moveX(step, level, keys);
  this.moveY(step, level, keys);

  var otherActor = level.actorAt(this);
  if (otherActor)
    level.playerTouched(otherActor.type, otherActor);

  // Losing animation
  if (level.status == "lost") {
    this.pos.y += step;
    this.size.y -= step;
  }
};

Level.prototype.playerTouched = function(type, actor) {
  if (type == "lava" && this.status == null) {
    this.status = "lost";
    this.finishDelay = 1;
  } else if (type == "coin") {
    this.actors = this.actors.filter(function(other) {
      return other != actor;
    });
    if (!this.actors.some(function(actor) {
      return actor.type == "coin";
    })) {
      this.status = "won";
      this.finishDelay = 1;
    }
  }
};

var arrowCodes = {37: "left", 38: "up", 39: "right"};

function trackKeys(codes) {
  var pressed = Object.create(null);
  function handler(event) {
    if (codes.hasOwnProperty(event.keyCode)) {
      var down = event.type == "keydown";
      pressed[codes[event.keyCode]] = down;
      event.preventDefault();
    }
  }
  addEventListener("keydown", handler);
  addEventListener("keyup", handler);
  return pressed;
}

function runAnimation(frameFunc) {
  var lastTime = null;
  function frame(time) {
    var stop = false;
    if (lastTime != null) {
      var timeStep = Math.min(time - lastTime, 100) / 1000;
      stop = frameFunc(timeStep) === false;
    }
    lastTime = time;
    if (!stop)
      requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

var arrows = trackKeys(arrowCodes);

function runLevel(level, Display, andThen) {
  var display = new Display(document.body, level);
  runAnimation(function(step) {
    level.animate(step, arrows);
    display.drawFrame(step);
    if (level.isFinished()) {
      display.clear();
      if (andThen)
        andThen(level.status);
      return false;
    }
  });
}

function runGame(plans, Display) {
  function startLevel(n, lives) {
    runLevel(new Level(plans[n]), Display, function(status) {
      if (status == "lost") {
        if (lives === 0) {
          console.log('Game over!');
          startLevel(0, 3);
        } else {
          startLevel(n, lives - 1);
        }
      } else if (n < plans.length - 1)
        startLevel(n + 1, lives + 3);
      else
        console.log("You win!");
    });
  }
  startLevel(0, 3);
}


var results = [
  {name: "Удовлетворён", count: 1043, color: "lightblue"},
  {name: "Нейтральное", count: 563, color: "lightgreen"},
  {name: "Не удовлетворён", count: 510, color: "pink"},
  {name: "Без комментариев", count: 175, color: "silver"}
];


function CanvasDisplay(parent, level) {
  this.canvas = document.createElement('canvas');
  this.canvas.width = Math.min(600, level.width * scale);
  this.canvas.heigth = Math.min(450, level.height * scale);
  parent.appendChild(this.canvas);
  this.cx = this.canvas.getContext("2d");

  this.level = level;
  this.animationTime = 0;
  this.flipPlayer = false;

  this.viewport = { 
    left: 0,
    top: 0,
    width: this.canvas.width / scale,
    height: this.canvas.height / scale
  };

  this.drawFrame(0);
}

CanvasDisplay.prototype.clear = function() {
  this.canvas.parentNode.removeChild(this.canvas);
};

CanvasDisplay.prototype.drawFrame = function(step) {
  this.animationTime += step;

  this.updateViewport();
  this.clearDisplay();
  this.drawBackground();
  this.drawActors();
};

CanvasDisplay.prototype.updateViewport = function() {
  var view = this.viewport, margin = view.width / 3,
      player = this.level.player,
      center = player.pos.plus(player.size.times(0.5));

      if (center.x < view.left + margin)
        view.left = Math.max(center.x - margin, 0);
      else if(center.x > view.left + view.width - margin)
        view.left = Math.min(center.x + margin - view.width, 
                              this.level.width - view.width);

      if (center.y < view.top + margin)
        view.top = Math.max(center.x - margin, 0);
      else if (center.y > view.top + view.heigth - margin)
        view.top = Math.min(center.y + margin - view.height,
                            this.level.height - view.height);

}

CanvasDisplay.prototype.clearDisplay = function() {
  switch(this.level.status) {
    case "won":
      this.cx.fillStyle = "rgb(68, 191, 255)";
      break;
    case "lost":
      this.cx.fillStyle = "rgb(44, 136, 214)";
      break;
    default:
      this.cx.fillStyle = "rgb(52, 166, 251)";
      break;
  }

  this.cx.fillRect(0, 0, this.canvas.width, this.canvas.height);
};

var otherSprites = document.createElement("img");
otherSprites.src = 'sprites.png';

CanvasDisplay.prototype.drawBackground = function() {
  var view = this.viewport,
      xStart = Math.floor(view.left),
      xEnd = Math.ceil(view.left + view.width),
      yStart = Math.floor(view.top),
      yEnd = Math.ceil(view.top + view.height);

    for (var y = yStart; y < yEnd; y++) {
      for (var x = xStart; x < xEnd; x++) {
        var title = this.level.grid[y][x];
        if (title == null) continue;
        var screenX = (x  - view.left) * scale,
            screenY = (y - view.top) * scale,
            titleX = title == 'lava' ? scale : 0;
            title.cx.drawImage(otherSprites,
              titleX, 0, scale, scale, 
              screenX, screenY, scale, scale);

      }
    }
}

var playerSprites = document.createElement("img");
playerSprites.src = "a_man.png";

var playerXOverlap = 4;


CanvasDisplay.prototype.drawPlayer = function(x, y, width, height) {
  var sprite = 8, player = this.level.player;
  width += playerXOverlap * 2;
  x -= playerXOverlap;
  if (player.speed.x != 0)
    this.flipPlayer = player.speed.x < 0;

  if (player.speed.y != 0)
    sprite = 9;
  else if (player.speed.x != 0)
    sprite = Math.floor(this.animationTime * 12) % 8;

  this.cx.save();
  if (this.flipPlayer)
    flipHorizantally(this.cx, x + width / 2);

  this.cx.drawImage(playerSprites, 
                    sprite * width, 0, width, height,
                    x,              y, width, height);

  this.cx.restore();

};

CanvasDisplay.prototype.drawActors = function() {
  this.level.actors.forEach(function(actor) {
    var width = actor.size.x * scale;
    var height = actor.size.y * scale;
    var x = (actor.pos.x - this.viewport.left) * scale;
    var y = (actor.pos.y - this.viewport.top) * scale;
    if (actor.type == "player") {
      this.drawPlayer(x, y, width, height);
    } else {
      var tileX = (actor.type == "coin" ? 2 : 1) * scale;
      this.cx.drawImage(otherSprites,
                        tileX, 0, width, height,
                        x,     y, width, height);
    }
  }, this);
};
function flipHorizantally(context, around) {
  context.translate(around, 0);
  context.scale(-1, 1);
  context.translate(-around, 0);
}

addEventListener('load', function() {
  
  var c_context = getElContext('c'),
      grid = document.getElementById('grid'),
      grid_c = grid.getContext('2d');


    c_context.fillStyle = '#ff0';
    c_context.fillRect(10, 10, 100, 50);

    c_context.strokeStyle = '#0ff';
    c_context.strokeRect(10, 10, 100, 50);
    c_context.lineWidth = 5;
    c_context.strokeRect(135, 5, 50, 50);

    grid
    grid_c.beginPath();
    for (var y = 0.5; y < 120.5; y += 10) {
        grid_c.moveTo(10, y);
        grid_c.lineTo(90, y);
        if (y > 10 && y < 100) {
          grid_c.moveTo(y, 0);
          grid_c.lineTo(y, 110);
        }
    }
    grid_c.stroke();  

   var r = getElContext('rect');

   r.beginPath();

   r.moveTo(20 * 3, 20 * 3);
   r.lineTo(40 * 3, 20 * 3);
   r.lineTo(30 * 3, 40 * 3);
   r.lineTo(20 * 3, 20 * 3);
   r.lineWidth = 2
   r.strokeStyle = '#f0f';
   r.stroke();
   r.fillStyle = '#fff';
   r.fill();

   r.beginPath();
   r.strokeStyle = '#f00';
   r.moveTo(40, 120);
   // control=(60,10) goal=(90,90)
   r.quadraticCurveTo(90, 30, 120, 120);
   r.lineTo(90, 30);
   r.closePath();
   r.stroke();

   r.beginPath();
   r.strokeStyle = '#ff6e00';
   r.moveTo(10, 90);
   // control1=(10,10) control2=(90,10) goal=(50,90)
   r.bezierCurveTo(10, 10, 90, 10, 50, 90);
   r.lineTo(90, 10);
   r.lineTo(10, 10);
   r.closePath();
   r.stroke();

   r.beginPath();
   r.strokeStyle = '#0f0'
   r.moveTo(30, 130);
   r.arcTo(200, 100, 190, 190, 20);
   r.moveTo(30, 130);
   r.arcTo(200, 100, 190, 190, 80);
   r.stroke();

   r.beginPath();
   r.fillStyle = '#f0f';
   r.arc(100, 75, 70, 0, 7);
   // r.fill();
   r.stroke();
   r.closePath();

   var d = getElContext('d'),
       total = results.reduce(function(sum, choice) {
         return sum + choice.count;
       }, 0),
        currentAngle = 1.5 * Math.PI;
    results.forEach(function(result) {
      var sliceAngle = (result.count / total) * 2 * Math.PI;
      d.beginPath();

      d.arc(50, 50, 50, currentAngle, currentAngle + sliceAngle);
      currentAngle += sliceAngle;
      d.lineTo(50, 50);
      d.fillStyle = result.color;
      d.fill();
    });

    d.font = '30px sans';
    d.textAlign = 'center';
    d.textBaseline = 'middle';
    d.fillStyle = '#f0f';
    // d.fillText('Hello World!', 110, 30);
    d.strokeText('Hello World!', 110, 30);

  var img = document.createElement('img'),
      mario = getElContext('mario');

  img.src = 'mario.png';


  img.addEventListener('load', function() {

    for (var y = 10; y <= 400; y += 30){
      for (var x = 10; x <= 400; x += 50)
        mario.drawImage(img, x, y , 30, 20);
    }
  });

  var man = getElContext('man'),
      manImg = document.createElement('img'),
      spriteW = 24, spriteH = 100;

  manImg.src = 'a_man.png';

  manImg.addEventListener('load', function() {
    var cycle = 0;

    setInterval(function() {
      man.clearRect(0, 0, spriteW, spriteH);
      man.drawImage(manImg, cycle * spriteW, 0, spriteW, spriteH,
       0, 0, spriteW, spriteH);

      cycle = (cycle + 1) % 9;
    }, 120);
    man.scale(3, .5);
    man.beginPath();
    man.arc(50, 150, 40, 0, 7);
    man.lineWidth = 3;
    man.strokeStyle = '#c0f';
    man.fillStyle = '#ff0';
    man.stroke();
    man.fill();
    man.closePath();
  });

  var playerImg = document.createElement('img'),
      player = getElContext('player'),
      spriteW = 37, spriteH = 100;

  playerImg.src = 'a_man.png';

  playerImg.addEventListener('load', function() {
    var cycle = 0;


    flipHorizantally(player, (100 + spriteW / 2));
    setInterval(function() {
      player.clearRect(0, 0, spriteW, spriteH);
      player.drawImage(playerImg, cycle * spriteW, 0, spriteW, spriteH, 0, 0, spriteW, spriteH);

      cycle = (cycle + 1) % 9;
      
    }, 120);



  });



  var tree = getElContext('tree');
  tree.fillStyle = '#f0f';
  function branch(length, angle, scale) {
    tree.fillRect(0, 0, 1, length);

    if (length < 8) return;

    tree.save();
    tree.translate(0, length);
    tree.rotate(-angle);
    branch(length * scale, angle, scale);
    tree.rotate(2 * angle);
    branch(length * scale, angle, scale);
    tree.restore();
  }
  tree.translate(150, 0);
  branch(37, 0.5, 0.8);

});

function getElContext(el) {
     return document.getElementById(el).getContext('2d');;
};  

