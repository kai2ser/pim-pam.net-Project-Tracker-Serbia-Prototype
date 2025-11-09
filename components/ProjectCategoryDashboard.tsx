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

  const sortedCategories = Object.entries(categoryData).sort(([a], [b]) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });


  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">{title}</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category (By Start Year)
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Project Count
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Value ({currency} mn)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* FIX: Explicitly type `data` as `CategoryData`. TypeScript's inference for `Object.entries` can be weak, causing `data` to be typed as `unknown`. */}
            {sortedCategories.map(([categoryName, data]: [string, CategoryData]) => {
              if (data.projects.length === 0) return null; // Don't render empty categories
              return (
                <tr key={categoryName}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{categoryName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{data.projects.length}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-gray-700">
                    {currencySymbol}{formatCurrency(data[dataKey])}m
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