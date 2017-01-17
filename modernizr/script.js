// Дай функции Modernizr.load строку, объект или массив строк и объектов
Modernizr.load([
// Поли-заполнители для презентации
  {
  	// Список того, что нам нужно
  	test : Modernizr.fontface && Modernizr.canvas && Modernizr.cssgradients,
  	// Modernizr.load зугружает css и javascript
  	nope : ['presentation-polyfill.js', 'presentational.css']
  },
  // Действенные поли-заполнители
  {
  	 // Авось прокатит
  	 test : Modernizr.websockets && window.JSON,
     // socket-io.js and json2.js
     nope : 'functional-polyfills.js',
     // А ещё можно дать массивы ресурсов для загрузки
     both : [ 'app.js', 'extra.js'],
     complete : function () {
     	// Запускаю это после того, как всё в этой группе было скачано
     	// и запущено, вдобавок ко всем предыдущим группам
     	myApp.init();
     }
  },
  // Запускаю анализ восле всего, что нужно сделать.
  'post-analytics.js'
]);	