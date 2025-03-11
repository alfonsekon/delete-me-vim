# Delete Me! Vim

Welcome to `Delete Me! Vim`! A simple VS Code extension that aims to train your Vim Motions. This is ***heavily*** inspired by ThePrimeagen's [vim-be-good](https://github.com/ThePrimeagen/vim-be-good) plugin.

## Features

As of *Mar 10, 2025*, the only mode is `Relative Line Jump` mode, which trains your ability to perform relative line jumping and line deletion.

## Requirements

- [Vim](https://marketplace.visualstudio.com/items?itemName=vscodevim.vim) Plugin for VS Code 
- Set your [`Editor: Line Numbers`](vscode://settings/editor.lineNumbers) to `relative` (this will change your life)
- Make sure to have your notifications on as you will interact with it
> Turn off *Do Not Disturb* or *Zen Mode*

## Known Issues

- Deleting line/s above the target "Delete Me!" will spawn additional targets, leading to multiple targets being on screen simultaneously.
- Deleting lines/s below the target will not spawn a new line and the player can run out of lines.

## Release Notes

### 0.0.2
Added a welcome screen with instructions and a prompt/invitation for the user to play. Score and timer added to add a sense of playing a game

### 0.0.1(?)
delete-me-vim, relative-line-jump mode were born

---