import { useEffect, useRef, useState } from 'react';
import useLocationMonitoring from '../hooks/useLocationMonitoring';
import { LocationSensorType } from '@repo/types';
import 'leaflet/dist/leaflet.css';

export default function LocationMonitoring() {
	const mapRef = useRef<HTMLDivElement>(null);
	const mapInstanceRef = useRef<any>(null);
	const markersRef = useRef<any[]>([]);
	const [isClient, setIsClient] = useState(false);
	const { messages } = useLocationMonitoring();

	// Ensure we're on the client side
	useEffect(() => {
		setIsClient(true);
	}, []);

	useEffect(() => {
		if (!isClient || !mapRef.current || mapInstanceRef.current) return;

		// Dynamically import Leaflet only on the client side
		let map: any;

		const initializeMap = async () => {
			const L = (await import('leaflet')).default;

			// Initialize map
			map = L.map(mapRef.current!).setView([20, 0], 2);

			// Add tile layer
			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '© OpenStreetMap contributors',
				maxZoom: 19
			}).addTo(map);

			mapInstanceRef.current = map;
		};

		initializeMap();

		return () => {
			if (map) {
				map.remove();
				mapInstanceRef.current = null;
			}
		};
	}, [isClient]);

	useEffect(() => {
		if (!isClient || !mapInstanceRef.current || messages.length === 0) return;

		const updateMarkers = async () => {
			const L = (await import('leaflet')).default;
			const map = mapInstanceRef.current;

			// Clear existing markers
			markersRef.current.forEach(marker => marker.remove());
			markersRef.current = [];

			// Custom icon
			const customIcon = L.divIcon({
				className: 'custom-marker',
				html: `<div style="background: #3B82F6; width: 32px; height: 32px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
					<div style="transform: rotate(45deg); color: white; font-size: 16px;">📍</div>
				</div>`,
				iconSize: [32, 32],
				iconAnchor: [16, 32],
				popupAnchor: [0, -32]
			});

			// Add markers for each user
			messages.forEach((location: LocationSensorType) => {
				const marker = L.marker([location.latitude, location.longitude], { icon: customIcon })
					.addTo(map);

				const popupContent = `
					<div style="font-family: system-ui; min-width: 200px;">
						<div style="font-weight: 600; font-size: 14px; margin-bottom: 8px; color: #1F2937;">
							${location.email}
						</div>
						<div style="font-size: 12px; color: #6B7280; margin-bottom: 4px;">
							<strong>User ID:</strong> ${location.userId}
						</div>
						<div style="font-size: 12px; color: #6B7280; margin-bottom: 4px;">
							<strong>Coordinates:</strong><br/>
							${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}
						</div>
						<div style="font-size: 11px; color: #9CA3AF; margin-top: 8px; padding-top: 8px; border-top: 1px solid #E5E7EB;">
							Last updated: ${new Date(location.timestamp).toLocaleString()}
						</div>
						<a href="https://www.google.com/maps?q=${location.latitude},${location.longitude}" 
							 target="_blank" 
							 rel="noopener noreferrer"
							 style="display: block; margin-top: 8px; text-align: center; background: #3B82F6; color: white; padding: 6px; border-radius: 4px; text-decoration: none; font-size: 12px;">
							Open in Google Maps
						</a>
					</div>
				`;

				marker.bindPopup(popupContent);
				markersRef.current.push(marker);
			});

			// Fit bounds to show all markers
			if (messages.length > 0) {
				const bounds = L.latLngBounds(messages.map(loc => [loc.latitude, loc.longitude]));
				map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
			}
		};

		updateMarkers();
	}, [isClient, messages]);

	if (!isClient) {
		return (
			<div className='p-10 h-[600px] w-full flex items-center justify-center'>
				<div className="text-gray-500">Loading map...</div>
			</div>
		);
	}

	return (
		<div className='p-10 z-30 absolute rounded-3xl overflow-hidden h-[600px] w-full'>
			<div ref={mapRef} className="w-full h-full rounded-3xl" />
		</div>
	);
}
