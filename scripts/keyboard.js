import {
	STATE_GAME_OVER,
	ALPHABET
} from "./constants.js";

const CODE_BACKSPACE = 8;
const CODE_RETURN = 13;

export class Keyboard {

	constructor(main) {
		this.main = main;

		// Create element
		this.element = document.createElement("div");
		this.element.classList.add("keyboard");
		this.#generate();
		document.body.appendChild(this.element);

		// Register event listeners
		this.#attachHooks();
	}

	async #generate() {
		// Define the keyboard layout
		const layout = [
			["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
			["A", "S", "D", "F", "G", "H", "J", "K", "L"],
			["#BACKSPACE", "Z", "X", "C", "V", "B", "N", "M", "#ENTER"],
		];

		// For each row in the layout
		for (const row of layout) {
			// Create the row element
			const rowElement = document.createElement("div");
			rowElement.classList.add("row");

			// For each key in the row
			for (const col of row) {
				// Create the key element
				const keyElement = document.createElement("div");
				keyElement.classList.add("key");
				keyElement.setAttribute("data-key", col);

				// If special key, use an icon to describe it
				if (col.startsWith("#")) {
					// Import SVG icon
					keyElement.innerHTML = await this.#loadSVG(col.substring(1));
					keyElement.classList.add("img");
				} else {
					// Otherwise just the letter
					keyElement.innerText = col;
				}

				// Handle tap
				keyElement.addEventListener("click", this.#onVirtualKeyBoardClick.bind(this, col));

				rowElement.appendChild(keyElement);
			}

			this.element.appendChild(rowElement);
		}
	}

	async #loadSVG(name) {
		return await fetch(`assets/ic_${name.toLowerCase()}.svg`).then((x) => x.text());
	}

	#onVirtualKeyBoardClick(key) {
		// If the game is in GAME_OVER state, just reset it
		if (this.main.state === STATE_GAME_OVER) return this.main.reset();

		switch (key) {
			case "#BACKSPACE":
				// Handle letter erasing
				this.main.onBackspacePressed();
				break;

			case "#ENTER":
				// Handle row completion
				this.main.onEnterPressed();
				break;

			default:
				// Handle letter typing
				this.main.onTypeLetter(key);
				break;
		}
	}

	#getKeyElement(key) {
		return this.element.querySelector(`[data-key="${key}"`);
	}

	#simulateKeyTap(event) {
		let key = event.key.toUpperCase();

		// Special keys
		if (event.keyCode === CODE_BACKSPACE || event.keyCode === CODE_RETURN) key = `#${key}`;

		const element = this.#getKeyElement(key);
		if (!element) return; // Invalid key

		// Highlight the key
		if (event.type === "keyup") {
			element.classList.remove("active");
		} else if (event.type === "keydown") {
			element.classList.add("active");
		}
	}

	#attachHooks() {
		window.addEventListener("keyup", this.#onKey.bind(this));
		window.addEventListener("keydown", this.#onKey.bind(this));
		window.addEventListener("keypress", this.#onKey.bind(this));
	}

	#onKey(event) {
		// If the game is in GAME_OVER state, just reset it
		if (this.main.state === STATE_GAME_OVER) {
			if (event.type === "keyup") this.main.reset();

			return;
		}

		this.#simulateKeyTap(event);

		const key = event.key.toUpperCase();

		if (event.type === "keypress" && ALPHABET.contains(key)) {
			// Handle letter typing
			this.main.onTypeLetter(key);

			event.preventDefault();
		} else if (event.type === "keydown" && event.keyCode === CODE_BACKSPACE) {
			// Handle letter erasing
			this.main.onBackspacePressed();

			event.preventDefault();
		} else if (event.type === "keydown" && event.keyCode === CODE_RETURN) {
			// Handle row completion
			this.main.onEnterPressed();

			event.preventDefault();
		}
	}

	clear() {
		for (let i = 0; i < ALPHABET.length; i++) {
			const letter = ALPHABET[i];
			const element = this.#getKeyElement(letter);
			element.classList.remove("correct");
			element.classList.remove("hint");
			element.classList.remove("incorrect");
			element.classList.remove("active");
		}
	}

	highlightKeysAccordingToAnswer(answer, stats) {
		for (const letter in stats) {
			if (!stats.hasOwnProperty(letter)) continue;

			const element = this.#getKeyElement(letter);

			if (stats[letter].misplaced > 0) {
				element.classList.add("hint");
			} else if (stats[letter].matches > 0) {
				element.classList.add("correct");
			}
		}

		for (const letter of answer) {
			const element = this.#getKeyElement(letter);
			if (!stats.hasOwnProperty(letter) || stats[letter].count <= 0) {
				element.classList.add("incorrect");
			}
		}
	}

}
