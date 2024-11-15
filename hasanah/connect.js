import { time, timeEnd } from 'console'
import { getAyah, getSpecificAyah } from './quraan'

const { printRandomHadith } = require('./hadith')
const { oldgetAyahText, oldgetSpecificAyah } = require('../oldquraan')

// displayRandomAyah
async function main() {
  time('hadith time')
  let hadith = await printRandomHadith()
  timeEnd('hadith time')
  // console.log(hadith)

  console.time('new get spicific ayah')
  const aya2 = await getSpecificAyah('2', '255') // 'https://quranapi.pages.dev/api'
  // console.log(aya2)
  console.timeEnd('new get spicific ayah')

  console.time('old get spicific ayah')
  const aya = await oldgetSpecificAyah(2, 255)
  // console.log(aya)
  console.timeEnd('old get spicific ayah')
}

// main()

async function testRunMultiTimes() {
  const numberOfExecutions = 20 // Number of times to run main
  const delayBetweenExecutions = 1000 // Delay in milliseconds

  for (let i = 0; i < numberOfExecutions; i++) {
    console.log(`Execution ${i + 1} of ${numberOfExecutions}`)
    await main()
    // Wait for a specified delay before the next execution
    await new Promise((resolve) => setTimeout(resolve, delayBetweenExecutions))
  }
}

testRunMultiTimes()
