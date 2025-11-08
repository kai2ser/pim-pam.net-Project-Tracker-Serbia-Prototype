
import React, { useMemo } from 'react';
import { projects } from '../data/projects';
import ProjectCard from '../components/ProjectCard';

const HomePage: React.FC = () => {
  const { totalProjects, totalValueEUR, totalValueRSD } = useMemo(() => {
    const totalValueEUR = projects.reduce((acc, p) => acc + p.totalCostEUR, 0);
    const totalValueRSD = projects.reduce((acc, p) => acc + p.totalCostRSD, 0);
    return {
      totalProjects: projects.length,
      totalValueEUR,
      totalValueRSD,
    };
  }, []);
  
  const formatCurrency = (value: number, isBillion = false) => {
    const val = isBillion ? value / 1000 : value;
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(val) + (isBillion ? 'b' : 'm');
  };

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-800">Serbian Public Investment Portfolio</h1>
        <p className="mt-2 text-lg text-gray-600">An overview of major public projects.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold text-gray-500">Total Projects</h3>
          <p className="text-4xl font-bold text-blue-600 mt-2">{totalProjects}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold text-gray-500">Total Value (EUR)</h3>
          <p className="text-4xl font-bold text-green-600 mt-2">€{formatCurrency(totalValueEUR, true)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold text-gray-500">Total Value (RSD)</h3>
          <p className="text-4xl font-bold text-indigo-600 mt-2">{formatCurrency(totalValueRSD, true)}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
