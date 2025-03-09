const { deleteFiles } = require('./utils/utils');
const { testExtension } = require('./modes/test');
const { relativeLineJump } = require('./modes/relativeLineJump');

async function activate(context) {
    console.log("delete-me-vim is active!");

    await testExtension(context);
    await relativeLineJump(context);

}

async function deactivate() {
    console.log(`delete-me-vim is deactivating, removing all temporary files`);
    await deleteFiles();
}

module.exports = { activate, deactivate };
