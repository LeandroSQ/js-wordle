const fs = require("fs/promises");
const { createReadStream, existsSync } = require("fs");
const path = require("path");
const csv = require("csv-parser");

async function loadDictionary(filename) {
    const file = path.join(__dirname, "../", "dictionaries", filename);
	const content = await fs.readFile(file, { encoding: "utf-8" });
    const lines = content.split(/\s*\r?\n/g);

    return {
        name: path.basename(filename),
        words: lines
    };
}

async function loadAllDictionaries(exclude) {
    // Loads all files
    const root = path.join(__dirname, "../", "dictionaries");
    let files = await fs.readdir(root, { withFileTypes: true, encoding: "utf-8" });
	files = files.filter(x => x.isFile())
				 .map(x => path.join(root, x.name));

	// Exclude indicated dictionary file
	if (exclude) files.splice(files.findIndex(x => x.endsWith(exclude)), 1);

	// Log found files
	console.log(`Found ${files.length} dictionaries!`);
	for (const dict of files) console.log(path.basename(dict));
	console.log("\n")

    // Load every dictionary
    const results = await Promise.all(
	files.map(x => loadDictionary.bind(this, x))
	);

    // Maps the array into a object
    const obj = {};
    for (const entry of results) obj[entry.name] = entry.words;
    return obj;
}

function isPresentInAnyDictionary(dictionaries, word) {
    for (const language in dictionaries) {
        if (!dictionaries.hasOwnProperty(language)) continue;

        if (language.indexOf(word) !== -1) return true;
    }

    return false;
}

/**
 * Validates word size ranging from 4..10
 * Validates over-repeating letters, more than 3 is considered invalid
 * Validates non-latin characters, accents and whatnot
 *
 * @param {String} word
 * @returns {boolean} Whether the word is valid
 */
function validateWord(word) {
    // Ignore small words
	if (word.length < 4) return false;

	// Ignore big words
	if (word.length > 10) return false;

	let repeatCount = 0;
	let lastCode = null;
	for (let i = 0, n = word.length; i < n; i++) {
		const code = word.charCodeAt(i);

		// Ignores three+ same letter repeating words
		if (i > 0 && lastCode === code) {
			repeatCount++;
			if (repeatCount >= 3) return false;
		}

		if (code < 97 || code > 122) return false;

		lastCode = code;
	}

	return true;
}

function parseCSV(filename) {
	return new Promise((resolve, reject) => {
		const results = [];

		createReadStream(filename)
			.pipe(csv())
			.on("data", (data) => results.push(data))
			.on("end", () => {
				resolve(results);
			})
			.on("error", (x) => reject(x));
	});
}

async function createCacheDirectoryIfNotExistent() {
	const folder = path.join(__dirname, "../", "cache");

	if (!existsSync(folder)) {
		console.log(`'cache' directory does not exit, creating it...`);
		await fs.mkdir(folder);
	}
}

module.exports = {
	loadDictionary,
	loadAllDictionaries,
	isPresentInAnyDictionary,
	validateWord,
	parseCSV,
	createCacheDirectoryIfNotExistent
};