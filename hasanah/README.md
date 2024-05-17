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
  <img src="./hasanah/Screenshot_20240402_162846.png" alt="messages">
</p>
<!-- https://ibb.co/5kVBfZ7 -->

## Requirements

There are no specific requirements or dependencies for this extension.

## Commands

This extension contributes the following commands:

* `hasanah.getAyah`: This command fetches and displays a random Ayah from the Quran.
* `getHasanah`: This command fetches and displays a random Hadith or Ayah from the Quran at a specified interval. The displayed text alternates between a Hadith and an Ayah.

You can run these commands from the command palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac) by typing the command name.

## Extension Settings

This extension contributes the following settings:

* `hasanah.enable`: Enable/disable this extension.
* `hasanah.delay`: Set the delay (in minutes) between each display of Hadith or Ayah. The delay can be any positive integer. The default value is 30 minutes.

## Known Issues

- When the Hadith text is too long, it may not display properly.


## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for a detailed history of changes.


## For more information

* [Hadith API](https://api.hadith.gading.dev): This API is used to fetch the Hadiths displayed by the extension.
* [Quraan API](https://api.alquran.cloud/v1/surah): This API is used to fetch the Ayahs displayed by the extension.
* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown): Learn more about writing Markdown in Visual Studio Code.
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/): A reference guide for Markdown syntax.
**Enjoy!**
