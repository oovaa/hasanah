import { getAyah, getSpecificAyah } from './quraan'

const { printRandomHadith } = require('./hadith')
const { oldgetAyahText, oldgetSpecificAyah } = require('./oldquraan')

// displayRandomAyah
;(async () => {
  console.time('new get spicific ayah')
  const aya2 = await getSpecificAyah('2', '255') // 'https://quranapi.pages.dev/api'
  // console.log(aya2)
  console.timeEnd('new get spicific ayah')

  console.time('old get spicific ayah')
  const aya = await oldgetSpecificAyah(2, 255)
  // console.log(aya)
  console.timeEnd('old get spicific ayah')
})()
