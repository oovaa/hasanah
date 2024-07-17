import { newgetAyah } from './quraan'

const { printRandomHadith } = require('./hadith')
const { getAyahText } = require('./oldquraan')

// displayRandomAyah
;(async () => {
  console.time()
  const aya2 = await newgetAyah() // 'https://quranapi.pages.dev/api'
  console.log(aya2)
  console.timeEnd()
  console.time()
  const aya = await getAyahText()
  console.log(aya)
  console.timeEnd()

  // console.log(aya)
  // const hadith = await printRandomHadith()
  //   console.log(hadith)
})()
