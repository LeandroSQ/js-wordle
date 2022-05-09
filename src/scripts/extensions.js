Array.prototype.random = function() {
	const index = Math.floor(Math.random() * this.length);

	return this[index];
};

Array.prototype.contains = function(elem) {
	return this.includes(elem);
};

Array.prototype.shuffle = function() {
	for (let i = this.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[this[i], this[j]] = [this[j], this[i]];
	}
};

String.prototype.contains = function(search) {
	return this.indexOf(search) !== -1;
};
