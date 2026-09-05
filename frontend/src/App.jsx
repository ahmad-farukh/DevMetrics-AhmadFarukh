import React from 'react';
import Header from './components/Header';
import MetricsOverview from './components/MetricsOverview';
import AuditInputForm from './components/AuditInputForm';
import AuditHistoryTable from './components/AuditHistoryTable';
import EditModal from './components/EditModal';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation / Header */}
      <Header />

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Metric Cards */}
        <MetricsOverview />

        {/* URL Input Form Area */}
        <AuditInputForm />

        {/* Audit Logs Table */}
        <AuditHistoryTable />
      </main>

      {/* Edit Modal Popup */}
      <EditModal />
    </div>
  );
}

export default App;