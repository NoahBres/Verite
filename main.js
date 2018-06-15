// TODO Implement fancy variable stuff / is handling later

// Editor stuff
const editor = document.getElementById('editor');
const shadowEditor = document.getElementById('shadow-editor');

// Gutter
const gutter = document.getElementById('gutter');
let gutterLength = -1;

// Output
const output = document.getElementById('output');

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
			newDiv.dataset.pos = i + 1;
			toAdd.appendChild(newDiv);
			gutter.appendChild(toAdd);
		}
	}
}

function highlightTokenize(tokenized) {
	let highlight = '';

	for(let line of tokenized) {
		let lineStr = '<div>';
		for(let elem of line) {
			if(elem[1] == Token.BREAK)
				lineStr += '<br>';
			else if(elem[1] == Token.SPACE)
				lineStr += ' ';
			else
				lineStr += `<span class='${elem[1]}'>${elem[0]}</span>`;
		}

		lineStr += '</div>';
		highlight += lineStr;
	}

	return highlight;
}

editor.addEventListener('input', function() {
	updateGutter();

	let innerText = editor.innerText;
	let splitText = innerText.split('\n');
	if(splitText[splitText.length - 1] == '') splitText.pop();

	let tokenizedText = [];

	for(let i of splitText) {
		tokenizedText.push(tokenize(i));
	}

	shadowEditor.innerHTML = highlightTokenize(tokenizedText);
});

gutter.addEventListener('mouseover', function(e) {
	if(e.target.id == 'gutter')
		return;
	let hoverPos = e.target.dataset.pos;
	if(hoverPos <= output.children.length) {
		output.children[hoverPos - 1].classList = 'output-line highlight';
	}
}, false);

gutter.addEventListener('mouseout', function(e) {
	if(e.target.id == 'gutter')
		return;
	let hoverPos = e.target.dataset.pos;
	if(hoverPos <= output.children.length) {
		output.children[hoverPos - 1].classList = 'output-line';
	}
}, false);

/* 
Price: $10
Fee: 4 GBP in Euro
sum in USD - 4%

today + 16 days
20ml in tsp
20% of what is 30cm
(25cm x 6 + 5%) in
*/