import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, Navigation, MapPin, CheckCircle2, AlertTriangle } from 'lucide-react';
import { api, type LocationResolveResponse } from '@/services/api';

import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

const customIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface LocationMapPickerProps {
  initialLat?: number;
  initialLng?: number;
  onLocationChange: (loc: {
    lat: number;
    lng: number;
    address?: string;
    resolved: LocationResolveResponse | null;
  }) => void;
}

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 13, { duration: 1.2 });
  }, [center, map]);
  return null;
}

function MapClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
}

export const LocationMapPicker: React.FC<LocationMapPickerProps> = ({
  initialLat = 20.0040,
  initialLng = 73.7825,
  onLocationChange
}) => {
  const [position, setPosition] = useState<[number, number]>([initialLat, initialLng]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const [address, setAddress] = useState<string>('Nashik District, Maharashtra, India');
  const [resolvedData, setResolvedData] = useState<LocationResolveResponse | null>(null);
  const [isResolving, setIsResolving] = useState(false);

  const handleCoordinateSelect = async (lat: number, lng: number, customAddr?: string) => {
    const roundLat = Number(lat.toFixed(6));
    const roundLng = Number(lng.toFixed(6));
    setPosition([roundLat, roundLng]);
    setIsResolving(true);
    setGeoError(null);

    let displayAddress = customAddr || address;

    if (!customAddr) {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${roundLat}&lon=${roundLng}`);
        if (res.ok) {
          const data = await res.json();
          displayAddress = data.display_name || `${roundLat}, ${roundLng}`;
        }
      } catch (err) {
        displayAddress = `Coordinates: ${roundLat}, ${roundLng}`;
      }
    }
    setAddress(displayAddress);

    try {
      const resolved = await api.resolveLocation(roundLat, roundLng);
      setResolvedData(resolved);
      onLocationChange({ lat: roundLat, lng: roundLng, address: displayAddress, resolved });
    } catch (err) {
      console.warn('Backend location resolve failed, setting raw coordinates:', err);
      const fallbackResolved: LocationResolveResponse = {
        latitude: roundLat,
        longitude: roundLng,
        coverage: {
          supported: (roundLat >= 19.3 && roundLat <= 21.1 && roundLng >= 73.0 && roundLng <= 75.2),
          region: 'Nashik District',
          message: 'Pilot coverage check completed.'
        }
      };
      setResolvedData(fallbackResolved);
      onLocationChange({ lat: roundLat, lng: roundLng, address: displayAddress, resolved: fallbackResolved });
    } finally {
      setIsResolving(false);
    }
  };

  useEffect(() => {
    handleCoordinateSelect(initialLat, initialLng);
  }, []);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setGeoError(null);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const results = await response.json();
        if (results && results.length > 0) {
          const first = results[0];
          const lat = parseFloat(first.lat);
          const lon = parseFloat(first.lon);
          await handleCoordinateSelect(lat, lon, first.display_name);
        } else {
          setGeoError(`No results found for "${searchQuery}". Please try another landmark or village name.`);
        }
      }
    } catch (err) {
      setGeoError('Address search request failed. Please check internet connection.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        await handleCoordinateSelect(lat, lon);
        setIsLocating(false);
      },
      (err) => {
        setIsLocating(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setGeoError('Location permission denied. Please allow location access in your browser settings.');
            break;
          case err.POSITION_UNAVAILABLE:
            setGeoError('Current location position is unavailable.');
            break;
          case err.TIMEOUT:
            setGeoError('Location request timed out. Please try clicking on the map directly.');
            break;
          default:
            setGeoError('Could not retrieve current location.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-[#6B6B6B]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search village, mandi, landmark, or address (e.g. Lasalgaon, Nashik)..."
            className="w-full pl-10 pr-24 py-3 rounded-2xl bg-[#F5F5F3]/90 border border-[#E2E2DC] font-sans text-xs sm:text-sm text-[#111111] focus:border-[#C9793A] focus:outline-none shadow-xs"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="absolute right-2 top-2 px-3 py-1.5 rounded-xl bg-[#111111] text-white text-xs font-mono-data font-bold hover:bg-[#C9793A] transition-colors disabled:opacity-50"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </form>

        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={isLocating}
          className="px-4 py-3 rounded-2xl bg-[#F5F5F3] border border-[#E2E2DC] text-[#111111] hover:border-[#C9793A] font-mono-data text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs shrink-0"
        >
          <Navigation className={`w-4 h-4 text-[#C9793A] ${isLocating ? 'animate-spin' : ''}`} />
          <span>{isLocating ? 'Locating...' : 'Use My Current Location'}</span>
        </button>
      </div>

      {geoError && (
        <div className="p-3 rounded-xl bg-[#A95743]/10 border border-[#A95743]/30 text-[#A95743] text-xs font-mono-data flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{geoError}</span>
        </div>
      )}

      <div className="rounded-3xl border border-[#E2E2DC] overflow-hidden shadow-lg relative min-h-[340px] sm:min-h-[400px]">
        <MapContainer
          center={position}
          zoom={12}
          scrollWheelZoom={true}
          className="w-full h-[340px] sm:h-[400px] z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapController center={position} />
          <MapClickHandler onClick={(lat, lng) => handleCoordinateSelect(lat, lng)} />
          <Marker
            position={position}
            icon={customIcon}
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                const marker = e.target;
                const newPos = marker.getLatLng();
                handleCoordinateSelect(newPos.lat, newPos.lng);
              }
            }}
          />
        </MapContainer>

        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#E2E2DC] font-mono-data text-[10px] text-[#111111] shadow-md z-10">
          📍 Click map or drag marker to set exact business coordinates
        </div>
      </div>

      <div className="p-6 rounded-2xl apple-card shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#E2E2DC] pb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#C9793A]" />
            <span className="font-display font-bold text-base text-[#111111]">
              Selected Location Confirmation
            </span>
          </div>

          {resolvedData && (
            <span className={`px-3 py-1 rounded-full text-xs font-mono-data font-bold border flex items-center gap-1.5 ${
              resolvedData.coverage.supported
                ? 'bg-[#3F7657]/15 text-[#3F7657] border-[#3F7657]'
                : 'bg-[#C9793A]/15 text-[#C9793A] border-[#C9793A]'
            }`}>
              {resolvedData.coverage.supported ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>VERIFIED PILOT COVERAGE</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>OUTSIDE PILOT COVERAGE</span>
                </>
              )}
            </span>
          )}
        </div>

        <div className="space-y-2 text-xs sm:text-sm">
          <div className="text-[#6B6B6B] leading-relaxed font-sans">
            <strong className="text-[#111111] block mb-0.5">FORMATTED ADDRESS:</strong>
            {isResolving ? 'Resolving administrative context...' : address}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 font-mono-data text-xs">
            <div className="p-2.5 rounded-xl bg-[#F5F5F3]/80 border border-[#E2E2DC]">
              <span className="text-[#6B6B6B] block text-[10px] uppercase">LATITUDE</span>
              <span className="font-bold text-[#111111]">{position[0].toFixed(6)}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#F5F5F3]/80 border border-[#E2E2DC]">
              <span className="text-[#6B6B6B] block text-[10px] uppercase">LONGITUDE</span>
              <span className="font-bold text-[#111111]">{position[1].toFixed(6)}</span>
            </div>
          </div>
        </div>

        {resolvedData?.administrative && (
          <div className="pt-3 border-t border-[#E2E2DC] flex flex-wrap gap-2 text-[11px] font-mono-data">
            {resolvedData.administrative.village && (
              <span className="px-2.5 py-1 rounded-full bg-[#111111] text-white">
                Village: {resolvedData.administrative.village}
              </span>
            )}
            {resolvedData.administrative.taluka && (
              <span className="px-2.5 py-1 rounded-full bg-[#F5F5F3] text-[#111111] border border-[#E2E2DC]">
                Taluka: {resolvedData.administrative.taluka}
              </span>
            )}
            {resolvedData.administrative.district && (
              <span className="px-2.5 py-1 rounded-full bg-[#C9793A]/20 text-[#C9793A] border border-[#C9793A]/40 font-bold">
                District: {resolvedData.administrative.district}
              </span>
            )}
            {resolvedData.administrative.state && (
              <span className="px-2.5 py-1 rounded-full bg-[#F5F5F3] text-[#111111] border border-[#E2E2DC]">
                State: {resolvedData.administrative.state}
              </span>
            )}
          </div>
        )}

        {resolvedData && !resolvedData.coverage.supported && (
          <div className="p-4 rounded-xl bg-[#C9793A]/10 border border-[#C9793A]/30 text-[#111111] text-xs leading-relaxed font-sans space-y-2">
            <div className="font-mono-data font-bold text-[#C9793A] flex items-center gap-1.5 uppercase">
              <AlertTriangle className="w-4 h-4" />
              <span>VyapaarIQ Pilot Coverage Notice</span>
            </div>
            <p>
              Detailed business intelligence and market telemetry are currently verified for <strong>Nashik District, Maharashtra</strong>.
            </p>
            <p className="text-[#6B6B6B]">
              You can still proceed with this location for financing and setup structure, but detailed market, demographic, infrastructure, and competition analysis is not yet available for this location.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
