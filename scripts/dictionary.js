export class Dictionary {

	constructor(wordSize) {
		this.filename = "lang/dictionary-ptbr.txt";
		this.wordSize = wordSize;
		this.words = [];
		this.index = 0;
	}

	async load() {
		const response = await fetch(this.filename);
		const content = await response.text();
		const lines = content.split(/\r?\n/g);

		// Process it
		console.groupCollapsed("Dictionary");
		console.log("Loaded dictionary!");
		console.log(`Found ${lines.length} in total`);

		this.#filterSameSizeWords(lines);

		// Randomize the word list
		this.words.shuffle();
		console.log(`${this.words.length} words with ${this.wordSize} letters (${Math.floor((this.words.length / lines.length) * 100)}%)`);
		console.log(this.words);
		console.groupEnd();
	}

	#filterSameSizeWords(words) {
		// Remove words with different length than the given one
		this.words = words.filter((x) => x.length === this.wordSize);
	}

	getNextWord() {
		const word = this.words[this.index++].toUpperCase();
		console.log(`%cTarget word: ${word}`, "color: magenta");

		return word;
	}

}
