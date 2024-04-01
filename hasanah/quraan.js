async function getRandomSurah() {
  const response = await fetch('https://api.alquran.cloud/v1/surah');
  const data = await response.json();
  let surahs = data.data;
  let surahs_number = Math.floor(Math.random() * surahs.length);
  return surahs[surahs_number];
}

async function getRandomAyah(surah) {
  let ayahNumber = Math.floor(Math.random() * surah.numberOfAyahs) + 1;
  const response = await fetch(`https://api.alquran.cloud/v1/ayah/${surah.number}:${ayahNumber}`);
  const data = await response.json();
  return data.data;
}

async function getAyahText() {
  try {
    const surah = await getRandomSurah();
    const ayah = await getRandomAyah(surah);
    console.log(ayah);
  } catch (error) {
    console.log('Error:', error);
  }
}

getAyahText();