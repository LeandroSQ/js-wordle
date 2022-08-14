import Store from "./store";
import DOM from "./dom";
import { SUPPORTED_DIFFICULTIES } from "./constants";

export class DifficultySelector {

	constructor(main) {
		this.main = main;

		this.current = this.#getPreferredSize();
		this.main.wordSize = this.current.letters;
		this.main.rowCount = this.current.rows;

		this.#generateDom();
	}

	#getPreferredSize() {
		const savedPreferredSize = Store.get("preferredDifficulty");
		const size = savedPreferredSize || SUPPORTED_DIFFICULTIES[1];

		return size;
	}

	#generateDom() {
		/* Root element */
		const element = DOM.create({
			tag: "div",
			classes: ["size", "selector"],
			onClick: (e) => {
				this.rootElement.classList.toggle("visible");
			},
			children: [
				/* Inner */
				DOM.create({
					tag: "span",
					classes: ["inner"],
					innerText: this.current.name
				}),

				/* Popup */
				DOM.create({
					parentElement: {
						tag: "div",
						classes: ["popup"]
					},

					/* Nested table */
					tag: "table",
					children: SUPPORTED_DIFFICULTIES.map((difficult) => {
						return DOM.create({
							tag: "tr",
							onClick: (e) => {
								this.#onDifficultyChange(difficult);
							},
							children: [
								DOM.create({
									tag: "td",
									innerText: difficult.name
								}),
								DOM.create({
									tag: "small",
									parentElement: {
										tag: "td",
									},
									innerText: `${difficult.letters}x${difficult.rows}`
								})
							]
						});
					})
				})
			]
		});

		this.rootElement = element;
		document.body.appendChild(element);
	}

	#onDifficultyChange(difficult) {
		this.current = difficult;

		// Update UI
		const inner = this.rootElement.querySelector(".inner");
		inner.innerText = difficult.name;

		// Save the preferred difficulty
		Store.set("preferredDifficulty", difficult);

		// Update the game
		this.main.onDifficultyChanged(difficult);
	}

	set current(value) {
		// Remove previous selected class
		if (this._current?.name) document.body.classList.remove(`difficulty-${this._current.name.toLowerCase()}`);

		// Add new selected class
		this._current = value;
		document.body.classList.add(`difficulty-${value.name.toLowerCase()}`);
	}

	get current() {
		return this._current;
	}

}