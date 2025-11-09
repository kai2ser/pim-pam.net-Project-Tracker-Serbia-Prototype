
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import '@geoman-io/leaflet-geoman-free';
import * as toGeoJSON from '@tmcw/togeojson';

import { projects } from '../data/projects';
import { Project, ProjectLocation, LocationType } from '../types';
import MapLocationSearch from '../components/MapLocationSearch';

const MapEditor: React.FC<{ location: ProjectLocation | null; onLocationChange: (loc: ProjectLocation | null) => void; }> = ({ location, onLocationChange }) => {
  const map = useMap();
  const layerRef = useRef<L.GeoJSON | null>(null);

  useEffect(() => {
    // Clear existing layers when location changes from outside (e.g., KML upload)
    if (layerRef.current) {
      layerRef.current.clearLayers();
    }
    if (location) {
      if (layerRef.current) {
        layerRef.current.addData(location);
        const bounds = layerRef.current.getBounds();
        if (bounds.isValid()) {
            map.fitBounds(bounds, { padding: [50, 50] });
        }
      }
    }
  }, [location, map]);

  useEffect(() => {
    map.pm.addControls({
      position: 'topleft',
      drawCircle: false,
      drawMarker: true,
      drawPolyline: true,
      drawRectangle: false,
      drawPolygon: true,
      drawCircleMarker: false,
      drawText: false,
      cutPolygon: false,
      editMode: true,
      dragMode: true,
      removalMode: true,
    });

    const handleShapeChange = (e: any) => {
      const layer = e.layer || e.target;
      if (layer) {
        const geojson = layer.toGeoJSON().geometry;
        onLocationChange({
          type: geojson.type as LocationType,
          coordinates: geojson.coordinates,
        });
      }
    };

    map.on('pm:create', (e) => {
        // Enforce only one shape on the map
        map.pm.getGeomanLayers().forEach(layer => {
            if (layer !== e.layer) {
                layer.remove();
            }
        });
        handleShapeChange(e);
    });
    
    map.on('pm:edit', handleShapeChange);

    map.on('pm:remove', (e) => {
      onLocationChange(null);
    });

    return () => {
      map.pm.removeControls();
      map.off('pm:create');
      map.off('pm:edit');
      map.off('pm:remove');
    };
  }, [map, onLocationChange]);

  return <GeoJSON ref={layerRef} data={location || undefined} />;
};


const MapperPage: React.FC = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [location, setLocation] = useState<ProjectLocation | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [map, setMap] = useState<L.Map | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedProject = useMemo(() => {
    return projects.find(p => p.id.toString() === selectedProjectId);
  }, [selectedProjectId]);

  useEffect(() => {
    setLocation(selectedProject?.location ?? null);
    setFeedbackMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [selectedProject]);
  
  const handleFeedback = (message: string, isError = false, duration = 4000) => {
      setFeedbackMessage(message);
      setTimeout(() => setFeedbackMessage(''), duration);
  }

  const handleKMLUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const kmlText = e.target?.result as string;
        const parser = new DOMParser();
        const kmlDoc = parser.parseFromString(kmlText, 'text/xml');
        
        const geojson = toGeoJSON.kml(kmlDoc);

        if (geojson.features && geojson.features.length > 0) {
          const firstFeature = geojson.features[0];
          const geometry = firstFeature.geometry;

          if (['Point', 'LineString', 'Polygon'].includes(geometry.type)) {
            setLocation({
              type: geometry.type as LocationType,
              coordinates: geometry.coordinates,
            });
            handleFeedback('KML loaded. Review on map and click "Update Location" to save.');
          } else {
            handleFeedback(`Unsupported geometry type "${geometry.type}" in KML.`, true);
          }
        } else {
          handleFeedback('No valid features found in KML file.', true);
        }
      } catch (error) {
        console.error("KML Parsing Error:", error);
        handleFeedback('Failed to parse KML file.', true);
      }
    };
    reader.readAsText(file);
  };

  const handleUpdateLocation = () => {
    if (!selectedProject) {
      handleFeedback('Please select a project first.', true);
      return;
    }
    console.log('--- MAPPING UPDATE ---');
    console.log('Project ID:', selectedProject.id);
    console.log('New Location Data:', location);
    console.log('--------------------');
    handleFeedback(`Location for "${selectedProject.name}" updated in console.`);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Project Location Mapper</h1>
        <p className="text-gray-700 mb-8">
          The mapping of projects can be a handy way to demonstrate progress for any project, as well as to conduct climate change risk analysis. Use the interactive map to draw a project's footprint (point, line, or polygon), or upload a KML file to import its location.
        </p>

        <div className="space-y-6">
          <div>
            <label htmlFor="project-select" className="block text-sm font-medium text-gray-700 mb-1">
              1. Select a project to map:
            </label>
            <select
              id="project-select"
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">-- Please choose a project --</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.id}: {project.name}
                </option>
              ))}
            </select>
          </div>

          {selectedProject && (
            <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">2. Edit Location for: <span className="font-bold">{selectedProject.name}</span></h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload a KML file:</label>
                  <input
                      type="file"
                      accept=".kml"
                      ref={fileInputRef}
                      onChange={handleKMLUpload}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">... or search for an address:</label>
                   {map ? <MapLocationSearch map={map} /> : <div className="h-10 bg-gray-200 rounded-md animate-pulse"></div>}
                </div>
              </div>

              <p className="text-center text-sm font-medium text-gray-600 mb-2">Draw directly on the map:</p>
              <div className="h-[500px] w-full rounded-md overflow-hidden border-2 border-gray-300">
                <MapContainer ref={setMap} center={[44.2, 21.0]} zoom={7} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <MapEditor location={location} onLocationChange={setLocation} />
                </MapContainer>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <button
                    onClick={handleUpdateLocation}
                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-colors"
                >
                    Update Location
                </button>
                {feedbackMessage && (
                    <p className={`text-sm font-medium ${feedbackMessage.includes('Failed') || feedbackMessage.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
                        {feedbackMessage}
                    </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapperPage;