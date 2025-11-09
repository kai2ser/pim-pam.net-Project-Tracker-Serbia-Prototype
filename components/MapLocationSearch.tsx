import React, { useState } from 'react';
import L from 'leaflet';

interface MapLocationSearchProps {
  map: L.Map | null;
}

const MapLocationSearch: React.FC<MapLocationSearchProps> = ({ map }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query || !map) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
      );
      if (!response.ok) {
        throw new Error('Failed to connect to the geocoding service.');
      }
      const data = await response.json();

      if (data && data.length > 0) {
        const result = data[0];
        const bounds: L.LatLngBoundsLiteral = [
            [parseFloat(result.boundingbox[0]), parseFloat(result.boundingbox[2])], // South-West
            [parseFloat(result.boundingbox[1]), parseFloat(result.boundingbox[3])]  // North-East
        ];
        map.flyToBounds(bounds, { paddingTopLeft: [50, 50], paddingBottomRight: [50, 50] });
      } else {
        setError('Location not found.');
      }
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center w-full">
      <div className="relative w-full">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (error) setError(null);
          }}
          placeholder="e.g., Belgrade Fortress"
          className="w-full pl-3 pr-20 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        />
         {error && <p className="text-xs text-red-600 absolute -bottom-4 left-1">{error}</p>}
      </div>
      <button
        type="submit"
        disabled={isLoading || !query}
        className="ml-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? '...' : 'Search'}
      </button>
    </form>
  );
};

export default MapLocationSearch;
