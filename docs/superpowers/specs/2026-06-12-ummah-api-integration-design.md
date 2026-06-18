# Ummah API Integration Design Document

## Project Overview

**Hasanah** is a VS Code extension that brings Quranic verses and Hadiths to developers' coding environment. This design document outlines the migration from current fragmented APIs to the unified Ummah API platform.

## Current State Analysis

### Existing APIs
1. **Quran**: AlQuran.cloud API (`https://api.alquran.cloud/v1/ayah/`)
   - Limited to 6,236 verses
   - Basic Arabic and English translations
   - Single script (Uthmani)

2. **Arabic Hadith**: Hadith API (gading.dev) (`https://api.hadith.gading.dev/books/`)
   - Limited to 7 collections
   - Arabic text only
   - Basic author attribution

3. **English Hadith**: Hadith API (hadithapi.com) (`https://www.hadithapi.com/api/hadiths/`)
   - Limited collections
   - English text with basic metadata

4. **Hijri Date**: Al Adhan API (`https://api.aladhan.com/v1/gToH/`)
   - Basic Hijri date conversion
   - Limited functionality

### Limitations of Current Approach
- Multiple API endpoints to maintain
- Inconsistent data formats
- Limited content variety
- Higher maintenance overhead

## Ummah API Capabilities

### Quran API
- **36,236 verses** (vs 6,236 currently)
- **3 Arabic scripts**: Uthmani, IndoPak, Tajweed
- **8 translations**: EN, UR, TR, ID, FR, DE, and more
- **12 reciters**: Alafasy, Sudais, Shuraim & others
- **Word-by-word** Arabic, transliteration, meaning
- **Tafsir** (Ibn Kathir, Ma'arif, Muyassar)
- **30 Juz + Search** functionality
- **Random ayah endpoint**

### Hadith API
- **36,000+ hadiths** (vs current ~2,000)
- **7 major collections**: Bukhari, Muslim, Tirmidhi, Nasai, Abu Dawood, Ibn Majah, Malik
- **Arabic and English** support
- **Detailed metadata**: author, reliability, total hadiths
- **Collection-based retrieval**

### Additional Services
- **Prayer Times**: 22 methods, auto timezone
- **Qibla Direction**: Compass bearing to Kaaba
- **Hijri Calendar**: Date conversion, events
- **Duas**: 126 authentic duas across 27 categories
- **99 Names of Allah**: Asma ul Husna with meanings
- **Tafsir**: Scholarly commentary per ayah

## Integration Strategy

### 1. Unified API Architecture
```
┌─────────────────────────────────────────────────────────┐
│                Hasanah Extension                        │
├─────────────────────────────────────────────────────────┤
│  main.js (core logic)                                   │
│  ummah-api.js (unified layer)                           │
│    ├─ QuranService                                           │
│    ├─ HadithService                                         │
│    ├─ PrayerTimesService                                    │
│    ├─ HijriCalendarService                                  │
│    ├─ DuaaService                                           │
│    ├─ NamesOfAllahService                                   │
│    └─ TafsirService                                        │
├─────────────────────────────────────────────────────────┤
│  extension.js (VS Code integration)                      │
└─────────────────────────────────────────────────────────┘
```

### 2. Service Layer Design

#### QuranService
- **Base URL**: `https://ummahapi.com/api/quran`
- **Endpoints**: 
  - `/surah/{number}` - Full surah with translations
  - `/surah/{surah}/ayah/{ayah}` - Specific ayah
  - `/random` - Random ayah
  - `/search?q={query}` - Search functionality
- **Features**: Multiple scripts, translations, audio, word-by-word

#### HadithService
- **Base URL**: `https://ummahapi.com/api/hadith`
- **Endpoints**:
  - `/collections` - List all collections with metadata
  - `/{collection}/{number}` - Specific hadith
  - `/random` - Random hadith
- **Features**: 7 major collections, Arabic/English support

#### HijriCalendarService
- **Base URL**: `https://ummahapi.com/api/today-hijri`
- **Features**: Today's Islamic date, month names, events

#### DuaaService
- **Base URL**: `https://ummahapi.com/api/duas`
- **Features**: 126 duas across 27 categories, random selection

#### NamesOfAllahService
- **Base URL**: `https://ummahapi.com/api/asma-ul-husna`
- **Features**: 99 names with Arabic, transliteration, meanings

### 3. Data Structure Adaptation

#### Current vs Ummah Response Format

**Current Hadith Response**:
```json
{
  "hadith": "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ",
  "author": "البخاري",
  "number": 1
}
```

**Ummah Hadith Response**:
```json
{
  "success": true,
  "service": "hadith",
  "data": {
    "hadith": "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ",
    "author": "Imam Bukhari",
    "reliability": "Sahih",
    "collection": "bukhari",
    "number": 1,
    "arabic_name": "صحيح البخاري"
  },
  "timestamp": "2026-06-12T00:00:00Z"
}
```

**Adaptation Strategy**:
- Extract data from Ummah's nested structure
- Maintain backward compatibility in service layer
- Add enhanced metadata (reliability, collection info)

### 4. Caching Strategy

#### Unified Cache Structure
```javascript
const cache = {
  quran: {
    random: { data: null, timestamp: null },
    surah: { 1: { data: null, timestamp: null }, ... },
    search: { query: { data: null, timestamp: null } }
  },
  hadith: {
    random: { data: null, timestamp: null },
    collections: { data: null, timestamp: null },
    specific: { "bukhari-1": { data: null, timestamp: null } }
  },
  hijri: { today: { data: null, timestamp: null } },
  duaa: { random: { data: null, timestamp: null }, category: { "morning": { data: null, timestamp: null } } },
  namesOfAllah: { data: null, timestamp: null }
};
```

#### Cache Keys
- `quran:random`, `quran:surah:{number}`, `quran:search:{query}`
- `hadith:random`, `hadith:collections`, `hadith:{collection}:{number}`
- `hijri:today`, `duaa:random`, `duaa:category:{category}`, `namesOfAllah:all`

### 5. Error Handling

#### Unified Error Structure
```javascript
{
  error: {
    code: 'API_ERROR',
    message: 'Failed to fetch data',
    service: 'quran',
    timestamp: '2026-06-12T00:00:00Z'
  }
}
```

#### Fallback Strategy
- Primary: Ummah API
- Secondary: Current APIs (for critical services during transition)
- Tertiary: Default content (Duaa, cached data)

## Implementation Timeline

### Phase 1: Core API Integration (Weeks 1-2)
- [ ] QuranService implementation
- [ ] HadithService implementation
- [ ] HijriCalendarService implementation
- [ ] Unified error handling
- [ ] Basic caching layer

### Phase 2: Enhanced Features (Weeks 3-4)
- [ ] DuaaService implementation
- [ ] NamesOfAllahService implementation
- [ ] Advanced search functionality
- [ ] Word-by-word Quran support
- [ ] Audio integration

### Phase 3: Testing & Optimization (Weeks 5-6)
- [ ] Comprehensive test suite
- [ ] Performance optimization
- [ ] Edge case handling
- [ ] Documentation updates

### Phase 4: Deployment (Week 7)
- [ ] Code review and cleanup
- [ ] Final testing
- [ ] Documentation updates
- [ ] Deployment preparation

## Risk Mitigation

### Technical Risks
1. **API Response Format Changes**
   - Mitigation: Flexible data parsing layer
   - Solution: Try-catch blocks with fallback parsing

2. **Rate Limiting**
   - Mitigation: Aggressive caching strategy
   - Solution: 24-hour cache for static content

3. **Data Quality Issues**
   - Mitigation: Multiple data source validation
   - Solution: Cross-reference with existing data

### Project Risks
1. **Timeline Delays**
   - Mitigation: Agile development with weekly sprints
   - Solution: Regular progress reviews

2. **Testing Coverage**
   - Mitigation: Comprehensive test suite
   - Solution: Mock all Ummah API responses

3. **User Experience**
   - Mitigation: Gradual rollout with feature flags
   - Solution: A/B testing for critical features

## Testing Strategy

### Unit Tests
- Mock all Ummah API endpoints
- Test data parsing and transformation
- Verify caching behavior
- Test error handling scenarios

### Integration Tests
- Test end-to-end functionality
- Verify VS Code extension integration
- Test real API calls (staged rollout)

### Performance Tests
- Measure API response times
- Verify cache effectiveness
- Test concurrent requests

## Files to Modify

### Core Files
- `main.js` - Update to use Ummah API
- `hadith.js` - Replace with Ummah Hadith integration
- `eng_hadith.js` - Replace with Ummah English Hadith integration
- `quraan.js` - Replace with Ummah Quran integration
- `islamicDate.js` - Replace with Ummah Hijri calendar integration

### New Files
- `ummah-api.js` - Unified API service layer
- `services/` - Service-specific implementations
- `tests/ummah.test.js` - Ummah API integration tests

## Benefits

### Immediate Benefits
1. **Expanded Content**: 6x more Quran verses, 18x more Hadiths
2. **Enhanced Features**: Word-by-word, audio, tafsir, multiple scripts
3. **Simplified Maintenance**: Single API endpoint instead of 4
4. **Better Data Quality**: Unified, well-structured data

### Long-term Benefits
1. **Additional Services**: Prayer times, Qibla, Duas, Names of Allah
2. **Scalability**: Single API handles all Islamic content needs
3. **Future-proof**: Ummah API continuously updated
4. **Developer Experience**: Consistent API patterns

## Success Metrics

### Technical Metrics
- API response time < 500ms
- Cache hit rate > 90%
- Error rate < 0.1%
- Test coverage > 90%

### User Experience Metrics
- Feature completeness > 95%
- Performance improvement > 50%
- User satisfaction > 90%
- Bug resolution time < 24 hours

## Conclusion

The migration to Ummah API represents a significant enhancement to Hasanah's capabilities while simplifying the technical architecture. The unified approach provides better content variety, improved data quality, and reduced maintenance overhead.

This design ensures a smooth transition with minimal disruption to existing functionality while unlocking the full potential of Ummah's comprehensive Islamic API platform.

**Estimated Implementation Time**: 6-7 weeks
**Risk Level**: Medium (mitigated with comprehensive testing)
**Complexity**: High (requires significant code changes)
