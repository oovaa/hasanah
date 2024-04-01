async function getRandomSurah() {
  try {
    const response = await fetch('https://api.alquran.cloud/v1/surah');
    const data = await response.json();
    let surahs = data['data'];
    let surahs_number = Math.floor(Math.random() * surahs.length);
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
    let ayahNumber = Math.floor(Math.random() * surah.numberOfAyahs) + 1;
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

getAyahText().then(ayah => {
  // You can handle the returned ayah here
  console.log(ayah);
});