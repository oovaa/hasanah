// utils.js
export const formatDate = (date) => {
  const yyyy = date.getFullYear()
  const month = date.getMonth()
  const mm = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ][month]
  let dd = date.getDate()
  dd = dd < 10 ? '0' + dd : dd
  return `${dd} ${mm} ${yyyy}`
}

// prayerTimes.js
export const fetchPrayerTimes = async () => {
  const todayDate = new Date()
  const month = todayDate.getMonth() + 1
  const year = todayDate.getFullYear()
  try {
    const response = await fetch(
      `https://api.aladhan.com/v1/calendarByCity/${year}/${month}?city=hail&country=saudi%20arabia&method=4`
    )
    if (!response.ok) throw new Error('Network response was not ok.')
    const data = await response.json()
    // @ts-ignore
    if (data && data.data) {
      // @ts-ignore
      const prayersTimes = data.data
      const res = prayersTimes.find(
        (el) => el.date.readable === formatDate(todayDate)
      )
      if (!res) throw new Error('No prayer times found for today.')
      const { timings, date } = res
      return {
        timings,
        en: {
          date: date.gregorian.date,
          day: date.gregorian.weekday.en,
          month: date.gregorian.month.en
        },
        ar: {
          date: date.hijri.date,
          day: date.hijri.weekday.ar,
          month: date.hijri.month.ar
        }
      }
    }
  } catch (error) {
    console.error('Failed to fetch prayer times:', error)
    return null // or handle the error as you see fit
  }
}

console.log(await fetchPrayerTimes())
