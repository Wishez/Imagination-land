
// document.addEventListener('load', function() {
  var terms = [];
  for (var name in window)
    terms.push(name);
  console.log('in', terms);

  var field = document.querySelector('#field');
  var result = document.querySelector('#suggestions');
  var clean = document.querySelector('#cleanResults');

  clean.addEventListener('click', function() {
    removeOldSelects(result);
    field.value = '';
  });
  field.addEventListener('input', function(e) {
    var value = e.target.value;

    createSelects(searchData(terms, value), result);
  });

  function createSelects(arr, target) {
    removeOldSelects(target);
    
    arr.forEach(function(string) {
      var p = document.createElement('p');
      p.innerText = string;
      p.addEventListener('click', addValueToField);
      
      target.appendChild(p);
    });  
  }

  function addValueToField(e) {
    field.value = e.target.innerText;
    createSelects(searchData(terms, field.value), result);
  }

  function removeOldSelects(target) {
    //console.log(target.childNodes);
    while (target.childNodes.length >= 1) {
      target.removeChild(target.lastChild)
    }
    return;
  }

  function searchData(arr, value) {
    return arr.filter(function(string) {
      return new RegExp(value, 'i').test(string);
    });
  }
// });