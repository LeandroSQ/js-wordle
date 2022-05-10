import { Cell } from "./cell.js";

export class Row {

	constructor(cellCount) {
		// Initialize element
		this.element = document.createElement("div");
		this.element.classList.add("row");

		// Initialize the cells
		this.cells = [];
		for (let i = 0; i < cellCount; i++) {
			const cell = new Cell();
			this.cells.push(cell);
			this.element.appendChild(cell.element);
		}
	}

	clear() {
		this.element.classList.remove("active");
	}

	markAsActive() {
		this.element.classList.add("active");
	}

}
