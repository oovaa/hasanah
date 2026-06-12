// Legacy eng_hadith.js - replaced by HadithService using Ummah API
// This file is kept for backward compatibility but delegates to HadithService

const { HadithService } = require('./services/hadith-service')

let hadithService = null

const getHadithService = () => {
  if (!hadithService) {
    hadithService = new HadithService()
  }
  return hadithService
}

async function GetRandomHadith_ENG(language = 'en') {
  const service = getHadithService()
  return await service.getRandomHadith(language)
}

module.exports.GetRandomHadith_ENG = GetRandomHadith_ENG