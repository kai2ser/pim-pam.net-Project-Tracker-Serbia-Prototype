
import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">About This Application</h1>
        <div className="prose max-w-none text-gray-700">
          <p>
            This application serves to track the implementation of major projects valued at over Euro 20 million. 
            The application uses public reference data from the Ministry of Finance, drawn from Annual and Medium Term 
            budgeting publications, notably the 3 year Fiscal Strategy and the Annual Budget.
          </p>
          <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">Features</h2>
          <ul>
            <li>
              <strong>Comprehensive Portfolio View:</strong> A dashboard summarizing the total number of projects and their cumulative value in both Serbian Dinar (RSD) and Euros (EUR).
            </li>
            <li>
              <strong>Detailed Project Pages:</strong> Each project has a dedicated page with detailed financial data, including total estimated costs and disbursed amounts.
            </li>
            <li>
              <strong>Multi-Year Financial Visualization:</strong> Interactive bar charts illustrate the planned budget allocation for each project over multiple years (2024, 2025, 2026 and beyond).
            </li>
            <li>
              <strong>AI-Powered Summaries:</strong> Leveraging the Gemini API, users can generate on-demand summaries for each project, providing insights on its location and recent press coverage based on public web sources.
            </li>
          </ul>
          <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">Technology Stack</h2>
          <p>
            This single-page application is built with modern web technologies to ensure a responsive and interactive user experience.
          </p>
          <ul>
            <li><strong>Frontend:</strong> React 18 with TypeScript</li>
            <li><strong>Styling:</strong> Tailwind CSS</li>
            <li><strong>Charting:</strong> Recharts</li>
            <li><strong>AI Integration:</strong> Google Gemini API</li>
            <li><strong>Routing:</strong> React Router (HashRouter)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
