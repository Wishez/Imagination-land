// --Invoce functions
window.onload = function(evt) {
  document.getElementById('pow').onclick = function(evt){
    pow();
  };
  document.getElementById('sumTo').onclick = function(evt) {
    sumToRecurse();
  };
  document.getElementById('sumToRecurse').onclick = function() {
    sumToRecurse();
  }
  document.getElementById('sumToAlgebrProgress').onclick = function() {
    sumToAlgebrProgress();
  }
}
'use strict;'
function addResult(action, result) {
  document.querySelector('#results').innerHTML = "<h3>" + action + ":</h3><p>" + result + "</p>";
}
function checkAge(age) {
   var result = age >= 18 ? true : confirm('Your parents allow you?');
   return result;
}

console.log(checkAge(18));

function checkAge(age) {
   var result = age >= 18 || confirm('Your parents allow you?');
   return result;
}

console.log(checkAge(18));

var minNum = function(a, b) {
	return a <  b ? a : b;
}

console.log(minNum(-5, 2));

function pow(x, n) {
	x = prompt("Число...", "");
	y = prompt("Степень...", "");
	var result = x;
	for(var i = 1; i < y; i++) {
		result *= x;
	}
	addResult("Pow:", result);
	return result;
}

function sumTo(n) {
	n = prompt("Number...", '');
	var result = 0;
	var x = +n;
    for(var i = 0; i < n; i++) {
    	result += x;
    	x--;
    }
    addResult("sumTo:", result);
	return result;
}

function sumToRecurse(n) {
  if(n == null)
  	n = prompt('Number...', '');
  var result = +n + sumToRecurse( +n - 1 );
  return result;
}

function sumToAlgebrProgress(n) {
  n = prompt("Which will num?", '');
  return n * (n + 1) / 2;
}
