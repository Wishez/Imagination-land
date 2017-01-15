//Блог владельца блога
var articles = document.querySelector('#articles'),
    blog = {
      notes : [],
      
	  creatArticle : function( note ) {
	    var article = document.createElement( 'div' ); 
	      article.classList.add( 'article' );
	      article.innerHTML = "<h3 class='article__date'>" +  
	                          note.date + "</h3><p class='article__paragraph'>" + 
	                          note.body + "</p>";
	    articles.appendChild( article ); // Выдает ошибку
	  },

	  cleanArticles : function() {
	    while ( articles.firstChild ) {
	  	  articles.removeChild( articles.firstChild );
	  	}
	  },

	  generateBlog : function() {
	    blog.notes.map( function( note ) {  
	      return blog.creatArticle( note );
	    });
	  },
	  searchNote : function() {
	  	var search = document.querySelector( '#search' ).value.toLowerCase(),
	  	    noMatches = true,
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
	 	  
	 	  return noMatches = false;
	    });

	    if ( noMatches != true ) {
	      return zeroBlock.innerHTML = 'Zero matches.';
	    }
	  }
}

// Конструктор записи
function Note( date, body ) {
  var newDate = new Date(date);

  blog.notes.unshift({"date" : date, "body" : body});
}

window.onload = function(e) {
   blog.generateBlog();

   var searchBtn = document.querySelector('#searchBtn'),
       showNotesBtn = document.querySelector('#showNotes');

   searchBtn.addEventListener('click', blog.searchNote, false);
   showNotesBtn.addEventListener('click', function() {
   	 blog.cleanArticles();
   	 blog.generateBlog();
   }, false);
}

var aboutSomething = new Note('01/14/2017', 'Here is text for the article.');
var anotherOne = new Note('01/15/2017', '<i>The article</i> on next day.');