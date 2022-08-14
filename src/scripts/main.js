import "./extensions";
import { UI } from "./ui";
import { Dictionary } from "./dictionary";
import { Keyboard } from "./keyboard";
import { POINTS_CORRECT_LETTER_AND_ORDER, POINTS_CORRECT_LETTER_WRONG_ORDER, STATE_PLAYING, STATE_GAME_OVER } from "./constants";
import { LanguageSelector } from "./language-selector";
import { DifficultySelector } from "./difficulty-selector";

class Main {

	constructor() {
		this.rowCount = 6;
		this.wordSize = 4;
		this.cursor = { row: 0, col: 0 };

		// Initializes the components
		this.difficultySelector = new DifficultySelector(this);
		this.languageSelector = new LanguageSelector(this);
		this.ui = new UI(this.rowCount, this.wordSize);
		this.keyboard = new Keyboard(this);
		this.dictionary = new Dictionary(this.wordSize);

		this.init();
	}

	reset() {
		// Reset the keyboard state
		this.keyboard.clear();

		// Reset variables
		this.points = 0;
		this.cursor = { row: 0, col: 0 };

		// Reset all the cells
		this.ui.reset();

		// Request another word
		this.targetWord = this.dictionary.getNextWord();

		// Set game sate
		this.state = STATE_PLAYING;

		// Highlight the first row, indicating the game is ready
		this.highlightCurrentRow(0);
	}

	async init() {
		// Loads the dictionary
		await this.dictionary.setLanguage(this.languageSelector.current);

		// And post-pone game initial state
		setTimeout(this.reset.bind(this), 250);
	}

	onTypeLetter(letter) {
		// Check whether the cell is empty
		if (!this.ui.isEmpty(this.cursor)) {
			if (this.cursor.col >= this.wordSize - 1) return;
			this.cursor.col++;
		}

		// Set the letter at cursor
		this.ui.setCell(this.cursor, letter);

		// Move cursor
		if (this.cursor.col < this.wordSize - 1) this.cursor.col++;
	}

	onBackspacePressed() {
		while (this.cursor.col > 0 && this.ui.isEmpty(this.cursor)) {
			this.cursor.col--;
		}

		// Remove the letter at cursor
		this.ui.setCell(this.cursor, "");

		// Move cursor
		if (this.cursor.col > 0) this.cursor.col--;
	}

	onEnterPressed() {
		// Check if all the letters in the row have been defined
		if (this.cursor.col <= this.wordSize && !this.ui.isEmpty(this.cursor)) {
			// Validate completed row
			this.onRowCompletion();

			// If still playing
			if (this.state === STATE_PLAYING) {
				// Check if we are out of tries
				if (this.cursor.row + 1 >= this.rowCount) {
					this.#onGameOver();
				} else {
					// Highlight the next row as active
					this.highlightCurrentRow(this.cursor.row + 1);

					// Move to next line
					this.cursor.row++;
					this.cursor.col = 0;
				}
			}
		} else {
			this.ui.showToast("Too short!");
		}
	}

	onRowCompletion() {
		// Get the row's text
		const answer = this.ui.getRowText(this.cursor.row);

		// Checks if the game has been won
		if (answer === this.targetWord) return this.#onCorrectAnswer(this.cursor.row);

		// Analyzes misplaces occurrences
		const stats = this.#analyzeMatches(answer);
		for (let i = 0; i < this.wordSize; i++) {
			const expected = this.targetWord[i];
			const actual = answer[i];
			const cell = this.ui.getCell({ row: this.cursor.row, col: i });

			if (expected === actual) {
				// Only one occurrence of 'actual' letter, but there is more than one in the word
				if (stats[actual].count > stats[actual].matches && stats[actual].misplaced <= 0) cell.setBadge(stats[actual].count);

				// Expected and in corrected spot
				cell.markAsCorrect();

				// Register points
				this.points += POINTS_CORRECT_LETTER_AND_ORDER;
			} else if (stats.hasOwnProperty(actual) && stats[actual].count > stats[actual].matches) {
				// Only occurrence of 'actual' letter, and with more than one occurrence on the word but on different spots
				if (stats[actual].count > stats[actual].misplaced && stats[actual].count > 1) cell.setBadge(stats[actual].count);

				// Wrong spot
				cell.markAsHint();

				// Register points
				this.points += POINTS_CORRECT_LETTER_WRONG_ORDER;
			} else {
				// Wrong letter and spot
				cell.markAsIncorrect();
			}
		}

		// Highlights the keyboard keys
		this.keyboard.highlightKeysAccordingToAnswer(answer, stats);
	}

	async onLanguageChanged(language) {
		await this.dictionary.setLanguage(language);
		this.reset();
	}

	async onDifficultyChanged(difficulty) {
		this.wordSize = difficulty.letters;
		this.rowCount = difficulty.rows;

		this.ui.regenerateRows(this.rowCount, this.wordSize);

		await this.dictionary.setWordSize(this.wordSize);

		this.reset();
	}

	#analyzeMatches(answer) {
		const stats = {};
		const createIfNonExistent = (property) => {
			if (!stats.hasOwnProperty(property)) {
				stats[property] = {
					count: 0,
					matches: 0,
					misplaced: 0
				};
			}
		};

		// Analyzes letter occurrences
		for (let i = 0; i < this.wordSize; i++) {
			const expected = this.targetWord[i];
			const actual = answer[i];

			createIfNonExistent(expected);

			stats[expected].count++; // Count occurrence
			if (expected === actual) stats[expected].matches++; // Count match
		}

		this.#analyzeMismatches(stats, answer, createIfNonExistent);

		return stats;
	}

	#analyzeMismatches(stats, answer, createIfNonExistent) {
		// Analyzes letter misplacement
		for (let i = 0; i < this.wordSize; i++) {
			const expected = this.targetWord[i];
			const actual = answer[i];

			if (actual !== expected && stats.hasOwnProperty(actual) && stats[actual].count > 0) {
				createIfNonExistent(actual);

				stats[actual].misplaced++; // Count misplaced
			}
		}
	}

	#onCorrectAnswer(row) {
		// Add points
		this.points += POINTS_CORRECT_LETTER_AND_ORDER * this.wordSize * 3;

		// Visual feedback
		this.ui.showToast("You win!");

		// Change the game state
		this.state = STATE_GAME_OVER;

		// Highlight entire row as correct
		for (let col = 0; col < this.wordSize; col++) this.ui.getCell({ row, col }).markAsCorrect();
	}

	#onGameOver() {
		this.state = STATE_GAME_OVER;

		// Shows visual feedback
		this.ui.showToast("Game over!");
		this.ui.showHint(this.targetWord);

		console.log("Points:", this.points);
	}

	highlightCurrentRow(row) {
		this.ui.rows[this.cursor.row].clear();
		this.ui.rows[row].markAsActive();
	}

}

new Main();
