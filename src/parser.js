import { Tokenizer, Token } from './tokenizer.js'
import { Variable } from './Variable.js'

const ParserUnits = [
	'num',
	'length',
	'volume',
	'time',
	'currency'
];

const UnitTable = {
	// Just number
	'#': 'num',

	// Constants
	'pi': 'num',

	// Length
	'km': 'length',
	'm': 'length',
	'cm': 'length',
	'mm': 'length',

	// Volume
	'l': 'volume',
	'ml': 'length',

	// Time
	'seconds': 'time',
	'minutes': 'time',
	'hours': 'time',
	'days': 'time',
	'weeks': 'time',
	'years': 'time',
	'date': 'time',

	// Currency
	'usd': 'currency',
	'euro': 'currency'
};

export class Parser {
	constructor() {
		this.variables = {

		};
		this.output = [];
	}

	getOutput(i = 0) {
		return output[i];
	}

	getFullOutput() {
		return output;
	}

	clear() {
		this.variables = [];
		this.output = [];
	}

	parseValue(str) {
		console.log('Parsing: ' + str);
	}

	// Helper
	arrContainsToken(arr, token) {
		for(let i of arr) {
			if(i[1] == token) return true;
		}

		return false;
	}

	// Feed in a tokenized array
	feedLine(str = []) {
		let noWhitespace = str.filter(e => e[1] != 'space');
		console.log(str);

		if(noWhitespace.length > 1 && noWhitespace[0][1] == 'variable') {
			if(noWhitespace[0][0].slice(-1) == ':') {
				let varName = noWhitespace[0][0].replace(':', '');

				if(!this.arrContainsToken(noWhitespace, Token.OPERATOR) &&
					!this.arrContainsToken(noWhitespace, Token.WORD_OPERATOR)) {
					let data = noWhitespace.slice(1);
					
					// Check if a value is a constant
					let val = data.find(e => e[1] == Token.CONSTANT);
					if(val) {
						this.variables[varName] = new Variable(varName, val[0], ['constant', UnitTable[val[0]]]);
						//this.variables.push(new Variable(varName, val[0], ['constant', UnitTable[val[0]]]));
					} else {
						val = data.find(e => e[1] == Token.NUMBER);
						let unit = data.find(e => e[1] == Token.UNIT) || ['#', 'num'];
						unit[0] = unit[0].toLowerCase();
						unit[0] = unit[0].replace('$', 'usd');
						this.variables[varName] = new Variable(varName, val[0], [UnitTable[unit[0]], unit[0]]);
					}
				} else {
					// Parse following value
				}
			} else if(noWhitespace[1][0] == 'is') {
				let varName = noWhitespace[0][0];
				
				// Word operator contains is so fix that. implement exclusion
				if(!this.arrContainsToken(noWhitespace, Token.OPERATOR) &&
					!this.arrContainsToken(noWhitespace, Token.WORD_OPERATOR)) {

					console.log(noWhitespace.slice(1));
				} else {
					// Parse the following value
				}
			}
		}
	}
}

//xx555xgf533423