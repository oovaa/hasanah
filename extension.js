const vscode = require('vscode')
const { getText } = require('./main')
const { getSpecificAyah } = require('./quraan')
const { get_hijri_Date } = require('./islamicDate.js')

let timerId
let config = vscode.workspace.getConfiguration('hasanah')
let language = config.get('language') // Get the language setting

const DEFAULT_DUAA =
    language === 'ar'
        ? 'اللهم احفظ السودان...'
        : 'O Allah, protect Sudan and its people...'

/**
 * Displays an automatically dismissing notification with the given message for the specified duration.
 *
 * @param {string} message - The text content of the notification.
 * @param {number} duration - Time in milliseconds before the notification is automatically dismissed.
 * @returns {void}
 */
function showAutoDismissNotification(message, duration) {
    vscode.window.withProgress(
        {
            location: vscode.ProgressLocation.Notification,
            cancellable: true,
            title: message,
        },
        (progress, token) => {
            return new Promise((resolve) => {
                token.onCancellationRequested(() => resolve())
                setTimeout(resolve, duration)
            })
        }
    )
}

/**
 * Activates the extension.
 * @param {vscode.ExtensionContext} context - The context in which the extension is activated.
 */
function activate(context) {
    // Get the configuration settings
    let delay = config.get('delay') * 60000 // Convert delay from minutes to milliseconds
    let turns = false

    // Function to fetch and display text (Hadith or Ayah) at regular intervals
    const showText = async () => {
        const text = await getText(turns, language)
        const dismissTime = (2 * delay) / 3 // Two-thirds of the delay

        showAutoDismissNotification(text, dismissTime)
        turns = !turns
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
    let disposable = vscode.commands.registerCommand(
        'hasanah.getAyah',
        async () => {
            const surah = await vscode.window.showInputBox({
                prompt: 'Enter the number of the surah',
            })
            const ayah = await vscode.window.showInputBox({
                prompt: 'Enter the number of the ayah',
            })
            if (!surah || !ayah) {
                vscode.window.showInformationMessage(
                    'Invalid input. Please enter a number.'
                )
                return
            }

            try {
                const data = await getSpecificAyah(surah, ayah, language)
                if (data) {
                    vscode.window.showInformationMessage(
                        `${data.text} 💙 ${data.surah_name} (${data.ayah_num})`
                    )
                } else {
                    vscode.window.showInformationMessage(
                        'No data returned from the Quraan API.'
                    )
                }
            } catch (error) {
                console.error('Error fetching specific Ayah:', error)
                vscode.window.showErrorMessage(
                    `${DEFAULT_DUAA} (invalid surah/Ayah reference or Internet problem)`
                )
            }
        }
    )

    context.subscriptions.push(disposable)

    // Register the command to fetch the current Hijri date
    disposable = vscode.commands.registerCommand(
        'hasanah.getHijriDate',
        async () => {
            try {
                const hejri_date = await get_hijri_Date()
                vscode.window.showInformationMessage(
                    `Today in Hijri is: ${hejri_date}`
                )
            } catch (e) {
                console.error('An error occurred:', e.message)
            }
        }
    )
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
    deactivate,
}
