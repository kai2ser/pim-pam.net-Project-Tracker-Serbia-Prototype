
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface ChartData {
  name: string;
  [key: string]: string | number;
}

interface PortfolioChartProps {
  data: ChartData[];
  dataKey: string;
  yAxisLabel: string;
  tooltipUnit: string;
  heightClass?: string;
}

const PortfolioChart: React.FC<PortfolioChartProps> = ({ data, dataKey, yAxisLabel, tooltipUnit, heightClass = "h-96" }) => {
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b', '#0891b2'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-300 rounded shadow-lg">
          <p className="font-bold">{label}</p>
          <p className="text-indigo-600">{`Amount: ${payload[0].value.toLocaleString('en-US', {maximumFractionDigits: 0})} ${tooltipUnit}`}</p>
        </div>
      );
    }
    return null;
  };
  
  const formatYAxis = (tickItem: number) => {
      if (tickItem === 0) return '0';
      if (tickItem >= 1000) {
        return (tickItem / 1000).toLocaleString('en-US', { maximumFractionDigits: 1 }) + 'k';
      }
      return tickItem.toLocaleString('en-US');
  }

  return (
    <div className={`w-full ${heightClass}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 30,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-25} textAnchor="end" interval={0} height={70} />
          <YAxis 
            label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }}
            tickFormatter={formatYAxis}
            width={80}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey={dataKey} name="Amount">
             {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PortfolioChart;
