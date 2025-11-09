import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">About This Application</h1>
        <div className="prose max-w-none text-gray-700">
           <p>
            This application provides a view of Serbia's major public investment projects through the lens of the Public Investment Management - Portfolio Assessment Model (PIM-PAM). 
            PIM-PAM is a framework for systematically assessing and managing public investment portfolios. For more information on the methodology, please visit <a href="https://pim-pam.net" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">pim-pam.net</a>.
          </p>
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
          <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">Version History</h2>
          <div>
            <p className="font-bold text-blue-600">November 7, 2025 | Version 0.1</p>
            <p>
              Initial prototype to demonstrate an interactive approach to presenting Serbia's major projects pipeline, 
              based on the Ministry of Finance's Revised Fiscal Strategy for 2025 with Projections for 2026 and 2027, 
              posted Dec 6, 2024 (<a href="https://www.mfin.gov.rs/en/documents2-2/revised-fiscal-strategy-for-2025-with-projections-for-2026-and-2027-2" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">link</a>), 
              Addendum 3 – Overview of investment projects in the Republic Budget – expenditures for nonfinancial assets 
              (over 20 million euros), in dinars
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;