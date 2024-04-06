
const vscode = require('vscode');
const { printRandomHadith } = require('./hadith');
const { getAyahText } = require('./quraan');

let timerId;


async function getText(showHadith) {
  try {
    let text;
    if (showHadith) {
      const hadith = await printRandomHadith();
      if (hadith && hadith.arab && hadith.book) {
        text = `${hadith.arab} ❤️ book (${hadith.book})`;
      }
    } else {
      const ayah = await getAyahText();
      if (ayah && ayah.text && ayah.surah && ayah.surah.name && ayah.numberInSurah) {
        text = `${ayah.text} ❤️ ${ayah.surah.name} (${ayah.numberInSurah})`;
      }
    }
    if (!text) {
      throw new Error('Failed to fetch text ', showHadith);
    }
    return text;
  } catch (error) {
    console.log(error);
    return `اللهم احفظ السودان واهله ❤️ سبحان الله وبحمده`;
  }
}

function activate(context) {
  let config = vscode.workspace.getConfiguration('hasanah');
  let delay = config.get('delay') * 60000; // convert from milliseconds

  let showHadith = false;

  const showText = async () => {
    const text = await getText(showHadith);
    vscode.window.showInformationMessage(text);
    showHadith = !showHadith;
  };

  let timerId = setInterval(showText, delay);

  // Listen for configuration changes
  context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(e => {
    if (e.affectsConfiguration('hasanah.delay')) {
      clearInterval(timerId); // Clear the old interval

      config = vscode.workspace.getConfiguration('hasanah');
      delay = config.get('delay') * 60000; // Get the new delay

      timerId = setInterval(showText, delay); // Create a new interval with the new delay
    }
  }));
}

function deactivate() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
}

module.exports = {
  activate,
  deactivate
};