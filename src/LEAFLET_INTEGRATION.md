# Leaflet Map Integration Guide

## Overview
GreenPath now uses **Leaflet** instead of Google Maps for displaying waste locations. Leaflet is a free, open-source mapping library that uses OpenStreetMap tiles - no API key required!

## What Changed

### ✅ New Components
- **`LeafletMapView.tsx`** - Main map component using Leaflet
  - Interactive map with custom markers for different waste types
  - Real-time marker updates
  - User location tracking
  - Click-to-view popups with waste details
  - Auto-fit bounds to show all markers

### ✅ Updated Components
- **`MapLoader.tsx`** - Simplified to directly load LeafletMapView (no API key checks needed)
- **`AddWaste.tsx`** - Enhanced with GPS location detection
  - Automatically detects user's GPS coordinates
  - Shows GPS status indicator (Active, Getting Location, or Approximate)
  - Uses exact GPS coordinates when available
  - Falls back to approximate India coordinates if GPS unavailable

### 🗑️ Deprecated Components
- `GoogleMapView.tsx` - Still available but no longer used
- `MapView.tsx` - Old placeholder map, replaced by Leaflet

## Key Features

### 🎨 Custom Markers
Each waste type has a unique colored marker:
- 🔋 **Batteries**: Yellow (#EAB308)
- 🥤 **Plastic**: Blue (#3B82F6)
- 📱 **Electronics**: Purple (#A855F7)
- 🛢️ **Oil**: Orange (#F97316)
- 🔩 **Metal**: Gray (#6B7280)
- 🍾 **Glass**: Green (#10B981)
- 📦 **Paper**: Purple (#8B5CF6)
- 🌿 **Organic**: Lime (#84CC16)
- ⚠️ **Hazardous**: Red (#EF4444)

### 🗺️ Map Controls
- **Zoom**: Standard +/- controls
- **Pan**: Click and drag
- **My Location**: Button to center map on user
- **Refresh**: Reload waste posts from database
- **Marker Popups**: Click any marker to see waste details

### 📍 GPS Integration
When users add waste:
1. App requests GPS permission
2. If granted, uses exact coordinates
3. If denied, uses approximate location
4. Status indicator shows current GPS state

## Technical Details

### Libraries Used
```typescript
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
```

### Map Initialization
```typescript
const map = L.map(container).setView([lat, lng], zoom);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);
```

### Custom Markers
Markers use `L.divIcon` with inline SVG for custom appearance:
- Pin shape with colored fill
- White inner circle
- Icon indicator inside
- Drop shadow effect

### User Location Marker
- Blue circle (#3C91E6)
- White border
- Box shadow
- "Your Location" popup

## Benefits Over Google Maps

✅ **No API Key Required** - Free and open-source
✅ **No Rate Limits** - Unlimited map loads
✅ **No Billing** - Completely free for any usage
✅ **Privacy-Friendly** - OpenStreetMap respects user privacy
✅ **Customizable** - Full control over styling and behavior
✅ **Lightweight** - Smaller bundle size

## Usage

### Viewing the Map
1. Navigate to "Map View" in the dashboard
2. Map automatically loads waste locations from Supabase
3. Click markers to see details
4. Use "My Location" to center on your position
5. Click "Refresh" to reload latest waste posts

### Adding Waste with GPS
1. Navigate to "Add Waste"
2. App requests GPS permission (allow for accuracy)
3. Fill in waste details
4. Submit - location automatically captured
5. New marker appears on map immediately

## Database Schema
Waste posts require these coordinates:
```typescript
{
  latitude: number;    // GPS latitude
  longitude: number;   // GPS longitude
  location: string;    // Human-readable address
}
```

## Future Enhancements
- 🎯 Marker clustering for high-density areas
- 🛣️ Route optimization visualization
- 🔍 Search/filter by location or waste type
- 📐 Drawing tools for collection zones
- 🌍 Multiple map tile providers

## Troubleshooting

### Markers not showing?
- Check that waste posts have valid latitude/longitude
- Open browser console to see loading logs
- Click "Refresh" to reload data

### GPS not working?
- Allow location permission in browser
- Works best on HTTPS sites
- Mobile devices generally more accurate

### Map tiles not loading?
- Check internet connection
- OpenStreetMap may have temporary outages
- Consider adding fallback tile provider

## Resources
- [Leaflet Documentation](https://leafletjs.com/)
- [OpenStreetMap](https://www.openstreetmap.org/)
- [Leaflet Tutorials](https://leafletjs.com/examples.html)
