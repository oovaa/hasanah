# hasanah README

This is the README for the "Hasanah" extension. Hasanah is a VS Code extension that displays random Hadith and Ayah from the Quran in your editor. It alternates between displaying a Hadith and an Ayah at a specified interval.


You can contribute to my repository [oovaa/hasanah](https://github.com/oovaa/hasanah) to help improve this extension.


#### This extension is inspired by the "Ayat" extension.

## Features

Hasanah has the following features:

- Displays a random Hadith or Ayah at a specified interval.
- The displayed text alternates between a Hadith and an Ayah.
- The displayed text includes the source of the Hadith or the Surah and Ayah number for the Quran verse.



<p align="center">
  <img src="./Screenshot_20240402_162846.png" alt="messages">
</p>


## Requirements

There are no specific requirements or dependencies for this extension.
## Extension Settings

This extension contributes the following settings:

* `hasanah.enable`: Enable/disable this extension.
* `hasanah.delay`: Set the delay (in minutes) between each display of Hadith or Ayah. The delay can be any positive integer. The default value is 30 minutes.

## Known Issues

- When the Hadith text is too long, it may not display properly.


## Release Notes

### 0.1

beta release of Hasanah.

### 0.2

Fixed issues:
- When offline, the extension now displays a specific message: "اللهم احفظ السودان وأهله ❤️ سبحان الله وبحمده".

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for a detailed history of changes.


## For more information

* [Hadith API](https://api.hadith.gading.dev): This API is used to fetch the Hadiths displayed by the extension.
* [Quraan API](https://api.alquran.cloud/v1/surah): This API is used to fetch the Ayahs displayed by the extension.
* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown): Learn more about writing Markdown in Visual Studio Code.
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/): A reference guide for Markdown syntax.
**Enjoy!**
