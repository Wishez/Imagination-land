
//Setup
var contacts = [
    {
        "firstName": "Akira",
        "lastName": "Laine",
        "number": "0543236543",
        "likes": ["Pizza", "Coding", "Brownie Points"]
    },
    {
        "firstName": "Harry",
        "lastName": "Potter",
        "number": "0994372684",
        "likes": ["Hogwarts", "Magic", "Hagrid"]
    },
    {
        "firstName": "Sherlock",
        "lastName": "Holmes",
        "number": "0487345643",
        "likes": ["Intriguing Cases", "Violin"]
    },
    {
        "firstName": "Kristian",
        "lastName": "Vos",
        "number": "unknown",
        "likes": ["Javascript", "Gaming", "Foxes"]
    }
];


function lookUpProfile(firstName, prop){
// Only change code below this line
  var result = "";
  
  for (var i = 0; i < contacts.length; i++) {
    var contact = contacts[i],
        contactFirstName = contact.firstName,
        contactProp = contact.hasOwnProperty(prop);
    if (contactFirstName == firstName) {
        if (contactProp){ 
          result = contact[prop];
          break; 
        } else {
          result = "No such property";
          break;
        }

    } else {
      result = "No such contact";
    }
  }
  
  return result;
// Only change code above this line
}
// Change these values to test your function
var result = [];

result.push(lookUpProfile("Akira", "lastName"));
result.push(lookUpProfile("Bob", "likes"));
result.push(lookUpProfile("Harry", "longOfPenis"));
result.push(lookUpProfile("Sherlock", "adress"));
console.log(result);
