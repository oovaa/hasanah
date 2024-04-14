async function getRandomSurah() {
  try {
    const response = await fetch('https://api.alquran.cloud/v1/surah');
    const data = await response.json();
    const surahs = data['data'];
    const surahs_number = Math.floor(Math.random() * surahs.length);
    return surahs[surahs_number];
  } catch (error) {
    if (error.message === 'Was there a typo in the url or port?') {
      throw new Error('No internet connection available.');
    }
    throw error;
  }
}

async function getRandomAyah(surah) {
  try {
    const ayahNumber = Math.floor(Math.random() * surah.numberOfAyahs) + 1;
    const response = await fetch(`https://api.alquran.cloud/v1/ayah/${surah.number}:${ayahNumber}`);
    const data = await response.json();
    return data['data'];
  } catch (error) {
    if (error.message === 'Was there a typo in the url or port?') {
      throw new Error('No internet connection available.');
    }
    throw error;
  }
}

async function getAyahText() {
  try {
    const surah = await getRandomSurah();
    const ayah = await getRandomAyah(surah);
    return ayah;
  } catch (error) {
    console.log('Error:', error.message);
  }
}

async function getSpecificAyah(surahNumber, ayahNumber) {
  if (typeof surahNumber !== 'number' || typeof ayahNumber !== 'number') {
    surahNumber = parseInt(surahNumber);
    ayahNumber = parseInt(ayahNumber);
  }
  try {
    const response = await fetch(`https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}`);
    const data = await response.json();
    return data['data'];
  } catch (error) {
    if (error.message === 'Was there a typo in the url or port?') {
      throw new Error('No internet connection available.');
    }
    throw error;
  }
}



module.exports.getSpecificAyah = getSpecificAyah;
module.exports.getAyahText = getAyahText;

// let data = await getSpecificAyah(2, 255)
// console.log(data.text, data.numberInSurah, data.surah.name);

// getAyahText().then(ayah => {
//   // You can handle the returned ayah here
//   console.log(ayah.text);
// });

// printRandomHadith()
