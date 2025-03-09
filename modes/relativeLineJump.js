const vscode = require("vscode");
const { jumpToNewFile, spawnText, createNewFile } = require('../utils/utils');
const numOfLines = 15;

async function spawnLines(fileUri, numOfLines) {
    let text = '\n'.repeat(numOfLines);
    await spawnText(fileUri, text);
}

async function relativeLineJump(context) {
    context.subscriptions.push(
        vscode.commands.registerCommand("delete-me-vim.relative-line-jump", async () => {
            const fileUri = await createNewFile('delete-me-vim|relative-line-jump');
            await spawnLines(fileUri, numOfLines);
            await jumpToNewFile(fileUri);
        })
    );
}

module.exports = { relativeLineJump };