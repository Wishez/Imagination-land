var cx = document.getElementById('figures').getContext('2d');
drawTrapeze(cx);
drawRotatedSquare(cx, 40);
drawFence(cx, 250, 20, 12, 80); // context, posX, posY, height, width
drawSpiral(cx, 410, 65, 50);
drawStar(cx, 500, 60, '#ff9', 80);
// drawSpiral(cx, 550, 65, 50);

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
		// context.rotate(5 * Math.PI / 180);
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

function drawStar(context, x, y, color, size) {
	context.save()
	context.rotate(-0.5);
	context.rotate(0.5 * 2);
	context.beginPath();
	context.moveTo(x, y);
	context.bezierCurveTo(x + 20, y + 5, x + 30, y - 10, x + 20, y - 25);
	// for (var i = 0; i < 9; i++) {

	// }
	context.fillStyle = color;
	context.stroke();
	context.restore();
	// context.closePath();
	// context.beginPath();

	// context.fill();
}