import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { MapPin, Battery, Trash2, Package, Droplet, RefreshCw, Locate, Navigation } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';
import { Button } from './ui/button';
import L from 'leaflet';

// Fix Leaflet's default icon path issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '',
  iconUrl: '',
  shadowUrl: '',
});

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

export function LeafletMapView() {
  const [wastePosts, setWastePosts] = useState<WastePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const userMarkerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    loadWastePosts();
    getUserLocation();
    
    // Listen for new waste posts being added
    const handleWastePostAdded = () => {
      console.log('[LEAFLET MAP] New waste post detected, refreshing...');
      loadWastePosts();
    };
    
    window.addEventListener('wastePostAdded', handleWastePostAdded);
    
    return () => {
      window.removeEventListener('wastePostAdded', handleWastePostAdded);
    };
  }, []);

  useEffect(() => {
    if (mapRef.current && !leafletMapRef.current) {
      initializeMap();
    }
  }, [userLocation]);

  useEffect(() => {
    if (leafletMapRef.current && wastePosts.length > 0) {
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
          toast.success('Location detected');
        },
        () => {
          // Default to center of India if geolocation fails
          setUserLocation({ lat: 20.5937, lng: 78.9629 });
          toast.info('Using default location (India)');
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
      console.log('[LEAFLET MAP] Loading waste posts');
      
      const apiUrl = `https://${projectId}.supabase.co/functions/v1/analyze-waste/waste-posts`;
      console.log('[LEAFLET MAP] Calling API:', apiUrl);
      
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      console.log('[LEAFLET MAP] Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[LEAFLET MAP] API error response:', errorText);
        
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
      console.log('[LEAFLET MAP] Loaded', data.posts?.length || 0, 'posts');

      setWastePosts(data.posts || []);
      toast.success(`Loaded ${data.posts?.length || 0} waste locations`);
    } catch (error: any) {
      console.error('[LEAFLET MAP] Error loading waste posts:', error);
      toast.error(`Failed to load waste posts: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const initializeMap = () => {
    if (!mapRef.current || leafletMapRef.current) return;

    const center = userLocation || { lat: 20.5937, lng: 78.9629 };

    // Create map
    leafletMapRef.current = L.map(mapRef.current).setView([center.lat, center.lng], 5);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(leafletMapRef.current);

    // Add user location marker
    if (userLocation) {
      const userIcon = L.divIcon({
        className: 'custom-user-marker',
        html: `
          <div style="
            width: 20px;
            height: 20px;
            background: #3C91E6;
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          "></div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
        icon: userIcon,
      })
        .addTo(leafletMapRef.current)
        .bindPopup('<strong>Your Location</strong>');
    }

    updateMarkers();
  };

  const getMarkerColor = (type: string): string => {
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
    return colors[type] || colors.other;
  };

  const getMarkerIcon = (type: string) => {
    const color = getMarkerColor(type);
    
    return L.divIcon({
      className: 'custom-waste-marker',
      html: `
        <div style="position: relative;">
          <svg width="32" height="42" viewBox="0 0 32 42" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
            <path d="M16 0C7.163 0 0 7.163 0 16c0 12 16 26 16 26s16-14 16-26c0-8.837-7.163-16-16-16z" 
                  fill="${color}" 
                  stroke="white" 
                  stroke-width="2"/>
            <circle cx="16" cy="16" r="6" fill="white" opacity="0.9"/>
          </svg>
          <div style="
            position: absolute;
            top: 8px;
            left: 50%;
            transform: translateX(-50%);
            width: 16px;
            height: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            ${getIconSVG(type)}
          </div>
        </div>
      `,
      iconSize: [32, 42],
      iconAnchor: [16, 42],
      popupAnchor: [0, -42],
    });
  };

  const getIconSVG = (type: string): string => {
    const iconMap: Record<string, string> = {
      batteries: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="6" width="18" height="12" rx="2" ry="2"/><line x1="23" y1="13" x2="23" y2="11"/></svg>',
      plastic: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>',
      electronics: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
      oil: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>',
      default: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    };
    return iconMap[type] || iconMap.default;
  };

  const updateMarkers = () => {
    if (!leafletMapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Create new markers
    const bounds = L.latLngBounds([]);
    let hasValidMarkers = false;

    wastePosts.forEach((post) => {
      if (post.latitude && post.longitude && leafletMapRef.current) {
        const marker = L.marker([post.latitude, post.longitude], {
          icon: getMarkerIcon(post.type),
        }).addTo(leafletMapRef.current);

        // Create popup content
        const popupContent = `
          <div style="min-width: 200px; font-family: 'Google Sans', sans-serif;">
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
        `;

        marker.bindPopup(popupContent);

        markersRef.current.push(marker);
        bounds.extend([post.latitude, post.longitude]);
        hasValidMarkers = true;
      }
    });

    // Fit bounds to show all markers
    if (hasValidMarkers) {
      if (userLocation) {
        bounds.extend([userLocation.lat, userLocation.lng]);
      }
      leafletMapRef.current.fitBounds(bounds, { padding: [50, 50] });
    } else if (userLocation) {
      leafletMapRef.current.setView([userLocation.lat, userLocation.lng], 5);
    }
  };

  const centerOnUser = () => {
    if (leafletMapRef.current && userLocation) {
      leafletMapRef.current.setView([userLocation.lat, userLocation.lng], 12, {
        animate: true,
      });
      if (userMarkerRef.current) {
        userMarkerRef.current.openPopup();
      }
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

      {/* Leaflet Map Container */}
      <motion.div
        className="bg-white rounded-2xl shadow-2xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative">
          <div ref={mapRef} className="h-[600px] w-full z-0" />
          
          {/* Loading overlay */}
          {loading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-12 h-12 border-4 border-[#3C91E6] border-t-transparent rounded-full"
              />
            </div>
          )}

          {/* Empty state */}
          {!loading && wastePosts.length === 0 && leafletMapRef.current && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="text-center bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
                <MapPin className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-[#342E37] mb-2">No Waste Posts Yet</h3>
                <p className="text-[#342E37]/60">
                  Add your first waste location to see it on the map
                </p>
              </div>
            </div>
          )}
        </div>

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
            Click on any marker to see waste details • {wastePosts.length} locations shown • Powered by OpenStreetMap
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
        <h3 className="text-xl font-bold mb-2">🗺️ Real-Time Interactive Map</h3>
        <p className="text-white/90 text-sm mb-3">
          This map uses Leaflet and OpenStreetMap to display actual waste locations across India.
          Click on any pin to see details and coordinate with your community - completely free and open-source!
        </p>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="bg-white/20 px-3 py-1 rounded-full">Interactive Pins</span>
          <span className="bg-white/20 px-3 py-1 rounded-full">GPS Coordinates</span>
          <span className="bg-white/20 px-3 py-1 rounded-full">Real-time Updates</span>
          <span className="bg-white/20 px-3 py-1 rounded-full">No API Key Required</span>
        </div>
      </motion.div>
    </div>
  );
}