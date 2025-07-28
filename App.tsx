import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DashboardScreen from './src/screens/DashboardScreen';

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<DashboardScreen />} />
          <Route path="/TBMM-Onerge-Analizi/" element={<DashboardScreen />} />
          <Route path="/TBMM-Onerge-Analizi" element={<DashboardScreen />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App; 