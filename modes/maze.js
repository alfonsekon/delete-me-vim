const vscode = require("vscode");
const { testMaze, spawnMaze, initMaze, maze, maze2, doMaze } = require("../utils/utilsMaze");

async function startMaze(context) {
    context.subscriptions.push(
        vscode.commands.registerCommand("delete-me-vim.maze", async () => {
            await doMaze();
        })
    );
}

module.exports = { startMaze };
