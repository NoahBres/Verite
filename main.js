// TODO Implement fancy variable stuff / is handling later

import { Editor } from './src/editor.js'
import { Parser } from './src/parser.js'

const p = new Parser();

const editor = new Editor({
	inputElement: 'editor',
	shadowElement: 'shadow-editor',
	gutterElement: 'gutter',
	outputElement: 'output',
	parser: p
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