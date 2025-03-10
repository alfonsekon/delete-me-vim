const vscode = require("vscode");
const { jumpToNewFile, spawnText, createNewFile } = require('../utils/utils');
const lineCount = 15;

async function spawnNLines(fileUri, numOfLines) {
    let text = '\n'.repeat(numOfLines);
    await spawnText(fileUri, text);
}

function generateRandomLineNumber(maxLines) {
    return Math.floor(Math.random() * maxLines);
}

async function countDocumentLines(editor) {
    const document = editor.document;
    const totalLines = document.lineCount;

    return { totalLines, document };
}

async function spawnDeleteMe(fileUri, customMsg = 'Delete Me!') {
    customMsg += '\n';
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const { document } = await countDocumentLines(editor);
    const { totalLines } = await countDocumentLines(editor);
    const lineNumber = generateRandomLineNumber(totalLines); //zero index

    await editor.edit(editBuilder => {
        editBuilder.insert(new vscode.Position(lineNumber, 0), customMsg);
    })

    vscode.window.showInformationMessage(`Spawned '${customMsg}' on line ${lineNumber + 1}.`); //+1 for 1 index
    await deleteListener(document, customMsg, lineNumber);
}

async function checkMsg(document, targetMsg, lineNumber) {
    if (lineNumber < 0 || lineNumber >= document.lineCount) {
        vscode.window.showErrorMessage(`Line count is out of bounds.`)
        return false;
    }

    const line = document.lineAt(lineNumber);
    console.log(`Content at line ${lineNumber} is ${line.text}`);
    return (line.text).length !== 0;
}

async function deleteListener(document, targetMsg, lineNumber) {
    const disposable = vscode.workspace.onDidChangeTextDocument(async event => {
        // console.log(`is correct document?: ${event.document === document}`);
        if (event.document === document) {
            const stillExists = await checkMsg(document, targetMsg, lineNumber);
            // console.log(`stillExists?: ${stillExists}`);
            if (!stillExists) {
                vscode.window.showInformationMessage(`${targetMsg} has been deleted!`);
                disposable.dispose();

                const fileUri = document.uri;
                await spawnDeleteMe(fileUri);
            }
        }
    });
}

async function relativeLineJump(context) {
    context.subscriptions.push(
        vscode.commands.registerCommand("delete-me-vim.relative-line-jump", async () => {
            const fileUri = await createNewFile('delete-me-vim|relative-line-jump');
            await spawnNLines(fileUri, lineCount);
            await jumpToNewFile(fileUri);
            await spawnDeleteMe(fileUri);
        })
    );
}

module.exports = { relativeLineJump };