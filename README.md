# HtmlTracker
Simplistic Fastr Tracker 2 inspired music tracker for your browser.

Written in TypeScript. Uses jQuery and Vash among other things.

Currently can only produce square waves and will probably not work in Chrome (though I'm sure it can be made to run in it). For now the recommended browser is FireFox.

Your creations can be saved to localStorage (if you move the app to another place on HDD, you won't be able to load previously saved songs).

I tried to keep the code tidy for once, but the editor class is a bit of a monster. Anyway, if you need a tracker for something (like an Arduino project), modding this app might be easier than writing your own from scratch.

<h2>Controls</h2>
Use arrow keys to move around the track editor. Edit mode is permanently on. You can use letter keys to input notes musical keyboard style. There are two rows of those, the Z-/ row and the Q-] row. Spacebar adds a break and DEL and Backspace allows removing notes. If a note is already placed the octave and tone can be changed by first selecting them with left arrow and then entering the note letter or octave number. All patterns have the same length, but each channel has it's own set of patterns. Pattern for a channel can be changed by pressing PgUp and PgDown while having that channel selected.
