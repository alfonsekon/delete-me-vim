const { deleteFiles } = require('./utils/utils');
const { relativeLineJump } = require('./modes/relativeLineJump');

/**
 * todo:
 * refactor RLJ
 * move this file to src/ (update package.json)
 */
async function activate(context) {
    console.log("delete-me-vim is active!");

    await relativeLineJump(context);

}

async function deactivate() {
    console.log(`delete-me-vim is deactivating, removing all temporary files`);
    await deleteFiles();
}

module.exports = { activate, deactivate };
