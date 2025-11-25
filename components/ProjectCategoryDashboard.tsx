
import React from 'react';
import { Project } from '../types';

interface CategoryData {
  projects: Project[];
  totalRSD: number;
  totalEUR: number;
}

interface ProjectCategoryDashboardProps {
  categoryData: { [key: string]: CategoryData };
  title: string;
  currency: 'RSD' | 'EUR';
}

const ProjectCategoryDashboard: React.FC<ProjectCategoryDashboardProps> = ({ categoryData, title, currency }) => {
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);
  };

  const dataKey = currency === 'RSD' ? 'totalRSD' : 'totalEUR';
  const currencySymbol = currency === 'RSD' ? '' : '€';

  const categoryOrder = ['Ongoing (pre-2025)', 'Starts in 2025', 'Starts in 2026', 'Starts in 2027+'];

  const sortedCategoryNames = Object.keys(categoryData).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });


  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
      <h2 className="text-xl font-bold text-gray-800 mb-6">{title}</h2>
      <div className="overflow-x-auto flex-grow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider rounded-tl-md">
                Category
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Count
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider rounded-tr-md">
                Value ({currency} mn)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedCategoryNames.map(categoryName => {
              const category = categoryData[categoryName];
              if (category.projects.length === 0) return null; // Don't render empty categories
              return (
                <tr key={categoryName} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{categoryName}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{category.projects.length}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-700">
                    {currencySymbol}{formatCurrency(Math.round(category[dataKey] / 1000000))}m
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectCategoryDashboard;
