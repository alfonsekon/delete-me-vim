const vscode = require("vscode");
const { generateRandomLineNumber } = require('./utilsRLJ');
const { maze } = require('./mazeMaze');
const { buildText, jumpToNewFile, createNewFile } = require('../utils/utils');

const MAZE_WIDTH = 13
const MAZE_HEIGHT = 18

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
    const document = editor.document;

    let validPosFound = false;
    let attempts = 0;
    const maxAttempts = 50;

    console.log(`before while loop`);
    while (attempts < maxAttempts && !validPosFound) {
    console.log('within while loop');
        const x = generateRandomLineNumber(MAZE_WIDTH);
        const y = generateRandomLineNumber(MAZE_HEIGHT);
        console.log(`Random numbers: ${x}, ${y}`);
        const lineText = document.lineAt(x).text;

        if (lineText[y] === ' ') {
            console.log(`within if condition`); 
            const pos = new vscode.Position(x, y);
            await editor.edit(editBuilder => {
                editBuilder.replace(new vscode.Range(new vscode.Position(x, y), new vscode.Position(x, y+1)), 'X');
                console.log(`'X' has been spawned at ${pos}`);
            })
            validPosFound = true;
        console.log(`line text at line ${document.lineAt(x).lineNumber} is ${lineText}`);
        }
        attempts++;
    }

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