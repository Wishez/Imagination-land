// Glob Variables
var resultsBlock = document.querySelector('#results');
// Execute
window.onload = function() {
  document.querySelector('#sum').onclick = function(e) {
    sum();
  };
  document.querySelector('#clean').onclick = function(e) {
    cleanResult();
  };
  document.querySelector('#getDecimal').onclick = function(e) {
    getDecimal();
  }
};// end onload

// Functions
function insertResult(result, nameFunc) {
  var p = document.createElement('p');

  p.classList.add('result');
  p.innerHTML = result + ' of ' + nameFunc;
  
  resultsBlock.appendChild(p);
}

// Clean the block of results 
function cleanResult() {
  while(resultsBlock.firstChild) {
    resultsBlock.removeChild(resultsBlock.firstChild);
  }
}
// To sum two nums.
function sum(a, b) {
  a = prompt('Type first number.', '');	
  b = prompt('Type first number.', '');	
  var result = +a + +b,
      nameFunc = 'sum(' + a +', ' + b + ');';

  result = convertСurrency(result) + "$";

  insertResult(result, nameFunc); 
}

function convertСurrency(result) {
  return result.toFixed(2);
}

function getDecimal(num) {
  num = prompt('Type decimal num.', '');
  num = parseFloat(num);
  var result = 0,
      nameFunc = 'getDecimal(' + num + ');',
      wholeNum = num.toFixed(0);

  if(num < 0) {
    num = (num - wholeNum);
    num = num - (num * 2);
  } else {
    num = (num - wholeNum);
  }

  result = num.toFixed(10);

  insertResult(result, nameFunc);
}