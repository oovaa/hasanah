const fs = require('fs');

const collections = [
    'muslim',
    'bukhari',
    'tirmidzi',
    'nasai',
    'abudaud',
    'ibnumajah',
    'ahmad',
    'darimi',
    'malik'
];

const getRandomCollection = () => {
    const randomIndex = Math.floor(Math.random() * collections.length);
    return collections[randomIndex];
};
function getRandomHadith() {
    const collection = getRandomCollection();
    return fetch(
        `https://api.hadith.gading.dev/books/${collection}?range=300-500`
    )
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            fs.writeFileSync('file.json', JSON.stringify(data));
            let hadiths = data.data.hadiths;
            let randomIndex = Math.floor(Math.random() * hadiths.length);
            return hadiths[randomIndex];
        })
        .catch((error) => {
            if (error.message === 'Network response was not ok') {
                return 'No internet connection available.';
            }
            return 'An error occurred: ' + error.message;
        });
}

getRandomHadith()
    .then((hadith) => console.log(hadith))
    .catch((error) => console.log('Error:', error));
