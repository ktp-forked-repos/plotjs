
// Scenario state


var characters =
  ["Shaggy", "Velma", "Daphne"]

var topics =
  ["house", "ghost", "murder", "doors"]

var current_topic = "";
var current_speaker = "";

var presence =
{
  "Shaggy": "present",
  "Velma": "present",
  "Daphne": "ungreeted",
}

function related(t1, t2) {

  switch(t1) {
    case "house": 
      switch(t2) {
        case "doors": return true;
        case "murder": return true;
        default: return false;
      }
    case "ghost":
      switch(t2) {
        case "murder": return true;
        case "doors": return true;
        default: return false;
      }
    case "murder":
      switch(t2) {
        case "house": return true;
        case "ghost": return true;
        default: return false;
      }
    case "doors":
      switch(t2) {
        case "house": return true;
        case "ghost": return true;
        default: return false;
      }
    default: return false;
  }

}

var conversation_log = [];

var current_choices;


function choiceToString(c) {
  var {op, args} = c;
  var str = op+"(";
  str = op+"("+ args.toString() + ")";
  return str;
}

/*
function displayState() {
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
*/

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

  document.getElementById("transcript").innerHTML += "<br>"+text;

  current_choices = generate_choices();
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
  /*  case "take": {
      action = take(args[0], args[1]);
      break;
    }
  */
    case "discuss": { 
      action = discuss(args[0], args[1]);
      break;
    }
    case "change topic": {
      action = change_topic(args[0], args[1]);
      break;
    }
    case "greet": {
      action = greet(args[0], args[1]);
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

    /* Taking things
      for(var ti in things) {
        var thing = things[ti];
        choices.push({op:"take", args:[c, thing]});
      }
    */

    // Talking to characters
    for(var oi in characters) {
      var other = characters[oi];
      if(greet(c, other).applies) {
        choices.push({op:"greet", args:[c, other]});
      }
    } //end loop over other characters


    if(discuss(c, current_topic).applies) {
      choices.push({op:"discuss", args:[c, current_topic]});
    }

    for(var ti in topics) {
      var topic = topics[ti];
      if(change_topic(c, topic).applies) {
        choices.push({op:"change topic", args:[c,topic]});
      }
    } // end loop over topics

  } //end outer loop over characters
  return choices;
  
}

// Operator specification


// enter
// preconditions: X absent
// effects: X not absent; X present; X ungreeted

// exit
// preconditions: X present
// effects: X not present; X absent; X ungreeted

// discuss current topic
function discuss(agent, topic) {
  var applies = (current_topic != "" && current_speaker == "");
  var text = agent + ": Next quip about " + topic; // XXX

  function effects() {
    current_topic = topic;
  }

  return {applies:applies, effects:effects, text:text};

}

function finish_speaking(agent) {
  var applies = current_speaker == agent;

  function effects() {
    current_speaker = "";
  }

  return {applies:applies, effects:effects, text:text};
}

function change_topic(agent, topic) {
  var applies = related(topic, current_topic) || current_topic == "";
  var text = agent + ": Let's talk about the "+topic;

  function effects() {
    current_topic = topic;
  }

  return {applies:applies, effects:effects, text:text};


}

// greet
// precondtions: X present; X ungreeted
// effects: X greeted
function greet(agent1, agent2) {

  var applies = presence[agent1] == "present"
    && presence[agent2] == "ungreeted";

  function effects() {
    presence[agent2] = "present";
  }

  var text = agent1+" says hello to "+agent2;

  return {applies:applies, effects:effects, text:text};

}


/* TODO
// give
// preconditions: X has A
// effects: Y has A
// turns: 1

// Ask for
// Drop

// Take
// preconditions: X and A in same place
// effect: has X A
// turns: 1
/*
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
*/
