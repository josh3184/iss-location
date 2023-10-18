// Imports
const express = require('express');
const axios = require('axios');

// Bootstrap
const app = express();

// Config
const APP_PORT = 3000;
const ISS_API = 'http://api.open-notify.org/iss-now.json';
const GEOCODE_API = 'https://maps.googleapis.com/maps/api/geocode/json';
const GOOGLE_API_KEY = 'AIzaSyDsidjxMpEGnnxBSEpyIhgDjoNuNVC4XT4';
const HQ_COORDS = {
    'latitude': '53.49131142222301',
    'longitude': '-2.242441338639333',
};

// Route
app.get('/iss-location', async (req, res) => {
    try {
        // Get ISS location data
        const { data: { iss_position } } = await axios.get(ISS_API);
        const {
            latitude: issLatitude,
            longitude: issLongitude
        } = iss_position

        // Send to Geocode to get country
        const {data: geocodeData} = await axios.get(`${GEOCODE_API}?latlng=${issLatitude},${issLongitude}&key=${GOOGLE_API_KEY}`);
        const geocodeDataAddressComponents = geocodeData.results[0].address_components;

        let issCountry = 'Unknown';
        for (const addressComponent of geocodeDataAddressComponents) {
            if (addressComponent.types.includes('country')) {
                issCountry = addressComponent.long_name;
                break;
            }
        }

        // Calculate distance between the coords
        const distanceBetweenISSAndHQMiles = distanceBetweenCoordinatesInMiles(issLatitude, issLongitude, HQ_COORDS.latitude, HQ_COORDS.longitude);

        // Construct response
        res.json({
            'status': 'success',
            'message': {
                'issPosition': iss_position,
                'distanceFromHQMiles': Math.round(distanceBetweenISSAndHQMiles),
                'issCountry': issCountry,
            }
        });
    } catch (error) {
        res.status(500).json({
            'status': 'error',
            'message': 'An internal error was encountered',
            'error': error.message
        });
    }

});

app.listen(APP_PORT, () => {
    console.log(`App running at http://localhost:${APP_PORT}`);
});

// Taken from: https://stackoverflow.com/a/18883819
// Distance between two coordinates in miles
function distanceBetweenCoordinatesInMiles(latitude1, longitude1, latitude2, longitude2) 
{
  var radiusEarthMiles = 3958.8; // Radius of the Earth in miles
  var diffLatitudeInRadians = toRadians(latitude2-latitude1);
  var diffLongitudeInRadians = toRadians(longitude2-longitude1);
  var latitude1 = toRadians(latitude1);
  var latitude2 = toRadians(latitude2);

  var a = Math.sin(diffLatitudeInRadians/2) * Math.sin(diffLatitudeInRadians/2) +
    Math.sin(diffLongitudeInRadians/2) * Math.sin(diffLongitudeInRadians/2) * Math.cos(latitude1) * Math.cos(latitude2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var distance = radiusEarthMiles * c;
  return distance;
}

// Taken from: https://stackoverflow.com/a/18883819 
// Converts numeric degrees to radians
function toRadians(value) 
{
    return value * Math.PI / 180;
}