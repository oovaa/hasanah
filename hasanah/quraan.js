// Fetch the Ayah
fetch('https://api.alquran.cloud/v1/ayah/2:255')
  .then((response) => response.json())
  .then((data) => {
    // Log the Ayah to the console
    console.log(data.data);
  })
  .catch((error) => {
    console.log('Error:', error);
  });
