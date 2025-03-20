const vscode = require("vscode");
const { } = require('./utilsRLJ');
const { maze } = require('./mazeMaze');
const { buildText, jumpToNewFile, createNewFile } = require('../utils/utils');

async function checkX(document) {
    const line = document.lineAt(0);
    const originalLine = 'x  <-  Delete to Start';
    const isXDeleted = !line.text.trim().includes('x') && line.text.trim().length < originalLine.trim().length;

    return isXDeleted;
}

async function deleteListener(document) {
    const disposable = vscode.workspace.onDidChangeTextDocument(async event => {
        if (event.document === document) {
            const isXDeleted = await checkX(document);

            if (isXDeleted) {
                disposable.dispose();
                console.log(`x has been deleted!`);
                await spawnX();
            }
        }
    });
}

async function spawnX() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    await editor.edit(editBuilder => {
        // editBuilder.insert(new vscode.Position(6, 3), 'X');
        editBuilder.replace(new vscode.Position(1, 0), 'X');
        editBuilder.delete(new vscode.Range(new vscode.Position(0, 0), new vscode.Position(1, 1)));
    })
}

async function testMaze() {
    console.log("Maze Mode is running.");
    vscode.window.showInformationMessage("Maze Mode is running.");
}

async function spawnMaze(maze) {
    /**
     * puts the maze on screen.
     */
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    // await buildText(editor, maze);
    await editor.edit(editBuilder => {
        editBuilder.insert(new vscode.Position(0, 0), maze);
    })
}

async function initMaze() {
    /**
     * makes a new file and goes to it
     */
    const mazeFileUri = await createNewFile('delete-me-vim|maze');
    await jumpToNewFile(mazeFileUri);
    await spawnMaze(maze);
    return mazeFileUri
}

async function doMaze() {
    await initMaze();
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const document = editor.document;
        await deleteListener(document);
    }
}

module.exports = { doMaze, testMaze, spawnMaze, initMaze, maze };