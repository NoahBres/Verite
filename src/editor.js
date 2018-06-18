import { Tokenizer } from './tokenizer.js'

export class Editor {
	constructor({
		inputElement,
		shadowElement,
		gutterElement,
		outputElement,
		parser
	} = {}) {
		this.inputElem = document.getElementById(inputElement);
		this.shadowElem = document.getElementById(shadowElement);
		this.gutterElem = document.getElementById(gutterElement);
		this.outputElem = document.getElementById(outputElement);
	
		this.parser = parser;

		this.gutterLength = -1;

		this.inputElem.addEventListener('input', (e) => { this.onInput(e); });

		this.gutterElem.addEventListener('mouseover', evt => {
			if(evt.target.id == this.gutterElem.id)
				return;
			let hoverPos = evt.target.dataset.pos;
			if(hoverPos <= this.outputElem.children.length) {
				this.outputElem.children[hoverPos - 1].classList = 'output-line highlight';
			}
		}, false);

		this.gutterElem.addEventListener('mouseout', evt => {
			if(evt.target.id == this.gutterElem.id)
				return;
			let hoverPos = evt.target.dataset.pos;
			if(hoverPos <= this.outputElem.children.length) {
				this.outputElem.children[hoverPos - 1].classList = 'output-line';
			}
		}, false);
	}

	updateGutter() {
		//const editorLength = Math.max(shadowElem.childNodes.length, 1);
		//const editorLength = Math.max(inputElem.childNodes.length, 1);
		let splitText = this.inputElem.innerText.split("\n");
		if(splitText[splitText.length - 1] == "") splitText.pop();
		const editorLength = Math.max(splitText.length, 1);
		
		// If length has changed, render
		if(editorLength !== this.gutterLength) {
			this.gutterLength = editorLength;
			
			const toAdd = document.createDocumentFragment();
			this.gutterElem.innerHTML = '';
			for(let i = 0; i < this.gutterLength; i++) {
				const newDiv = document.createElement('div');
				newDiv.className = 'gutter-num';
				newDiv.innerHTML = `${i + 1}.`;
				newDiv.dataset.pos = i + 1;
				toAdd.appendChild(newDiv);
				this.gutterElem.appendChild(toAdd);
			}
		}
	}

	onInput(evt) {
		this.updateGutter();

		let innerText = this.inputElem.innerText;
		let splitText = innerText.split('\n');
		if(splitText[splitText.length - 1] == '') splitText.pop();

		let tokenizedText = [];

		for(let i of splitText) {
			tokenizedText.push(Tokenizer.tokenize(i));
		}

		this.shadowElem.innerHTML = Tokenizer.highlightTokenize(tokenizedText);
	
		if(this.parser) {
			this.parser.feedLine(tokenizedText[0]);
		}
	}
}