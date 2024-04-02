const { printRandomHadith } = require('./hadith');
const { getAyahText } = require('./quraan');

(async () => {
    const aya = await getAyahText();
    const hadith = await printRandomHadith();
    console.log(aya);
    console.log(hadith);
})();
