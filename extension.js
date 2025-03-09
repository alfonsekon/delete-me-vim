const vscode = require('vscode');
const os = require('os');
const fs = require('fs').promises;
const path = require('path');
const files = [];

async function deleteFiles() {
    for (const file of files) {
        try {
            await fs.unlink(file.fsPath);
            console.log(`Deleted file: ${file.fsPath}`);
        } catch (e) {
            console.error(`Failed to delete file ${file.fsPath}: ${e.message}`);
        }
    }
    files.length = 0;
}

async function jumpToNewFile(fileUri) {
    try {
        const file = await createNewFile(fileUri);
        // console.log(file);
        const document = await vscode.workspace.openTextDocument(file);
        await vscode.window.showTextDocument(document);
    } catch (e) {
        vscode.window.showErrorMessage(`Failed to open file: ${e.message}`)
    }
}

async function createNewFile(fileName) {
    const tempDir = os.tmpdir();
    const file = path.join(tempDir, fileName);
    const fileUri = vscode.Uri.file(file);

    const wsedit = new vscode.WorkspaceEdit();
    wsedit.createFile(fileUri, { ignoreIfExists: true });

    const created = await vscode.workspace.applyEdit(wsedit);
    if (!created) {
        throw new Error(`Failed to create ${fileName}.`);
    }

    await spawnText(fileUri, "hello world");

    console.log(`Created a new file: ${fileUri}`);

    files.push(fileUri);

    return fileUri;
}

async function spawnText(fileUri, text) {
    try {
        await vscode.workspace.fs.writeFile(fileUri, Buffer.from(text, 'utf-8'));
        console.log(`Successfully written to file.`);
    } catch (e) {
        console.log(`Failed to write to file: ${e}`);
    }
}

async function activate(context) {
    console.log("delete-me-vim is active!");

    context.subscriptions.push(
        vscode.commands.registerCommand("delete-me-vim.test", async () => {
            await jumpToNewFile('delete-me-vim|relative-line-jump');
        })
    );
}

async function deactivate() {
    console.log(`delete-me-vim is deactivating, removing all temporary files`);
    await deleteFiles();
}

module.exports = { activate, deactivate };
