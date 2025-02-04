# Changelog

All notable changes to the **Hasanah** extension will be documented in this file.  
This project adheres to [Semantic Versioning](https://semver.org/).

---


## [9.2.1] - 2025-02-04

### Fixed
- offline default duaa


---


## [9.2.0] - 2025-02-04

### Improved
- The notification will now auto-dismiss after two-thirds of the delay time.
- Added caching to the "Get Hijri Date" command.
- General developer experience improvements.

---

## [9.1.1] - 2025-01-19

### Fixed
- Resolved issue where Hadiths showed `undefined` when offline.

---

## [9.1.0] - 2024-12-01

### Added
- Experimental English Hadith support using [Hadith API](https://www.hadithapi.com/docs/hadiths).  
  *Special thanks to [Abdul Baaki Hudu](https://github.com/baaki20) for this contribution!*

### Improved
- Refactored codebase for better maintainability.
- Enhanced error handling for API requests.

---

## [9.0.2] - 2024-12-01

### Changed
- Reverted to the original Quran API (`https://api.alquran.cloud/v1/surah`) for better reliability.

### Fixed
- Improved Quran retrieval performance.
- Minor bug fixes and code cleanup.

---

## [9.0.1] - 2024-12-01

### Added
- No restart required after changing the language setting.
- Comprehensive code documentation for `extension.js`.

### Improved
- Overall error handling and user feedback.

---

## [9.0.0] - 2024-11-15

### Added
- Full support for English and Arabic Quranic verses.
- Updated README with clearer instructions.

### Next Steps
- Expand English Hadith support.

---

## [0.8.2] - 2024-10-03

### Added
- Extension description for better discoverability.
- Support for newer VS Code versions.

---

## [0.8.1] - 2024-07-18

### Fixed
- Corrected Hadith narrator names.
- Removed unnecessary files and images.

---

## [0.8.0] - 2024-07-17

### Added
- New Quran API integration (`https://quranapi.pages.dev/api`).

### Improved
- Code readability and performance.
- Unified response objects across modules.

---

## [0.7.0] - 2024-04-20

### Added
- `get_hijri_Date` command to display the current Hijri date.

---

## [0.6.0] - 2024-04-16

### Changed
- Updated command names and added visual indicators (💙 for Ayahs, 💛 for Hadiths).

---

## [0.5.0] - 2024-04-16

### Added
- Command to fetch specific Ayahs via the command palette.

---

## [0.4.0] - 2024-04-12

### Fixed
- Typos and repository name consistency.

---

## [0.3.0] - 2024-04-10

### Added
- Heart emoji (❤️) at the end of Hadiths for a personal touch.

---

## [0.2.0] - 2024-04-01

### Added
- Support for displaying random Hadiths.
- Arabic book names for Hadith sources.

---

## [0.1.0] - 2024-03-22

### Added
- Initial release of Hasanah.
- Basic functionality to display random Quranic verses.

---

*May this project continue to grow and benefit the ummah. Ameen.*