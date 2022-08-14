export class Dictionary {

	constructor(wordSize) {
		this.wordSize = wordSize;
		this.words = [];
		this.cache = { };
		this.index = 0;
	}

	async setLanguage({ code, name }) {
		this.filename = `lang/dictionary-${code.replace("-", "").toLowerCase()}.txt`;
		await this.init();
	}

	async setWordSize(wordSize) {
		this.wordSize = wordSize;
		await this.init();
	}

	async init() {
		const lines = await this.#loadFile();

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

	async #loadFile() {
		// Fetch from cache, if available
		if (this.cache.hasOwnProperty(this.filename)) return this.cache[this.filename];

		// Request the file
		const response = await fetch(this.filename);
		const content = await response.text();

		// Split it into lines
		const treatedContent = content.split(/\r?\n/g);

		// Cache it
		this.cache[this.filename] = treatedContent;

		return treatedContent;
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
