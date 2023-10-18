# ISS Location API
## Description
Provides a single route `/iss-location` which can be accessed without any authentication as a GET request. It runs on port 3000.

### Example Output
Will provide:

- Status
- The ISS position latitude and logitude
- Distance from 15 Carnarvon Street (aka HQ) in miles
- The country it is currently over (if any)

JSON:

    {
        "status": "success",
        "message": {
            "issPosition": {
                "longitude": "-138.9332",
                "latitude": "-27.9020"
            },
            "distanceFromHQMiles": 9628.381611141973,
            "issCountry": "Unknown"
        }
    }

### Future improvements
A few things could be added in the future. Some are listed here:
- Extract the distance calculation funtion into its own service (or use a 3rd party library)
- Add testing, especially around the distance calculation function in its current state
- Authentication
- Caching if it's okay to only display an update e.g. every 5 seconds
- Linting
- Typescript models, specifically for the coordinates data structure