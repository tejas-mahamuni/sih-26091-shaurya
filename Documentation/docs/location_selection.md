# Location Selection & Spatial Coordinate Resolution Standard

This document details the map-based location selection architecture, geocoding pipeline, PostGIS spatial boundary resolution, and pilot coverage handling in **VyapaarIQ**.

---

## 🗺️ Architecture Overview

VyapaarIQ uses **geographic coordinates** (`latitude`, `longitude`) as the primary user-selected location identifier rather than hardcoded village names or string arrays.

```text
User Interaction (Click Map / Drag Marker / Search Address / Geolocation)
                  │
                  ▼
Exact Geographic Coordinates (Latitude, Longitude) & Formatted Address
                  │
                  ▼
POST /api/v1/locations/resolve
                  │
                  ▼
PostGIS Spatial Boundary Check & Proximity Lookup
                  │
                  ├───────────────────────────────┐
                  ▼                               ▼
    Within Nashik Pilot Boundary      Outside Pilot Boundary
(district_lgd_code = 497, 19.3°-21.1°N)   (supported = false)
                  │                               │
                  ▼                               ▼
  Resolved Administrative Hierarchy    Honest Pilot Boundary Notice
  (State, District, Taluka, Village)   (User can proceed; telemetry pending)
```

---

## 🔌 API Contract: Coordinate Resolution

### Endpoint
`POST /api/v1/locations/resolve`

### Request Payload
```json
{
  "latitude": 20.1472,
  "longitude": 74.23
}
```

### Response (Within Nashik Verified Coverage)
```json
{
  "latitude": 20.1472,
  "longitude": 74.23,
  "coverage": {
    "supported": true,
    "region": "Nashik District, Maharashtra",
    "message": "Verified Nashik pilot coverage active."
  },
  "administrative": {
    "village": "Lasalgaon",
    "village_lgd_code": 550901,
    "taluka": "Niphad",
    "subdistrict_lgd_code": 4182,
    "district": "Nashik",
    "district_lgd_code": 497,
    "state": "Maharashtra",
    "state_code": 27
  }
}
```

### Response (Outside Nashik Coverage)
```json
{
  "latitude": 28.6139,
  "longitude": 77.2090,
  "coverage": {
    "supported": false,
    "region": null,
    "message": "VyapaarIQ Pilot Coverage: Detailed business intelligence is currently available for Nashik district, Maharashtra. You can still select this location, but detailed market, demographic, infrastructure and competition analysis is not yet available for this area."
  },
  "administrative": null
}
```

---

## 🛠️ Geocoding & Provider Configuration

- **Interactive Map Engine**: React Leaflet with OpenStreetMap tiles
- **Reverse Geocoding**: OpenStreetMap Nominatim API (convert lat/lon -> address)
- **Forward Geocoding**: OpenStreetMap Nominatim Search API
- **Browser Geolocation**: W3C HTML5 `navigator.geolocation` API with permission, timeout, and accuracy error handling.
- **Provider Environment Key**: Can be overridden via `VITE_GEOCODING_API_KEY` or `VITE_MAP_PROVIDER_URL` in `.env`.

---

## 🔒 PostGIS Boundary Resolution Logic

PostgreSQL PostGIS performs coordinate checking against stored LGD geographic nodes:
1. `is_within_nashik_bounds(lat, lon)` checks if coordinates fall inside Nashik bounding box (`min_lat: 19.30`, `max_lat: 21.10`, `min_lon: 73.00`, `max_lon: 75.20`).
2. Euclidean / ST_Distance spatial lookup determines nearest village and taluka node stored in `locations` and `villages` tables.

---

## 🚀 Future Geographic Expansion

The Start Analysis UI is architected without Nashik-specific hardcoded assumptions:
- To expand to another district (e.g. Pune, Ahmednagar, or all Maharashtra), add the state/district LGD codes to the database `districts` table with `is_pilot_active = true`.
- The frontend map picker and coordinate resolution contract will automatically recognize the expanded boundary without requiring UI refactoring.
