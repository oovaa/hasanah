const vscode = require('vscode')
const { printRandomHadith } = require('./hadith')
const { getSpecificAyah, getAyah } = require('./quraan')
const { get_hijri_Date } = require('./islamicDate.js')

let timerId

const DEFAULT_DUAA = 'اللهم احفظ السودان واهله ❤️ سبحان الله وبحمده '

/**
 * @param { boolean } showHadith
 */
/**
 * @typedef {Object} Hadith
 * @property {string} arab
 * @property {string} book
 * @property {number} number
 */

/**
 * @typedef {Object} Ayah
 * @property {string} text
 * @property {string} surah_name
 * @property {number} ayah_num
 */

/**
 * @param {boolean} showHadith
 * @param {string} language
 * @returns {Promise<string>}
 */
async function getText(showHadith, language) {
  try {
    let text
    switch (showHadith) {
      case true:
        /** @type {Hadith} */
        const hadith = await printRandomHadith()
        if (hadith && hadith.arab && hadith.book) {
          text = `${hadith.arab} 💚 book (${hadith.book}) (${hadith.number})`
        } else {
          text = `${DEFAULT_DUAA} 💚 hadith failed`
        }
        break
      case false:
        /** @type {Ayah} */
        const ayah = await getAyah(language)
        if (ayah && ayah.text && ayah.surah_name && ayah.ayah_num) {
          text = `${ayah.text} ❤️ ${ayah.surah_name} (${ayah.ayah_num})`
        }
        break
    }
    if (!text) {
      showHadith = !showHadith
      return getText(showHadith, language)
    }
    return text
  } catch (error) {
    console.log(error)
    return DEFAULT_DUAA
  }
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  let config = vscode.workspace.getConfiguration('hasanah')
  let delay = config.get('delay') * 60000 // convert from milliseconds
  let language = config.get('language') // get the language setting

  let showHadith = false

  const showText = async () => {
    const text = await getText(showHadith, language)
    vscode.window.showInformationMessage(text)
    showHadith = !showHadith
  }

  let timerId = setInterval(showText, delay)

  // Listen for configuration changes
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration('hasanah.delay')) {
        clearInterval(timerId) // Clear the old interval

        config = vscode.workspace.getConfiguration('hasanah')
        delay = config.get('delay') * 60000 // Get the new delay

        timerId = setInterval(showText, delay) // Create a new interval with the new delay
      }

      if (e.affectsConfiguration('hasanah.language')) {
        config = vscode.workspace.getConfiguration('hasanah')
        language = config.get('language') // Get the new language
      }
    })
  )

  let disposable = vscode.commands.registerCommand('hasanah.getAyah', async function () {
    const surah = await vscode.window.showInputBox({
      prompt: 'Enter the number of the surah'
    })
    const ayah = await vscode.window.showInputBox({
      prompt: 'Enter the number of the ayah'
    })
    if (!surah || !ayah) {
      vscode.window.showInformationMessage('Invalid input. Please enter a number.')
      return
    }

    try {
      const data = await getSpecificAyah(surah, ayah, language)
      if (data) {
        vscode.window.showInformationMessage(`${data.text} 💙 ${data.surah_name} (${data.ayahNumber})`)
      } else {
        vscode.window.showInformationMessage('No data returned from the Quraan API.')
      }
    } catch (error) {
      console.log(error.message)
      vscode.window.showErrorMessage(` ${DEFAULT_DUAA} (invalid surah/Ayah reference or Internet problem)`)
    }
  })
  vscode.commands.registerCommand('hasanah.getHijriDate', async () => {
    try {
      const hejri_date = await get_hijri_Date()
      vscode.window.showInformationMessage(`Today in Hijri is: ${hejri_date}`)
    } catch (e) {
      console.log('An error occurred:', e.message)
    }
  })
  context.subscriptions.push(disposable)
}

function deactivate() {
  if (timerId) {
    clearInterval(timerId)
    timerId = null
  }
}

module.exports = {
  activate,
  deactivate
}
