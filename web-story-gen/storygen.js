

var syl1 = ["An", "Ar", "San", "Ne", "Mo", "Vel", "Cer", "Ce", "Wil", "Hol",
            "Sun", "Ro", "Al"]

var syl2 =
  [ "ya", "yan", "vo", "dar", "min", "se", "is", "den", "li"]

var syl3 =
  ["co", "na", "resh", "as", "me", "se", "ri", "ipher" ]

var syl4 =
  ["son", "dottir", "old", "er", "gon", "wood", "wick"]

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
var places = [];

var character_sheet_example =
{ name: "Myla",
  rels: [],
  memories: []
}

function findNewGroup(c) {
  var group = randBetween(0, groups.length);
  if (group == groups.length) {
    // make a new group
    group_location = expand(placenames);
    newgroup = {people: [], place: group_location};
    groups.push(newgroup);
    return newgroup;
  } else {
    return groups[group];
  }
}

function remove(array, elt) {
  array.splice(array.indexOf(elt), 1);
}

function moveToNewGroup(c, oldgroup, newgroup) {
  if(oldgroup) {
    remove(oldgroup.people, c);
  }
  newgroup.people.push(c);
}

function shuffle(a) {
  console.log("length: "+a.length);
  for(var i=0; i < a.length; i++) {
    var c = a[i];
    var group = findNewGroup(c);
    moveToNewGroup(c, null, group);
  }
}

var linebreak = "<br>"
function begin() {

  var protagonist = expand(charname);
  var allies = repeat(charname, 1, 5);
  var antagonist = expand(charname);
  var antagonist_allies = repeat(charname, 1, 3);
  var chars = allies.concat([protagonist, antagonist]).concat(antagonist_allies);
  console.log(chars.toString());
  shuffle(chars);

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
  // * C1 and C2 interact within group
  //  (C1 <action> C2)
  //  action constrained by:
  //    - relation btwn C1 and C2
  //    - affordances of location
  // * C leaves group G1 for G2 (could be new)

  var newstuff = linebreak + linebreak;
  var starting_group_count = groups.length;

  for (var i = 0; i < starting_group_count; i++)
  {
    var group = groups[i];
    
    if (group.people.length >= 1) { // someone is here
      
      var initiator = group.people.splice(randBetween(0,group.people.length-1),1)[0];
      var others = group.people;
      // XXX have "others" each react to initiator

      var roll = randBetween(1,3)

      switch(roll) {
        case 1: {
          newstuff += initiator + " does something in " + group.place;
          group.people.push(initiator);
          break;
        }
        case 2: { // Leave for a new group
          var newgroup = group;
          while (newgroup.place == group.place) {
            newgroup = findNewGroup(initiator);
          }
          moveToNewGroup(initiator, group, newgroup);
          
          // group.people.splice(group.people.indexOf(initiator), 1);
          newstuff += initiator + " leaves " + group.place + " for " + newgroup.place;
          break;
        }
        case 3: {
          // new character
          newchar = expand(charname);
          group.people.push(newchar);
          newstuff += "A new character arrives at " + group.place + ": " + newchar;
          newstuff += ". They seem to know " + initiator + "."
          group.people.push(initiator);
          break;
        }
      }
      newstuff += linebreak;
    } // end if someone is here
  } // end loop over groups

  document.getElementById("state").innerHTML += newstuff;
  document.getElementById("state").innerHTML += linebreak + JSON.stringify(groups);


}





