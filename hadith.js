// Legacy hadith.js - replaced by HadithService using Ummah API
// This file is kept for backward compatibility but delegates to HadithService

const { HadithService } = require('./services/hadith-service')

let hadithService = null

const getHadithService = () => {
  if (!hadithService) {
    hadithService = new HadithService()
  }
  return hadithService
}

async function GetRandomHadith() {
  const service = getHadithService()
  return await service.getRandomHadith('ar')
}

module.exports.GetRandomHadith = GetRandomHadith