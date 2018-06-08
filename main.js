// TODO Implement fancy variable stuff / is handling later

// Editor Stuff
const editor = document.getElementById('editor');
const shadowEditor = document.getElementById('shadow-editor');

// Gutter
const gutter = document.getElementById('gutter');
let gutterLength = -1;

// Keywords for tokenizing
const units = ['ml', 'tsp', '$', 'USD', 'GBP', 'Euro', 'cm', 'days', 'rad', 'deg'];
const wordOperators = ['in', 'of', 'what', 'is', 'to', 'sum', 'times'];
const operators = ['+', '-', '*', 'x', '/', '%', '='];
const constants = ['today', 'pi'];
const numberModifier = ['%'];

// TokenValue: css-tag name
const Token = {
	'SPACE': 'space',
	'BREAK': 'break',
	'COMMENT': 'comment',
	'NUMBER': 'number',
	'OPERATOR': 'operator',
	'UNIT': 'unit',
	'WORD_OPERATOR': 'word-operator',
	'VARIABLE': 'variable',
	'CONSTANT': 'constant'
};

let tokenizedText = [];

function updateGutter() {
	//const editorLength = Math.max(shadowEditor.childNodes.length, 1);
	const editorLength = Math.max(editor.childNodes.length, 1);
	
	// If length has changed, render
	if(editorLength !== gutterLength) {
		gutterLength = editorLength;
		
		const toAdd = document.createDocumentFragment();
		gutter.innerHTML = '';
		for( let i = 0; i < gutterLength; i++) {
			const newDiv = document.createElement('div');
			newDiv.className = 'gutter-num';
			newDiv.innerHTML = `${i + 1}.`;
			toAdd.appendChild(newDiv);
			gutter.appendChild(toAdd);
		}
	}
}

function parseText() {
	let innerText = editor.innerText;
	let splitText = innerText.split("\n");

	if(splitText[splitText.length - 1] == "") splitText.pop();

	// Replace blanks with <br> for new line
	splitText = splitText.map(elem => (elem == "" ? "<br>" : elem));
	
	// Highlight non-numbers
	// splitText.forEach((o, i, a) => {
	// 	let split = o.split(" ");
	// 	split = split.map(elem => isNaN(elem) ? `<span class="blue">${elem}</span>` : elem);
	// 	a[i] = split.join(' ');
	// 	console.log(a);
	// });
	// Highlight variables
	splitText.forEach((o, i, a) => {
		let split = o.split(" ");
		split = split.map(elem => elem.slice(-1) == ":" ? `<span class="variable">${elem}</span>` : elem);
		a[i] = split.join(' ');
		console.log(a);
	});
	
	// Highlight word operators
	splitText.forEach((o, i, a) => {
		let split = o.split(" ");
		split = split.map(elem => ~wordOperators.indexOf(elem) ? `<span class="word-operator">${elem}</span>` : elem);
		a[i] = split.join(' ');
		console.log(a);
	});
	
	
	console.log(splitText);
	// Mirror shadow editor with editted mirror content
	//shadowEditor.innerHTML = editor.innerHTML;
	shadowEditor.innerHTML = splitText.map(i => `<div>${i}</div>`).join('');
}

// Helper for tokenizer
// Takes a string and string array
// Takes a string, removes all instances of the char
function stripCharFromString(str, chars) {
	let split = str.split('');
	split = split.filter(char => !~chars.indexOf(char));
	console.log(split);
	return split.join('');
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
			
			// If characters contain a colon at the end it's a variable
			if(currentString.slice(-1) == ":") {
				currentToken = Token.VARIABLE;
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
			}
			
			item.push(currentString, currentToken);
			line.push(item);
			line.push(['', Token.SPACE]);
		}
		
		tokenized.push(line);
	}
	
	return tokenized;
}

// Takes 3D tokenized array
// Returns 1D array with span highlights
function highlightTokenize(tokenized) {
	let highlighted = [];
	
	for(let line of tokenized) {
		let lineStr = '<div>';
		for(let elem of line ) {
			if(elem[1] == Token.BREAK)
				lineStr += '<br>';
			else if(elem[1] == Token.SPACE)
				lineStr += ' ';
			else
				lineStr += `<span class='${elem[1]}'>${elem[0]}</span>`;
		}
		lineStr += '</div>';
		highlighted.push(lineStr);
	}
	
	return highlighted;
}

editor.addEventListener('input', function() {
	updateGutter();
	//parseText();
	
	let innerText = editor.innerText;
	let splitText = innerText.split("\n");
	if(splitText[splitText.length - 1] == "") splitText.pop();

	console.log(splitText);
	tokenizedText = tokenize(splitText);
	console.log(tokenizedText);
	let highlighted = highlightTokenize(tokenizedText);
	console.log(highlighted);
	
	//console.log(splitText);
	shadowEditor.innerHTML = highlighted.join('');
	//splitText = splitText.map(elem => elem == "" ? '<br>' : elem);
	//shadowEditor.innerHTML = splitText.map(i => `<div>${i}</div>`).join('');
});

/* 
Price: $10
Fee: 4 GBP in Euro
sum in USD - 4%

today + 16 days
20ml in tsp
20% of what is 30cm
(25cm x 6 + 5%) in
*/