import React from 'react';
import AuditHistoryTable from './components/AuditHistoryTable';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">DevMetrics Audit Dashboard</h1>
        
        {/* Main Audit Components */}
        <AuditHistoryTable />
      </div>
    </div>
  );
}

export default App;