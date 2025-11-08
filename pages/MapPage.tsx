
import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { projects } from '../data/projects';
import MapInfoPanel from '../components/MapInfoPanel';

const MapPage: React.FC = () => {
    const center: [number, number] = [44.2, 21.0];
    
    const projectGeometries = useMemo(() => {
        return projects.map((project) => {
            if (!project.location) return null;
            
            const popupContent = (
                <div>
                    <h3 className="font-bold">{project.name}</h3>
                    <p>ID: {project.id}</p>
                    <p>Cost: €{project.totalCostEUR.toLocaleString()}m</p>
                    <Link to={`/project/${project.id}`} className="text-blue-600 hover:underline">View Details &rarr;</Link>
                </div>
            );

            switch (project.location.type) {
                case 'Point':
                    return (
                        <Marker key={project.id} position={project.location.coordinates}>
                            <Popup>{popupContent}</Popup>
                        </Marker>
                    );
                case 'LineString':
                    return (
                        <Polyline key={project.id} positions={project.location.coordinates} color="blue">
                             <Popup>{popupContent}</Popup>
                        </Polyline>
                    );
                // case 'Polygon':
                //     return (
                //         <Polygon key={project.id} positions={project.location.coordinates} color="green">
                //             <Popup>{popupContent}</Popup>
                //         </Polygon>
                //     );
                default:
                    return null;
            }
        });
    }, []);

    return (
        <div>
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-gray-800">Project Map View</h1>
                <p className="mt-2 text-lg text-gray-600">Geographical overview of public investments in Serbia.</p>
            </div>
            <div className="relative h-[70vh] w-full rounded-lg shadow-lg overflow-hidden">
                <MapContainer center={center} zoom={7} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {projectGeometries}
                </MapContainer>
                <MapInfoPanel projects={projects} />
            </div>
        </div>
    );
};

export default MapPage;
