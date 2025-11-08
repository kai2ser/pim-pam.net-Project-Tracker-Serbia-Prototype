
import React, { useMemo } from 'react';
import { Project } from '../types';

interface MapInfoPanelProps {
  projects: Project[];
}

const MapInfoPanel: React.FC<MapInfoPanelProps> = ({ projects }) => {
  const stats = useMemo(() => {
    const pointProjects = projects.filter(p => p.location?.type === 'Point');
    const lineProjects = projects.filter(p => p.location?.type === 'LineString');
    const polygonProjects = projects.filter(p => p.location?.type === 'Polygon');
    const unmappedProjects = projects.filter(p => !p.location);

    return {
      point: { count: pointProjects.length, projects: pointProjects },
      line: { count: lineProjects.length, projects: lineProjects },
      polygon: { count: polygonProjects.length, projects: polygonProjects },
      unmapped: { count: unmappedProjects.length, projects: unmappedProjects },
    };
  }, [projects]);

  const StatItem: React.FC<{ color: string, label: string, count: number }> = ({ color, label, count }) => (
    <div className="flex items-center space-x-2">
      <span className={`h-4 w-4 rounded-full ${color}`}></span>
      <span className="font-semibold">{label}:</span>
      <span>{count}</span>
    </div>
  );

  return (
    <div className="absolute top-4 right-4 z-[1000] w-72 bg-white bg-opacity-90 p-4 rounded-lg shadow-lg max-h-[calc(100%-2rem)] overflow-y-auto">
      <h3 className="text-lg font-bold mb-3 border-b pb-2">Project Mapping Status</h3>
      <div className="space-y-2 mb-4">
        <StatItem color="bg-blue-500" label="Points" count={stats.point.count} />
        <StatItem color="bg-sky-500" label="Lines" count={stats.line.count} />
        {/* <StatItem color="bg-green-500" label="Polygons" count={stats.polygon.count} /> */}
        <StatItem color="bg-gray-400" label="Not Mapped" count={stats.unmapped.count} />
      </div>
      
      {stats.unmapped.count > 0 && (
        <div>
          <h4 className="font-semibold text-md mt-4 border-t pt-3">Unmapped Projects:</h4>
          <ul className="text-sm text-gray-600 mt-1 space-y-1">
            {stats.unmapped.projects.map(p => (
              <li key={p.id}>- {p.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MapInfoPanel;
