var Validate, zipcode;

Validate = function (inputField, helpField) {
  this.inputField = inputField;
  this.helpField = helpField;	
}

Validate.prototype.validateNonEmpty = function (inputField, helpField) {
  // проверка наличия текста
  if (inputField.value.length == 0) {
  	if (helpField != null)
  	  helpField.innerHTML = "Please enter a value.";
  	return false;
  }
  else {
    if (helpField != null)
      helpField.innerHTML = "";
  	  return true;
  }
}

Validate.prototype.validateZipcode = function(inputField, helpField) {
	// Verify an amount of a value in the string.
	if(isNaN(inputField.value)) {
	  if(helpField != null)
	    helpField.innerHTML = "Enter only numbers. Mkey?"
	  return false;
	}
	else if (inputField.value.length == 0) {
  	  if (helpField != null)
  	    helpField.innerHTML = "Please enter a value.";
  	  return false;
    }
	else {
	  if(helpField != null)
	  	helpField.innerHTML = "";
	  return true;
	}
}
