// Constants
export const POINTS_CORRECT_LETTER_AND_ORDER = 10;
export const POINTS_CORRECT_LETTER_WRONG_ORDER = 2;
export const STATE_PLAYING = 0;
export const STATE_GAME_OVER = 1;
export const ALPHABET = [
	"A",
	"B",
	"C",
	"D",
	"E",
	"F",
	"G",
	"H",
	"I",
	"J",
	"K",
	"L",
	"M",
	"N",
	"O",
	"P",
	"Q",
	"R",
	"S",
	"T",
	"U",
	"V",
	"W",
	"X",
	"Y",
	"Z",
];
export const SUPPORTED_LANGUAGES = [
	{ code: "en-US", name: "English" },
	{ code: "pt-BR", name: "Português" }
];
export const SUPPORTED_DIFFICULTIES = [
	{ letters: 4, rows: 7, name: "Easy" },
	{ letters: 5, rows: 6, name: "Medium" },
	{ letters: 6, rows: 5, name: "Hard" }
];