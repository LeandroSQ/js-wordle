class Store {

	/**
	 * Gets a value from localStorage
	 *
	 * @param {string} key The key to get the value from
	 * @param {boolean} parse Whether to parse the value as JSON
	 * @param {any} defaultValue The default value to return if the key is not found
	 * @return {string|any} The value from localStorage
	 */
	get(key, parse = true, defaultValue = null) {
		const value = localStorage.getItem(key);

		if (value) {
			return parse ? JSON.parse(value) : value;
		} else {
			return defaultValue;
		}
	}

	/**
	 * Sets a value in localStorage
	 * 
	 * @param {string} key The key to set the value to
	 * @param {any} value The value to set
	 * @param {boolean} stringify Whether to stringify the value before setting it
	 * @return {void}
	 */
	set(key, value, stringify = true) {
		if (stringify) {
			localStorage.setItem(key, JSON.stringify(value));
		} else {
			localStorage.setItem(key, value);
		}

		return value;
	}

};

const instance = new Store();
export default instance;