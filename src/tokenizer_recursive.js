// Helper
// Takes a string and string array
// Takes a string, removes all instances of the char
function stripCharFromString(str, chars) {
	let split = str.split('');
	split = split.filter(char => !~chars.indexOf(char));
	//console.log(split);
	return split.join('');
}

// Helper
// Walks back a string and finds the last character
// Basically str.charAt(-1) except it ignores all the spaces
function walkBackString(str) {
  str = str.filter(str => str != ' ');

  return str[str.length - 1];
}

// Takes string
// Returns array of tokens
function tokenize(toTokenize) {
  if(toTokenize == '')
	return ['', Token.BREAK];

	let tokenized = [];

  let split = toTokenize.split(/(\s)/g);//toTokenize.split(' ');
  for(let i = 0; i < split.length; i++) {
	let item = [];
	let currentString = split[i];
	let currentToken = Token.COMMENT;

	// Used to tokenize non-trivial items
	let ignorePush = false;

	// Check if space
	if(currentString == ' ') {
	  currentToken = Token.SPACE;
	// If characters contain a colon at the end it's a variable
		} else if(currentString.slice(-1) == ':') {
			currentToken = Token.VARIABLE;
		// Check if current string is parantheses
		} else if(currentString == '(' || currentString == ')') {
			currentToken = Token.PARANTHESES;
		// Check if the current string is an operator
		} else if(~operators.indexOf(currentString)) {
			currentToken = Token.OPERATOR;
		// Check is current string is a number
		}  else if(!isNaN(currentString)) {
			currentToken = Token.NUMBER;
		// Check if current string is a unit
		} else if(~units.indexOf(currentString)) {
			currentToken = Token.UNIT;
		// Check if current string is a word operator
		} else if(~wordOperators.indexOf(currentString)) {
			currentToken = Token.WORD_OPERATOR;
		// Check if current string is a reserved variable/constant
		} else if(~constants.indexOf(currentString)) {
			currentToken = Token.CONSTANT;
		// Check if current string is followed by an equal sign. If so it's a variable
		} else if(i < split.length - 2 && split[i + 1] == '=') {//(splitSplit[j + 1] == '=' ||splitSplit[j + 1] == 'is')) {
			currentToken = Token.VARIABLE;
		// Check if string has a number with modifiers ($, %, etc)
	} else if(!isNaN(stripCharFromString(currentString, numberModifier))) {
	  ignorePush = true;
			
	  let arr = currentString.split(/(\$|\%)/);
	  arr = arr.filter(j => j != "");

	  for(let i of arr) {
		if(!isNaN(i)) tokenized.push([i, Token.NUMBER]);
		else tokenized.push([i, Token.NUM_MODIFIER]);
	  }
	  
	  //currentToken = Token.NUMBER;
	// Check if string has of before it. If so, it's probably a variable
		} else if(i > 0 && walkBackString(split.slice(0, i)) == 'of') {
	  currentToken = Token.VARIABLE;
	// Check if a string has a operator or word operator after it. Then it's probably a variable
	} else if(i < split.length - 1 && isNaN(currentString[0])) {
	  let lookAhead = walkForwardString(split.slice(i + 1));
	  if((~operators.indexOf(lookAhead) || ~wordOperators.indexOf(lookAhead)))
		currentToken = Token.VARIABLE;
	} else if(!isNaN(stripStringFromString(currentString, units))) {
	  ignorePush = true;

	  let arr = currentString.match(/[a-z]+|[^a-z]+/gi);
	  
	  for(let i of arr) {
		if(!isNaN(i)) tokenized.push([i, Token.NUMBER]);
		else tokenized.push([i, Token.UNIT]);
	  }
	}

	if(!ignorePush) {
	  item.push(currentString, currentToken);
	}

	if(item.length > 0)
	  tokenized.push(item);
  }

  return tokenized;
}