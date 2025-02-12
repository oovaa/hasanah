
# Hasanah - Quran & Hadith in Your Editor 🕋

Hasanah is a VS Code extension that brings the beauty of the Quran and Hadith directly into your coding environment. It displays random Ayahs (Quranic verses) and Hadiths at customizable intervals, helping you stay spiritually connected while you code.

[![Version](https://img.shields.io/badge/version-9.3.0-blue)](https://marketplace.visualstudio.com/items?itemName=omarabdo.hasanah)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE.md)
[![Open Issues](https://img.shields.io/github/issues/oovaa/hasanah)](https://github.com/oovaa/hasanah/issues)


![logo](./hasanah.png)

---

## ✨ Features

- **Daily Inspiration**: Displays random Ayahs and Hadiths at customizable intervals.
- **Dual Language Support**: Choose between Arabic (`ar`) and English (`en`) for Ayahs and Hadiths.
- **Hijri Date**: Get the current Islamic date with a single command.
- **Customizable Delay**: Set the interval (in minutes) between notifications.
- **Quick Access**: Fetch specific Ayahs or Hadiths via the command palette.

---

## 🚀 Installation

1. Open **VS Code**.
2. Go to the Extensions view (`Ctrl+Shift+X` or `Cmd+Shift+X` on Mac).
3. Search for **"Hasanah"**.
4. Click **Install**.

---

## ⚙️ Configuration

### Settings
You can configure Hasanah via VS Code settings:

1. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac).
2. Search for `Preferences: Open Settings (UI)`.
3. Search for `Hasanah` to customize:
   - **Delay**: Set the interval between notifications (default: 30 minutes).
   - **Language**: Choose between Arabic (`ar`) and English (`en`).

Alternatively, edit your `settings.json` file:
```json
{
  "hasanah.delay": 30,
  "hasanah.language": "ar"
}
```

### Commands
- `hasanah.getAyah`: Fetch and display a specific Ayah.
- `hasanah.getHijriDate`: Display the current Hijri date.

---

## 📸 Screenshots

![Hasanah in Action](./Screenshot_20241115_062746.png)

---

## 🛠️ Development

### Contributing
We welcome contributions! Here's how to get started:
1. Fork the repository: [oovaa/hasanah](https://github.com/oovaa/hasanah).
2. Clone your fork and install dependencies:
   ```bash
   npm install
   ```
3. Make your changes and test them using VS Code's extension debugger.
4. Submit a pull request with a detailed description of your changes.

### Requirements
- Node.js (v16+)
- VS Code (v1.93+)

---

## ❓ FAQ

### Why is my Hadith/Ayah not displaying properly?
If the text is too long, it may get truncated. We're working on a solution using webview panels for better display.

### Can I use Hasanah offline?
While Hasanah requires an internet connection to fetch new content, we're exploring offline caching for future releases.


### How can I hide a popup?

To hide a popup in Hasanah, simply press the `Esc` key on your keyboard. This will hide the popup and allow you to continue working without interruptions.


---

## 🙏 Acknowledgments

- Inspired by the **"Ayat"** extension.
- Special thanks to [Abdul Baaki Hudu](https://github.com/baaki20) for English Hadith support.
- APIs used:
  - [AlQuran Cloud](https://api.alquran.cloud/v1/surah)
  - [Hadith API](https://api.hadith.gading.dev)
  - [English Hadith API](https://www.hadithapi.com/docs/hadiths) (Experimental)

---

## 📜 License

Hasanah is open-source software licensed under the [MIT License](./LICENSE.md).

---

**May this project be a source of barakah in your coding journey. 💙**  
*"And whoever does an atom's weight of good will see it."* (Quran 99:7)

**Enjoy!**

### 🙏 Thank You! 🙏

A huge thank you to everyone who uses and supports this extension. Your feedback and contributions make it better every day. May your coding journey be filled with inspiration and productivity.
and a special thank for you. 🩷

صدقة جارية عن جميع المسلمين، نسألكم الدعاء ونفع الله بنا وبكم. 💙