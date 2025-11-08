import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projects } from '../data/projects';
import { Project, AISummary } from '../types';
import ProjectChart from '../components/ProjectChart';
import LoadingSpinner from '../components/LoadingSpinner';
import { generateProjectSummary } from '../services/geminiService';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

const MapViewSetter: React.FC<{ project: Project }> = ({ project }) => {
    const map = useMap();
    useEffect(() => {
        if (project.location) {
            if (project.location.type === 'Point') {
                map.setView(project.location.coordinates, 14);
            } else if (project.location.type === 'LineString') {
                 const bounds = L.latLngBounds(project.location.coordinates);
                 map.fitBounds(bounds, { padding: [50, 50] });
            }
        }
    }, [project, map]);
    return null;
};

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams();
  const project = useMemo(() => projects.find(p => p.id === id), [id]);

  const [summary, setSummary] = useState<AISummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateSummary = async () => {
    if (!project) return;
    setIsLoading(true);
    setError(null);
    setSummary(null);
    try {
      const result = await generateProjectSummary(
        project.name,
        project.id,
        `€${project.totalCostEUR}m (RSD ${project.totalCostRSD}m)`
      );
      setSummary(result);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatCurrency = (value: number) => new Intl.NumberFormat('en-US').format(value);

  if (!project) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold">Project not found</h2>
        <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">
          &larr; Back to Portfolio
        </Link>
      </div>
    );
  }

  const InfoCard: React.FC<{title: string, value: string, currency: string}> = ({title, value, currency}) => (
    <div className="bg-gray-100 p-4 rounded-lg">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-xl font-semibold text-gray-800">{value} <span className="text-base font-normal">{currency}</span></p>
    </div>
  );

  return (
    <div>
      <Link to="/" className="text-blue-600 hover:underline mb-6 inline-block">
        &larr; Back to Portfolio
      </Link>
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <span className="text-sm font-semibold text-blue-600 bg-blue-100 py-1 px-3 rounded-full">{project.id}</span>
        <h1 className="text-3xl font-bold text-gray-900 mt-2">{project.name}</h1>
        
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <InfoCard title="Total Cost (EUR)" value={`€${formatCurrency(project.totalCostEUR)}`} currency="million"/>
            <InfoCard title="Total Cost (RSD)" value={`${formatCurrency(project.totalCostRSD)}`} currency="million"/>
            <InfoCard title="Disbursed by end-2023" value={`${formatCurrency(project.disbursed2023)}`} currency="RSD mn"/>
            <InfoCard title="2024 Plan" value={`${formatCurrency(project.plan2024)}`} currency="RSD mn"/>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Multi-Year Budget Allocation</h2>
          <ProjectChart project={project} />
        </div>
        
        {project.location && (
           <div className="mt-12 pt-8 border-t border-gray-200">
             <h2 className="text-2xl font-semibold text-gray-800 mb-4">Project Location</h2>
             <div className="h-96 rounded-lg overflow-hidden relative z-0">
                <MapContainer center={[44.2, 21.0]} zoom={7} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapViewSetter project={project}/>
                    {project.location.type === 'Point' && <Marker position={project.location.coordinates} />}
                    {project.location.type === 'LineString' && <Polyline positions={project.location.coordinates} color="blue" />}
                </MapContainer>
             </div>
           </div>
        )}

        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800">AI-Powered Project Briefing</h2>
          <p className="text-gray-600 mt-1">Generate a summary of the project's location and recent press coverage.</p>
          <button
            onClick={handleGenerateSummary}
            disabled={isLoading}
            className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Generating...' : 'Generate Summary'}
          </button>

          {isLoading && <div className="mt-4"><LoadingSpinner /></div>}
          
          {error && <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}

          {summary && (
            <div className="mt-6 space-y-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800">Location Summary</h3>
                <p className="mt-2 text-gray-700">{summary.locationSummary}</p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800">Press Reports Summary</h3>
                <p className="mt-2 text-gray-700">{summary.pressReportsSummary}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;