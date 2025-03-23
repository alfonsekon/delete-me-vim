const vscode = require("vscode");
const { deleteFile, jumpToNewFile, spawnText, createNewFile } = require('../utils/utils');

//initial values; will give users option to change
let lineCount = 15;
let targetScore = 15;
let canAddScore = true;
let MESSAGE = 'Delete Me!';
let playing = false;

let score = 0;
let scoreStatusBarItem;

let countdown = 3;
let countdownInterval;
let countdownStatusBarItem;

let timer = 0;
let timerInterval;
let timerStatusBarItem;

function reset() {
    /**
     * resets score, timer and status bar elements
     */

    MESSAGE = 'Delete Me!';
    canAddScore = true;
    playing = false;
    timer = 0;
    score = 0;
    countdown = 3;

    if (scoreStatusBarItem) {
        scoreStatusBarItem.dispose();
        scoreStatusBarItem = undefined;
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
    /**
     * start the countdown (3, 2, 1) before the game starts. displays the countdown in the status bar
     * and is cleared once the game starts
     */    
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }

    countdown = 3;

    if (!countdownStatusBarItem) {
        countdownStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
        countdownStatusBarItem.show();
    }

    //hide timer once countdown is over
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
    /**
     * end game and ask user if they want to play again
     */
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    let tryAgain = await vscode.window.showInformationMessage(`Good job! You deleted ${targetScore} targets in ${timer.toFixed(2)} seconds (${(timer/targetScore).toFixed(2)} seconds/target) Would you like to play again?`, `Yes`, `No`);

    // console.log(`Try Again: ${tryAgain}`);
    await checkAnswer(tryAgain);
}

function startTimer(document) {
    /**
     * starts game timer and displays it on status bar. Timer stops and disappears when tab is closed
     */
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    timer = 0;
    const start = Date.now();
    updateTimerDisplay();

    //listen for tab close
    const tabListener = vscode.window.onDidChangeVisibleTextEditors((editors) => {
        const isDocumentStillOpen = editors.some(editor => editor.document === document);
        if (!isDocumentStillOpen) {
            // console.log(`delete-me-vim|relative-line-jump tab was closed, stopping timer.`);
            stopTimer();
            tabListener.dispose();
            reset();
        }
    });

    timerInterval = setInterval(() => {
        timer = (Date.now() - start) / 1000;
        updateTimerDisplay();

        if (score >= targetScore) {
            score = targetScore; //prevent 21/20 from happening if player is somehow that quick
            clearInterval(timerInterval);
            MESSAGE = 'Game Over!';
            canAddScore = false;
            playing = false;
            endGame();
            // console.log(`RLJ has finished. Score was ${score}`);
            // console.log(`RLJ has finished. Time elapsed: ${timer}`);
        }
    }, 100)
}


function stopTimer() {
    /**
     *  stop timer and hide it from view
     */
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = undefined;
    }

    if (timerStatusBarItem) {
        timerStatusBarItem.dispose();
        timerStatusBarItem = undefined;
    }

    timer = 0;
}

async function updateTimerDisplay() {
    /**
     * update timer in status bar
     */
    if (!timerStatusBarItem) {
        timerStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
        timerStatusBarItem.show();
    }
    timerStatusBarItem.text = `Time Elapsed: ${timer.toFixed(2)}s`;
    timerStatusBarItem.tooltip = `Delete Me! Vim - Relative Line Jump time elapsed`
}

async function updateScore() {
    /**
     * increment score if game is still ongoing. update the score shown in status bar as well
     */
    if (canAddScore) {
        score++;
    }
    scoreStatusBarItem.text = `Line Jump Score: ${score}/${targetScore}`;
    scoreStatusBarItem.show();
}

async function updateScoreDisplay() {
    /**
     * show score in status bar
     */
    if (!scoreStatusBarItem) {
        scoreStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    }
    score = 0;
    scoreStatusBarItem.text = `Line Jump Score: ${score}/${targetScore}`;
    scoreStatusBarItem.tooltip = `Delete Me! Vim - Relative Line Jump score`;
    scoreStatusBarItem.show();
}

async function spawnNLines(fileUri, numOfLines) {
    /**
     * spawn n lines for the target to possibly spawn in (play area)
     */
    const text = '\n'.repeat(numOfLines);
    await spawnText(fileUri, text);
}

async function compensateLines(fileUri, document) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const difference = lineCount - document.lineCount;
    if (difference > 0) {
        await editor.edit(editBuilder => {
            editBuilder.insert(new vscode.Position(0, 0), '\n'.repeat(difference));
        });

    }
}

function generateRandomLineNumber(maxLines) {
    return Math.floor(Math.random() * maxLines);
}

async function countDocumentLines(editor) {
    /**
     * return the number of lines the document has
     */
    const document = editor.document;
    const totalLines = document.lineCount;

    return { totalLines, document };
}

async function spawnWelcomeMsg(fileUri) {
    /**
     * welcome prompt and ask user first time if they want to play
     */
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const welcomeMsg = `

    Welcome to Delete Me! Vim - Relative Line Jump (RLJ) Mode. 
    Your goal is to delete the 'Delete Me!' lines as quick as you can.
    Up for a challenge? Check your notifications and choose your answer. 
    Once you start, your score and the time remaining will be displayed
    in your status bar below. Good luck!

    `;

    await spawnText(fileUri, welcomeMsg);
    await editor.edit(editBuilder => {
        editBuilder.insert(new vscode.Position(0, 0), welcomeMsg);
    })

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
    // if (score < targetScore) {
    //     console.log(`RLJ is ongoing!`)
    // } else {
    //     console.log("RLJ has stopped. score does not count anymore")
    // }
    // vscode.window.showInformationMessage(`Spawned '${customMsg}' on line ${ lineNumber + 1 }.`); //+1 for 1 index

    await deleteListener(document, customMsg, lineNumber, async () => {
        await updateScore();
        if (timer > 0) {
            await compensateLines(fileUri, document); 
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
    return line.text.trim().length !== 0; 
}

async function deleteListener(document, targetMsg, lineNumber, onDelete) {
    const disposable = vscode.workspace.onDidChangeTextDocument(async event => {
        if (event.document === document) {
            const stillExists = await checkMsg(document, targetMsg, lineNumber);

            if (!stillExists) {
                disposable.dispose();
                await onDelete();
            }
        }
    });
}

async function startGame(fileUri) {
    const document = await vscode.workspace.openTextDocument(fileUri);
    startTimer(document);
    await spawnDeleteMe(fileUri);
}

async function initRLJ() {
    const fileUri = await createNewFile('delete-me-vim|relative-line-jump');
    await spawnNLines(fileUri, lineCount);
    await jumpToNewFile(fileUri);
    await updateScoreDisplay();
    await updateTimerDisplay();
    await startCountdown();

    return fileUri
}

async function checkAnswer(answer) {
    if (answer === 'Yes') {
        reset();
        const gameFileUri = await initRLJ();
        await startGame(gameFileUri);
        await deleteFile('delete-me-vim|welcome-relative-line-jump');
    } else if (answer === 'No') {
        vscode.window.showInformationMessage('Come back next time!');
        // vscode.commands.executeCommand('workbench.action.revertAndCloseActiveEditor');
        reset();
        await deleteFile('delete-me-vim|welcome-relative-line-jump');
    } else {
        answer = await vscode.window.showInformationMessage(
            `Make a choice, do not close the notification.`,
            { modal: true },
            `Yes`, `No`
        );

        if (answer) {
            await checkAnswer(answer);
        } else {
            vscode.window.showWarningMessage('You must select an option.');
        }
    }
}

async function waitForAnswer() {
    const welcomeFileUri = await createNewFile('delete-me-vim|welcome-relative-line-jump')
    await jumpToNewFile(welcomeFileUri);

    let answer = await spawnWelcomeMsg(welcomeFileUri);
    return answer;
}

module.exports = { generateRandomLineNumber,  startCountdown, reset, startGame, checkAnswer, spawnWelcomeMsg, waitForAnswer, spawnNLines };
