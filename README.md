# Delete Me! Vim

Welcome to [Delete Me! Vim](https://marketplace.visualstudio.com/items?itemName=alfonsekon.delete-me-vim)! A simple VS Code extension that aims to train your Vim Motions. This is ***heavily*** inspired by ThePrimeagen's [vim-be-good](https://github.com/ThePrimeagen/vim-be-good) plugin. 
<br></br>
I will continue developing this extension and add more modes when I have free time --- *I just don't have a lot of free time right now*.

## Features

As of *Mar 10, 2025*, the only mode is `Relative Line Jump` mode, which trains your ability to perform relative line jumping and line deletion.

## Requirements

- [Vim](https://marketplace.visualstudio.com/items?itemName=vscodevim.vim) Plugin for VS Code 
- Set your [`Editor: Line Numbers`](vscode://settings/editor.lineNumbers) to `relative` (this will change your life)
- Make sure to have your notifications on as you will interact with it
> Turn off *Do Not Disturb* or *Zen Mode*
- Enable Delete Me! Vim Extension in the status bar to see your score and time remaining

## How To Play

Open the Command palette `Ctrl+Shift+P` and search for `Delete Me! Vim - Relative Line Jump` to start/restart the game.

## Known Issues

- Only works on Unix-based machines for now
- Deleting line/s above the target "Delete Me!" will spawn additional targets, leading to multiple targets being on screen simultaneously.
- Adding line/s above the target will spawn additional targets.
- Deleting line/s below the target will not spawn a new line and the player can run out of lines.
- Performing undos (`u` in Vim) breaks the game.

**I'm sure there's going to be many more than what I have listed above, but these are the only ones I have come across in my limited testing.** 

In the case of a broken game, restarting the extension by opening the command palette with `Ctrl+Shift+P` and selecting `Delete Me! Vim` *should* reset everything and it should work as expected again.

## Release Notes

### 0.0.4
- Fixed a bug where restarting the extension did not reset everything, and the gameplay becomes deleting `Game Over!`s instead of `Delete Me!`s.
- Added a prompt to restart the game.

### 0.0.3
- Added a welcome screen with instructions and a prompt/invitation for the user to play. Score and timer added to add a sense gaming. Nobody knows what happened to 0.0.2.

### 0.0.1(?)
- delete-me-vim, relative-line-jump mode were born.

---