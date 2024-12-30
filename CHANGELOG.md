# Change Log

All notable changes to the "hasanah" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

# Changelog

## [9.1.0] - 2024-12-1

- added experimentel English Hadith support with the API `https://www.hadithapi.com/docs/hadiths` thanks to [Abdul Baaki Hudu](https://github.com/baaki20)  ✅
- improved code structure ✅


## [9.0.2] - 2024-12-1

- Back to using the old API for Quran (`https://api.alquran.cloud/v1/surah`)
- Cleaning up `extension.js` and moving some logic to `main.js`
- Quran retrieval performance improved.
- Minor bug fixes.

## [9.0.1] - 2024-12-1

- No restart needed after changing language.
- Added comments documentation for `extension.js` for better developer experience.
- Overall improved error handling.

## [9.0.0] - 2024-11-15

- support english and arabic on quraan
- Updated readme
- next step is to support english hadith

## [8.3.0] - 2024-10-24

- Updated readme
- Improved compatibility with older versions of VS Code
- Improved error messages

> lost the 0

## [0.8.2] - 2024-10-03

- Added extension description
- Updated `engines.vscode` to support newer versions

## [0.8.1] - 2024-07-18

- fix names of hadith rawi
- add some docs
- remove unnneded stuff (pics and files)

## [0.8.0] - 2024-07-17

- update readmes
- Updated the extension to use a new API 'https://quranapi.pages.dev/api'.
- Improved performance and code readability.
- Unified the returned objects in files.

## [0.7.1] - 2024-04-20

- update readmes

## [0.7.0] - 2024-04-20

### Added

- Added `get_hijri_Date` command to retrieve the current Hijri date.
- Displays the current Hijri date alongside the Gregorian date.

## [0.6.0] - 2024-04-16

### Added

- hasanah.getAyah command is now hasanah.getAyah and shows a blue heart and the hadith with the yellow heart.

## [0.5.0] - 2024-04-16

### Added

- Added feature to ask for an ayah on the command palette with the command "get ayah".

## [0.4.0] - 2024-04-12

### Added

- Fixed some typos.
- Updated the repo name to "hasanah".

## [0.3.0] - 2024-04-10

### Added

- added a heart at the end of the hadith

## [0.2.0] - 2024-04-01

### Added

- Added support for displaying random Hadith.
- Added Arabic book names for Hadith.

## [0.1.0] - 2024-03-22

### Added

- Initial release of Hasanah.
- Displays random Quranic verses.
