var global_frame = new Object();
global_frame["parent"] = null;
global_frame["variables"] = new Object();
var function_names = [];
var function_defs = [];

var make_child_frame = function(parent){
	frame = new Object();
	frame["parent"] = parent;
	frame["variables"] = new Object();
	return frame;
}

function lookup(frame, var_name) {
	if(var_name in frame["variables"]) {
		return frame["variables"][var_name];
	}
	else if(frame["parent"]) {
		lookup(frame["parent"], var_name);
	}
	else {
		// do nothing
	}
}


var tweeteval = function(tweet, frame) 
{
    var body = tweet["tokenized"];
    var children = tweet["children"];
	
    if(body[0] == ">" || body[0] == '&gt;')
    {
        var x = tweeteval_child(body.slice(1), frame);
		return eval(x, frame);
    }
    
    else
    {
        function_names.push(body);
		function_defs.push(children);
    }
}

var tweeteval_child = function(body, frame)
{
	
	var index = matching_index(body, function_names);
	
    if(index >= 0)
    {
		var the_function = function_defs[index];
		var the_frame = make_child_frame(frame);
		for(var i = 0; i < function_names[index].length; i++) {
			var token = function_names[index][i];
			if(typeof token == 'string' && token[0] == '#') {
				the_frame["variables"][token] = eval(body[i], frame);
			}
		}
		for(var j = 0; j < the_function.length; j++) {
			var x = tweeteval(the_function[j], the_frame);
			if(x) {
				return x;
			}
		}
    }
	else {
		return tweeteval_builtin(body, frame);
	}
}
    
// As a last-ditch effort, tries to find a matching built-in function to call
function tweeteval_builtin(body, frame) {
	
	var functions = [
	["#something"],
	["import", "#someone"],
	["print", "#something"],
	["return", "#something"],
	["set", '#var', 'to', '#value'],
	["#a", "plus", "#b"],
	["#a", "minus", "#b"],
	["#a", "times", "#b"],
	["#a", "divided", "by", "#b"],
	["if", "#pred", "#value"],
	["not", "#x"],
	["#a", "and", "#b"],
	["#a", "or", "#b"],
	["#a", "is", "#b"],
	["#a", "is", "greater", "than", "#b"],
	["#a", "is", "less", "than", "#b"]
	];
	
	var index = matching_index(body, functions);

	switch(index) {
	case 0: // Identity
	var s = eval(body[0], frame);
	return s;
		
	case 1: // Import
	if(body[1].charAt(0) == '@') {
		var s = body[1].slice(1);
		load_user(s);
	}
	break;
		
	case 2: // Print
	var s = eval(body[1], frame);
	if(typeof s == 'string' && s[0] == '"') {
		s = s.slice(1, s.length - 1)
	}
	output(s);
	break;
	
	case 3: // Return
	return body[1];
	
	case 4: // Variable binding
	frame["variables"][body[1]] = eval(body[3], frame);
	break;
	
	case 5: // Addition
	var a = eval(body[0], frame);
	var b = eval(body[2], frame);
	if(typeof a == 'number' && typeof b == 'number') {
		return a + b;
	}

	case 6: // Subtraction
	var a = eval(body[0], frame);
	var b = eval(body[2], frame);
	if(typeof a == 'number' && typeof b == 'number') {
		return a - b;
	}
	
	case 7: // Multiplication
	var a = eval(body[0], frame);
	var b = eval(body[2], frame);
	if(typeof a == 'number' && typeof b == 'number') {
		return a * b;
	}
	
	case 8: // Division
	var a = eval(body[0], frame);
	var b = eval(body[3], frame);
	if(typeof a == 'number' && typeof b == 'number' && b != 0) {
		return a / b;
	}
	
	case 9: // If statement
	if(eval(body[1], frame)) {
		var value = eval(body[2], frame);
		return value;
	}
	break;

	case 10: // Not
	var pred = eval(body[1], frame);
	return !pred;
	
	case 11: // And
	if(eval(body[0], frame) && eval(body[2], frame)) {
		return true;
	}
	else {
		return false;
	}
	
	case 12: // Or
	if(eval(body[0], frame) || eval(body[2], frame)) {
		return true;
	}
	else {
		return false;
	}
	case 13: // Is
	return eval(body[0], frame) == eval(body[2], frame);
	
	case 14: // Greater than
	return eval(body[0], frame) > eval(body[4], frame);
	
	case 15: // Less than
	return eval(body[0], frame) < eval(body[4], frame);
	
	}
}
    
    
// True if x is a regular word string, false otherwise
function is_word(x) {
	return (typeof x == 'string') && (x[0] != '#') && (x[0] != '@') && (x[0] != '"');
}

// Takes in a function call BODY (an array), and an array of valid function
// names (a 2D array).
// Returns the index of the first matching function, or -1 if not found.
function matching_index(body, names) {
	console.log(body);
	var index = -1;
	for(var i = 0; i < names.length; i++) {
		f = names[i];
		var valid = true;
		if(f.length != body.length) continue;
		for (var j = 0; j < body.length; j++) {
            if (is_word(body[j]))
            {
                if(!is_word(f[j]) || body[j].toLowerCase() != f[j].toLowerCase()) {
                	valid = false;
					break;
                }
            }
            else
            {
                if(typeof f[j] != 'string' || f[j].charAt(0) != "#") {
                	valid = false;
					break;
                }
            }
		}
		if(valid) {
			index = names.indexOf(f);
			console.log(f);
			break;
		}
	}
	return index;
}

function eval(x, frame) {
	if(typeof x == 'number' || typeof x == 'boolean') {
		return x;
	}
	else if(typeof x == 'object') {
		return tweeteval_child(x, frame);
	}
	else if(typeof x == 'string' && x.charAt(0) == '#') {
		return lookup(frame, x);
	}
	else if(typeof x != 'undefined') {
		return x;
	}
}