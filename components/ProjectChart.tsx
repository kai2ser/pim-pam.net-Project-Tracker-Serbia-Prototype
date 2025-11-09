import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Project } from '../types';

interface ProjectChartProps {
  project: Project;
}

const ProjectChart: React.FC<ProjectChartProps> = ({ project }) => {

  const data = [
    { name: 'Cost up to 2025', 'Amount (RSD mn)': project.disbursed2024 },
    { name: 'Projected cost in 2025', 'Amount (RSD mn)': project.plan2025 },
    { name: 'Projected cost in 2026', 'Amount (RSD mn)': project.plan2026 },
    { name: 'Projected cost in 2027', 'Amount (RSD mn)': project.plan2027 },
    { name: 'Projected cost in 2028', 'Amount (RSD mn)': project.plan2028 },
    { name: 'Projected Cost 2029ff', 'Amount (RSD mn)': project.plan2029_beyond },
  ];
  
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c', '#d0ed57'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-300 rounded shadow-lg">
          <p className="font-bold">{label}</p>
          <p className="text-indigo-600">{`Amount: ${payload[0].value.toLocaleString()} RSD mn`}</p>
        </div>
      );
    }
    return null;
  };
  
  const formatYAxis = (tickItem: number) => {
      if (tickItem === 0) return '0';
      if (tickItem >= 1000) {
        return (tickItem / 1000).toLocaleString() + 'k';
      }
      return tickItem.toLocaleString();
  }

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis 
             label={{ value: 'RSD (millions)', angle: -90, position: 'insideLeft' }}
             tickFormatter={formatYAxis}
             width={80}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="Amount (RSD mn)" name="Allocation">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProjectChart;