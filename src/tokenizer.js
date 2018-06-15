// Keywords for tokenizing
const units = [
	'cm',
	'mm',
	'inch',
	'ml',
	'tsp',
	'$',
	'USD',
	'GBP',
	'Euro',
	'cm',
	'days',
	'rad',
	'deg',
];
const wordOperators = ['in', 'of', 'what', 'is', 'to', 'sum', 'times'];
const operators = ['+', '-', '*', 'x', '/', '%', '='];
const constants = ['today', 'pi'];
const numberModifier = ['%', '$'];

// TokenValue: css-tag name
const Token = {
	SHOW_BUT_NOT_CATEGORIZED: 'show-but-not-catergorized',
	SPACE: 'space',
	BREAK: 'break',
	COMMENT: 'comment',
	NUMBER: 'number',
	OPERATOR: 'operator',
	WORD_OPERATOR: 'word-operator',
	UNIT: 'unit',
	VARIABLE: 'variable',
	CONSTANT: 'constant',
	PARANTHESES: 'parantheses',
	NUM_MODIFIER: 'num-modifier',
};

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
// Takes a string and string array
// Returns string without any instances of strings in string array
function stripStringFromString(str, strArr) {
	for (let i of strArr) {
		str = str.replace(i, '');
	}

	return str;
}

// Helper
// Walks back a string and finds the last character
// Basically str.charAt(-1) except it ignores all the spaces
function walkBackString(str) {
  str = str.filter(str => str != ' ');

  return str[str.length - 1];
}

// Helper
// Walks forward in a string and finds the next character
// basically str.charAt(i + 1) except it ignores all the spaces
function walkForwardString(str) {
	str = str.filter(str => str != ' ');

	return str[0];
}

// Handling parantheses just for ease
function paranthesesTokenize(str) {
	let tokenized = [];

	let split = str.split(/(\()|(\))/gi);
	split = split.filter(elem => elem != '' && elem);
	for(let i of split) {
		if(i == '(') {
			tokenized.push(['(', Token.PARANTHESES]);
		} else if(i == ')') {
			tokenized.push([')', Token.PARANTHESES]);
		} else {
			let t = tokenize(i);
			tokenized = tokenized.concat(t);
		}
	}

	return tokenized;
}

// Takes string
// Returns array of tokens
function tokenize(toTokenize) {
	// If line is just a string just return a break token
	if (toTokenize == '') return [['', Token.BREAK]];
	// If line contains any parantheses then hand it off to a custom function for easier handling
	if(~toTokenize.indexOf('(') || ~toTokenize.indexOf(')')) return paranthesesTokenize(toTokenize);

	let tokenized = [];

	let split = toTokenize.split(/(\s)/g); //toTokenize.split(' ');
	for (let i = 0; i < split.length; i++) {
		let item = [];
		let currentString = split[i];
		let currentToken = Token.COMMENT;

		// Used to tokenize non-trivial items
		let ignorePush = false;

		// Check if space
		if (currentString == ' ') {
			currentToken = Token.SPACE;
			// If characters contain a colon at the end it's a variable
		} else if (currentString.slice(-1) == ':') {
			currentToken = Token.VARIABLE;
			// Check if current string is parantheses
		} else if (currentString == '(' || currentString == ')') {
			currentToken = Token.PARANTHESES;
			// Check if the current string is an operator
		} else if (~operators.indexOf(currentString)) {
			currentToken = Token.OPERATOR;
			// Check is current string is a number
		} else if (!isNaN(currentString)) {
			currentToken = Token.NUMBER;
			// Check if current string is a unit
		} else if (~units.indexOf(currentString)) {
			currentToken = Token.UNIT;
			// Check if current string is a word operator
		} else if (~wordOperators.indexOf(currentString)) {
			currentToken = Token.WORD_OPERATOR;
			// Check if current string is a reserved variable/constant
		} else if (~constants.indexOf(currentString)) {
			currentToken = Token.CONSTANT;
			// Check if current string is followed by an equal sign. If so it's a variable
		} else if (i < split.length - 2 && split[i + 1] == '=') {
			//(splitSplit[j + 1] == '=' ||splitSplit[j + 1] == 'is')) {
			currentToken = Token.VARIABLE;
			// Check if string has a number with modifiers ($, %, etc)
		} else if (!isNaN(stripCharFromString(currentString, numberModifier))) {
			ignorePush = true;

			let arr = currentString.split(/(\$|\%)/);
			arr = arr.filter(j => j != '');

			for (let i of arr) {
				if (!isNaN(i)) tokenized.push([i, Token.NUMBER]);
				else tokenized.push([i, Token.NUM_MODIFIER]);
			}

			//currentToken = Token.NUMBER;
		// Check if string has of before it. If so, it's probably a variable
		} else if (i > 0 && walkBackString(split.slice(0, i)) == 'of') {
			currentToken = Token.VARIABLE;
			// Check if a string has a operator or word operator after it. Then it's probably a variable
		} else if (i < split.length - 1 && isNaN(currentString[0])) {
			let lookAhead = walkForwardString(split.slice(i + 1));
			if (~operators.indexOf(lookAhead) || ~wordOperators.indexOf(lookAhead))
				currentToken = Token.VARIABLE;
		} else if (!isNaN(stripStringFromString(currentString, units))) {
			ignorePush = true;

			let arr = currentString.match(/[a-z]+|[^a-z]+/gi);

			for (let i of arr) {
				if (!isNaN(i)) tokenized.push([i, Token.NUMBER]);
				else tokenized.push([i, Token.UNIT]);
			}
		}

		if (!ignorePush) {
			item.push(currentString, currentToken);
		}

		if (item.length > 0) tokenized.push(item);
	}

	return tokenized;
}