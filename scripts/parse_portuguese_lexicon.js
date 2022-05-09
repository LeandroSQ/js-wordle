/* eslint-disable no-undef */
/* eslint-disable no-control-regex */

// Imports
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");

// Constants
const inputFilePath = path.join(__dirname, "misc", "lexporbr.csv");
const outputFilePath = path.join(__dirname, "../", "src", "lang", "dictionary-ptbr.txt");
const results = [];
const dictionaries = { };

// Utility methods
function isInvalid(s) {
	// Ignore small words
	if (s.length < 4) return false;

	// Ignore big words
	if (s.length > 10) return false;

	let repeatCount = 0;
	let lastCode = null;
	for (let i = 0, n = s.length; i < n; i++) {
		const code = s.charCodeAt(i);

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

function isFrequentEnough(frequency) {
	return frequency > 3;
}

function loadDictionary(name) {
	if (!dictionaries[name]) {
		const filename = path.join(__dirname, "misc", `${name}.txt`);
		const content = fs.readFileSync(filename, { encoding: "utf-8" });
		dictionaries[name] = content.split(/\s*\r?\n/g);
	}
}

function isNotPresentInOtherDictionaries(word) {
	// Assures that the correct dictionaries are loaded
	loadDictionary("dictionary-enus");

	for (const language in dictionaries) {
		if (!dictionaries.hasOwnProperty(language)) continue;

		if (language.indexOf(word) !== -1) return false;
	}

	return true;
}

// Runtime
fs.createReadStream(inputFilePath)
	.pipe(csv({ separator: "," }))
	.on("data", (data) => results.push(data))
	.on("end", () => {
		console.log(`Loaded ${results.length} entries!\n`);

		console.log("Removing words with accentuation...");
		let processed = results.filter((x) => isInvalid(x["ortografia"]));
		console.log(`Removed ${results.length - processed.length} words!\n`);

		console.log("Removing infrequent words...");
		processed = processed.filter((x) => isFrequentEnough(x["log10_freq_orto"]));
		console.log(`Removed ${results.length - processed.length} words!\n`);

		console.log("Removing foreign words...");
		processed = processed.filter((x) => isNotPresentInOtherDictionaries(x["ortografia"]));
		console.log(`Removed ${results.length - processed.length} words!\n`);

		console.log("Sorting by frequency...");
		processed = processed.sort((a, b) => a["log10_freq_orto"] - b["log10_freq_orto"]);

		fs.writeFileSync(
			outputFilePath,
			processed.map((x) => x["ortografia"])
				.join("\n"), { encoding: "utf-8" }
		);

		console.log(`Done with ${processed.length} results.`);
		console.log(`${results.length - processed.length} words were removed.`)
	});