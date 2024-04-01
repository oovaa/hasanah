// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "hasanah" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    'hasanah.helloWorld',
    async function () {
      // Get the user's input
      let name = await vscode.window.showInputBox({
        prompt: 'Enter your name'
      });

      let time = await vscode.window.showInputBox({
        prompt: 'Enter time'
      });
      // Set an interval to display the message every 10 seconds
      setInterval(function () {
        vscode.window.showInformationMessage(
          `Hello World from hasanah! I'm ${name}`
        );
      }, time * 1000); // 10000 milliseconds = 10 seconds
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate
};
