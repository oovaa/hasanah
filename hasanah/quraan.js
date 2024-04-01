function getRandomAyah() {}

function getRandomsurah() {
  // First, fetch the list of all Surahs
  fetch('https://api.alquran.cloud/v1/surah')
    .then((response) => response.json())
    .then((data) => {
      // Get a random Surah from the list
      let surahs = data.data;
      let surahs_number = Math.floor(Math.random() * surahs.length - 1);
      let randomSurah = surahs.find((surah) => surah.number === surahs_number);
      console.log(surahs_number);
      console.log(randomSurah);

      // Generate a random Ayah number
      let ayahNumber =
        Math.floor(Math.random() * randomSurah['numberOfAyahs']) + 1;

      // Then, fetch the random Ayah from the random Surah
      fetch(`https://api.alquran.cloud/v1/ayah/${surahs_number}:${ayahNumber}`)
        .then((response) => response.json())
        .then((data) => {
          // Log the Ayah to the console
          console.log('the ayah is /n');
          console.log(data.data);
        })
        .catch((error) => {
          console.log('Error:', error);
        });
    })
    .catch((error) => {
      console.log('Error:', error);
    });
}

// Call the function
getRandomsurah();
