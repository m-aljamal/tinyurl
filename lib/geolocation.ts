type GeoData = {
  country: string;
  city: string;
  latitude: number;
  longitude: number;
};

export async function getGeoData(): Promise<GeoData | null> {
  try {
    const response = await fetch(
      `https://api.ipregistry.co/?key=${process.env.IPREGISTRY_KEY}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch geolocation data");
    }
    const data = await response.json();
    return {
      country: data.location.country.name,
      city: data.location.city,
      latitude: data.location.latitude,
      longitude: data.location.longitude,
    };
  } catch (error) {
    console.error("Error fetching geolocation data:", error);
    return null;
  }
}
