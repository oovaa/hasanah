function getRandomSurah() {
  return fetch('https://api.alquran.cloud/v1/surah')
    .then((response) => response.json())
    .then((data) => {
      let surahs = data.data;
      let surahs_number = Math.floor(Math.random() * surahs.length);
      return surahs[surahs_number];
    });
}

function getRandomAyah(surah) {
  let ayahNumber = Math.floor(Math.random() * surah.numberOfAyahs) + 1;
  return fetch(
    `https://api.alquran.cloud/v1/ayah/${surah.number}:${ayahNumber}`
  )
    .then((response) => response.json())
    .then((data) => data.data);
}

let get_aya_text = () => {
  return getRandomSurah()
    .then((surah) => getRandomAyah(surah))
    .then((ayah) => ayah.text);
};

get_aya_text()
  .then((aya) => console.log(aya))
  .catch((error) => console.log('Error:', error));

// // Usage:
// getRandomSurah()
//   .then((surah) => getRandomAyah(surah))
//   .then((ayah) => console.log(ayah))
//   .catch((error) => console.log('Error:', error));
