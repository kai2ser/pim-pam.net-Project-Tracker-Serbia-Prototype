
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Project } from '../types';

interface ProjectChartProps {
  project: Project;
}

const ProjectChart: React.FC<ProjectChartProps> = ({ project }) => {
  const data = [
    { name: 'By end-2023', 'Amount (RSD mn)': project.disbursed2023 },
    { name: '2024', 'Amount (RSD mn)': project.plan2024 },
    { name: '2025', 'Amount (RSD mn)': project.plan2025 },
    { name: '2026+', 'Amount (RSD mn)': project.plan2026 + project.plan2027_beyond },
  ];
  
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

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
          <YAxis label={{ value: 'RSD (millions)', angle: -90, position: 'insideLeft' }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="Amount (RSD mn)" fill="#8884d8">
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
