import { useEffect, useState } from 'react';
import { LeafletMapView } from './LeafletMapView';

export function MapLoader() {
  // Directly use Leaflet map (no API key needed)
  return <LeafletMapView />;
}