const { fetchFromUmmah } = require('./ummahapi')

let hijriDateCache = {}

const get_hijri_Date = async () => {
    let today = new Date()
    let dd = String(today.getDate()).padStart(2, '0')
    let mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
    let yyyy = today.getFullYear()

    let formattedDate = dd + '-' + mm + '-' + yyyy

    if (hijriDateCache[formattedDate]) return hijriDateCache[formattedDate]

    let data = await fetchFromUmmah('/today-hijri')
    
    let hijri = data.hijri || data

    const hijri_date = hijri.date
    const month_en = hijri.month_name || 'Unknown'
    const month_ar = hijri.month_name_arabic || 'Unknown'

    hijriDateCache[
        formattedDate
    ] = `${hijri_date} (${month_ar} - ${month_en}) 🩵`

    return hijriDateCache[formattedDate]
}

module.exports.get_hijri_Date = get_hijri_Date
