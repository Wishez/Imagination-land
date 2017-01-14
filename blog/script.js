//Блог владельца блога
var blog = {
  notes : [],
  blocksOfArticles : [],

  generateBlog : function() {
    blog.notes.map( function( note ) {
      var article = "<div class='article'><h3 class='article__date'>" +  
                     note.date + "</h3><p class='article__paragraph'>" + 
                     note.body + "</p></div>"; 

      return blog.blocksOfArticles.push(article);
    });

    blog.blocksOfArticles.map( function( article ) {
      return document.querySelector('#articles').innerHTML = article;
    });
    // for ( var i = 0; i < blog.notes.length; i++ ) {
    //    var note = "<div class='article'><h3 class='article__date'>" +  blog.notes[i].date + 
    //               "</h3><p class='article__paragraph'>" + blog.notes[i].body + "</p></div>"; 
    //    blog.blocksOfArticles.push(note);            
    // }


  }
}
// Конструктор записи
function Note( date, body ) {
  var newDate = new Date(date);

  blog.notes.unshift({"date" : date, "body" : body});
}

window.onload = function(e) {
   blog.generateBlog();
}
console.log(blog.blocksOfArticles);
var aboutSomething = new Note('01/14/2017', 'Here is text for the article.');
var anotherOne = new Note('01/15/2017', 'The article on next day.');