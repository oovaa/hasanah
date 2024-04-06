
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
      throw new Error('Failed to fetch text');
    }
    return text;
  } catch (error) {
    console.log(error);
    return `اللهم احفظ السودان واهله ❤️ سبحان الله وبحمده`;
  }
}

function activate() {
  const config = vscode.workspace.getConfiguration('hasanah');
  let delay = config.get('delay') * 60000; // convert from milliseconds

  if (timerId) {
    clearInterval(timerId);
  }

  let showHadith = false;

  timerId = setInterval(async () => {
    const text = await getText(showHadith);
    vscode.window.showInformationMessage(text);
    showHadith = !showHadith;
    delay = config.get('delay') * 60000;
  }, delay);
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
