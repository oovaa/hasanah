class LocationService {
  async getCurrentLocation() {
    const response = await fetch('https://ip-api.com/json/')
    if (!response.ok) throw new Error('Failed to detect location')
    const data = await response.json()
    if (data.status === 'fail') throw new Error(data.message || 'Location detection failed')
    return { latitude: data.lat, longitude: data.lon, city: data.city, country: data.country }
  }
}

module.exports = { LocationService }
