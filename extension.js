const vscode = require('vscode')
const { getText } = require('./main')
const { HijriCalendarService } = require('./services/hijri-service')
const { QuranService } = require('./services/quran-service')
const { TafsirService } = require('./services/tafsir-service')
const { PrayerTimeService } = require('./services/prayer-time-service')

const hijriCalendarService = new HijriCalendarService()
const quranService = new QuranService()
const tafsirService = new TafsirService()
const prayerTimeService = new PrayerTimeService()

let timerId

function getConfig() {
    return vscode.workspace.getConfiguration('hasanah')
}

function getLanguage() {
    return getConfig().get('language')
}

function getDefaultDuaa(language) {
    return language === 'ar'
        ? 'اللهم احفظ السودان...'
        : 'O Allah, protect Sudan and its people...'
}

function showAutoDismissNotification(message, duration) {
    vscode.window.withProgress(
        {
            location: vscode.ProgressLocation.Notification,
            cancellable: true,
            title: message,
        },
        (progress, token) => {
            return new Promise((resolve) => {
                let dismissed = false
                token.onCancellationRequested(() => {
                    dismissed = true
                    resolve()
                })
                setTimeout(() => {
                    if (!dismissed) resolve()
                }, duration)
            })
        }
    )
}

function activate(context) {
    let turn = 0

    function getDelay() {
        return getConfig().get('delay') * 60000
    }

    const showText = async () => {
        const language = getLanguage()
        let delay = getDelay()
        try {
            turn = 2
            const text = await getText(turn, language)
            const dismissTime = (2 * delay) / 3
            showAutoDismissNotification(text, dismissTime)
        } catch (err) {
            vscode.window.showErrorMessage(
                getDefaultDuaa(language) + ' (Error displaying text)'
            )
        }
        turn = (turn + 1) % 3
    }

    function startInterval() {
        if (timerId) clearInterval(timerId)
        timerId = setInterval(showText, getDelay())
    }

    startInterval()

    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration((e) => {
            if (
                e.affectsConfiguration('hasanah.delay') ||
                e.affectsConfiguration('hasanah.language')
            ) {
                startInterval()
            }
        })
    )

    let disposable = vscode.commands.registerCommand(
        'hasanah.getAyah',
        async () => {
            const surah = await vscode.window.showInputBox({
                prompt: 'Enter the number of the surah',
            })
            const ayah = await vscode.window.showInputBox({
                prompt: 'Enter the number of the ayah',
            })
            const language = getLanguage()
            if (!surah || !ayah) {
                vscode.window.showInformationMessage(
                    'Invalid input. Please enter a number.'
                )
                return
            }
            try {
                const data = await quranService.getSpecificAyah(surah, ayah, language)
                if (data) {
                    vscode.window.showInformationMessage(
                        `${data.text} 💙 ${data.surah_name} (${data.ayah_num})`
                    )
                } else {
                    vscode.window.showInformationMessage(
                        'No data returned from the Quran API.'
                    )
                }
            } catch (error) {
                console.error('Error fetching specific Ayah:', error)
                vscode.window.showErrorMessage(
                    getDefaultDuaa(language) +
                        ' (invalid surah/Ayah reference or Internet problem)'
                )
            }
        }
    )
    context.subscriptions.push(disposable)

    disposable = vscode.commands.registerCommand(
        'hasanah.getTafsir',
        async () => {
            const language = getLanguage()
            const tafsirKey = language === 'ar' ? 'ibn_kathir_ar' : 'ibn_kathir'
            const surah = await vscode.window.showInputBox({
                prompt: 'Enter surah number (1-114)',
            })
            const ayah = await vscode.window.showInputBox({
                prompt: 'Enter ayah number',
            })
            if (!surah || !ayah || isNaN(surah) || isNaN(ayah) || parseInt(surah) < 1 || parseInt(ayah) < 1) {
                vscode.window.showInformationMessage('Invalid input. Please enter valid numbers.')
                return
            }
            try {
                const data = await tafsirService.getTafsir(surah, ayah, tafsirKey)
                const doc = await vscode.workspace.openTextDocument({
                    content: `${data.verse_key} - ${data.tafsir_name}\n${'='.repeat(50)}\n\n${data.text.replace(/([.!?؟]) /g, '$1\n')}`,
                    language: language === 'ar' ? 'plaintext' : 'plaintext'
                })
                await vscode.window.showTextDocument(doc, { preview: true })
            } catch (error) {
                console.error('Error fetching tafsir:', error)
                const msg = error.message.includes('(') ? error.message.match(/\((.+)\)$/)[1] : 'Error fetching tafsir'
                vscode.window.showErrorMessage(msg)
            }
        }
    )
    context.subscriptions.push(disposable)

    disposable = vscode.commands.registerCommand(
        'hasanah.getPrayerTimes',
        async () => {
            const lat = await vscode.window.showInputBox({
                prompt: 'Enter your latitude (e.g. 40.71)',
            })
            const lng = await vscode.window.showInputBox({
                prompt: 'Enter your longitude (e.g. -74.01)',
            })
            if (!lat || !lng) {
                vscode.window.showInformationMessage('Invalid coordinates.')
                return
            }
            try {
                const times = await prayerTimeService.getPrayerTimes(lat, lng)
                const pt = times.prayer_times
                vscode.window.showInformationMessage(
                    `Prayer Times (${times.date}) - ${times.location.latitude},${times.location.longitude}\n` +
                    `Fajr: ${pt.fajr} | Sunrise: ${pt.sunrise} | Dhuhr: ${pt.dhuhr} | ` +
                    `Asr: ${pt.asr} | Maghrib: ${pt.maghrib} | Isha: ${pt.isha}`
                )
            } catch (error) {
                console.error('Error fetching prayer times:', error)
                vscode.window.showErrorMessage('Error fetching prayer times.')
            }
        }
    )
    context.subscriptions.push(disposable)

    disposable = vscode.commands.registerCommand(
        'hasanah.getHijriDate',
        async () => {
            try {
                const hijriDate = await hijriCalendarService.getTodayHijriDate()
                vscode.window.showInformationMessage(
                    `Today in Hijri is: ${hijriDate.date} ${hijriDate.month} ${hijriDate.year}`
                )
            } catch (e) {
                console.error('An error occurred:', e.message)
            }
        }
    )
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
    deactivate,
}
