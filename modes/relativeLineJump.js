const vscode = require("vscode");
const { checkAnswer, reset, waitForAnswer } = require("../utils/utilsRLJ");

async function relativeLineJump(context) {
    context.subscriptions.push(
        vscode.commands.registerCommand("delete-me-vim.relative-line-jump", async () => {
            reset();
            let answer = await waitForAnswer();
            await checkAnswer(answer);
        })
    );
}

module.exports = { relativeLineJump };