# ⚡ GreenPath Quick Start Guide

## 🚨 Fix "Failed to Fetch" Error NOW

The error happens because the Supabase Edge Function isn't deployed. Here's the fix:

### Step 1: Deploy Edge Function (Required)

```bash
# Login to Supabase
supabase login

# Link your project
supabase link --project-ref hoyckjjbulqfnzumiasf

# Deploy the function
supabase functions deploy analyze-waste
```

### Step 2: Set Secrets (Required)

```bash
# Get your Service Role Key from Supabase Dashboard > Settings > API
supabase secrets set SUPABASE_URL=https://hoyckjjbulqfnzumiasf.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### Step 3: Test It Works

Open in browser:
```
https://hoyckjjbulqfnzumiasf.supabase.co/functions/v1/analyze-waste/health
```

Should return:
```json
{"status": "ok", "timestamp": "...", "message": "GreenPath server is running"}
```

## ✅ That's It!

Now try adding a waste location - it should work! 🎉

---

## 🎨 Optional: Enable Gemini AI Scanner

Want the AI scanner to work?

```bash
# Get free API key from https://ai.google.dev/
supabase secrets set GEMINI_API_KEY=your_gemini_key_here
```

**Note:** Scanner works in demo mode without this key!

---

## 🗺️ How Map Auto-Refresh Works

When you add a waste location:
1. ✅ Form submits successfully
2. ✅ Custom event fires: `wastePostAdded`
3. ✅ Map component listens and auto-refreshes
4. ✅ New pin appears instantly!

**You don't need to manually refresh!**

---

## 🔍 Debug Checklist

Still having issues? Check:

1. **Edge Function Deployed?**
   ```bash
   supabase functions list
   ```
   Should show `analyze-waste`

2. **Secrets Set?**
   ```bash
   supabase secrets list
   ```
   Should show `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`

3. **Logged In?**
   - Try logging out and back in
   - Check browser console for session info

4. **CORS Enabled?**
   - Should be auto-enabled in the Edge Function
   - Check Supabase Dashboard > API Settings

5. **Internet Connection?**
   - Test: `ping supabase.co`

---

## 📋 Common Errors & Fixes

| Error | Fix |
|-------|-----|
| "Network error: Unable to connect" | Deploy edge function (Step 1) |
| "Unauthorized - please log in" | Log out and log back in |
| "Authentication failed" | Re-set secrets (Step 2) |
| "Gemini API not configured" | Normal! Scanner uses demo mode |
| Map doesn't show pins | Wait 2 seconds, auto-refreshes |

---

## 🎯 Where to Find Keys

### Service Role Key
1. [Supabase Dashboard](https://supabase.com/dashboard)
2. Project: `hoyckjjbulqfnzumiasf`
3. Settings > API
4. Copy `service_role` key

### Gemini API Key (Optional)
1. [Google AI Studio](https://ai.google.dev/)
2. Click "Get API Key"
3. Free tier available!

---

## 💡 Pro Tips

- **GPS Location**: Allow browser location for accurate pins
- **Photo Upload**: Works with or without AI scanner
- **Map Markers**: Color-coded by waste type
- **Mobile**: Works perfectly on phones!
- **Offline**: Requires internet to save/load data

---

**Need full documentation?** See `SETUP_INSTRUCTIONS.md`

**Ready to go!** 🚀🌱♻️
