draw_c();
draw_d();
draw_cat();

function draw_c() {
	var c_canvas = document.querySelector('#c'),
		  context = c_canvas.getContext("2d");


	for (var x = 0.5; x < 500; x += 15) {
		context.moveTo(x, 0);
		context.lineTo(x, 375);
	}
	for (var y = 0.5; y < 375; y += 10) {
		context.moveTo(0, y);
		context.lineTo(375, y);		
	}
		

	context.strokeStyle = "#aaa";
	context.stroke();

	context.beginPath();

	context.moveTo(0.5, 40.5);
	context.lineTo(135, 40.5);
	context.moveTo(165, 40.5);
	context.lineTo(290, 40.5);
	context.moveTo(280, 37.5);
	context.lineTo(290, 40.5);
	context.lineTo(280, 43.5);	

	context.moveTo(60.5, 0);
	context.lineTo(60.5, 80);
	context.moveTo(60.5, 100);
	context.lineTo(60.5, 140);
	context.moveTo(63.5, 133);
	context.lineTo(60.5, 140);
	context.lineTo(57.5, 133);
	

	context.strokeStyle = "#000";
	context.stroke();
		
	context.font = "bold 12px sans-serif";
	context.textBaseline = "middle";
	context.fillText("x", 147, 40);
	context.fillText("y", 57, 88);
	context.font = "bold 10px sans-setif";
	context.textBaseline = "top";
	context.fillText("( 0, 0 )", 5, 0);
	context.textBaseline = "bottom";
	context.fillText("( 300, 150 )", 250, 145 );
	context.fillRect(296.5, 146.5, 3.5, 3.5);
	context.fillRect(0, 0, 3.5, 3.5);

}


function draw_d() {
	var d_canvas = document.querySelector('#d'),
		  context = d_canvas.getContext("2d"),
		  new_gradient = context.createLinearGradient(0, 0 , 150, 0);
	new_gradient.addColorStop(0, "#f00");
	new_gradient.addColorStop(1, "#f0f");
	new_gradient.addColorStop(0, "#ff0");
	context.fillStyle = new_gradient;
	context.fillRect(0, 0, 150, 30);

	var r_g = context.createRadialGradient(2, 14, 15, 3, 15, 15);

	r_g.addColorStop(0, '#fff');
	r_g.addColorStop(1, '#f0f');

	context.fillStyle = r_g;
	context.fillRect(0, 40, 100, 100);
	
}

function draw_cat() {
	var cat = new Image(),
			cat_canvas = document.querySelector('#cat'),
			context = cat_canvas.getContext('2d'); 
	cat.src = "NY.jpg";
	console.log(cat.width);



	cat.onload = function() {
		for (var x = 0, y = 0; x < 500 && y < 375; x += 50, y += 37 )
			context.drawImage(cat, x, y, 150, 70);
	}
}