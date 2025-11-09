import React, { useMemo, useState } from 'react';
import { projects } from '../data/projects';
import ProjectCard from '../components/ProjectCard';
import ProjectCategoryDashboard from '../components/ProjectCategoryDashboard';
import PortfolioChart from '../components/PortfolioChart';
import { Project } from '../types';

type SortKey = 'id' | 'projectCode' | 'name' | 'costEur' | 'costRsd';

const HomePage: React.FC = () => {
  const [currency, setCurrency] = useState<'RSD' | 'EUR'>('EUR');
  const [sortKey, setSortKey] = useState<SortKey>('id');

  const stats = useMemo(() => {
    const totalProjects = projects.length;
    const totalCostEUR = projects.reduce((sum, p) => sum + p.totalCostEUR, 0);
    const totalCostRSD = projects.reduce((sum, p) => sum + p.totalCostRSD, 0);
    return { totalProjects, totalCostEUR, totalCostRSD };
  }, []);

  const categorizedProjects = useMemo(() => {
    const categories: { [key: string]: { projects: Project[], totalRSD: number, totalEUR: number } } = {
      'Ongoing (pre-2025)': { projects: [], totalRSD: 0, totalEUR: 0 },
      'Starts in 2025': { projects: [], totalRSD: 0, totalEUR: 0 },
      'Starts in 2026': { projects: [], totalRSD: 0, totalEUR: 0 },
      'Starts in 2027+': { projects: [], totalRSD: 0, totalEUR: 0 },
    };

    projects.forEach(p => {
      let categoryName: string | null = null;
      if (p.disbursed2024 > 0) {
        categoryName = 'Ongoing (pre-2025)';
      } else if (p.plan2025 > 0) {
        categoryName = 'Starts in 2025';
      } else if (p.plan2026 > 0) {
        categoryName = 'Starts in 2026';
      } else if (p.plan2027 > 0 || p.plan2028 > 0) {
        categoryName = 'Starts in 2027+';
      }

      if (categoryName && categories[categoryName]) {
        categories[categoryName].projects.push(p);
        categories[categoryName].totalRSD += p.totalCostRSD;
        categories[categoryName].totalEUR += p.totalCostEUR;
      }
    });

    return categories;
  }, []);
  
  const sectorChartData = useMemo(() => {
    const dataKey = currency === 'RSD' ? 'totalCostRSD' : 'totalCostEUR';
    const amountKey = `Amount (${currency} mn)`;
    
    // Group projects by a simplified sector based on name, for charting
    const sectors: { [key: string]: number } = {};
    const sectorKeywords: { [key: string]: string[] } = {
        'Transport': ['metro', 'railway', 'highway', 'road', 'corridor', 'bridge', 'bypass', 'airport', 'port', 'lock'],
        'Energy': ['gas', 'hydroelectric', 'power plant'],
        'Environment': ['wastewater', 'waste management', 'irrigation', 'gorge'],
        'Social & Digital': ['clinical center', 'hospital', 'campus', 'data center', 'schools', 'parks'],
        'Culture & Sport': ['philharmonic', 'training center', 'hall', 'stadium', 'expo', 'sava centar', 'lozionica'],
        'Housing': ['housing', 'apartments'],
    };

    projects.forEach(p => {
        let assignedSector = 'Other';
        for (const [sector, keywords] of Object.entries(sectorKeywords)) {
            if (keywords.some(k => p.name_en.toLowerCase().includes(k))) {
                assignedSector = sector;
                break;
            }
        }
        if (!sectors[assignedSector]) {
            sectors[assignedSector] = 0;
        }
        sectors[assignedSector] += p[dataKey as keyof Project] as number;
    });

    // Map to a consistent structure for safe sorting
    const dataToSort = Object.entries(sectors).map(([name, amount]) => ({
      name,
      amount,
    }));

    // Sort by the numeric amount
    dataToSort.sort((a, b) => b.amount - a.amount);

    // Map back to the final structure required by the chart
    return dataToSort.map(({ name, amount }) => ({
      name,
      [amountKey]: amount,
    }));

  }, [currency]);
  
  const annualCostData = useMemo(() => {
    const totalsRSD = {
      'Cost up to 2025': projects.reduce((sum, p) => sum + p.disbursed2024, 0),
      'Projected 2025': projects.reduce((sum, p) => sum + p.plan2025, 0),
      'Projected 2026': projects.reduce((sum, p) => sum + p.plan2026, 0),
      'Projected 2027': projects.reduce((sum, p) => sum + p.plan2027, 0),
      'Projected 2028': projects.reduce((sum, p) => sum + p.plan2028, 0),
      'Projected 2029ff': projects.reduce((sum, p) => sum + p.plan2029_beyond, 0),
    };

    const rate = stats.totalCostEUR > 0 ? stats.totalCostRSD / stats.totalCostEUR : 117.2;
    const amountKey = `Amount (${currency} mn)`;
    
    return Object.entries(totalsRSD).map(([name, amountRSD]) => ({
      name,
      [amountKey]: currency === 'RSD' ? amountRSD : Math.round(amountRSD / rate),
    }));

  }, [currency, stats.totalCostRSD, stats.totalCostEUR]);

  const sortedProjects = useMemo(() => {
    const sorted = [...projects];
    switch (sortKey) {
      case 'id':
        sorted.sort((a, b) => a.id - b.id);
        break;
      case 'projectCode':
        sorted.sort((a, b) => a.projectCode.localeCompare(b.projectCode));
        break;
      case 'name':
        sorted.sort((a, b) => a.name_en.localeCompare(b.name_en));
        break;
      case 'costEur':
        sorted.sort((a, b) => b.totalCostEUR - a.totalCostEUR);
        break;
      case 'costRsd':
        sorted.sort((a, b) => b.totalCostRSD - a.totalCostRSD);
        break;
    }
    return sorted;
  }, [sortKey]);


  const StatCard: React.FC<{ title: string, value: string, subValue?: string }> = ({ title, value, subValue }) => (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      <h3 className="text-lg text-gray-500">{title}</h3>
      <p className="text-4xl font-bold text-gray-800 mt-2">{value}</p>
      {subValue && <p className="text-md text-gray-600 mt-1">{subValue}</p>}
    </div>
  );

  const SortButton: React.FC<{ sortValue: SortKey, label: string }> = ({ sortValue, label }) => (
    <button
      onClick={() => setSortKey(sortValue)}
      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
        sortKey === sortValue
          ? 'bg-blue-600 text-white shadow'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div>
      <div className="text-center mb-10">
        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MjIgMTI5Ij4KICA8c3R5bGU+CiAgICAudGV4dCB7CiAgICAgIGZvbnQtZmFtaWx5OiAnQXJpYWwgQmxhY2snLCBBcmlhbCwgc2Fucy1zZXJpZjsKICAgICAgZm9udC1zaXplOiAxMjBweDsKICAgICAgZmlsbDogIzNkM2QzZDsKICAgIH0KICAgIC5kb3QgewogICAgICBmaWxsOiAjZmM2NjAwOwogICAgfQogIDwvc3R5bGU+CiAgPHRleHQgeD0iMCIgeT0iMTA1Ij5QSU0tUEFNPC90ZXh0PgogIDxjaXJjbGUgY2xhc3M9ImRvdCIgY3g9IjUxMCIgY3k9Ijk4IiByPSIxMiIvPgo8L3N2Zz4K" alt="PIM-PAM Logo" className="h-12 w-auto mx-auto mb-4" />
        <h1 className="text-4xl font-extrabold text-gray-800">Public Investment Management - Portfolio Assessment Model</h1>
        <p className="mt-2 text-lg text-gray-600">A PIM-PAM View of Serbia's Public Investment Portfolio.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard title="Total Projects" value={stats.totalProjects.toString()} />
        <StatCard 
            title="Total Value (RSD)" 
            value={Math.round(stats.totalCostRSD / 1000000).toLocaleString('en-US')}
            subValue="million"
        />
        <StatCard 
            title="Total Value (EUR)" 
            value={`€${Math.round(stats.totalCostEUR / 1000000).toLocaleString('en-US')}`}
            subValue="million"
        />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-12">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Portfolio Annual Cost Projections</h2>
            <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Currency:</span>
                <button onClick={() => setCurrency('EUR')} className={`px-3 py-1 text-sm rounded-md ${currency === 'EUR' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>EUR</button>
                <button onClick={() => setCurrency('RSD')} className={`px-3 py-1 text-sm rounded-md ${currency === 'RSD' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>RSD</button>
            </div>
        </div>
        <PortfolioChart 
            data={annualCostData} 
            dataKey={`Amount (${currency} mn)`}
            yAxisLabel={`${currency} (millions)`}
            tooltipUnit={`${currency} mn`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Investment by Sector</h2>
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Currency:</span>
                    <button onClick={() => setCurrency('EUR')} className={`px-3 py-1 text-sm rounded-md ${currency === 'EUR' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>EUR</button>
                    <button onClick={() => setCurrency('RSD')} className={`px-3 py-1 text-sm rounded-md ${currency === 'RSD' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>RSD</button>
                </div>
            </div>
            <PortfolioChart 
                data={sectorChartData} 
                dataKey={`Amount (${currency} mn)`}
                yAxisLabel={`${currency} (millions)`}
                tooltipUnit={`${currency} mn`}
            />
        </div>
        <ProjectCategoryDashboard 
          categoryData={categorizedProjects} 
          title="Projects by Implementation Start"
          currency={currency}
        />
      </div>

      <div className="mt-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-3xl font-bold text-gray-800">Project List</h2>
          <div className="flex items-center space-x-2 flex-wrap justify-center">
            <span className="text-sm font-medium text-gray-600 mr-2">Sort by:</span>
            <SortButton sortValue="id" label="No." />
            <SortButton sortValue="projectCode" label="Code" />
            <SortButton sortValue="name" label="Name (A-Z)" />
            <SortButton sortValue="costEur" label="Cost (EUR ↓)" />
            <SortButton sortValue="costRsd" label="Cost (RSD ↓)" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;