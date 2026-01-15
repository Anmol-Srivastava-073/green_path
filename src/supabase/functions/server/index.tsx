import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Initialize Supabase client with service role key for admin operations
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

console.log('=== SERVER INITIALIZATION ===');
console.log('Supabase URL:', supabaseUrl ? 'SET' : 'MISSING');
console.log('Service Role Key:', supabaseServiceKey ? 'SET' : 'MISSING');

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('CRITICAL: Missing Supabase credentials!');
  throw new Error('Missing required environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Bucket name for waste images
const BUCKET_NAME = 'make-2994acb6-waste-images';

// Initialize storage bucket on startup
async function initStorage() {
  try {
    console.log('Initializing storage bucket:', BUCKET_NAME);
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return;
    }
    
    const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);
    
    if (!bucketExists) {
      console.log('Creating new bucket:', BUCKET_NAME);
      const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: false,
        fileSizeLimit: 5242880, // 5MB
      });
      
      if (createError) {
        console.error('Error creating bucket:', createError);
      } else {
        console.log(`Successfully created bucket: ${BUCKET_NAME}`);
      }
    } else {
      console.log('Bucket already exists:', BUCKET_NAME);
    }
  } catch (error) {
    console.error('Storage initialization error:', error);
  }
}

// Initialize on startup
initStorage();

// Enable logger with detailed output
app.use('*', logger((str, ...rest) => {
  console.log('[REQUEST]', str, ...rest);
}));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);

// Health check endpoint
app.get("/analyze-waste/health", (c) => {
  console.log('[HEALTH CHECK] Request received');
  return c.json({ 
    status: "ok",
    timestamp: new Date().toISOString(),
    message: "GreenPath server is running"
  });
});

// User signup endpoint
app.post("/analyze-waste/signup", async (c) => {
  console.log('[SIGNUP] Request received');
  try {
    const body = await c.req.json();
    const { email, password, name } = body;

    console.log('[SIGNUP] Email:', email);

    if (!email || !password) {
      console.error('[SIGNUP] Missing email or password');
      return c.json({ error: 'Email and password are required' }, 400);
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name: name || '' },
      email_confirm: true, // Auto-confirm email since email server hasn't been configured
    });

    if (error) {
      console.error('[SIGNUP] Supabase auth error:', error);
      return c.json({ error: error.message }, 400);
    }

    console.log('[SIGNUP] User created successfully:', data.user.id);
    return c.json({ success: true, user: data.user });
  } catch (error: any) {
    console.error('[SIGNUP] Unexpected error:', error);
    return c.json({ error: error.message || 'Failed to create user' }, 500);
  }
});

// Get all waste posts
app.get("/analyze-waste/waste-posts", async (c) => {
  console.log('[GET WASTE POSTS] Request received');
  try {
    const posts = await kv.getByPrefix('waste_post_');
    console.log('[GET WASTE POSTS] Found', posts.length, 'posts');
    return c.json({ posts });
  } catch (error: any) {
    console.error('[GET WASTE POSTS] Error:', error);
    return c.json({ error: error.message || 'Failed to fetch waste posts' }, 500);
  }
});

// Create a new waste post
app.post("/analyze-waste/waste-posts", async (c) => {
  console.log('[CREATE WASTE POST] Request received');
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    console.log('[CREATE WASTE POST] Access token present:', !!accessToken);
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError) {
      console.error('[CREATE WASTE POST] Auth error:', authError);
      return c.json({ error: 'Authentication failed: ' + authError.message }, 401);
    }

    if (!user?.id) {
      console.error('[CREATE WASTE POST] No user ID found');
      return c.json({ error: 'Unauthorized - please log in' }, 401);
    }

    console.log('[CREATE WASTE POST] User authenticated:', user.id);

    const body = await c.req.json();
    const { type, title, location, description, latitude, longitude, imageData } = body;

    console.log('[CREATE WASTE POST] Data:', { type, title, location, hasImage: !!imageData });

    if (!type || !title || !location) {
      console.error('[CREATE WASTE POST] Missing required fields');
      return c.json({ error: 'Missing required fields: type, title, location' }, 400);
    }

    const postId = `waste_post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log('[CREATE WASTE POST] Generated post ID:', postId);
    
    let imageUrl = null;

    // Upload image if provided
    if (imageData) {
      console.log('[CREATE WASTE POST] Processing image upload');
      try {
        // Convert base64 to blob
        const base64Data = imageData.split(',')[1] || imageData;
        const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
        
        const fileName = `${postId}.jpg`;
        console.log('[CREATE WASTE POST] Uploading image:', fileName);
        
        const { error: uploadError } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(fileName, binaryData, {
            contentType: 'image/jpeg',
            upsert: true,
          });

        if (uploadError) {
          console.error('[CREATE WASTE POST] Image upload error:', uploadError);
        } else {
          console.log('[CREATE WASTE POST] Image uploaded successfully');
          // Get signed URL for the image
          const { data: urlData, error: urlError } = await supabase.storage
            .from(BUCKET_NAME)
            .createSignedUrl(fileName, 60 * 60 * 24 * 365); // 1 year expiry
          
          if (urlError) {
            console.error('[CREATE WASTE POST] Error creating signed URL:', urlError);
          } else {
            imageUrl = urlData?.signedUrl || null;
            console.log('[CREATE WASTE POST] Signed URL created');
          }
        }
      } catch (imgError: any) {
        console.error('[CREATE WASTE POST] Image processing error:', imgError);
        // Continue without image if upload fails
      }
    }

    const wastePost = {
      id: postId,
      type,
      title,
      location,
      description: description || '',
      latitude: latitude || null,
      longitude: longitude || null,
      imageUrl,
      userId: user.id,
      userEmail: user.email,
      userName: user.user_metadata?.name || 'Anonymous',
      createdAt: new Date().toISOString(),
    };

    console.log('[CREATE WASTE POST] Saving to KV store');
    await kv.set(postId, wastePost);
    console.log('[CREATE WASTE POST] Post saved successfully');

    return c.json({ success: true, post: wastePost });
  } catch (error: any) {
    console.error('[CREATE WASTE POST] Unexpected error:', error);
    return c.json({ error: error.message || 'Failed to create waste post' }, 500);
  }
});

// Delete a waste post
app.delete("/analyze-waste/waste-posts/:id", async (c) => {
  console.log('[DELETE WASTE POST] Request received');
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user?.id) {
      console.error('[DELETE WASTE POST] Auth error:', authError);
      return c.json({ error: 'Unauthorized - please log in' }, 401);
    }

    const postId = c.req.param('id');
    console.log('[DELETE WASTE POST] Post ID:', postId, 'User:', user.id);
    
    const post = await kv.get(postId);

    if (!post) {
      console.error('[DELETE WASTE POST] Post not found:', postId);
      return c.json({ error: 'Post not found' }, 404);
    }

    // Verify user owns this post
    if (post.userId !== user.id) {
      console.error('[DELETE WASTE POST] Unauthorized - not post owner');
      return c.json({ error: 'Unauthorized - you can only delete your own posts' }, 403);
    }

    // Delete image from storage if exists
    if (post.imageUrl) {
      try {
        const fileName = `${postId}.jpg`;
        console.log('[DELETE WASTE POST] Deleting image:', fileName);
        await supabase.storage.from(BUCKET_NAME).remove([fileName]);
      } catch (imgError) {
        console.error('[DELETE WASTE POST] Image deletion error:', imgError);
      }
    }

    console.log('[DELETE WASTE POST] Deleting from KV store');
    await kv.del(postId);
    console.log('[DELETE WASTE POST] Post deleted successfully');

    return c.json({ success: true });
  } catch (error: any) {
    console.error('[DELETE WASTE POST] Unexpected error:', error);
    return c.json({ error: error.message || 'Failed to delete waste post' }, 500);
  }
});

// Upload image endpoint (for scanner)
app.post("/analyze-waste/upload-image", async (c) => {
  console.log('[UPLOAD IMAGE] Request received');
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user?.id) {
      console.error('[UPLOAD IMAGE] Auth error:', authError);
      return c.json({ error: 'Unauthorized - please log in' }, 401);
    }

    const body = await c.req.json();
    const { imageData } = body;

    if (!imageData) {
      console.error('[UPLOAD IMAGE] No image data provided');
      return c.json({ error: 'No image data provided' }, 400);
    }

    const imageId = `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fileName = `${imageId}.jpg`;
    console.log('[UPLOAD IMAGE] Uploading:', fileName);

    // Convert base64 to blob
    const base64Data = imageData.split(',')[1] || imageData;
    const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, binaryData, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (uploadError) {
      console.error('[UPLOAD IMAGE] Upload error:', uploadError);
      return c.json({ error: 'Failed to upload image: ' + uploadError.message }, 500);
    }

    // Get signed URL
    const { data: urlData, error: urlError } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(fileName, 60 * 60 * 24 * 365); // 1 year expiry

    if (urlError) {
      console.error('[UPLOAD IMAGE] Error creating signed URL:', urlError);
      return c.json({ error: 'Failed to create signed URL: ' + urlError.message }, 500);
    }

    console.log('[UPLOAD IMAGE] Upload successful');
    return c.json({
      success: true,
      imageUrl: urlData?.signedUrl,
      imageId,
    });
  } catch (error: any) {
    console.error('[UPLOAD IMAGE] Unexpected error:', error);
    return c.json({ error: error.message || 'Failed to upload image' }, 500);
  }
});

// Analyze image with Gemini AI
app.post("/analyze-waste/analyze-waste", async (c) => {
  console.log('[ANALYZE WASTE] Request received');
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user?.id) {
      console.error('[ANALYZE WASTE] Auth error:', authError);
      return c.json({ error: 'Unauthorized - please log in' }, 401);
    }

    console.log('[ANALYZE WASTE] User authenticated:', user.id);

    const body = await c.req.json();
    const { imageData } = body;

    if (!imageData) {
      console.error('[ANALYZE WASTE] No image data provided');
      return c.json({ error: 'No image data provided' }, 400);
    }

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    
    console.log('[ANALYZE WASTE] Gemini API key present:', !!geminiApiKey);

    if (!geminiApiKey) {
      console.error('[ANALYZE WASTE] Gemini API key not configured');
      return c.json({ 
        error: 'Gemini API not configured. Please add your GEMINI_API_KEY.',
        useMock: true 
      }, 400);
    }

    // Remove data URL prefix if present
    const base64Data = imageData.includes(',') ? imageData.split(',')[1] : imageData;

    console.log('[ANALYZE WASTE] Calling Gemini API');

    // Call Gemini Vision API
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;
    
    const prompt = `You are an expert waste management and recycling advisor for India. Analyze this image and provide:

1. Identify the item in the image
2. Determine if it's recyclable (true/false)
3. Specify the correct bin type for disposal in India (e.g., "Blue Recycling Bin", "Green Wet Waste", "Black Dry Waste", "Red Hazardous Waste", "Compost", etc.)
4. Provide 3-4 specific, actionable tips for proper disposal or recycling

Respond ONLY with valid JSON in this exact format:
{
  "recyclable": true/false,
  "itemName": "name of the item",
  "binType": "specific bin type",
  "tips": ["tip 1", "tip 2", "tip 3"]
}`;

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: base64Data
              }
            }
          ]
        }]
      })
    });

    console.log('[ANALYZE WASTE] Gemini API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[ANALYZE WASTE] Gemini API error:', errorText);
      return c.json({ 
        error: 'Failed to analyze image with Gemini AI. Status: ' + response.status,
        details: errorText,
        useMock: true 
      }, 500);
    }

    const geminiResult = await response.json();
    console.log('[ANALYZE WASTE] Gemini response received');
    
    // Extract the text response from Gemini
    const textResponse = geminiResult?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!textResponse) {
      console.error('[ANALYZE WASTE] No text response from Gemini:', JSON.stringify(geminiResult));
      return c.json({ error: 'No response from Gemini AI', useMock: true }, 500);
    }

    console.log('[ANALYZE WASTE] Gemini text response:', textResponse);

    // Parse the JSON response from Gemini
    let analysisResult;
    try {
      // Clean the response (remove markdown code blocks if present)
      const cleanedResponse = textResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      analysisResult = JSON.parse(cleanedResponse);
      console.log('[ANALYZE WASTE] Analysis result parsed successfully');
    } catch (parseError) {
      console.error('[ANALYZE WASTE] Failed to parse Gemini response:', textResponse);
      return c.json({ 
        error: 'Failed to parse AI response', 
        rawResponse: textResponse,
        useMock: true 
      }, 500);
    }

    return c.json({
      success: true,
      result: analysisResult
    });

  } catch (error: any) {
    console.error('[ANALYZE WASTE] Unexpected error:', error);
    return c.json({ 
      error: error.message || 'Failed to analyze waste',
      details: error.stack,
      useMock: true 
    }, 500);
  }
});

// Global error handler
app.onError((err, c) => {
  console.error('[GLOBAL ERROR]', err);
  return c.json({
    error: 'Internal server error',
    message: err.message,
    timestamp: new Date().toISOString()
  }, 500);
});

console.log('=== SERVER CONFIGURED - STARTING ===');
Deno.serve(app.fetch);