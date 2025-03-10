const vscode = require('vscode');
const os = require('os');
const fs = require('fs').promises;
const path = require('path');
const files = [];

// async function checkIfFileExists(fileName) {
//     const filePath = path.join(os.tmpdir(), fileName);
//     if (filePath) {
//         return true;
//     }
//     return false;
// }

async function deleteFile(fileName) {
    /**
     * takes in a filename and removes os.tmpdir() + filename
     * all files are created within the temporary directory
     */
    const filePath = path.join(os.tmpdir(), fileName)

    try {
        await fs.unlink(filePath);
        console.log(`${filePath} deleted.`)
    } catch (e) {
        console.error(`Failed to delete ${filePath}: ${e.message}`);
    }
}

async function deleteFiles() {
    /**
     * iterates through global `files` and deletes each file one by one
     */
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
    /**
     * takes in a fileUri and jumps to new newly created file. use hand-in-hand with createNewFile. 
     */
    try {
        const document = await vscode.workspace.openTextDocument(fileUri);
        await vscode.window.showTextDocument(document);
    } catch (e) {
        console.error(e.message);
        vscode.window.showErrorMessage(`Failed to open file: ${e.message}`)
    }
}

async function createNewFile(fileName) {
    /**
     * creates new file in the os temp directory with the given file name which depends on the mode.
     * returns the fileUri for jumpToNewFile to use
     */
    const tempDir = os.tmpdir();
    const filePath = path.join(tempDir, fileName);
    const fileUri = vscode.Uri.file(filePath);

    // try {
    //     await fs.unlink(filePath);
    //     console.log(`Deleted file before making a new one: ${filePath}`);
    // } catch (e) {
    //     console.error(e.message);
    // }

    const wsedit = new vscode.WorkspaceEdit();
    wsedit.createFile(fileUri, { overwrite: true });

    const created = await vscode.workspace.applyEdit(wsedit);
    if (!created) {
        throw new Error(`Failed to create ${fileName}.`);
    }

    console.log(`Created a new file: ${fileUri}`);
    files.push(fileUri);

    return fileUri;
}

async function spawnText(fileUri, text) {
    let written = false;
    try {
        written = await vscode.workspace.fs.writeFile(fileUri, Buffer.from(text, 'utf-8'));
        console.log(`Successfully written to file.`);
    } catch (e) {
        console.log(`Failed to write to file: ${e}`);
    }
    return written
}

module.exports = { deleteFile, deleteFiles, jumpToNewFile, createNewFile, spawnText, files };