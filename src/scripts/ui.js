import { Row } from "./row";
import DOM from "./dom";

export class UI {

	constructor(rowCount, wordSize) {
		// Initialize element
		this.element = document.createElement("div");
		this.element.classList.add("ui");
		document.body.appendChild(this.element);

		// Initialize the rows
		this.#generateRows(rowCount, wordSize);
	}

	#generateRows(rowCount, wordSize) {
		this.rows = [];
		for (let i = 0; i < rowCount; i++) {
			const row = new Row(wordSize);
			this.rows.push(row);
			this.element.appendChild(row.element);
		}
	}

	regenerateRows(rowCount, wordSize) {
		this.element.innerHTML = "";
		this.#generateRows(rowCount, wordSize);
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

	reset() {
		this.#clearHints();

		for (const row of this.rows) {
			row.clear();

			for (const cell of row.cells) {
				cell.clear();
			}
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

	#clearHints() {
		const elements = [...document.querySelectorAll(".word-hint")];
		for (const element of elements) {
			element.parentElement.removeChild(element);
		}
	}

	showHint(message) {
		const element = DOM.create({
			tag: "span",
			parentElement: {
				tag: "div",
				classes: ["word-hint"]
			},
			innerText: message
		});

		const parent = this.element.children[this.element.childElementCount - 1];
		parent.style.position = "relative";
		parent.appendChild(element);
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
