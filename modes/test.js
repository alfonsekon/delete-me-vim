const vscode = require('vscode');
const { jumpToNewFile, spawnText, createNewFile } = require('../utils/utils');

async function testExtension(context) {
    context.subscriptions.push(
        vscode.commands.registerCommand("delete-me-vim.test", async () => {
            const fileUri = await createNewFile('delete-me-vim|test');
            await spawnText(fileUri, testMsg);
            await jumpToNewFile(fileUri);
        })
    );
}

const testMsg = `this is a test file.`;

module.exports = { testExtension, testMsg };
