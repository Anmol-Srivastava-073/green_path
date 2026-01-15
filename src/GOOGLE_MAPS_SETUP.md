# 🗺️ Google Maps Setup Guide

## Step-by-Step Instructions

### Step 1: Get API Key (5 minutes)

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create or Select Project**
   - Click "Select a project" dropdown
   - Click "New Project"
   - Name it "GreenPath" (or anything you like)
   - Click "Create"

3. **Enable Maps JavaScript API**
   - In the search bar, type "Maps JavaScript API"
   - Click on it
   - Click "Enable"
   - Wait for it to enable (~30 seconds)

4. **Create API Key**
   - Go to "Credentials" (left sidebar)
   - Click "Create Credentials" → "API Key"
   - Copy the key that appears
   - Click "Restrict Key" (IMPORTANT for security)

5. **Restrict Your Key** (Security Step)
   - Under "Application restrictions":
     - Select "HTTP referrers (web sites)"
     - Add your domain: `yourdomain.com/*`
     - For testing: `localhost:*`
   - Under "API restrictions":
     - Select "Restrict key"
     - Check "Maps JavaScript API"
   - Click "Save"

### Step 2: Add to Your App (1 minute)

1. **Open MapLoader.tsx**
   ```bash
   # File location:
   /components/MapLoader.tsx
   ```

2. **Replace API Key**
   ```typescript
   // Find this line (around line 5):
   const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY_HERE';
   
   // Replace with your actual key:
   const GOOGLE_MAPS_API_KEY = 'AIzaSyC...your-actual-key...';
   ```

3. **Save the file**

4. **Refresh your browser**
   - Map should now show Google Maps!

---

## 🎯 What You'll Get

### Before (Simple Map):
- Basic animated visualization
- Hover tooltips
- Color-coded pins
- Works immediately

### After (Google Maps):
- ✨ Real Google Maps
- ✨ Clickable pins with info windows
- ✨ Street view, satellite view
- ✨ Zoom, pan, search
- ✨ User location marker
- ✨ Directions support
- ✨ Place names, roads

---

## 💰 Cost (Don't Worry, It's Free!)

### Free Tier:
- **28,000 map loads per month** - FREE
- **100,000 map views** - FREE
- No credit card required to start

### For Small Apps:
- If you have < 1000 users, you'll likely stay free
- Google gives $200 free credit per month
- Monitor usage in Google Cloud Console

### To Enable Billing (Optional but Recommended):
1. Go to Google Cloud Console
2. Click "Billing" in left menu
3. Add credit card (won't be charged unless you exceed free tier)
4. This unlocks full quota

**Note:** Without billing, you get reduced quota but it's still usable for testing!

---

## 🔧 Troubleshooting

### Error: "This page can't load Google Maps correctly"

**Causes & Fixes:**

1. **Invalid API Key**
   - Check you copied the full key
   - No extra spaces before/after
   - Wrapped in quotes

2. **API Not Enabled**
   - Go to Google Cloud Console
   - Search "Maps JavaScript API"
   - Make sure it's enabled (green checkmark)

3. **Billing Not Enabled** (For production)
   - Add billing in Google Cloud Console
   - You won't be charged in free tier
   - Just enables full quota

4. **Domain Restrictions**
   - Check API key restrictions
   - Add `localhost:*` for development
   - Add your domain for production

### Map Loads but Pins Don't Show

**Fixes:**
1. Make sure you have waste posts added
2. Click "Refresh" button
3. Check browser console (F12) for errors
4. Verify you're logged in

### "Loading..." Never Finishes

**Fixes:**
1. Check internet connection
2. Verify API key is correct
3. Check browser console for errors
4. Try hard refresh (Ctrl+Shift+R)

---

## 🎨 Customization Options

### Change Map Style

In `/components/GoogleMapView.tsx`, find the `initializeMap` function and add styles:

```typescript
googleMapRef.current = new google.maps.Map(mapRef.current, {
  center,
  zoom: 5,
  // Add custom styles here:
  styles: [
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#3C91E6' }], // GreenPath blue
    },
    {
      featureType: 'landscape',
      elementType: 'geometry',
      stylers: [{ color: '#FAFFFD' }], // GreenPath white
    },
  ],
});
```

### Change Default Zoom

```typescript
zoom: 5,  // Country level (current)
zoom: 10, // City level
zoom: 15, // Neighborhood level
```

### Change Center Point

```typescript
// Current (center of India):
const center = { lat: 20.5937, lng: 78.9629 };

// Mumbai:
const center = { lat: 19.0760, lng: 72.8777 };

// Delhi:
const center = { lat: 28.7041, lng: 77.1025 };

// Bangalore:
const center = { lat: 12.9716, lng: 77.5946 };
```

---

## 📊 Monitoring Usage

### Check Your Quota:

1. Go to Google Cloud Console
2. Click "APIs & Services" → "Dashboard"
3. Click "Maps JavaScript API"
4. View usage graphs

### Set Up Alerts:

1. Click "Quotas" in left menu
2. Find "Maps JavaScript API"
3. Click "Edit Quotas"
4. Set limit (e.g., 25,000 per month)
5. Add email for alerts

---

## 🔒 Security Best Practices

### 1. Restrict API Key
✅ Always restrict to your domain
✅ Never commit API key to public GitHub
✅ Use environment variables in production

### 2. Example Restrictions:

**For Development:**
```
HTTP referrers:
- localhost:*
- 127.0.0.1:*
```

**For Production:**
```
HTTP referrers:
- yourdomain.com/*
- www.yourdomain.com/*
```

### 3. Rotate Keys:
- Create new key every 6-12 months
- Delete old unused keys
- Monitor for suspicious activity

---

## 🚀 Production Deployment

### Environment Variable Approach (Recommended):

1. **Create .env file:**
   ```bash
   VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

2. **Update MapLoader.tsx:**
   ```typescript
   const GOOGLE_MAPS_API_KEY = 
     import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 
     'YOUR_FALLBACK_KEY';
   ```

3. **Add to .gitignore:**
   ```
   .env
   .env.local
   ```

4. **Deploy:**
   - Add env variable in Vercel/Netlify dashboard
   - Never hardcode in production

---

## 📱 Mobile Optimization

Google Maps works great on mobile but you can optimize:

1. **Adjust zoom for mobile:**
   ```typescript
   const isMobile = window.innerWidth < 768;
   zoom: isMobile ? 12 : 5,
   ```

2. **Disable controls on mobile:**
   ```typescript
   mapTypeControl: !isMobile,
   fullscreenControl: !isMobile,
   ```

3. **Enable geolocation:**
   - Already implemented!
   - Click "My Location" button

---

## 🌟 Advanced Features

### Enable Clustering (Many Pins):

Install marker clusterer:
```bash
npm install @googlemaps/markerclusterer
```

Add to GoogleMapView.tsx:
```typescript
import { MarkerClusterer } from '@googlemaps/markerclusterer';

// After creating all markers:
new MarkerClusterer({ map: googleMapRef.current, markers: markersRef.current });
```

### Enable Search Box:

```typescript
const searchBox = new google.maps.places.SearchBox(inputElement);
```

### Enable Directions:

```typescript
const directionsService = new google.maps.DirectionsService();
const directionsRenderer = new google.maps.DirectionsRenderer();
```

---

## ✅ Checklist

Before going live, verify:

- [ ] API key is correct
- [ ] Maps JavaScript API is enabled
- [ ] API key is restricted to your domain
- [ ] Billing is enabled (for full quota)
- [ ] Tested on desktop
- [ ] Tested on mobile
- [ ] Pins show correctly
- [ ] Info windows work
- [ ] User location works
- [ ] Performance is good

---

## 🎉 You're Done!

Your GreenPath app now has:
- ✅ Interactive Google Maps
- ✅ Real GPS coordinates
- ✅ Professional map experience
- ✅ Fallback for when API isn't configured

**Enjoy your enhanced mapping experience!** 🗺️✨

---

## 📞 Need More Help?

- [Google Maps Documentation](https://developers.google.com/maps/documentation/javascript)
- [Pricing Calculator](https://mapsplatform.google.com/pricing/)
- [API Key Best Practices](https://developers.google.com/maps/api-security-best-practices)

---

*Happy Mapping! 🌍*
