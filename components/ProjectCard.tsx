
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
      className="block bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-400 hover:-translate-y-0.5 transition-all duration-200 group h-full flex flex-col justify-between"
    >
      <div>
        <div className="flex justify-between items-start mb-2">
           <span className="text-[10px] font-mono font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
             #{project.id}
           </span>
           <div className="text-gray-300 group-hover:text-blue-500 transition-colors">
              <ChevronRightIcon className="h-3 w-3" />
           </div>
        </div>
        
        <h3 className="text-sm font-bold text-gray-800 leading-snug group-hover:text-blue-700 transition-colors mb-1 line-clamp-2">
            {project.name}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-1 leading-relaxed mb-3">
            {project.name_en}
        </p>
      </div>
      
      <div className="mt-auto pt-2 border-t border-dashed border-gray-100 flex justify-between items-center">
         <span className="text-[10px] text-gray-400 font-mono">{project.projectCode}</span>
         <span className="font-bold text-blue-700 text-xs bg-blue-50 px-1.5 py-0.5 rounded">
            €{formatCurrency(Math.round(project.totalCostEUR / 1000000))}m
         </span>
      </div>
    </Link>
  );
};

export default ProjectCard;