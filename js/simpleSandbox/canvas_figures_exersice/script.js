function getElementContext(element) {
	return document.getElementById(element).getContext('2d');	
}
var cx = getElementContext('figures');
drawTrapeze(cx);
drawRotatedSquare(cx, 40);
drawFence(cx, 250, 20, 12, 80); // context, posX, posY, height, width
drawSpiral(cx, 410, 65, 50);
drawStar(cx, 490, 10, '#fc1', 60);

function drawRotatedSquare(context, rotate) {
	context.save()
	context.rotate(45 * Math.PI / 180);
	context.beginPath();
	context.rect(145, -115, 60, 60);
	context.fillStyle = '#f00';
	context.fill();
	context.restore();
}


function drawTrapeze(context) {
	context.beginPath();
	context.moveTo(35, 30);
	context.lineTo(100, 30);
	context.lineTo(120, 100);
	context.lineTo(15, 100);
	context.lineTo(35, 30);
	context.stroke();
	context.closePath();
}

function drawFence(context, posX, posY, height, width) {
	context.beginPath();
	context.moveTo(posX, posY);
	for (var x = 0; x < height; x++) {
		posY += 8;
		if(x % 2 === 0)
			context.lineTo(posX + width, posY);
		else 
			context.lineTo(posX, posY);
	}
	context.stroke();
	context.closePath();

}

function drawSpiral(context, x, y, size) {
	var angle = size / 6,
		iFlipHalfCircle = true,
		halfOfCircle = 1 * Math.PI;
		// halfOfCircleTwo = Math.cos(-1 / Math.PI);

	for (var i = size; i  >= 0; i -= angle) {
		context.beginPath();
		context.save();
		if (iFlipHalfCircle)
			context.arc(x + angle, y, i, 0, halfOfCircle);
		else 
			context.arc(x, y, i, halfOfCircle, 0);
		context.stroke();
		context.restore();
		context.closePath();

		iFlipHalfCircle = !iFlipHalfCircle;
	}
}

function drawStar(context, x, y, color, radius) {

	var xCenter = x + radius, yCenter = y + radius;
	context.beginPath();
	context.moveTo(xCenter, yCenter);

	for (var i = 0; i <= 8; i++) {

		var angle = i * Math.PI / 4;
		context.quadraticCurveTo(xCenter, yCenter,
			   xCenter + Math.cos(angle) * radius,
			   yCenter + Math.sin(angle) * radius);
	}

	context.fillStyle = color;
	context.fill();
	

}




var results = [
  {name: "Satisfied", count: 1043, color: "lightblue", fontColor: "darkorange"},
  {name: "Neutral", count: 563, color: "lightgreen", fontColor: "darkred"},
  {name: "Unsatisfied", count: 510, color: "pink", fontColor: "red"},
  {name: "No comment", count: 175, color: "silver", fontColor: "black"}
];

var ch = getElementContext('chart');;
var total = results.reduce(function(sum, choice) {
return sum + choice.count;
}, 0);

var currentAngle = -0.5 * Math.PI;
var centerX = 300, centerY = 150;
// Add code to draw the slice labels in this loop.
results.forEach(function(result) {
	var sliceAngle = (result.count / total) * 2 * Math.PI;
	ch.beginPath();
	ch.arc(centerX, centerY, 100,
	       currentAngle, currentAngle + sliceAngle);
		
	ch.lineTo(centerX, centerY);
	ch.fillStyle = result.color;
	ch.fill();
	var middleAngle = currentAngle + 0.5 * sliceAngle,
		textX = Math.cos(middleAngle) * 100 + centerX,
		textY = Math.sin(middleAngle) * 100  + centerY;
	ch.font = '15px serif';
	ch.fillStyle = result.fontColor;
	ch.fillText(result.name, textX, textY);
	currentAngle += sliceAngle;
});

 var ball = getElementContext('ball');

  var lastTime = null;
  function frame(time) {
    if (lastTime != null)
      updateAnimation(Math.min(100, time - lastTime) / 1000);
    lastTime = time;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
 var x = 100, y = 300;
 var radius = 20;
 var speedX = 160, speedY = 120;
  function updateAnimation(step) {
  	ball.clearRect(0, 0, 400, 400);
 	ball.beginPath();
 	ball.strokeStyle = '#f48';
 	ball.lineWidth = 5;
 	ball.rect(0, 0, 400, 400);
 	ball.stroke();
 	ball.closePath();
	// console.log(step);
    x += step * speedX;
	y += step * speedY;
 	if (x > 360 + radius || x < 40 - radius )  speedX = -speedX;
 	if (y > 360 + radius || y < 45 - radius) speedY = -speedY;

    var g = ball.createLinearGradient(0, 0, 0, 60);
    g.addColorStop(0, 'lightcoral');
    g.addColorStop(1, 'red');
    
    ball.fillStyle = g;
  	ball.beginPath();
    ball.arc(x, y, radius, 0, 2 * Math.PI);
    ball.fill();
    ball.closePath();
  }



  function drawRuningMan(lastTime) {
  	var sprinter = getElementContext('sprinter');
  	var sprinterSprites = document.createElement('img');
  	var x = 47, y = 60;

  	sprinterSprites.src = './a_man.png';

  	var sprinterSpritesStyles = sprinterSprites.style;

  	sprinterSpritesStyles.transform = 'rotate(60deg)';
  	var spriteCounter = 0;
  	// console.log(sprinterSpritesStyles);
	var lastTime = null;


	function drawMan(step) {
  		sprinter.clearRect(0, 0, 400, 400);
	  	sprinter.beginPath();
	  	sprinter.drawImage(sprinterSprites, x * spriteCounter, 0, x, y, 0, 0, x, y);
	  	spriteCounter = (spriteCounter + 1) % 8;
	}
	function frame(time) {
		if (lastTime != null)
			drawMan();
		lastTime = Math.min(100, time - lastTime / 1000);
		requestAnimationFrame(frame);
	}
   	
  	sprinterSprites.addEventListener('load', function() {
		
		requestAnimationFrame(frame);	
		
	});
};

  	
 drawRuningMan();