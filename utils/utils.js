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
        const document = await vscode.workspace.openTextDocument(fileUri);
        await vscode.window.showTextDocument(document);
    } catch (e) {
        console.error(e.message);
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

module.exports = { deleteFiles, jumpToNewFile, createNewFile, spawnText, files };