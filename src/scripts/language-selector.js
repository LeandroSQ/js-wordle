import Store from "./store";
import DOM from "./dom";
import { SUPPORTED_LANGUAGES } from "./constants";

export class LanguageSelector {

	constructor(main) {
		this.main = main;

		this.defaultLanguage = "en-US";

		this.current = this.#getPreferredLanguage();

		console.groupCollapsed("Language");
		console.log("Supported languages:", SUPPORTED_LANGUAGES);
		console.log(`Current language: ${this.current.code}`);
		console.groupEnd();

		this.#generateDom();
	}

	#getPreferredLanguage() {
		const savedPreferredLanguage = Store.get("preferredLanguage");
		const code = savedPreferredLanguage || (navigator.languages ? navigator.languages[0] : navigator.language || navigator.userLanguage) || this.defaultLanguage;
		const language = SUPPORTED_LANGUAGES.find((language) => language.code === code);

		return language;
	}

	#generateDom() {
		/* Root element */
		const element = DOM.create({
			tag: "div",
			classes: ["language", "selector"],
			onClick: (e) => {
				this.rootElement.classList.toggle("visible");
			},
			children: [
				/* Inner */
				DOM.create({
					tag: "span",
					classes: ["inner"],
					innerText: this.current.name,
					children: [this.#getCountryFlagImgElement(this.current.code)]
				}),

				/* Popup */
				DOM.create({
					parentElement: {
						tag: "div",
						classes: ["popup"]
					},

					/* Nested table */
					tag: "table",
					children: SUPPORTED_LANGUAGES.map((language) => {
						return DOM.create({
							tag: "tr",
							onClick: (e) => {
								this.#onLanguageChange(language);
							},
							children: [
								DOM.create({
									tag: "td",
									innerText: language.name
								}),
								DOM.create({
									tag: "td",
									children: [this.#getCountryFlagImgElement(language.code)]
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

	#onLanguageChange(language) {
		this.current = language;

		// Update UI
		const inner = this.rootElement.querySelector(".inner");
		inner.innerHTML = language.name;
		inner.append(this.#getCountryFlagImgElement(language.code));

		// Save preferred language
		Store.set("preferredLanguage", language.code);

		// Reload dictionaries
		this.main.onLanguageChanged(language);
	}

	#getCountryFlagUrl(language) {
		return `https://hatscripts.github.io/circle-flags/flags/${this.#extractCountryFromLanguage(language)}.svg`;
	}

	#getCountryFlagImgElement(language) {
		return DOM.create({
			tag: "img",
			attributes: {
				src: this.#getCountryFlagUrl(language),
				alt: language,
				title: language,
				width: "16"
			},
		});
	}

	#extractCountryFromLanguage(language) {
		// Extract country from language code (e.g. "en-US" -> "US")
		return language.split("-")[1].toLowerCase();
	}

}