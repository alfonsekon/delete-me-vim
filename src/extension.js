const { deleteFiles } = require('../utils/utils');
const { startRelativeLineJump } = require('../modes/relativeLineJump');
const { startMaze } = require('../modes/maze');

async function activate(context) {
    console.log("delete-me-vim is active!");

    await startRelativeLineJump(context);
    await startMaze(context);

}

async function deactivate() {
    console.log(`delete-me-vim is deactivating, removing all temporary files`);
    await deleteFiles();
}

module.exports = { activate, deactivate };
