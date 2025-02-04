let hijriDateCache = {}

const get_hijri_Date = async () => {
    let today = new Date()
    let dd = String(today.getDate()).padStart(2, '0')
    let mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
    let yyyy = today.getFullYear()

    let formattedDate = dd + '-' + mm + '-' + yyyy

    if (hijriDateCache[formattedDate]) return hijriDateCache[formattedDate]

    let response = await fetch(
        'https://api.aladhan.com/v1/gToH/' + formattedDate
    )
    let data = await response.json()

    const hijri_date = data['data']['hijri']['date']

    const month_en = data['data']['hijri']['month'].en
    const month_ar = data['data']['hijri']['month'].ar

    hijriDateCache[
        formattedDate
    ] = `${hijri_date} (${month_ar} - ${month_en}) 🩵`

    return hijriDateCache[formattedDate]
}

module.exports.get_hijri_Date = get_hijri_Date
