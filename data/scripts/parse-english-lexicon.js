// Imports
const fs = require("fs/promises");
const path = require("path");
const { loadAllDictionaries, isPresentInAnyDictionary, validateWord, parseCSV } = require("./util.js");
const { performance } = require("perf_hooks");

// Constants
const filename = "SUBTLEX-US.csv";
const outputFilename = "dictionary-enus.txt";

function isFrequentEnough(frequency) {

	return frequency > 2;
}

async function main() {
	const start = performance.now();

	// Calculate relative path
	const inputFilePath = path.join(__dirname, "../", "lexicon", filename);
	const outputFilePath = path.join(__dirname, "../", "cache", outputFilename);

	// Load dictionaries present in folder
	const dictionaries = await loadAllDictionaries(outputFilename);

	// Load and parse the lexicon file
	let csv = (await parseCSV(inputFilePath))
				.map((x) => ({ word: x["Word"], frequency: x["Lg10CD"], type: x["Dom_PoS_SUBTLEX"] }));
	let count = csv.length;

	console.log(`Loaded ${count} entries!\n`);

	console.log(`Sanitizing word list...`);
	csv = csv.filter((x) => validateWord(x.word));
	console.log(`Removed ${count - csv.length} words!\n`);
	count = csv.length;

	console.log(`Removing infrequent words...`);
	csv = csv.filter((x) => isFrequentEnough(x.frequency));
	console.log(`Removed ${count - csv.length} words!\n`);
	count = csv.length;

	console.log(`Removing interjections, articles and unclassified...`);
	csv = csv.filter((x) => ["Noun", "Verb", "Name", "Preposition"].includes(x.type));
	console.log(`Removed ${count - csv.length} words!\n`);
	count = csv.length;

	console.log(`Removing foreign words...`);
	csv = csv.filter((x) => !isPresentInAnyDictionary(dictionaries, x.word));
	console.log(`Removed ${count - csv.length} words!\n`);
	count = csv.length;

	console.log(`Sorting by frequency...`);
	csv = csv.sort((a, b) => a.frequency - b.frequency);

	console.log(`Writing ${csv.length} words to file...`);
	await fs.writeFile(
		outputFilePath,
		csv.map((x) => x.word).join("\n"),
		{ encoding: "utf-8" }
	);

	console.log(`\nDone in ${(performance.now() - start) / 1000}s.`);
}

main();