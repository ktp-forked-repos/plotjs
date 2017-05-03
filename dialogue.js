
// Scenario state


var characters =
  ["Alexis", "Brian", "Corryn"]

var things =
  ["pen", "chair", "coffee", "tea", "notebook"]

var inventory =
  {
    "Alexis": [],
    "Brian": [],
    "Corryn": []
  }

var conversation_log = [];

var current_choices;


function choiceToString(c) {
  var {op, args} = c;
  var str = op+"(";
  str = op+"("+ args.toString() + ")";
  return str;
}

function displayState() {
  var transcriptAddition = "";

  if(conversation_log.length > 0) {
    transcriptAddition += conversation_log[conversation_log.length - 1];
    transcriptAddition += "<br>";
  }
  transcriptAddition += "</p>";

  // Append
  document.getElementById("transcript").innerHTML += transcriptAddition;

  var stateHTML = "";

  for(c in inventory){
    items = inventory[c];
    if(items.length > 0) {
      stateHTML += "<p>"+c+" has: "+items.toString();
      stateHTML += "</p>"
    }
  }
  
  // Replace
  document.getElementById("state").innerHTML = stateHTML;

}

function displayChoices() {
  // current_choices = generate_choices();
  toRender = "";
  for (var i = 0; i < current_choices.length; i++) {
    var choice = current_choices[i];
    toRender += ""+i+": "+choiceToString(choice)+"<br>";
  }
  document.getElementById("choices").innerHTML = toRender;
}

function begin() { render(""); }

function render(text) {

  document.getElementById("response").innerHTML = text;

  current_choices = generate_choices();
  displayState();
  displayChoices();
}


function selectChoice(index) {

  var display_text = applyOper(current_choices[index]);

  
  // current_choices = generate_choices();
  render(display_text);
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
    case "talk": {
      action = talk(args[0], args[1]);
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


function generate_choices () {
  choices = [];

  // for each character, see what they can do
  // XXX use "applies" method on actions?
  for(var ci in characters) {
    var c = characters[ci];
    for(var ti in things) {
      var thing = things[ti];
      choices.push({op:"take", args:[c, thing]});
    }
    for(var oi in characters) {
      var other = characters[oi];
      if(other != c) {
        choices.push({op:"talk", args:[c, other]});
      }
    } //end loop over other characters
  } //end outer loop over characters
  return choices;
  
}

// Operator specification

// take
// preconditions: X and A in same place
// effect: has X A
// turns: 1
function take(agent, thing) {

  var ti = things.indexOf(thing);
  var applies = ti != -1;

  function effects() {
    inventory[agent].push(thing);
    things.splice(ti, 1);
  }

  var text = agent+" takes the "+thing+".";

  return {applies:applies, effects:effects, text:text};

}



// talk
// precondtions: X and Y in L
// effects: none
// turns: 1-3
function talk(agent1, agent2) {

  var applies = true;

  function effects() {
    var line = agent1+" says hello to "+agent2;
    conversation_log.push(line);
  }

  return {applies:applies, effects:effects, text:""};

}

// give
// preconditions: X has A
// effects: Y has A
// turns: 1

