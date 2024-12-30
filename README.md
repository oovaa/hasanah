# hasanah README

This is the README for the "Hasanah" extension. Hasanah is a VS Code extension that displays random Hadith and Ayah from the Quran in your editor. It alternates between displaying a Hadith and an Ayah at a specified interval.

You can contribute to the repository [oovaa/hasanah](https://github.com/oovaa/hasanah) to help improve this extension.

#### This extension is inspired by the "Ayat" extension.

## Features

Hasanah includes the following features:

- Displays a random Hadith or Ayah at a specified interval.
- Alternates between displaying a Hadith and an Ayah.
- Includes the source of the Hadith or the Surah and Ayah number for the Quran verse.

<p align="center">
  <img src="./Screenshot_20241115_062746.png" alt="Hasanah extension screenshot">
</p>

## Requirements

There are no specific requirements or dependencies for this extension.

## Commands

This extension contributes the following commands:

- `hasanah.getAyah`: Fetches and displays a random Ayah from the Quran.
- `hasanah.getHijriDate`: Fetches and displays the current Hijri date.

You can run these commands from the command palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac) by typing the command name.

## Extension Settings

This extension contributes the following settings:

- `hasanah.delay`: Set the delay (in minutes) between each display of Hadith or Ayah. The delay can be any positive integer. The default value is 30 minutes.

- `hasanah.language`: Set the language for the displayed Ayah or Hadith. The language can be either 'en' for English or 'ar' for Arabic. The default value is 'ar'.

    **How to configure:**

    1. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac).
    2. Type `Preferences: Open Settings (UI)` and press `Enter`.
    3. In the search bar at the top, type `hasanah delay`.
    4. Set the desired delay value in the settings.

    Alternatively, you can add the following line to your `settings.json` file:

    ```json
    "hasanah.delay": 30
    ```

    **How to configure:**

    1. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac).
    2. Type `Preferences: Open Settings (UI)` and press `Enter`.
    3. In the search bar at the top, type `hasanah language`.
    4. Select the desired language from the dropdown menu in the settings.

    Alternatively, you can add the following line to your `settings.json` file:

    ```json
    "hasanah.language": "ar"
    ```

## Known Issues

- When the Hadith text is too long, it may not display properly.

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for a detailed history of changes.

## For more information

- [Quraan API](https://api.alquran.cloud/v1/surah): This is the old API used to fetch the Ayahs displayed by the extension.
- [Old Quraan API](https://quranapi.pages.dev/api): This API is used to fetch the Ayahs displayed by the extension.
- [Hadith API](https://api.hadith.gading.dev): This API is used to fetch the Hadiths displayed by the extension.
> - [English Hadith API](https://www.hadithapi.com/docs/hadiths): This is the API used to fetch the English Hadiths displayed by the extension. <span style="color: yellow;">Experimental</span>
- [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown): Learn more about writing Markdown in Visual Studio Code.
- [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/): A reference guide for Markdown syntax.

**Enjoy!**

### 🙏 Thank You! 🙏

A huge thank you to everyone who uses and supports this extension. Your feedback and contributions make it better every day. May your coding journey be filled with inspiration and productivity.
and a special thank for you. 🩷

صدقة جارية عن جميع المسلمين، نسألكم الدعاء ونفع الله بنا وبكم. 💙
