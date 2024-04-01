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

async function getRandomHadith() {
    try {
        const collection = getRandomCollection();
        const response = await fetch(`https://api.hadith.gading.dev/books/${collection}?range=300-500`);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const hadiths = data.data.hadiths;
        const randomIndex = Math.floor(Math.random() * hadiths.length);
        return hadiths[randomIndex];
    } catch (error) {
        if (error.message === 'Network response was not ok') {
            return 'No internet connection available.';
        }
        return 'An error occurred: ' + error.message;
    }
}

getRandomHadith()
    .then((hadith) => console.log(hadith))
    .catch((error) => console.log('Error:', error));