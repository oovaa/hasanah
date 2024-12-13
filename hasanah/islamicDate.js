const get_hijri_Date = async () => {
    let today = new Date()
    let dd = String(today.getDate()).padStart(2, '0')
    let mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
    let yyyy = today.getFullYear()

    let formattedDate = dd + '-' + mm + '-' + yyyy

    let response = await fetch(
        'https://api.aladhan.com/v1/gToH/' + formattedDate
    )
    let data = await response.json()

    const hijri_date = data['data']['hijri']['date']

    const month_en = data['data']['hijri']['month'].en
    const month_ar = data['data']['hijri']['month'].ar

    return `${hijri_date} (${month_ar} - ${month_en}) 🩵`
}

module.exports.get_hijri_Date = get_hijri_Date
