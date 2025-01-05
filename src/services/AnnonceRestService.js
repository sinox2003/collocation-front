import axios from 'axios';

const fetchAnnoncesWithinRadius = async (country, city, street, radius) => {
  try {
    const response = await axios.get('http://localhost:8762/geolocation-service/api/geo/annonces', {
      params: {
        country,
        city,
        street,
        radius,
      },
    });
    return response.data; // The fetched data (list of annonces)
  } catch (error) {
    console.error('Error fetching annonces within radius:', error);
    throw error; // You can handle this error more specifically if needed
  }
};

export default fetchAnnoncesWithinRadius;
