// Glob Variables

// Execute
window.onload = function() {
  document.querySelector('#sum').onclick = function(e) {
    sum();
  };
};// end onload

// Functions
function insertResult(result, nameFunc) {
  var p = document.createElement('p'),
      resultsBlock = document.querySelector('#results');
  p.classList.add('result');
  p.innerHTML = result + ' of ' + nameFunc;
  
  resultsBlock.appendChild(p);
}

function generateNameFunc(name) {
    
}

function sum(a, b) {
  a = prompt('Type first number.', '');	
  b = prompt('Type first number.', '');	
  var result = +a + +b,
      nameFunc = 'sum(' + a +', ' + b + ');';
  
  insertResult(result, nameFunc); 
}

