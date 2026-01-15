# 🚀 GreenPath Setup Instructions

## ✅ What's Been Fixed

1. **Network Error Handling** - Proper detection of actual network failures vs API errors
2. **Map Auto-Refresh** - Map automatically updates when you add a new waste location
3. **Gemini AI Integration** - Falls back to demo mode if API key not configured
4. **GPS Location** - Automatically detects user location for accurate pinning

## 🔧 Required Setup Steps

### 1. Deploy the Supabase Edge Function

The app requires a Supabase Edge Function to be deployed. This is the **most critical step** to fix the "Failed to fetch" error.

**Steps:**

```bash
# Login to Supabase CLI
supabase login

# Link to your project
supabase link --project-ref hoyckjjbulqfnzumiasf

# Deploy the edge function
supabase functions deploy analyze-waste
```

**Set Environment Secrets:**

```bash
# Required for authentication
supabase secrets set SUPABASE_URL=https://hoyckjjbulqfnzumiasf.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Optional - for AI scanner (get free key from https://ai.google.dev/)
supabase secrets set GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. Verify Edge Function is Running

Test the health endpoint in your browser:

```
https://hoyckjjbulqfnzumiasf.supabase.co/functions/v1/analyze-waste/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-14T...",
  "message": "GreenPath server is running"
}
```

If this fails, the edge function is not deployed or has errors.

### 3. Enable CORS in Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `hoyckjjbulqfnzumiasf`
3. Navigate to **Settings** > **API**
4. Under **API Settings**, verify CORS is enabled for your domain

## 🎯 How to Use the App

### Adding a Waste Location

1. **Navigate to "Add Waste"** in the sidebar
2. **Select waste type** (batteries, plastic, electronics, etc.)
3. **Fill in details:**
   - Title: e.g., "5 Car Batteries"
   - Location: e.g., "Connaught Place, New Delhi"
   - Description (optional)
   - Photo (optional)
4. **Click "Add to Map"**
5. ✅ **The map will automatically refresh** and show your new pin!

### Using the AI Scanner (Optional)

1. **Get a free Gemini API key** from [Google AI Studio](https://ai.google.dev/)
2. **Set the secret** (see step 1 above)
3. **Navigate to "AI Scanner"** in the sidebar
4. **Upload or take a photo** of any waste item
5. **Click "Analyze with AI"**
6. Get instant recycling guidance!

**Note:** If Gemini API key is not configured, the scanner will use demo mode with sample data.

### Viewing the Map

1. **Navigate to "Map View"** in the sidebar
2. **See all waste locations** with color-coded pins
3. **Click any pin** to see details
4. **Use "My Location"** button to center on your GPS position
5. **Click "Refresh"** to manually reload posts

## 🐛 Troubleshooting

### Still seeing "Failed to fetch" error?

**Check Console Logs:**

Open browser DevTools (F12) > Console and look for:

```
[ADD WASTE] Starting submission
[ADD WASTE] Session present: true
[ADD WASTE] Access token present: true
[ADD WASTE] Calling API: https://hoyckjjbulqfnzumiasf.supabase.co/...
```

**Common Issues:**

| Issue | Solution |
|-------|----------|
| `Session present: false` | Log out and log back in |
| `Access token present: false` | Re-authenticate |
| `Network error: Unable to connect` | Edge function not deployed - see step 1 |
| `Status: 401` | Invalid credentials - check secrets |
| `Status: 500` | Server error - check Edge Function logs |

### Check Edge Function Logs

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Edge Functions** > **analyze-waste**
4. Click **Logs** tab
5. Look for errors in real-time

### Re-deploy Edge Function

If the function has errors:

```bash
# Re-deploy with verbose logging
supabase functions deploy analyze-waste --debug
```

## 📍 GPS Location

The app automatically tries to get your GPS location for accurate pinning.

**Browser Permissions:**
- Click **Allow** when browser asks for location permission
- If denied, the app uses approximate India coordinates
- You'll see a status indicator showing GPS accuracy

## 🗺️ Map Features

### Color-Coded Pins

- 🟡 **Yellow** - Batteries
- 🔵 **Blue** - Plastic
- 🟣 **Purple** - Electronics
- 🟠 **Orange** - Oil
- ⚫ **Gray** - Metal
- 🟢 **Green** - Glass
- 🟣 **Purple** - Paper
- 🟢 **Lime** - Organic
- 🔴 **Red** - Hazardous

### Interactive Features

- Click pins to see details
- Zoom in/out with scroll
- Pan by dragging
- Auto-fit to show all pins
- Real-time updates when new posts are added

## 🔐 Privacy & Security

- All data is stored in your Supabase database
- GPS coordinates are used only for map display
- Only you can delete your own posts
- User authentication via Supabase Auth

## ✨ Features Overview

### ✅ Working Features

- [x] User signup and login
- [x] Add waste locations with GPS
- [x] Interactive Leaflet map
- [x] Color-coded waste type markers
- [x] Photo upload for waste items
- [x] AI recycling scanner (with Gemini API)
- [x] Demo mode (without Gemini API)
- [x] Real-time map updates
- [x] Waste hotspot analysis
- [x] Delete own posts
- [x] Mobile responsive design
- [x] Beautiful animations with Motion

### 🎨 Design System

**Colors:**
- Primary Blue: `#3C91E6`
- Primary Green: `#A2D729`
- Dark Gray: `#342E37`
- Off-White: `#FAFFFD`

**Font:**
- Google Sans (throughout)

## 📱 Mobile Experience

The app is fully responsive:
- Touch-friendly controls
- Mobile camera integration
- GPS auto-detection
- Optimized map interactions
- Collapsible sidebar

## 🆘 Need Help?

### Where to Get Service Role Key

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select project: `hoyckjjbulqfnzumiasf`
3. Navigate to **Settings** > **API**
4. Find **Project API keys** section
5. Copy the `service_role` key (⚠️ Keep this secret!)

### Where to Get Gemini API Key (Optional)

1. Go to [Google AI Studio](https://ai.google.dev/)
2. Click **Get API Key**
3. Create a new API key
4. Copy and set as secret (see step 1)
5. Free tier includes generous limits

### Test Individual Endpoints

**Get all waste posts:**
```bash
curl https://hoyckjjbulqfnzumiasf.supabase.co/functions/v1/analyze-waste/waste-posts
```

**Create waste post:**
```bash
curl -X POST \
  https://hoyckjjbulqfnzumiasf.supabase.co/functions/v1/analyze-waste/waste-posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "type": "plastic",
    "title": "Test Waste",
    "location": "Test Location",
    "latitude": 28.6139,
    "longitude": 77.2090
  }'
```

## 🎉 Success Checklist

Before reporting issues, verify:

- [ ] Edge function deployed successfully
- [ ] Health endpoint returns "ok"
- [ ] Environment secrets are set
- [ ] Can access Supabase dashboard
- [ ] Browser allows location access
- [ ] No CORS errors in console
- [ ] Logged in with valid account

---

**Your GreenPath app is ready to revolutionize waste management in India! 🌱♻️**
