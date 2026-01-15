# GreenPath Debugging Guide

## Overview
This guide helps you troubleshoot and debug common issues in the GreenPath application.

## Checking Console Logs

All operations now include detailed console logging with prefixes:
- `[AUTH]` - Authentication operations
- `[SCANNER]` - AI waste scanner operations
- `[ADD WASTE]` - Waste post creation
- `[WASTE LIST]` - Waste post listing
- `[MAP VIEW]` - Map view operations
- `[SERVER]` - Backend server operations
- `[CREATE WASTE POST]` - Server-side waste post creation
- `[GET WASTE POSTS]` - Server-side waste post retrieval
- `[ANALYZE WASTE]` - Server-side Gemini AI analysis
- `[SIGNUP]` - Server-side user registration
- `[DELETE WASTE POST]` - Server-side post deletion

## Common Issues and Solutions

### 1. "Failed to fetch" Errors

**Symptoms:**
- All API calls return "Failed to fetch"
- Network errors in console
- Operations fail silently

**Debugging Steps:**
1. Open browser console (F12)
2. Look for error messages with `[COMPONENT NAME]` prefix
3. Check the API URL being called
4. Verify the response status code

**Possible Causes:**
- **Supabase Edge Function not deployed**: The server may not be running yet
- **CORS issues**: Check if proper CORS headers are set
- **Network connectivity**: Check your internet connection
- **Invalid credentials**: Verify Supabase URL and keys

**Solutions:**
```javascript
// Check console for these log messages:
[SERVER] === SERVER INITIALIZATION ===
[SERVER] Supabase URL: SET
[SERVER] Service Role Key: SET
```

If you see "MISSING" for either, the edge function needs environment variables configured.

### 2. Authentication Issues

**Symptoms:**
- Cannot sign up or log in
- "Unauthorized" errors
- Session not persisting

**Debugging Steps:**
1. Check console for `[AUTH]` logs
2. Verify email and password are correct
3. Check if session is being created:
```javascript
[AUTH] Login response: { user: "xxx", session: true }
```

**Solutions:**
- Clear browser storage and try again
- Ensure password meets requirements (min 6 characters)
- Check if email confirmation is enabled in Supabase settings

### 3. Gemini API Not Working

**Symptoms:**
- Scanner falls back to mock data
- "Gemini API not configured" message
- AI analysis fails

**Debugging Steps:**
1. Check server logs for:
```
[ANALYZE WASTE] Gemini API key present: true/false
```

2. Verify API key is set in environment variables
3. Check Gemini API response status

**Solutions:**
- Add GEMINI_API_KEY to Supabase Edge Function secrets
- Get free API key from https://ai.google.dev/
- Check API key has correct permissions
- Verify quota hasn't been exceeded

### 4. Waste Posts Not Appearing

**Symptoms:**
- Empty waste list
- Map shows no markers
- "No waste posts yet" message

**Debugging Steps:**
1. Check console logs:
```javascript
[WASTE LIST] Loaded X posts
[GET WASTE POSTS] Found X posts
```

2. Try adding a test post
3. Check if posts are being saved:
```javascript
[CREATE WASTE POST] Post saved successfully
```

**Possible Causes:**
- KV store not initialized
- Posts not being saved correctly
- Frontend not fetching posts

**Solutions:**
- Refresh the page
- Add a new waste post
- Check server logs for KV store operations

### 5. Image Upload Failures

**Symptoms:**
- Images not showing after upload
- Storage errors in console
- Waste posts created without images

**Debugging Steps:**
1. Check server logs for storage operations:
```
[CREATE WASTE POST] Processing image upload
[CREATE WASTE POST] Image uploaded successfully
[CREATE WASTE POST] Signed URL created
```

2. Verify bucket exists:
```
[SERVER] Bucket already exists: make-2994acb6-waste-images
```

**Solutions:**
- Check image size (max 5MB)
- Verify Supabase storage is enabled
- Check bucket permissions
- Try with a smaller image

## Server Health Check

Test if the server is running:

```bash
# Make a health check request
curl https://[YOUR-PROJECT-ID].supabase.co/functions/v1/analyze-waste/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-01-14T...",
  "message": "GreenPath server is running"
}
```

## Database Inspection

Check KV store directly:
1. Go to Supabase Dashboard
2. Navigate to Table Editor
3. Find `kv_store_2994acb6` table
4. Check for entries with keys starting with `waste_post_`

## Network Request Inspection

1. Open DevTools (F12)
2. Go to Network tab
3. Filter by "fetch" or "XHR"
4. Look for requests to:
   - `/analyze-waste/waste-posts`
   - `/analyze-waste/analyze-waste`
   - `/analyze-waste/signup`

5. Check:
   - Request headers (Authorization token present?)
   - Request payload (correct data format?)
   - Response status (200 = success, 401 = unauthorized, 500 = server error)
   - Response body (error messages?)

## Environment Variables Checklist

Required in Supabase Edge Function:
- ✅ `SUPABASE_URL` (auto-set by Supabase)
- ✅ `SUPABASE_SERVICE_ROLE_KEY` (auto-set by Supabase)
- ⚠️ `GEMINI_API_KEY` (must be set manually for AI features)

## Error Message Reference

| Error Message | Cause | Solution |
|--------------|-------|----------|
| "Failed to fetch" | Network/CORS issue | Check server logs, verify endpoint |
| "Unauthorized - please log in" | No valid session | Log in again |
| "Authentication failed" | Invalid token | Re-authenticate |
| "Missing required fields" | Invalid request data | Check form inputs |
| "Gemini API not configured" | No API key | Add GEMINI_API_KEY |
| "Failed to create waste post" | Server error | Check server logs |
| "Post not found" | Invalid post ID | Verify post exists |

## Best Practices for Debugging

1. **Always check console first** - Logs are detailed and will point you to the issue
2. **Start from the server** - Server logs show what's actually happening
3. **Test incrementally** - Try simple operations first (health check, then basic CRUD)
4. **Clear state** - Sometimes clearing browser storage helps
5. **Check network tab** - See actual request/response data

## Getting Help

If issues persist:
1. Copy relevant console logs
2. Note the exact error message
3. Include:
   - What you were trying to do
   - What happened instead
   - Console logs (with timestamps)
   - Network request details
4. Check if it's a known issue in the documentation

## Success Indicators

You'll know everything is working when you see:
```
[SERVER] === SERVER CONFIGURED - STARTING ===
[AUTH] Login successful
[ADD WASTE] Post created successfully
[WASTE LIST] Loaded X posts
[SCANNER] Using real AI result (if Gemini configured)
```

## Quick Fixes

**App not loading:**
- Refresh the page
- Clear browser cache
- Check browser console for errors

**Can't log in:**
- Verify email/password
- Try signing up again
- Clear browser storage

**Features not working:**
- Check you're logged in
- Verify internet connection
- Look for error toasts
- Check console logs

**Gemini not working:**
- Expected if API key not configured
- App will use mock data instead
- Add GEMINI_API_KEY to enable real AI

## Performance Tips

- Images are compressed and stored in Supabase Storage
- KV store is fast but may have limits
- Map markers are optimized with clustering
- Toast messages provide real-time feedback
