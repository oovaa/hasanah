const vscode = require('vscode');
const { printRandomHadith } = require('./hadith');
const { getAyahText } = require('./quraan');

let timerId;

function activate(context) {
  const config = vscode.workspace.getConfiguration('hasanah');
  const delay = config.get('delay') * 6000; // convert to milliseconds

  if (timerId) {
    clearInterval(timerId);
  }

  let showHadith = true;

  timerId = setInterval(async () => {
    let text;
    try {
      if (showHadith) {
        text = await printRandomHadith();
        text = `${text.arab}`;
      } else {
        text = await getAyahText();
        if (text) {
          let name = text['surah']['name']
          let number = text['surah']['number']
          text = `${text.text} ❤️ ${name} (${number})`;
        }
      }
    } catch (error) {
      text = `اللهم احفظ السودان واهله ✨ سبحان الله وبحمده`;
    }
    vscode.window.showInformationMessage(text);
    showHadith = !showHadith;
  }, delay);

  context.subscriptions.push({
    dispose: () => {
      if (timerId) {
        clearInterval(timerId);
      }
    }
  });
}

function deactivate() {
  if (timerId) {
    clearInterval(timerId);
  }
}

module.exports = {
  activate,
  deactivate
};
