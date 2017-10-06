var canvas_1 = document.getElementById('c'),
	c = canvas_1.getContext('2d');


	c.fillStyle = '#f0f';
	c.fillRect(50, 100, 50, 30);
	
var canvas_2 = document.getElementById('tr'),
	tr = canvas_2.getContext('2d');

	tr.fillStyle = '#ccc';
	tr.beginPath();
	tr.moveTo(25, 10);
	tr.lineTo(100, 10);
	tr.lineTo(25, 40);
	tr.lineTo(100, 40);
	tr.closePath();
	tr.fill();
	tr.strokeStyle = '#0ff';
	tr.lineWidth = 2;
	tr.stroke();

	tr.fillStyle = '#f00';
	tr.beginPath();
	tr.moveTo(10, 50);
	tr.bezierCurveTo(80, 80, 143, 20, 150, 54);
	tr.lineTo(150, 90);
	tr.lineTo(10, 90);
	tr.closePath();
	tr.fill();
	tr.lineWidth = 2;
	tr.strokeStyle = '#000';
	tr.stroke();


