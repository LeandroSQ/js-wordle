import { Row } from "./row.js";

export class UI {

	constructor(rowCount, wordSize) {
		// Initialize element
		this.element = document.createElement("div");
		this.element.classList.add("ui");
		document.body.appendChild(this.element);

		// Initialize the rows
		this.rows = [];
		for (let i = 0; i < rowCount; i++) {
			const row = new Row(wordSize);
			this.rows.push(row);
			this.element.appendChild(row.element);
		}
	}

	setCell({ row, col }, key) {
		this.rows[row].cells[col].letter = key;
	}

	getCell({ row, col }) {
		return this.rows[row].cells[col];
	}

	isEmpty({ row, col }) {
		const letter = this.rows[row].cells[col].letter;

		return !letter || letter.length <= 0;
	}

	getRowText(row) {
		return this.rows[row].cells.map((x) => x.letter).join("");
	}

	resetRow(row) {
		this.rows[row].clear();

		for (let col = 0; col < this.rows[row].cells.length; col++) {
			this.rows[row].cells[col].clear();
		}
	}

	showToast(message, duration = 2000) {
		// Creates a toast element
		const element = document.createElement("div");
		element.classList.add("toast");
		element.setAttribute("data-duration", duration);
		element.innerText = message;

		// Shows it
		document.body.appendChild(element);

		setTimeout(() => {
			element.classList.add("removing");
		}, duration - 250);

		// Removes the toast element
		setTimeout(() => {
			document.body.removeChild(element);
		}, duration);
	}

	#markLetter(letter, tag) {
		const letterElement = [...this.keyboardElement.children].find((x) => x.innerText === letter);
		letterElement.classList.add(tag);
	}

	markLetterAsCorrect(letter) {
		this.#markLetter(letter, "correct");
	}

	markLetterAsIncorrect(letter) {
		this.#markLetter(letter, "incorrect");
	}

	markLetterAsHint(letter) {
		this.#markLetter(letter, "hit");
	}

}
