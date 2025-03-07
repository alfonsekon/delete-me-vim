const vscode = require('vscode');
const path = require('path');
const fs = require('fs').promises;
const os = require('os');

async function createTempFile(numOfLines) {
    const tempDir = os.tmpdir();
    const filePath = path.join(tempDir, 'delete-me.txt');

    await fs.writeFile(filePath, '\n'.repeat(numOfLines));

    const document = await vscode.workspace.openTextDocument(filePath);
    const editor = await vscode.window.showTextDocument(document);

    return { document, editor, filePath };
}

async function spawnDeleteMe(context, editor, document) {
    const totalLines = document.lineCount;
    const randomLine = Math.floor(Math.random() * totalLines);

    await editor.edit(editBuilder => {
        editBuilder.insert(new vscode.Position(randomLine, 0), 'delete me!\n');
    });

    context.workspaceState.update('deleteMeLine', randomLine);
}

function activate(context) {
    console.log('delete-me-vim is now active!');

    let numOfLines = 20;
    let isFileOpen = true; 
    let deleteCount = 0;

    let insertDisposable = vscode.commands.registerCommand('delete-me-vim.spawn', async function () {
        const { document, editor, filePath } = await createTempFile(numOfLines);

        const closeListener = vscode.workspace.onDidCloseTextDocument(closedDoc => {
            if (closedDoc.fileName === filePath) {
                isFileOpen = false;
                console.log('delete-me.txt closed. Stopping loop.');
            }
        });

        while (isFileOpen) {
            await spawnDeleteMe(context, editor, document);

            await new Promise(resolve => {
                let deleteListener = vscode.workspace.onDidChangeTextDocument(event => {
                    const deleteMeLine = context.workspaceState.get('deleteMeLine');
                    if (deleteMeLine === undefined) return;

                    const deleted = event.contentChanges.some(change => {
                        return change.range.start.line === deleteMeLine && change.text === '';
                    });

                    if (deleted) {
                        deleteCount++;
                        vscode.window.showInformationMessage(`Delete Count: ${deleteCount}`);
                        context.workspaceState.update('deleteMeLine', undefined);
                        deleteListener.dispose(); // Stop listening for deletions
                        resolve(); // Continue the loop
                    }
                });

                context.subscriptions.push(deleteListener);
            });
        }

        closeListener.dispose();
    });

    context.subscriptions.push(insertDisposable);
}

function deactivate() {}

module.exports = { activate, deactivate };
