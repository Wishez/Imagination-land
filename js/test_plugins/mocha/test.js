describe( "pow", function() {
  
  describe( "возводит x в степень n", function() {

	function makeTest( x ) {
	  var expected = x * x * x;

	  it("при возведении " + x + " в 3ю степень результат " + expected, function() {
	    assert.equal( pow( x, 3 ), expected);
	  });

	}

	for ( var i = 1; i <= 5; i++ ) {
      makeTest(i);
    }

  });

  it("при возведении в отрицательную степень результат NaN", function() {
    assert(isNaN(pow(2, -1)));
  });

  it("при возведении в дробную степень результат NaN", function() {
    assert(isNaN(pow(2, 1.5)));
  });

  describe("любое число, кроме нуля, встепени 0 равно 1", function() {
    
    function makeTest(x) {
      it("при возведении " + x + " в степень 0 результат: 1", function() {
      	assert.equal(pow(x, 0), 1);
      });
    }

    for ( var i = -5; i <= 5; i += 2 ) {
      makeTest(i);
    }

  });

  it("ноль в нулевой степени даёт NaN", function() {
    assert(isNaN(pow(0, 0)), "0 в степени 0 не NaN");
  });
  
});