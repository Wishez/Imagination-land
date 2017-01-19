window.onload = function(e) {
   blog.generateBlog();

   var btnSearch = document.querySelector('#searchBtn'),
       btnShowNotes = document.querySelector('#showNotes'),
       btnShowRandomArticle = document.querySelector('#showRandomArticle');


   btnSearch.addEventListener('click', blog.searchNote, false);
   btnShowNotes.addEventListener('click', function() {
   	 blog.cleanArticles();
   	 blog.generateBlog();
   }, false);
   btnShowRandomArticle.addEventListener('click', blog.showRandomArticle, false);
}

 var blog = {
  // Массив всех записей в блоге 
  notes : [], 
  
  creatArticle : function( note ) {
    var article = document.createElement( 'div' ),
        date = note.date,
        zeroBlock = document.querySelector('#zero');

    zeroBlock.innerHTML = "";

    article.classList.add( 'article' );
    article.innerHTML = "<h3 class='article__date'>" + note.toStringDate() + "</h3><p class='article__paragraph'>" + 
                        note.body + "<br>By <span class='text-danger'>" + note.signature + "</span></p>";
    // Если заменить выборку на переменную с выборкой - выдаёт ошибку.
    document.querySelector( '#articles' ).appendChild( article ); 
  },
  // Очистка статей
  cleanArticles : function() {
  	var articles = document.querySelector( '#articles' );
    while ( articles.firstChild ) {
  	  articles.removeChild( articles.firstChild );
  	}
  },
  // Генерация блога. Загружаются все статьи.
  generateBlog : function() {
    blog.notes.map( function( note ) {  
      return blog.creatArticle( note );
    });
  },
  // Поиск статей.
  searchNote : function() {
  	var search = document.querySelector( '#search' ).value.toLowerCase(),
  	    failMatches = [],
        zeroBlock = document.querySelector('#zero');

    zeroBlock.innerHTML = "";
    
    blog.cleanArticles();

    blog.notes.map( function( note ) {
 	  var match = note.body
 	               .toLowerCase()
 	               .indexOf( search );
	  if ( match != -1 ) {	  
	  	return blog.creatArticle( note ); 
	  } 	          
 	  
 	  return failMatches.push(false);
    });

    if ( failMatches.length == blog.notes.length ) {
      return zeroBlock.innerHTML = 'Zero matches.';
    }
  },
  // Не знаешь, что почитать?
  showRandomArticle : function() {
    var i = Math.floor( Math.random() * blog.notes.length ),
        randomNote = blog.notes[i];

    blog.cleanArticles();
    blog.creatArticle( randomNote );	  
  }
},
aboutSomething = new Note("01/14/2017", "Here is text for the article."),
anotherOne = new Note("01/15/2017", "<i>The article</i> on next day."),
raport = new Note("01/17/2017", "Here is, how you can see, all basic functions for the blog. Of course, i'm sure, i can add more functions which my imagination could create and to styleshout this page, but i will go to learn new things next to improve a quality of a code and my imagination.")

// Конструктор записи
function Note( date, body ) {
  this.date = new Date( date );
  this.body = body;

  blog.notes.unshift(this);
}

Note.prototype.signature = 'Shining Finger';
Note.prototype.toStringDate = function() {
  var dayMonthYear = this.date.getDate() + "/" +  this.date.getMonth() + 1 + "/" + this.date.getFullYear();
  return dayMonthYear;

}
console.log(blog.notes);

