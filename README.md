# Hasanah - Quran & Hadith in Your Editor 🕋

Hasanah is a VS Code extension that brings the beauty of the Quran and Hadith directly into your coding environment. It displays random Ayahs (Quranic verses) and Hadiths at customizable intervals, helping you stay spiritually connected while you code.

[![Version](https://img.shields.io/badge/version-9.3.0-blue)](https://marketplace.visualstudio.com/items?itemName=omarabdo.hasanah)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE.md)
[![Open Issues](https://img.shields.io/github/issues/oovaa/hasanah)](https://github.com/oovaa/hasanah/issues)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/omarabdo.hasanah?label=Installs)](https://marketplace.visualstudio.com/items?itemName=omarabdo.hasanah)
[![Rating](https://img.shields.io/visual-studio-marketplace/r/omarabdo.hasanah?label=Rating)](https://marketplace.visualstudio.com/items?itemName=omarabdo.hasanah)

![logo](./hasanah.png)

---

## ✨ Features

-   **Random Quranic Verses (Ayahs)**: Displays random Ayahs in your chosen language.
-   **Random Hadiths**: Shows random Hadiths, with support for both Arabic and English.
-   **Customizable Intervals**: Set how often you want to see a new Ayah or Hadith.
-   **Dual Language Support**:
    -   Ayahs: Arabic (`ar`) and English (`en`).
    -   Hadiths: Arabic (`ar`) and English (`en`) (experimental).
-   **Hijri Date**: Quickly get the current Islamic (Hijri) date.
-   **Specific Ayah Lookup**: Fetch a particular Ayah by Surah and Ayah number.
-   **Auto-Dismiss Notifications**: Popups will automatically disappear after a configurable portion of the display interval.
-   **Offline Duaa**: Displays a default Duaa if an internet connection is unavailable.
-   **Caching**: Hijri date requests are cached to improve performance.

---

## 🚀 Installation

1.  Open **Visual Studio Code**.
2.  Go to the **Extensions** view (`Ctrl+Shift+X` or `Cmd+Shift+X` on Mac).
3.  Search for **"Hasanah"**.
4.  Click **Install**.
5.  Reload VS Code if prompted.

---

## ⚙️ Configuration

You can configure Hasanah through your VS Code settings.

### Via Settings UI

1.  Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac).
2.  Type `Preferences: Open Settings (UI)` and press Enter.
3.  In the search bar, type `Hasanah`.
4.  Adjust the following settings:
    -   **`hasanah.delay`**: The interval (in minutes) between notifications. Default is `20`.
    -   **`hasanah.language`**: The preferred language for Ayahs and Hadiths. Choose between `ar` (Arabic) and `en` (English). Default is `ar`.

### Via `settings.json`

Alternatively, you can directly edit your `settings.json` file:

```json
{
  "hasanah.delay": 30, // Example: 30 minutes
  "hasanah.language": "en" // Example: English
}
```

---

## ⌨️ Commands

Hasanah provides the following commands, accessible via the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`):

-   **`hasanah: get Ayah`**: Prompts you to enter a Surah number and Ayah number, then displays the specified Quranic verse.
-   **`hasanah: get Hijri Date`**: Displays the current date in the Hijri calendar.

---

## 📸 Screenshots

![Hasanah in Action](./Screenshot_20241115_062746.png)

---

## 🛠️ Development & Contributing

We welcome contributions to make Hasanah even better!

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18+ recommended, check [`package.json`](package.json ) for specific engine requirements)
-   [Visual Studio Code](https://code.visualstudio.com/) (v1.93+ recommended, check [`package.json`](package.json ) for specific engine requirements)
-   [npm](https://www.npmjs.com/) (usually comes with Node.js) or [Yarn](https://yarnpkg.com/)

### Getting Started

1.  **Fork the repository**: Click the "Fork" button at the top right of the [oovaa/hasanah](https://github.com/oovaa/hasanah) GitHub page.
2.  **Clone your fork**:
    ```bash
    git clone https://github.com/YOUR_USERNAME/hasanah.git
    cd hasanah
    ```
3.  **Install dependencies**:
    ```bash
    npm install
    # or
    # yarn install
    ```
4.  **Open in VS Code**:
    ```bash
    code .
    ```
5.  **Run the extension in a development host**:
    -   Press `F5` to open a new VS Code window with the extension loaded (Extension Development Host).
    -   Make changes to the code. The Extension Development Host will usually reload automatically, or you can manually reload it (`Ctrl+R` or `Cmd+R`).
6.  **Test your changes**:
    -   Use the commands provided by the extension.
    -   Check the debug console for any output or errors.
7.  **Lint your code**:
    ```bash
    npm run lint
    ```
8.  **Submit a Pull Request**:
    -   Create a new branch for your feature or bug fix.
    -   Commit your changes with clear and descriptive messages.
    -   Push your branch to your fork.
    -   Open a pull request from your fork to the [`main`](connect.js ) branch of `oovaa/hasanah`.
    -   Provide a detailed description of your changes in the pull request.

---

## ❓ Troubleshooting & FAQ

### Q: Notifications are not appearing.
**A:**
1.  Check your VS Code settings for `hasanah.delay` and `hasanah.language`. Ensure they are correctly configured.
2.  Make sure you have an active internet connection, as Hasanah fetches content online.
3.  Open the VS Code Developer Tools (Help > Toggle Developer Tools) and check the Console tab for any error messages related to Hasanah.
4.  Try restarting VS Code.

### Q: The Hadith/Ayah text is truncated or looks strange.
**A:** Very long texts might sometimes be truncated by the standard VS Code notification system. We are always looking for ways to improve the display.

### Q: Can I use Hasanah offline?
**A:** Hasanah primarily fetches new content (Ayahs and Hadiths) online. If you are offline, it will attempt to display a default Duaa. Full offline caching for a wider range of content is a potential future enhancement.

### Q: How can I hide a notification popup?
**A:** You can usually dismiss VS Code notifications by pressing the `Esc` key or clicking the "Close" (X) button on the notification. The notifications are also designed to auto-dismiss.

---

## 🙏 Acknowledgments

-   Inspired by the **"Ayat"** extension.
-   Special thanks to **[Abdul Baaki Hudu](https://github.com/baaki20)** for the initial English Hadith support.
-   APIs used:
    -   Quran: [AlQuran.cloud API](https://alquran.cloud/api)
    -   Arabic Hadith: [Hadith API (gading.dev)](https://api.hadith.gading.dev/)
    -   English Hadith: [Hadith API (hadithapi.com)](https://www.hadithapi.com/docs/hadiths) (Experimental)
    -   Hijri Date: [Al Adhan API](https://aladhan.com/prayer-times-api)

---

## 📜 License

Hasanah is open-source software licensed under the MIT License.

---

**May this project be a source of barakah (blessings) in your coding journey. 💙**

> *"So whoever does an atom's weight of good will see it, And whoever does an atom's weight of evil will see it."* (Quran 99:7-8)

**Enjoy!**

### 🙏 Thank You! 🙏

A heartfelt thank you to everyone who uses, supports, and contributes to this extension. Your feedback and involvement are invaluable in making Hasanah better. May your coding journey be filled with inspiration, productivity, and spiritual connection.

And a special thank you to **you** for being part of this community. 🩷

---
صدقة جارية عن جميع المسلمين، نسألكم الدعاء ونفع الله بنا وبكم. 💙