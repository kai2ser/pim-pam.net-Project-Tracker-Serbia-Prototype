
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
      } else if (p.plan2027 > 0 || p.plan2028 > 0 || p.plan2029_beyond > 0) {
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
      [amountKey]: Math.round(amount / 1000000),
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
      [amountKey]: Math.round((currency === 'RSD' ? amountRSD : (amountRSD / rate)) / 1000000),
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


  const StatCard: React.FC<{ title: string, value: string, subValue?: string, colorClass: string }> = ({ title, value, subValue, colorClass }) => (
    <div className={`bg-white p-6 rounded-lg shadow-sm border-t-4 ${colorClass} hover:shadow-md transition-all duration-200 text-center`}>
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{title}</h3>
      <p className="text-3xl font-extrabold text-gray-900">{value}</p>
      {subValue && <p className="text-xs font-medium text-gray-500 mt-1">{subValue}</p>}
    </div>
  );

  const SortButton: React.FC<{ sortValue: SortKey, label: string }> = ({ sortValue, label }) => (
    <button
      onClick={() => setSortKey(sortValue)}
      className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 border ${
        sortKey === sortValue
          ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
          : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-2 sm:px-4">
      {/* Header Section */}
      <div className="text-center pt-2 pb-6 flex flex-col items-center">
        <svg 
          viewBox="0 0 260 100" 
          className="h-16 w-auto mb-4 text-gray-900 drop-shadow-sm"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Square Icon */}
          <g transform="translate(0, 10)">
            <rect x="0" y="0" width="80" height="80" fill="none" stroke="currentColor" strokeWidth="6" />
            {/* Abstract geometric shapes inside */}
            <path d="M 15 15 L 45 15 L 15 45 Z" fill="currentColor" />
            <path d="M 65 65 L 35 65 L 65 35 Z" fill="currentColor" />
          </g>
          
          {/* Text PIM PAM */}
          <g transform="translate(100, 0)">
             <text x="0" y="42" fontFamily="sans-serif" fontWeight="bold" fontSize="28" letterSpacing="0.2em" fill="currentColor">PIM</text>
             <text x="0" y="72" fontFamily="sans-serif" fontWeight="bold" fontSize="28" letterSpacing="0.2em" fill="currentColor">PAM</text>
             <text x="0" y="92" fontFamily="sans-serif" fontSize="12" fill="currentColor" letterSpacing="0.05em">pim-pam.net</text>
          </g>
        </svg>

        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 tracking-tight">Public Investment Management Portfolio</h1>
        <h2 className="text-lg font-semibold text-blue-600 mt-1">Prototype Demonstration Application</h2>
        <p className="mt-2 text-sm text-gray-500 max-w-2xl mx-auto">
          A systematic assessment of Serbia's major public investment projects pipeline.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
            title="Total Projects" 
            value={stats.totalProjects.toString()} 
            colorClass="border-blue-500"
        />
        <StatCard 
            title="Total Value (RSD)" 
            value={Math.round(stats.totalCostRSD / 1000000).toLocaleString('en-US')}
            subValue="million RSD"
            colorClass="border-emerald-500"
        />
        <StatCard 
            title="Total Value (EUR)" 
            value={`€${Math.round(stats.totalCostEUR / 1000000).toLocaleString('en-US')}`}
            subValue="million EUR"
            colorClass="border-indigo-500"
        />
      </div>
      
      {/* Annual Projection Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
                <h2 className="text-xl font-bold text-gray-800">Portfolio Annual Cost Projections</h2>
                <p className="text-sm text-gray-500">Projected expenditure flow for the entire portfolio</p>
            </div>
            <div className="flex bg-gray-100 p-1 rounded-lg">
                <button 
                    onClick={() => setCurrency('EUR')} 
                    className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${currency === 'EUR' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    EUR
                </button>
                <button 
                    onClick={() => setCurrency('RSD')} 
                    className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${currency === 'RSD' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    RSD
                </button>
            </div>
        </div>
        <PortfolioChart 
            data={annualCostData} 
            dataKey={`Amount (${currency} mn)`}
            yAxisLabel={`${currency} (millions)`}
            tooltipUnit={`${currency} mn`}
            heightClass="h-72"
        />
      </div>

      {/* Sector Chart & Category Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Investment by Sector</h2>
            </div>
            <div className="flex-grow">
                <PortfolioChart 
                    data={sectorChartData} 
                    dataKey={`Amount (${currency} mn)`}
                    yAxisLabel={`${currency} (millions)`}
                    tooltipUnit={`${currency} mn`}
                    heightClass="h-64"
                />
            </div>
        </div>
        <div className="flex flex-col h-full">
            <ProjectCategoryDashboard 
            categoryData={categorizedProjects} 
            title="Projects by Implementation Start"
            currency={currency}
            />
        </div>
      </div>

      {/* Project List Section */}
      <div className="pt-4">
        <div className="flex flex-col lg:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-800 self-start lg:self-center">Project List</h2>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <span className="text-sm font-medium text-gray-500 hidden sm:inline">Sort by:</span>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-end w-full">
                <SortButton sortValue="id" label="No." />
                <SortButton sortValue="projectCode" label="Code" />
                <SortButton sortValue="name" label="Name" />
                <SortButton sortValue="costEur" label="Value (€)" />
                <SortButton sortValue="costRsd" label="Value (RSD)" />
            </div>
          </div>
        </div>
        
        {/* Updated grid to "Menu Tile" style: more columns, tighter gaps */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {sortedProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
