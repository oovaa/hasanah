# Changelog

All notable changes to the **Hasanah** extension will be documented in this file.  
This project adheres to [Semantic Versioning](https://semver.org/).

## [10.0.2] - 2026-06-18

### Added
- **3-step tafsir flow** — choose tafsir source (Ibn Kathir Arabic/English, Ma'arif al-Qur'an, Tafsir Muyassar), select surah from a numbered QuickPick list (1–114), then enter ayah number.

### Fixed
- **Tafsir command** now shows 4 tafsir sources instead of auto-selecting based on language.

---

## [10.0.1] - 2026-06-18

### Fixed
- **Random endpoints now skip cache** — `getDuaa`, random hadith, and other random commands no longer return the same cached result for 24 hours. Each call gets fresh content from the API.

---

## [10.0.0] - 2026-06-18

### Added
- **Unified Ummah API** — migrated from 4 separate APIs to `ummahapi.com` (Quran, Hadith, Hijri, Duas, Tafsir, Prayer Times, 99 Names all through one service).
- **Tafsir command** (`hasanah.getTafsir`) — fetch scholarly commentary for any verse. Auto-selects Ibn Kathir (Arabic/English) based on language setting. Displays full scrollable text in an editor tab.
- **Prayer Times command** (`hasanah.getPrayerTimes`) — auto-detects location via IP geolocation, shows all prayer times with current time and next prayer countdown.
- **Prayer alerts** — automatic notifications at 10 minutes and 1 minute before each prayer, refreshing daily.
- **Duaa command** (`hasanah.getDuaa`) — random authentic dua from Quran and Sunnah, respecting language setting.
- **3-state alternation** — automatically cycles through Hadith 💚 → Ayah ❤️ → Duaa 🤲 in the notification loop.
- **TafsirService, PrayerTimeService, PrayerAlertService, LocationService** — new service layer modules.

### Fixed
- **DuaaService** — corrected endpoints from `/duaa/` to `/duas/`, added `getRandomDuaa()`.
- **HadithService** — now respects language parameter (picks Arabic vs English text).
- **NamesOfAllahService** — fixed broken endpoints to `/asma-ul-husna`.
- **UmmahAPI** — improved error messages with API response body included.
- **Input validation** — tafsir command validates surah (1-114) and ayah (≥1) before API calls.
- **Error messages** — API error responses now show the actual reason from the server.

### Changed
- **Architecture** — unified all API integration under `ummah-api.js` with built-in caching (24h TTL).
- **Extension host** — `turn` variable changed from boolean to 3-state counter.
- **Config description** — updated to reflect hadith/ayah/duaa cycle.

---

## [9.4.2] - 2026-06-12

### Fixed
- Unknown author display in hadith notifications.

---

## [9.4.0] - 2025-07-10

### Improved
- Enhanced error handling and API response validation in English Hadith module (`eng_hadith.js`).
- Improved documentation and code comments for maintainability.
- Updated error messages for clarity and user feedback.

### Fixed
- Addressed edge cases in Hadith API response structure.
- Ensured consistent return values and error propagation in Hadith fetching logic.

---

## [9.3.1] - 2025-05-26

### Modified
- Update the Hasanah logo preparing for Ramadan


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