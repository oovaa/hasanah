class LocationService {
  async getCurrentLocation() {
    const providers = [
      async () => {
        const res = await fetch('https://ipapi.co/json/')
        if (!res.ok) throw new Error('ipapi.co failed')
        const data = await res.json()
        if (data.error) throw new Error(data.reason || 'ipapi.co error')
        return {
          latitude: data.latitude,
          longitude: data.longitude,
          city: data.city,
          country: data.country_name
        }
      },
      async () => {
        const res = await fetch('http://ip-api.com/json/')
        if (!res.ok) throw new Error('ip-api.com failed')
        const data = await res.json()
        if (data.status === 'fail') throw new Error(data.message || 'ip-api.com error')
        return {
          latitude: data.lat,
          longitude: data.lon,
          city: data.city,
          country: data.country
        }
      }
    ]
    for (const provider of providers) {
      try {
        return await provider()
      } catch {}
    }
    throw new Error('Failed to detect location')
  }
}

module.exports = { LocationService }
