const vscode = require("vscode");
const { checkAnswer, reset, waitForAnswer } = require("../utils/utilsRLJ");

async function startRelativeLineJump(context) {
    context.subscriptions.push(
        vscode.commands.registerCommand("delete-me-vim.relative-line-jump", async () => {
            reset();
            await checkAnswer(await waitForAnswer());
        })
    );
}

module.exports = { startRelativeLineJump };