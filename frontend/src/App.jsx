import React from 'react';
import Header from './components/Header';
import AuditForm from './components/AuditForm';
import MetricsCards from './components/MetricsCards';
import TechStackPanel from './components/TechStackPanel';
import DesignSpecsPanel from './components/DesignSpecsPanel';
import RecommendationsPanel from './components/RecommendationsPanel';
import AuditHistoryTable from './components/AuditHistoryTable';
import EditModal from './components/EditModal';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white pb-16">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6">
        <AuditForm />
        <MetricsCards />
        <TechStackPanel />
        <DesignSpecsPanel />
        <RecommendationsPanel />
        <AuditHistoryTable />
      </main>

      <EditModal />
    </div>
  );
}