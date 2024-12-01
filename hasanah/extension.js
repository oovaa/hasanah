const vscode = require('vscode')
const { printRandomHadith } = require('./hadith')
const { getSpecificAyah, getAyah } = require('./quraan')
const { get_hijri_Date } = require('./islamicDate.js')

let timerId

const DEFAULT_DUAA = 'اللهم احفظ السودان واهله ❤️ سبحان الله وبحمده'

/**
 * @typedef {Object} Hadith
 * @property {string} arab - The Arabic text of the Hadith.
 * @property {string} book - The book where the Hadith is found.
 * @property {number} number - The number of the Hadith in the book.
 */

/**
 * @typedef {Object} Ayah
 * @property {string} text - The text of the Ayah.
 * @property {string} surah_name - The name of the Surah.
 * @property {number} ayah_num - The number of the Ayah.
 */

/**
 * Fetches either a random Hadith or Ayah based on the showHadith flag and language.
 * @param {boolean} showHadith - Whether to show a Hadith (true) or an Ayah (false).
 * @param {string} language - The language for the Ayah (en for English, ar for Arabic).
 * @returns {Promise<string>} The text to display.
 */
async function getText(showHadith, language) {
  try {
    let text
    if (showHadith) {
      // Fetch a random Hadith
      const hadith = await printRandomHadith()
      if (hadith && hadith.arab && hadith.book) {
        text = `${hadith.arab} 💚 book (${hadith.book}) (${hadith.number})`
      } else {
        text = `${DEFAULT_DUAA} 💚 hadith failed`
      }
    } else {
      // Fetch a random Ayah
      const ayah = await getAyah(language)
      if (ayah && ayah.text && ayah.surah_name && ayah.ayah_num) {
        text = `${ayah.text} ❤️ ${ayah.surah_name} (${ayah.ayah_num})`
      }
    }
    if (!text) {
      // If no text was fetched, toggle showHadith and try again
      showHadith = !showHadith
      return getText(showHadith, language)
    }
    return text
  } catch (error) {
    console.error('Error fetching text:', error)
    return DEFAULT_DUAA
  }
}

/**
 * Activates the extension.
 * @param {vscode.ExtensionContext} context - The context in which the extension is activated.
 */
function activate(context) {
  // Get the configuration settings
  let config = vscode.workspace.getConfiguration('hasanah')
  let delay = config.get('delay') * 60000 // Convert delay from minutes to milliseconds
  let language = config.get('language') // Get the language setting

  let showHadith = false

  // Function to fetch and display text (Hadith or Ayah) at regular intervals
  const showText = async () => {
    const text = await getText(showHadith, language)
    vscode.window.showInformationMessage(text)
    showHadith = !showHadith
  }

  // Set an interval to call the showText function based on the delay setting
  timerId = setInterval(showText, delay)

  // Listen for configuration changes
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration('hasanah.delay')) {
        // If the delay setting changes, update the interval
        clearInterval(timerId) // Clear the old interval
        config = vscode.workspace.getConfiguration('hasanah')
        delay = config.get('delay') * 60000 // Get the new delay
        timerId = setInterval(showText, delay) // Create a new interval with the new delay
      }
      if (e.affectsConfiguration('hasanah.language')) {
        // If the language setting changes, update the language
        config = vscode.workspace.getConfiguration('hasanah')
        language = config.get('language') // Update the language setting
      }
    })
  )

  // Register the command to fetch a specific Ayah
  let disposable = vscode.commands.registerCommand('hasanah.getAyah', async () => {
    const surah = await vscode.window.showInputBox({ prompt: 'Enter the number of the surah' })
    const ayah = await vscode.window.showInputBox({ prompt: 'Enter the number of the ayah' })
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
      console.error('Error fetching specific Ayah:', error.message)
      vscode.window.showErrorMessage(`${DEFAULT_DUAA} (invalid surah/Ayah reference or Internet problem)`)
    }
  })

  context.subscriptions.push(disposable)

  // Register the command to fetch the current Hijri date
  disposable = vscode.commands.registerCommand('hasanah.getHijriDate', async () => {
    try {
      const hejri_date = await get_hijri_Date()
      vscode.window.showInformationMessage(`Today in Hijri is: ${hejri_date}`)
    } catch (e) {
      console.error('An error occurred:', e.message)
    }
  })
  context.subscriptions.push(disposable)
}

/**
 * Deactivates the extension.
 */
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
