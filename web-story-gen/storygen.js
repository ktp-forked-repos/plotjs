

var syl1 = ["An", "Ar", "San", "Ne", "Mo", "Vel", "Cer", "Ce", "Wil", "Hol"]

var syl2 =
  [ "ya", "yan", "vo", "dar", "min", "se", "is", "den"]

var syl3 =
  ["co", "na", "resh", "as", "me", "se", "ri" ]

var syl4 =
  ["son", "dottir", "old", "er", "gon"]

var charname =
  [ {conj: [syl1, syl2, syl3]}, {conj: [syl1, syl2]} ]


var locations =
[ "City", "Garden", "Library", "Forest", "Market", "Club", "Inn",
  "House"]

var space = [ " " ]

var surname =
[ {conj: [charname, syl4] } ]

var placenames = 
[ {conj: [surname, space, locations] } ]


function randBetween(min, max) {
  var range = max-min + 1;
  var r = Math.floor(Math.random()*range) + min;
  return r;
}

function randomElement(a) {
  return a[randBetween(0,a.length-1)];
}

function expand(grammar) {
  var instance = randomElement(grammar);
  if (instance.conj) {
    var g = instance.conj;
    var assembly = "";
    for(var i=0; i < g.length; i++) {
       var piece = expand(g[i]);
       assembly += piece;
    }
    return assembly;
  }
  return instance;
}

function repeat(grammar, min, max) {
  var instances = [];
  var n = randBetween(min, max);
  for (var i = 0; i < n; i++) {
    instances.push(expand(grammar));
  }
  return instances;
}




// World model
var groups = [];


function shuffle(a) {
  console.log("length: "+a.length);
  for(var i=0; i < a.length; i++) {
    var c = a[i];
    var group = randBetween(0,groups.length);
    console.log(c + "'s group: " + group);
    if (group == groups.length) {
      group_location = expand(placenames);
      groups.push({people: [c], place: group_location});
    } else {
      groups[group].people.push(c);
    }
  }
}

function begin() {

  var protagonist = expand(charname);
  var allies = repeat(charname, 1, 5);
  var antagonist = expand(charname);
  var antagonist_allies = repeat(charname, 1, 3);
  var chars = allies.concat([protagonist, antagonist]).concat(antagonist_allies);
  console.log(chars.toString());
  shuffle(chars);

  var linebreak = "<br>"
  var header = 
  "Protagonist: " + protagonist + linebreak +
  "Allies: " + allies.toString() + linebreak +
  "Antagonist: " + antagonist + linebreak +
  "Antagonist's allies: " + antagonist_allies + linebreak +
  "Groups: " + JSON.stringify(groups);

  document.getElementById("state").innerHTML = header;

}


function progress() {
  // Actions:
  // C1 and C2 interact within group
  //  (C1 <action> C2)
  //  action constrained by:
  //    - relation btwn C1 and C2
  //    - affordances of location
  // C leaves group G1 for G2

}





