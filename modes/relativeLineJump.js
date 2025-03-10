const vscode = require("vscode");
const { deleteFile, jumpToNewFile, spawnText, createNewFile } = require('../utils/utils');

const lineCount = 15;
const targetScore = 20;
let canAddScore = true;
let MESSAGE = 'Delete Me!';
let playing = false;

let score = 0;
let scoreStatusbarItem;

let countdown = 3;
let countdownInterval;
let countdownStatusBarItem;

let timer = 0;
let timerInterval;
let timerStatusBarItem;

function reset() {
    MESSAGE = 'Delete Me!';
    canAddScore = true;
    playing = false;
    timer = 0;
    score = 0;

    if (scoreStatusbarItem) {
        scoreStatusbarItem.dispose();
        scoreStatusbarItem = undefined;
    }
    if (timerStatusBarItem) {
        timerStatusBarItem.dispose();
        timerStatusBarItem = undefined;
    }

    if (countdownStatusBarItem) {
        countdownStatusBarItem.dispose();
        countdownStatusBarItem = undefined;
    }

    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = undefined;
    }

    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = undefined;
    }
}

async function startCountdown() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }

    countdown = 3;

    if (!countdownStatusBarItem) {
        countdownStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
        countdownStatusBarItem.show();
    }

    return new Promise((resolve) => {
        countdownInterval = setInterval(() => {
            if (countdown > 0) {
                countdownStatusBarItem.text = `Starting in ${countdown}...`;
                // vscode.window.showInformationMessage( `Starting in ${countdown}...`);
                countdown--;
            } else {
                clearInterval(countdownInterval);
                countdownStatusBarItem.hide();
                resolve();
            }
        }, 1000);
    });
}

async function endGame() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    vscode.window.showInformationMessage(`Good job! You deleted ${targetScore} targets in ${timer} seconds!`);
}

function startTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    const start = Date.now();
    timer = 0;
    updateTimerDisplay();

    timerInterval = setInterval(() => {
        timer = (Date.now() - start) / 1000;
        updateTimerDisplay();

        if (score >= targetScore) {
            clearInterval(timerInterval);
            MESSAGE = 'Game Over!';
            canAddScore = false;
            playing = false;
            endGame();
            // console.log(`RLJ has finished. Score was ${score}`);
            console.log(`RLJ has finished. Time elapsed: ${timer}`);
        }
    }, 100)
}

async function updateTimerDisplay() {
    if (!timerStatusBarItem) {
        timerStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
        timerStatusBarItem.show();
    }
    timerStatusBarItem.text = `Time Elapsed: ${timer.toFixed(2)}s`;
    timerStatusBarItem.tooltip = `Delete Me! Vim - Relative Line Jump time elapsed`
}

async function updateScore() {
    if (canAddScore) {
        score++;
    }
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

async function spawnWelcomeMsg(fileUri) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const welcomeMsg = `

    Welcome to Delete Me! Vim - Relative Line Jump (RLJ) Mode. 
    Your goal is to delete the 'Delete Me!' lines as quick as you can.
    Up for a challenge? Check your notifications and choose your answer. 

    `;

    await spawnText(fileUri, welcomeMsg);

    return vscode.window.showInformationMessage("Up for a challenge?", "Yes", "No");
}

async function spawnDeleteMe(fileUri, customMsg = MESSAGE) {
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

    //console logs because im paranoid :)
    if (timer > 0) {
        console.log(`RLJ is ongoing!`)
    } else {
        console.log("RLJ has stopped. score does not count anymore")
    }
    // vscode.window.showInformationMessage(`Spawned '${customMsg}' on line ${ lineNumber + 1 }.`); //+1 for 1 index

    await deleteListener(document, customMsg, lineNumber, async () => {
        await updateScore();
        if (timer > 0) {
            await spawnDeleteMe(fileUri);
        }
    });

    return playing;
}

async function checkMsg(document, targetMsg, lineNumber) {
    if (lineNumber < 0 || lineNumber >= document.lineCount) {
        return false;
    }

    const line = document.lineAt(lineNumber);
    console.log(`Content at line ${lineNumber} is ${line.text}`);
    return (line.text).length !== 0;
}

async function deleteListener(document, targetMsg, lineNumber, onDelete) {
    const disposable = vscode.workspace.onDidChangeTextDocument(async event => {
        // console.log(`is correct document ?: ${ event.document === document } `);
        if (event.document === document) {
            const stillExists = await checkMsg(document, targetMsg, lineNumber);
            // console.log(`stillExists ?: ${ stillExists } `);
            if (!stillExists) {
                disposable.dispose();
                await onDelete();
            }
        }
    });
}

async function startGame(fileUri) {
    startTimer();
    await spawnDeleteMe(fileUri);
}

async function initRLJ() {
    const fileUri = await createNewFile('delete-me-vim|relative-line-jump');
    await spawnNLines(fileUri, lineCount);
    await jumpToNewFile(fileUri);
    await updateScoreDisplay();
    await updateTimerDisplay();

    return fileUri
}

async function relativeLineJump(context) {
    context.subscriptions.push(
        vscode.commands.registerCommand("delete-me-vim.relative-line-jump", async () => {
            reset();
            const welcomeFileUri = await createNewFile('delete-me-vim|welcome-relative-line-jump')
            await jumpToNewFile(welcomeFileUri);

            const answer = await spawnWelcomeMsg(welcomeFileUri);
            console.log(`ANSWER: ${answer}`);

            if (answer === 'Yes') {
                const gameFileUri = await initRLJ();
                await startCountdown();
                await startGame(gameFileUri);
                await deleteFile('delete-me-vim|welcome-relative-line-jump');
            } else {
                vscode.window.showInformationMessage('Well, try again next time!');
                vscode.commands.executeCommand('workbench.action.revertAndCloseActiveEditor');
                reset();
                await deleteFile('delete-me-vim|welcome-relative-line-jump');
            }
        })
    );
}

module.exports = { relativeLineJump };