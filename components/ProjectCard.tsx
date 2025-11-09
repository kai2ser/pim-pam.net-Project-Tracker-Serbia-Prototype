import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../types';
import ChevronRightIcon from './icons/ChevronRightIcon';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const formatCurrency = (value: number) => new Intl.NumberFormat('en-US').format(value);

  return (
    <Link 
      to={`/project/${project.id}`} 
      className="block bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
            <span>No: <span className="font-semibold text-gray-800">{project.id}</span></span>
            <span className="border-l border-gray-300 h-4"></span>
            <span>Code: <span className="font-semibold text-gray-800">{project.projectCode}</span></span>
          </div>
          <h3 className="text-lg font-bold text-gray-800">{project.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{project.name_en}</p>
        </div>
        <div className="text-gray-400 group-hover:text-blue-600 transition-colors">
            <ChevronRightIcon />
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Total Cost (EUR)</span>
          <span className="font-semibold text-gray-700">€{formatCurrency(project.totalCostEUR)}m</span>
        </div>
        <div className="flex justify-between items-center text-sm mt-2">
          <span className="text-gray-500">Total Cost (RSD)</span>
          <span className="font-semibold text-gray-700">{formatCurrency(project.totalCostRSD)}m</span>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;