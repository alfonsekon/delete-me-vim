const { deleteFiles } = require('./utils/utils');
const { testExtension, testMsg } = require('./modes/test');

async function activate(context) {
    console.log("delete-me-vim is active!");
    console.log(testMsg);
    await testExtension(context);

}

async function deactivate() {
    console.log(`delete-me-vim is deactivating, removing all temporary files`);
    await deleteFiles();
}

module.exports = { activate, deactivate };
