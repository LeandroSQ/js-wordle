class DOM {

	/**
	 *
	 * @param {Object} options
	 * @param {String} options.tag
	 * @param {String|Array<String>} options.classes
	 * @param {String} options.innerText
	 * @param {String} options.innerHTML
	 * @param {Object} options.parentElement
	 * @param {Object} options.attributes
	 * @param {Function} options.onClick
	 * @param {HTMLElement|Array<HTMLElement>} options.children
	 *
	 * @return {HTMLElement}
	 */
	create({ tag, parentElement, classes, innerText, children, attributes, onClick }) {
		const element = document.createElement(tag);

		// Sets custom attributes
		if (attributes) {
			Object.keys(attributes).forEach((key) => {
				element.setAttribute(key, attributes[key]);
			});
		}

		// Sets classes
		if (classes) {
			if (Array.isArray(classes)) element.classList.add(...classes);
			else element.classList.add(classes);
		}

		// Sets inner text
		if (innerText) element.innerText = innerText;

		// Sets children elements
		if (children) {
			if (Array.isArray(children)) element.append(...children);
			else element.append(children);
		}

		// Sets onClick event
		if (onClick) element.addEventListener("click", onClick);

		// Sets parent element, creating wrapper recursively if needed
		if (parentElement) {
			const parent = this.create(parentElement);
			parent.appendChild(element);

			return parent;
		}

		return element;
	}

}

const instance = new DOM();
export default instance;