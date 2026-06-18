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
            const tafsirKey = await vscode.window.showQuickPick(
                ['ibn_kathir', 'maarif', 'muyassar'],
                { placeHolder: 'Select tafsir source' }
            )
            if (!tafsirKey) return
            const surahs = [
                '1 - Al-Fatiha', '2 - Al-Baqarah', '3 - Aal-e-Imran', '4 - An-Nisa',
                '5 - Al-Maidah', '6 - Al-Anam', '7 - Al-Araf', '8 - Al-Anfal',
                '9 - At-Tawbah', '10 - Yunus', '11 - Hud', '12 - Yusuf',
                '13 - Ar-Rad', '14 - Ibrahim', '15 - Al-Hijr', '16 - An-Nahl',
                '17 - Al-Isra', '18 - Al-Kahf', '19 - Maryam', '20 - Ta-Ha',
                '21 - Al-Anbiya', '22 - Al-Hajj', '23 - Al-Muminun', '24 - An-Nur',
                '25 - Al-Furqan', '26 - Ash-Shuara', '27 - An-Naml', '28 - Al-Qasas',
                '29 - Al-Ankabut', '30 - Ar-Rum', '31 - Luqman', '32 - As-Sajdah',
                '33 - Al-Ahzab', '34 - Saba', '35 - Fatir', '36 - Ya-Sin',
                '37 - As-Saffat', '38 - Sad', '39 - Az-Zumar', '40 - Ghafir',
                '41 - Fussilat', '42 - Ash-Shura', '43 - Az-Zukhruf', '44 - Ad-Dukhan',
                '45 - Al-Jathiya', '46 - Al-Ahqaf', '47 - Muhammad', '48 - Al-Fath',
                '49 - Al-Hujurat', '50 - Qaf', '51 - Adh-Dhariyat', '52 - At-Tur',
                '53 - An-Najm', '54 - Al-Qamar', '55 - Ar-Rahman', '56 - Al-Waqiah',
                '57 - Al-Hadid', '58 - Al-Mujadila', '59 - Al-Hashr', '60 - Al-Mumtahina',
                '61 - As-Saff', '62 - Al-Jumua', '63 - Al-Munafiqun', '64 - At-Taghabun',
                '65 - At-Talaq', '66 - At-Tahrim', '67 - Al-Mulk', '68 - Al-Qalam',
                '69 - Al-Haqqah', '70 - Al-Maarij', '71 - Nuh', '72 - Al-Jinn',
                '73 - Al-Muzzammil', '74 - Al-Muddaththir', '75 - Al-Qiyamah', '76 - Al-Insan',
                '77 - Al-Mursalat', '78 - An-Naba', '79 - An-Naziat', '80 - Abasa',
                '81 - At-Takwir', '82 - Al-Infitar', '83 - Al-Mutaffifin', '84 - Al-Inshiqaq',
                '85 - Al-Buruj', '86 - At-Tariq', '87 - Al-Ala', '88 - Al-Ghashiyah',
                '89 - Al-Fajr', '90 - Al-Balad', '91 - Ash-Shams', '92 - Al-Layl',
                '93 - Ad-Duha', '94 - Ash-Sharh', '95 - At-Tin', '96 - Al-Alaq',
                '97 - Al-Qadr', '98 - Al-Bayyinah', '99 - Az-Zalzalah', '100 - Al-Adiyat',
                '101 - Al-Qariah', '102 - At-Takathur', '103 - Al-Asr', '104 - Al-Humazah',
                '105 - Al-Fil', '106 - Quraysh', '107 - Al-Maun', '108 - Al-Kawthar',
                '109 - Al-Kafirun', '110 - An-Nasr', '111 - Al-Masad', '112 - Al-Ikhlas',
                '113 - Al-Falaq', '114 - An-Nas'
            ]
            const surahPick = await vscode.window.showQuickPick(surahs, {
                placeHolder: 'Select surah by number'
            })
            if (!surahPick) return
            const surah = surahPick.split(' - ')[0]
            const ayah = await vscode.window.showInputBox({
                prompt: 'Enter the number of the ayah',
                validateInput: (value) => {
                    const n = parseInt(value, 10)
                    if (isNaN(n) || n < 1) return 'Ayah must be a positive integer'
                    return null
                }
            })
            if (!ayah) {
                vscode.window.showInformationMessage('Invalid input.')
                return
            }
            try {
                const data = await tafsirService.getTafsir(surah, ayah, tafsirKey)
                vscode.window.showInformationMessage(
                    `${data.verse_key} - ${data.tafsir_name}\n\n${data.text.slice(0, 500)}...`
                )
            } catch (error) {
                console.error('Error fetching tafsir:', error)
                vscode.window.showErrorMessage('Error fetching tafsir.')
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
