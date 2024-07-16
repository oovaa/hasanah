import { newgetAyah } from './exp/quraan2'

const { printRandomHadith } = require('./hadith')
const { getAyahText } = require('./quraan')

// displayRandomAyah
;(async () => {
  console.time()
  const aya2 = await newgetAyah()
  console.timeEnd()
  console.time()
  const aya = await getAyahText()
  console.timeEnd()

  // console.log(aya)
  // const hadith = await printRandomHadith()
  //   console.log(hadith)
})()
