// TODO Implement fancy variable stuff / is handling later

// Editor Stuff
const editor = document.getElementById('editor');
const shadowEditor = document.getElementById('shadow-editor');

// Gutter
const gutter = document.getElementById('gutter');
let gutterLength = -1;

let tokenizedText = [];

function updateGutter() {
	//const editorLength = Math.max(shadowEditor.childNodes.length, 1);
	//const editorLength = Math.max(editor.childNodes.length, 1);
	let splitText = editor.innerText.split("\n");
	if(splitText[splitText.length - 1] == "") splitText.pop();
	const editorLength = Math.max(splitText.length, 1);
	
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

	console.log("Split text:");
	console.log(splitText);
	tokenizedText = tokenize(splitText);
	console.log("Tokenized text");
	console.log(tokenizedText);
	let highlighted = highlightTokenize(tokenizedText);
	console.log("Highlighted text");
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