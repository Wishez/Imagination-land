var crapyGame = {}; 

crapyGame.elem = document.querySelector('#crapyGame');
crapyGame.context = crapyGame.elem.getContext('2d');

function Ball() {

}

// Объект ШАРИК.
// У меня есть объект  шарик, который должен перемещаться на одну клетку вперёд 
// или перепрыгивать через другой шарик.


// Холст.
// При каждом ходе счётчик обновляется.
// Вырисовывается сетка.
// Перерисовываются шарики и сетка, при ходе.

// View 
// Просматриваются перемещения ШАРИКОВ

crapyGame.drawGrid = function() {
	// for ()
	console.log(crapyGame.elem.width,crapyGame.elem.height );
};

crapyGame.drawGrid();