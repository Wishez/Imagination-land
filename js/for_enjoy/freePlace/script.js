'use strict';

var selSeat = -1;

var place = {
    avail: {
      status: "img/avail.png",
      description: "Available seat" 
    },
    unavail: {
      status: "img/unavail.png",
      description: "Unavailable seat"
    },
    selected: {
      status: "img/selected.png",
      description: "Selected seat."

    },
    places: [
    	[false, true, false, true, true, true, false, true, false],
    	[false, true, false, false, true, false, true, true, true],
    	[true, true, true, true, true, true, false, true, false],
    	[true, true, true, false, true, false, false, true, false]
    ],
    // Массив индификаторов мест
    idPlaces: [
     	["place-1_1", "place-1_2", "place-1_3", "place-1_4", "place-1_5", "place-1_6", "place-1_7", "place-1_8", "place-1_9"],
    	["place-2_1", "place-2_2", "place-2_3", "place-2_4", "place-2_5", "place-2_6", "place-2_7", "place-2_8", "place-2_9"],
    	["place-3_1", "place-3_2", "place-3_3", "place-3_4", "place-3_5", "place-3_6", "place-3_7", "place-3_8", "place-3_9"],
    	["place-4_1", "place-4_2", "place-4_3", "place-4_4", "place-4_5", "place-4_6", "place-4_7", "place-4_8", "place-4_9"]
    ],
    //Устанавливаем доступные и недоступные места. 
    generatePlaces: function() {
	    for(var i = 0; i < place.places.length; i++){
	    	for(var x = 0; x < place.places[i].length; x++){
		        var seat = place.idPlaces[i][x];
		        if(place.places[i][x] == true) {
		            document.getElementById(seat).src = place.avail.status;
		            document.getElementById(seat).alt = place.avail.description;	            
		        }
		        else {
		            document.getElementById(seat).src = place.unavail.status;
		            document.getElementById(seat).alt = place.unavail.description;
		        }
	    	}	
	    }
    },
    //Устанавливает выбранные места.
    setPlace: function(seat, status) {
    	if (status == "avail"){
    		document.getElementById(seat).src = this.avail.status;
    		document.getElementById(seat).alt = + this.avail.description;
    	}
    	else {
    		document.getElementById(seat).src = this.selected.status;
    		document.getElementById(seat).alt = + this.selected.description;
    	}
    },
    //Получает информацию о месте.
    getInfoAboutPlace: function(row, seat) {
    	var place = this.idPlaces[row - 1][seat - 1];
        var idCheckedPlace = this.places[row - 1][seat - 1];
        
    	if (user.place != -1 && (place == user.firstMachoSeat || place == user.secondMachoSeat || place == user.thirdMachoSeat))
    	  return alert("Your place is row: " + row + ", seat: " + seat  + ".");
    	else if (idCheckedPlace)
          return alert("The place " + seat + "th is available in the " + row + "th row.");
        else
          return alert("The place " + seat + "th is unavailable in the " + row + "th row.");
    }
}
function clickOnPlace(row, seat) {
  document.getElementById('place-' + row + '_' + seat).onclick = function(evt) {
    place.getInfoAboutPlace(row, seat);
  }
}
window.onload = function(evt) {
  place.generatePlaces();
  document.getElementById('findPlace').onclick = function(evt) {
    user.findPlace();
  };
  clickOnPlace(1, 1);
  clickOnPlace(1, 2);
  clickOnPlace(1, 3);
  clickOnPlace(1, 4);
  clickOnPlace(1, 5);
  clickOnPlace(1, 6);
  clickOnPlace(1, 7);
  clickOnPlace(1, 8);
  clickOnPlace(1, 1);
  clickOnPlace(2, 2);
  clickOnPlace(2, 3);
  clickOnPlace(2, 4);
  clickOnPlace(2, 5);
  clickOnPlace(2, 6);
  clickOnPlace(2, 7);
  clickOnPlace(2, 8);
  clickOnPlace(2, 9);
  clickOnPlace(3, 1);
  clickOnPlace(3, 2);
  clickOnPlace(3, 3);
  clickOnPlace(3, 4);
  clickOnPlace(3, 5);
  clickOnPlace(3, 6);
  clickOnPlace(3, 7);
  clickOnPlace(3, 8);
  clickOnPlace(3, 9);
  clickOnPlace(4, 1);
  clickOnPlace(4, 2);
  clickOnPlace(4, 3);
  clickOnPlace(4, 4);
  clickOnPlace(4, 5);
  clickOnPlace(4, 6);
  clickOnPlace(4, 7);
  clickOnPlace(4, 8);
  clickOnPlace(4, 9);

};
var user = {
    place: selSeat,

    findPlace: function() {
    	
		if(selSeat != -1) {
			selSeat = -1;
			place.generatePlaces();
		}
		var finished = false;
		for(var x = 0; x < place.places.length && !finished; x++) {
		  for(var i = 0; i < place.places[x].length; i++ ) {
            if (place.places[x][i] && place.places[x][i + 1] && place.places[x][i + 2]) {
    		 	var seatFirst = place.idPlaces[x][i];
    		 	var seatSecond = place.idPlaces[x][i + 1];
    		 	var seatThird = place.idPlaces[x][i + 2];
		 		selSeat =  seatFirst;
		 		place.setPlace(seatFirst, "selected");
		 		place.setPlace(seatSecond, "selected");
		 		place.setPlace(seatThird, "selected");
		    	var accept = confirm("Row " + (x + 1) + ", seat " + (i + 1) + " through " + (i + 3) + " is available. Accept?");
			    if (accept) {
			    	finished = true;
			    	break;
			    }
			    else{
			    	selSeat = -1;
			    	place.setPlace(seatFirst, "avail");
		 			place.setPlace(seatSecond, "avail");
		 			place.setPlace(seatThird, "avail");
			    }
		 	}
		 }
	   }
	}
}
