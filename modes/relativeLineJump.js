const vscode = require("vscode");
const { jumpToNewFile, spawnText, createNewFile } = require('../utils/utils');

const lineCount = 15;
let MAIN_MESSAGE = 'Delete Me!';
let playing = false;

let score = 0;
let scoreStatusbarItem;

let countdown = 5;
let countdownInterval;
let countdownStatusBarItem;

async function endGame() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    vscode.window.showErrorMessage(`Time is up! Your score was ${score}`);
}

function startCountdown() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }

    countdown = 5;
    updateCountdownDisplay();

    countdownInterval = setInterval(() => {
        countdown--;
        updateCountdownDisplay();

        if (countdown <= 0) {
            clearInterval(countdownInterval);
            endGame();
            playing = false;
            console.log(`RLJ has finished. Score was ${score}`);
        }
    }, 1000)
}

async function updateCountdownDisplay() {
    if (!countdownStatusBarItem) {
        countdownStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
        countdownStatusBarItem.show();
    }
    countdownStatusBarItem.text = `Time Remaining: ${countdown}s`;
    countdownStatusBarItem.tooltip = `Delete Me! Vim - Relative Line Jump time remaining`
}

async function updateScore() {
    score++;
    scoreStatusbarItem.text = `Line Jump Score: ${score}`;
    scoreStatusbarItem.show();
}

async function updateScoreDisplay() {
    if (!scoreStatusbarItem) {
        scoreStatusbarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    }
    score = 0;
    scoreStatusbarItem.text = `Line Jump Score: ${score}`;
    scoreStatusbarItem.tooltip = `Delete Me! Vim - Relative Line Jump score`;
    scoreStatusbarItem.show();
}

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

// async function spawnScore(fileUri, score) {
//     const congratsMsg = `Congratulations! You were able to delete ${score} lines in ${countdown} seconds!`
//     // const pbMsg = `Personal Best: `

//     await spawnText(fileUri, congratsMsg);
// }

async function spawnWelcomeMsg(fileUri) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const welcomeMsg = `

    Welcome to Delete Me! Vim - Relative Line Jump (RLJ) Mode. 
    Your goal is to delete the 'Delete Me!' lines as quick as you can
    before the time runs out. Up for a challenge? 
    Delete the line that corresponds to your choice.

    [Yes]
    [No]

    `
    const yesLineNumber = 7 //zero index
    const noLineNumber = yesLineNumber + 1 //zero index
    let answer = '';

    await spawnText(fileUri, welcomeMsg);
    // let answer = vscode.window.showInformationMessage("What is your answer?", "Yes", "No");

    //i need to distinguish this document from the '...|relative-line-jump' document 
    const { totalLines } = await countDocumentLines(editor);
    const { document } = await countDocumentLines(editor);

    const isYesDeleted = await deleteListener(document, `[Yes]`, yesLineNumber);
    const isNoDeleted = await deleteListener(document, `[No]`, noLineNumber);

    if (isYesDeleted) {
        answer = 'Yes'
    } else if (isNoDeleted) {
        answer = 'No';
    } else {
        answer = 'Invalid';
    }

    return answer;
}

async function spawnDeleteMe(fileUri, customMsg = MAIN_MESSAGE) {
    customMsg += '\n';
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const { document } = await countDocumentLines(editor);
    const { totalLines } = await countDocumentLines(editor);
    const lineNumber = generateRandomLineNumber(totalLines); //zero index

    await editor.edit(editBuilder => {
        editBuilder.insert(new vscode.Position(lineNumber, 0), customMsg);
    })

    playing = true;
    if (countdown > 0) {
        console.log(`RLJ is ongoing!`)
    } else {
        console.log("RLJ has stopped. score does not count anymore")
    }

    // vscode.window.showInformationMessage(`Spawned '${customMsg}' on line ${ lineNumber + 1 }.`); //+1 for 1 index
    let deleted = await deleteListener(document, customMsg, lineNumber);
    // if (deleted) {
    //     await spawnDeleteMe(fileUri);
    // }
    return playing;
}

async function checkMsg(document, targetMsg, lineNumber) {
    if (lineNumber < 0 || lineNumber >= document.lineCount) {
        vscode.window.showErrorMessage(`Line count is out of bounds.`)
        return false;
    }

    const line = document.lineAt(lineNumber);
    console.log(`Content at line ${lineNumber} is ${line.text} `);
    return (line.text).length !== 0;
}

async function deleteListener(document, targetMsg, lineNumber) {
    let deleted = false;
    const disposable = vscode.workspace.onDidChangeTextDocument(async event => {
        // console.log(`is correct document ?: ${ event.document === document } `);
        if (event.document === document) {
            const stillExists = await checkMsg(document, targetMsg, lineNumber);
            // console.log(`stillExists ?: ${ stillExists } `);
            if (!stillExists) {
                await updateScore();
                disposable.dispose();
                deleted = true;

                const fileUri = document.uri;
                await spawnDeleteMe(fileUri);
            }
        }
    });
    return deleted;
}

async function startGame(fileUri) {
    startCountdown();
    await spawnDeleteMe(fileUri);
}

async function initRLJ() {
    const fileUri = await createNewFile('delete-me-vim|relative-line-jump');
    await spawnNLines(fileUri, lineCount);
    await jumpToNewFile(fileUri);
    await updateScoreDisplay();
    await updateCountdownDisplay();

    return fileUri
}

async function relativeLineJump(context) {
    context.subscriptions.push(
        vscode.commands.registerCommand("delete-me-vim.relative-line-jump", async () => {
            // const welcomeFileUri = await createNewFile('delete-me-vim|welcome')
            // await jumpToNewFile(welcomeFileUri);
            // const answer = await spawnWelcomeMsg(welcomeFileUri);
            // console.log(`ANSWER: ${answer}`);
            const fileUri = await initRLJ();
            await startGame(fileUri);

            // if (answer === 'Yes') {
            // } else if (answer === 'No') {
            //     vscode.window.showInformationMessage('Well, try again next time!');
            //     vscode.commands.executeCommand('workbench.action.closeActiveEditor');
            // } else {
            //     vscode.window.showInformationMessage('Invalid Choice.');
            // }
        })
    );
}

module.exports = { relativeLineJump };