# JS Wordle clone

Simple Javascript clone of the game [Wordle](https://en.wikipedia.org/wiki/Wordle).
<center>
	<br/>
	<img src=".github/screenshot01.png"/>
</center>

<center>
    <p float="left" align="center">
        <img src=".github/screenshot02.png" style="width: 40%"/>
    	<span>&nbsp;&nbsp;&nbsp;</span>
        <img src=".github/screenshot03.png" style="width: 40%"/>
    </p>
</center>

[Live demo here](https://leandrosq.github.io/js-wordle/)

## How to use

- A random word will be generated by the game, your goal is to guess it
- Type your guessed word and press enter
- The game will provide hints to whether your word is similar to the target one
  - Red letters -> These do not appear on the target word
  - Green letters -> These appear in the word in the exactly typed spot
  - Purple letters -> These appear in the word, but in a different spot

- When run out of rows to type, you will either win or lose
  - Pressing any key will restart the game

## Features

- Light and Dark mode
- Full compatible with mobile
- Responsive design
- Vanilla JS without external dependencies
- Fully dynamic, adjusting parameters like word size is possible
- Dictionaries are processed and analyzed, you won't see archaic or strange words

## Project

| Name | Description |
| -- | -- |
| Eslint | For linting and semantic analysis |
| Github actions | For CI, building and deploying to github pages |
| [LexPorBr](http://www.lexicodoportugues.com/) | For providing a wonderful portuguese lexicon |
