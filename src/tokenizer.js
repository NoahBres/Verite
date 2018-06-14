// Keywords for tokenizing
const units = ['cm', 'mm', 'ml', 'tsp', '$', 'USD', 'GBP', 'Euro', 'cm', 'days', 'rad', 'deg'];
const wordOperators = ['in', 'of', 'what', 'is', 'to', 'sum', 'times'];
const operators = ['+', '-', '*', 'x', '/', '%', '='];
const constants = ['today', 'pi'];
const numberModifier = ['%'];

// TokenValue: css-tag name
const Token = {
	'SHOW_BUT_NOT_CATEGORIZED': 'show-but-not-catergorized',
	'SPACE': 'space',
	'BREAK': 'break',
	'COMMENT': 'comment',
	'NUMBER': 'number',
	'OPERATOR': 'operator',
	'UNIT': 'unit',
	'WORD_OPERATOR': 'word-operator',
	'VARIABLE': 'variable',
	'CONSTANT': 'constant',
	'PARANTHESES': 'parantheses'
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
// Returns whether or not string contains a substring from a list
function stringContainsString(str, strList) {
	for(let i of strList) {
		if(~str.indexOf(i))
			return true;
	}

	return false;
}

// Takes array of strings
// Returns 3D array
// line[[string, token]] 
function tokenize(splitText) {
	let tokenized = [];
		
	for(let i = 0; i < splitText.length; i++) {
		let line = [];
		if(splitText[i] == "") {
			let item = [];
			item.push(splitText[i], Token.BREAK);
			line.push(item);
			tokenized.push(line);
			
			continue;
		}
		
		let splitSplit = splitText[i].split(' ');
		for(let j = 0; j < splitSplit.length; j++) {
			let item = [];
			
			let currentString = splitSplit[j];
			let currentToken = Token.COMMENT;
			
			let ignorePush = false;
			
			// If characters contain a colon at the end it's a variable
			if(currentString.slice(-1) == ":") {
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
			} else if(j < splitSplit.length - 2 && splitSplit[j + 1] == '=') {//(splitSplit[j + 1] == '=' || splitSplit[j + 1] == 'is')) {
				currentToken = Token.VARIABLE;
			// Check if string has a number with modifiers ($, %, etc)
			} else if(!isNaN(stripCharFromString(currentString, numberModifier))) {
				currentToken = Token.NUMBER;
			} else if(stringContainsString(currentString, units)) {
				ignorePush = true;
				
			// Check if string has parantheses
			} else if(~currentString.indexOf('(') || ~currentString.indexOf(')')) {
				ignorePush = true;
				//console.log(currentString);
				let splitMe = currentString.split(/(\()|(\))/gi);
				splitMe = splitMe.filter(elem => elem != "" && elem);
				
				//let splitMe = currentString.split('(');
				//splitMe = splitMe.map(elem => elem == "" ? '(' : elem);
				//console.log('000');
				//console.log(splitMe);
				for(let elem of splitMe) {
					if(elem == "(" || elem == ")") {
						line.push([elem, Token.PARANTHESES])
					} else {
						line.push([elem, Token.SHOW_BUT_NOT_CATEGORIZED]);
					}
				}
			}
			
			if(!ignorePush) {
				item.push(currentString, currentToken);
				line.push(item);
			}
			line.push(['', Token.SPACE]);
		}
		
		tokenized.push(line);
	}
	
	return tokenized;
}