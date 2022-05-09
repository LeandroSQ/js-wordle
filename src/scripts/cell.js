export class Cell {

	constructor() {
		// Initialize element
		this.element = document.createElement("div");
		this.element.classList.add("cell");
	}

	clear() {
		this.letter = "";
		this.element.classList.remove("correct");
		this.element.classList.remove("incorrect");
		this.element.classList.remove("hint");
		this.element.removeAttribute("data-badge");
	}

	setBadge(text) {
		this.element.setAttribute("data-badge", text);
	}

	markAsCorrect() {
		this.element.classList.add("correct");
	}

	markAsIncorrect() {
		this.element.classList.add("incorrect");
	}

	markAsHint() {
		this.element.classList.add("hint");
	}

	get letter() {
		return this.element.innerText;
	}
	set letter(value) {
		this.element.innerText = value;
	}

}
