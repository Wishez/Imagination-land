var Validate, zipcode, phoneNumber, email;
// Конструктор полей и их подсказок.
Validate = function (inputField, helpField) {
  this.inputField = inputField;
  this.helpField = helpField;	
}
//Функция проверки на наличие текста.
Validate.prototype.validateNonEmpty = function (inputField, helpField) {
  inputField = document.getElementById(inputField);
  helpField =  document.getElementById(helpField);
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
//Функция проверки правильности ввода выбранного поля по шаблону.
Validate.prototype.validateRegex = function(regex ,inputField, helpField, message) {
  if (inputField.value != regex)//Проверка на правильность шаблона
    helpField.innerHTML = message;//Присвоение сообщение "полю-помощнику".
    return false;// Не true:(.
  if(helpField != null)
    helpField.innerHTML = "";//Всё окей.
  return true;

}
zipcode = new Validate('zipcode', 'zipcodeHelp');
//Поле проверки индекса.
zipcode.validateZipcode = function() {
  var selZipFiled = document.getElementById(zipcode.inputField),
      selZipHelp = document.getElementById(zipcode.helpField);    
	// Пользователь вводит только цифры?
  if(isNaN(selZipFiled.value)) {
    if(selZipHelp != null)
      selZipHelp.innerHTML = "Enter only numbers. Mkey?"//Кажется, нет.
    return false;
  }
  // Больше или меньше цифр, чем того требуется?
  else if(selZipFiled.value.length != 5) {
    selZipHelp.innerHTML = "You have to enter 5 numbers. Mkey?"// Повнимательней, пожалуйста.     
  }
  // В поле есть что-нибудь?
	else if (selZipFiled.value.length == 0) {
  	  if (helpField != null)
  	    selZipHelp.innerHTML = "Please enter a value. Mkey?";// А должно быть.
  	  return false;
    }
	else {
	  if(selZipHelp != null)
	  	selZipHelp.innerHTML = "";// Пользователь - молодец.
	  return true;
	}
}

window.onload = function(evt) {
  document.getElementById(zipcode.inputField).onblur = function(evt) {
    zipcode.validateZipcode();
  }
  //
}
//Проверка номера телефона
phoneNumber = new Validate('phoneNumber', 'phoneNumberHelp'); 
validatePhoneNumber = function() {
  //Если атрибут pattern не соответствует заначению ввода...
}

Validate.prototype.validateEmail = function(inputField, helpField) {

}
