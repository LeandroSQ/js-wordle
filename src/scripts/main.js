import "./extensions.js";
import { UI } from "./ui.js";
import { Dictionary } from "./dictionary.js";
import { Keyboard } from "./keyboard.js";
import {
	POINTS_CORRECT_LETTER_AND_ORDER,
	POINTS_CORRECT_LETTER_WRONG_ORDER,
	STATE_PLAYING,
	STATE_GAME_OVER
} from "./constants.js";

class Main {

	constructor() {
		this.rowCount = 6;
		this.wordSize = 6;

		this.ui = new UI(this.rowCount, this.wordSize);
		this.cursor = { row: 0, col: 0 };

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
		for (let row = 0; row < this.rowCount; row++) this.ui.resetRow(row);

		// Request another word
		this.targetWord = "lerdyu".toUpperCase();// this.dictionary.getNextWord();

		// Set game sate
		this.state = STATE_PLAYING;

		// Highlight the first row, indicating the game is ready
		this.highlightCurrentRow(0);
	}

	async init() {
		// Loads the dictionary
		await this.dictionary.load();

		// Initializes the keyboard
		this.keyboard = new Keyboard(this);

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
					this.state = STATE_GAME_OVER;

					this.ui.showToast("Game over!");
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
		if (answer === this.targetWord) return this.onCorrectAnswer(this.cursor.row);

		// Analyzes misplaces occurrences
		const stats = this.analyzeWordAndAnswer(answer);
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
				if (stats[actual].count > stats[actual].misplaced) cell.setBadge(stats[actual].count);

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

	analyzeWordAndAnswer(answer) {
		const stats = { };

		// Analyzes letter occurrences
		for (let i = 0; i < this.wordSize; i++) {
			const expected = this.targetWord[i];
			const actual = answer[i];

			if (!stats.hasOwnProperty(expected)) {
				stats[expected] = {
					count: 0,
					matches: 0, // Amount of correct letter and in order
					misplaced: 0,
				};
			}

			stats[expected].count++; // Count occurrence
			if (expected === actual) stats[expected].matches++;// Count match
		}

		// Analyzes letter misplacement
		for (let i = 0; i < this.wordSize; i++) {
			const expected = this.targetWord[i];
			const actual = answer[i];

			if (actual !== expected && stats.hasOwnProperty(actual) && stats[actual].count > 0) {
				if (!stats.hasOwnProperty(actual)) {
					stats[actual] = {
						count: 0,
						matches: 0,
						misplaced: 0,
					};
				}

				stats[actual].misplaced++; // Count misplaced
			}
		}

		return stats;
	}

	onCorrectAnswer(row) {
		// Add points
		this.points += POINTS_CORRECT_LETTER_AND_ORDER * this.wordSize * 3;

		// Visual feedback
		this.ui.showToast("You win!");

		// Change the game state
		this.state = STATE_GAME_OVER;

		// Highlight entire row as correct
		for (let col = 0; col < this.wordSize; col++) this.ui.getCell({ row, col }).markAsCorrect();
	}

	highlightCurrentRow(row) {
		this.ui.rows[this.cursor.row].clear();
		this.ui.rows[row].markAsActive();
	}

}

new Main();
