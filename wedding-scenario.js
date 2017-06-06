

var scriptCorryn =
  [ {op: "take", args: ["Corryn", "dress"]},
    {op: "go", args: ["Corryn", "WinstonHouse"]},
    {op: "talk", args: ["Corryn", "Winston"]},
    {op: "wear", args: ["Corryn", "dress"]},
    {op: "go", args: ["church"]},
    {op: "marry", args: ["Corryn", "Alexis"]},
    {op: "dance", args: ["Corryn", "Alexis"]},
    {op: "dance", args: ["Corryn", "Winston"]}
  ]

var scriptWinston =
  [ {op: "talk", args: ["Corryn", "Winston"]},
    {op: "give", args: ["Winston", "necklace", "Corryn"]},
    {op: "wear", args: ["Corryn", "necklace"]},
    {op: "wait"},
    {op: "go", args: ["Winston", "Church"]},
    {op: "marry", args: ["Corryn", "Alexis"]},
    {op: "dance", args: ["Corryn", "Winston"]}
  ]

var scriptAlexis =
  [ {op: "take", args: ["Alexis", "dress"]},
    {op: "go", args: ["Alexis", "church"]},
    {op: "wear", args: ["Alexis", "dress"]},
    {op: "marry", args: ["Corryn", "Alexis"]},
    {op: "dance", args: ["Corryn", "Alexis"]}
  ]

var locations = 
  ["AlexisHouse", "WinstonHouse", "CorrynHouse",
    "Church"]

var characters =
  ["Alexis", "Winston", "Corryn"]

// State
var location_of =
  { "Alexis": "AlexisHouse",
    "Winston": "WinstonHouse",
    "green_dress": "AlexisHouse",
    "Corryn": "CorrynHouse",
    "silver_dress": "CorrynHouse",
    "necklace": "WinstonHouse",
   // "officiant": "Church"
  }

var current_choices;


function choiceToString(c) {
  var {op, args} = c;
  var str = op+"(";
  str = op+"("+ args.toString() + ")";
  return str;
}

function displayState() {
  toRender = "";
  for (var i = 0; i < locations.length; i++) {
    var stuff = whatsAt(locations[i]);
    toRender += "At "+locations[i]+": ";
    toRender += stuff.toString() + "<br>";
  }
  document.getElementById("state").innerHTML = toRender;

}

function displayChoices() {
  current_choices = generate_choices();
  toRender = "";
  for (var i = 0; i < current_choices.length; i++) {
    var choice = current_choices[i];
    toRender += ""+i+": "+choiceToString(choice)+"<br>";
  }
  document.getElementById("choices").innerHTML = toRender;
}

function render() {
  displayState();
  displayChoices();
}


function selectChoice(index) {

  var display_text = applyOper(current_choices[index]);
  current_choices = generate_choices();

  document.getElementById("response").innerHTML = display_text;
  
  render();
}


// returns text to display upon applying cmd
function applyOper(cmd) {

  var {op, args} = cmd;
  var displayText; // to return at the end

  var applies = false;
  var effects = function() {};
  var text = "Dummy text";

  var action = {applies:applies, effects:effects, text:text};

  switch(op) {
    case "take": {
      action = take(args[0], args[1]);
      break;
    }
    case "go": { 
      action = go(args[0], args[1]);
      break;
    }
  }
  if(action.applies) { 
    action.effects();
    displayText = action.text;
  } else {
    displayText = "Action not possible!";
  }
  return displayText;
}

function whatsAt(loc) {
  var things = [];
  for(var thing in location_of) {
    if(location_of[thing] == loc) {
      things.push(thing);
    }
  }
  return things;
}

function generate_choices () {
  choices = [];
  // for each character, see what they can do
  for(var ci in characters) {
    var c = characters[ci];
    var loc = location_of[c];
    var things = whatsAt(loc);
    for(var ti in things) {
      var thing = things[ti];
      if(characters.indexOf(thing) < 0) {
        // taking it
        choices.push({op:"take", args:[c, thing]});
      }
      else {
        // talking to it
        if(thing != c) {
          choices.push({op:"talk", args:[c, thing]});
        }
      }
    } // end loop over things at location of c

    // places to move
    for(var li in locations) {
      var l = locations[li];
      if(l != loc) {
        choices.push({op:"go", args:[c, l]});
      }
    }

  } //end loop over characters
  return choices;
  
}

// Operator specification

// take
// preconditions: X and A in same place
// effect: has X A
// turns: 1
function take(agent, thing) {

  var applies = location_of[agent] == location_of[thing];

  function effects() {
    location_of[thing] = agent;
  }

  var text = agent+" takes the "+thing+".";

  return {applies:applies, effects:effects, text:text};

}


// go
// preconditions: none
// effects: at X L
// turns: = distance between places
function go(agent, place) {

  var applies = true; // for now

  function effects() {
    location_of[agent] = place;
  }

  var text = agent+" goes to "+place;

  return {applies:applies, effects:effects, text:text};

}

// wear
// preconditions: has X A
// effects: wearing X A
// turns: 1

// talk
// precondtions: X and Y in L
// effects: none
// turns: 1-3

// marry
// preconditions: X and Y in L
//    *** both X and Y intend the action
// effects: X and Y married
// turns: 3

// dance at wedding
// preconditions: X and Y at L. Z and W married at L.
// effects: X and Y danced
// turns: 2

// give
// preconditions: X has A
// effects: Y has A
// turns: 1

