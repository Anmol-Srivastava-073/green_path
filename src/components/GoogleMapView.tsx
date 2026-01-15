import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { MapPin, Battery, Trash2, Package, Droplet, RefreshCw, Locate } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';
import { Button } from './ui/button';

interface WastePost {
  id: string;
  type: string;
  title: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  userName: string;
  description?: string;
}

// Add this script to your HTML head or load dynamically
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY"></script>

export function GoogleMapView() {
  const [wastePosts, setWastePosts] = useState<WastePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    loadWastePosts();
    getUserLocation();
  }, []);

  useEffect(() => {
    if (wastePosts.length > 0 && mapRef.current && !googleMapRef.current) {
      initializeMap();
    } else if (wastePosts.length > 0 && googleMapRef.current) {
      updateMarkers();
    }
  }, [wastePosts]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // Default to center of India if geolocation fails
          setUserLocation({ lat: 20.5937, lng: 78.9629 });
        }
      );
    } else {
      // Default to center of India
      setUserLocation({ lat: 20.5937, lng: 78.9629 });
    }
  };

  const loadWastePosts = async () => {
    setLoading(true);
    try {
      console.log('[MAP VIEW] Loading waste posts');
      
      const apiUrl = `https://${projectId}.supabase.co/functions/v1/analyze-waste/waste-posts`;
      console.log('[MAP VIEW] Calling API:', apiUrl);
      
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      console.log('[MAP VIEW] Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[MAP VIEW] API error response:', errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText };
        }
        
        toast.error(errorData.error || `Failed to load waste posts (Status: ${response.status})`);
        return;
      }

      const data = await response.json();
      console.log('[MAP VIEW] Loaded', data.posts?.length || 0, 'posts');

      setWastePosts(data.posts || []);
      toast.success(`Loaded ${data.posts?.length || 0} waste locations`);
    } catch (error: any) {
      console.error('[MAP VIEW] Error loading waste posts:', error);
      toast.error(`Failed to load waste posts: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const initializeMap = () => {
    if (!mapRef.current || !window.google) {
      console.error('Google Maps not loaded or map container not ready');
      return;
    }

    const center = userLocation || { lat: 20.5937, lng: 78.9629 };

    googleMapRef.current = new google.maps.Map(mapRef.current, {
      center,
      zoom: 5,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }],
        },
      ],
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: true,
    });

    // Add user location marker
    if (userLocation) {
      new google.maps.Marker({
        position: userLocation,
        map: googleMapRef.current,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#3C91E6',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 2,
        },
        title: 'Your Location',
      });
    }

    updateMarkers();
  };

  const getMarkerIcon = (type: string) => {
    const colors: Record<string, string> = {
      batteries: '#EAB308',
      plastic: '#3B82F6',
      electronics: '#A855F7',
      oil: '#F97316',
      metal: '#6B7280',
      glass: '#10B981',
      paper: '#8B5CF6',
      organic: '#84CC16',
      hazardous: '#EF4444',
      other: '#3C91E6',
    };

    return {
      path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
      fillColor: colors[type] || colors.other,
      fillOpacity: 1,
      strokeColor: '#FFFFFF',
      strokeWeight: 2,
      scale: 2,
      anchor: new google.maps.Point(12, 24),
    };
  };

  const updateMarkers = () => {
    if (!googleMapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // Create new markers
    wastePosts.forEach((post) => {
      if (post.latitude && post.longitude && googleMapRef.current) {
        const marker = new google.maps.Marker({
          position: { lat: post.latitude, lng: post.longitude },
          map: googleMapRef.current,
          title: post.title,
          icon: getMarkerIcon(post.type),
          animation: google.maps.Animation.DROP,
        });

        // Create info window
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 12px; max-width: 250px;">
              <h3 style="font-weight: bold; font-size: 16px; margin: 0 0 8px 0; color: #342E37;">
                ${post.title}
              </h3>
              <p style="margin: 4px 0; font-size: 14px; color: #6B7280;">
                <strong>Type:</strong> ${post.type}
              </p>
              <p style="margin: 4px 0; font-size: 14px; color: #6B7280;">
                <strong>Location:</strong> ${post.location}
              </p>
              ${post.description ? `
                <p style="margin: 4px 0; font-size: 14px; color: #6B7280;">
                  <strong>Details:</strong> ${post.description}
                </p>
              ` : ''}
              <p style="margin: 8px 0 0 0; font-size: 12px; color: #3C91E6;">
                Posted by ${post.userName}
              </p>
            </div>
          `,
        });

        marker.addListener('click', () => {
          infoWindow.open(googleMapRef.current!, marker);
        });

        markersRef.current.push(marker);
      }
    });

    // Fit bounds to show all markers
    if (markersRef.current.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      markersRef.current.forEach((marker) => {
        const position = marker.getPosition();
        if (position) bounds.extend(position);
      });
      if (userLocation) bounds.extend(userLocation);
      googleMapRef.current.fitBounds(bounds);
    }
  };

  const centerOnUser = () => {
    if (googleMapRef.current && userLocation) {
      googleMapRef.current.panTo(userLocation);
      googleMapRef.current.setZoom(12);
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'batteries':
        return { bg: 'bg-yellow-500', text: 'text-yellow-700' };
      case 'plastic':
        return { bg: 'bg-blue-500', text: 'text-blue-700' };
      case 'electronics':
        return { bg: 'bg-purple-500', text: 'text-purple-700' };
      case 'oil':
        return { bg: 'bg-orange-500', text: 'text-orange-700' };
      case 'metal':
        return { bg: 'bg-gray-500', text: 'text-gray-700' };
      case 'glass':
        return { bg: 'bg-green-500', text: 'text-green-700' };
      case 'paper':
        return { bg: 'bg-purple-600', text: 'text-purple-700' };
      case 'organic':
        return { bg: 'bg-lime-500', text: 'text-lime-700' };
      case 'hazardous':
        return { bg: 'bg-red-500', text: 'text-red-700' };
      default:
        return { bg: 'bg-[#3C91E6]', text: 'text-blue-700' };
    }
  };

  // Check if Google Maps is loaded
  const isGoogleMapsLoaded = typeof window !== 'undefined' && window.google;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <div>
          <h2 className="text-3xl font-bold text-[#342E37] mb-2">
            Waste Location Map
          </h2>
          <p className="text-[#342E37]/60">
            Interactive map showing all waste collection points in India
          </p>
        </div>
        <div className="flex gap-2">
          {userLocation && (
            <Button
              onClick={centerOnUser}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Locate className="w-4 h-4" />
              My Location
            </Button>
          )}
          <Button
            onClick={loadWastePosts}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </motion.div>

      {/* Google Maps Container */}
      <motion.div
        className="bg-white rounded-2xl shadow-2xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        {!isGoogleMapsLoaded ? (
          <div className="h-[600px] flex items-center justify-center bg-gradient-to-br from-[#e8f7ff] via-[#FAFFFD] to-[#f0ffd9]">
            <div className="text-center p-8">
              <MapPin className="w-16 h-16 mx-auto text-[#3C91E6] mb-4" />
              <h3 className="text-xl font-bold text-[#342E37] mb-2">
                Google Maps API Required
              </h3>
              <p className="text-[#342E37]/60 mb-4">
                To enable interactive mapping, add your Google Maps API key.
              </p>
              <a
                href="https://developers.google.com/maps/documentation/javascript/get-api-key"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gradient-to-r from-[#3C91E6] to-[#A2D729] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Get API Key
              </a>
            </div>
          </div>
        ) : (
          <div ref={mapRef} className="h-[600px] w-full" />
        )}

        {/* Legend */}
        <div className="border-t border-[#342E37]/10 p-4 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex flex-wrap gap-4 items-center justify-center">
            <div className="text-sm font-semibold text-[#342E37]">Waste Types:</div>
            {[
              { type: 'batteries', label: 'Batteries' },
              { type: 'plastic', label: 'Plastic' },
              { type: 'electronics', label: 'Electronics' },
              { type: 'oil', label: 'Oil' },
              { type: 'metal', label: 'Metal' },
              { type: 'glass', label: 'Glass' },
            ].map((item) => {
              const color = getColor(item.type);
              return (
                <motion.div
                  key={item.type}
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.1 }}
                >
                  <div className={`${color.bg} w-4 h-4 rounded-full shadow-md`} />
                  <span className="text-sm text-[#342E37]/80">{item.label}</span>
                </motion.div>
              );
            })}
          </div>
          <div className="text-center mt-3 text-xs text-[#342E37]/50">
            Click on any marker to see waste details • {wastePosts.length} locations shown
          </div>
        </div>
      </motion.div>

      {/* Info Card */}
      <motion.div
        className="bg-gradient-to-r from-[#3C91E6] to-[#A2D729] text-white p-6 rounded-2xl shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-xl font-bold mb-2">🗺️ Real-Time Google Maps Integration</h3>
        <p className="text-white/90 text-sm mb-3">
          This map uses Google Maps Platform to display actual waste locations across India.
          Click on any pin to see details, get directions, and coordinate with your community.
        </p>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="bg-white/20 px-3 py-1 rounded-full">Interactive Pins</span>
          <span className="bg-white/20 px-3 py-1 rounded-full">GPS Coordinates</span>
          <span className="bg-white/20 px-3 py-1 rounded-full">Real-time Updates</span>
          <span className="bg-white/20 px-3 py-1 rounded-full">Clustering Support</span>
        </div>
      </motion.div>
    </div>
  );
}