var message = "Okay, pharhaps you are not along.";
var anotherMessage = "My imagination is very boring.";
var replaceNodeText = function(id, newText) {
  var node = document.getElementById(id);
  node.innerHTML = newText;
}
var anotherReplaceNodeText = function(id, newText) {
  var node = document.getElementById(id);
  while (node.firstChild)
    node.removeChild(node.firstChild);
  node.appendChild(document.createTextNode(newText));
}
var pId = 'story';
window.onload = function(evt) {
 replaceNodeText(pId, message);
 setTimeout(anotherReplaceNodeText(pId, anotherMessage), 3000);
}