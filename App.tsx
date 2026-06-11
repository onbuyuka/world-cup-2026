import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { SettingsProvider } from './components/settingsStore';
import { LiveProvider } from './components/liveStore';
import { BracketPage } from './pages/BracketPage';
import { TeamsPage } from './pages/TeamsPage';
import { TeamDetailPage } from './pages/TeamDetailPage';
import { CalendarPage } from './pages/CalendarPage';

const App: React.FC = () => (
  <SettingsProvider>
    <LiveProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<BracketPage />} />
            <Route path="/teams" element={<TeamsPage />} />
            <Route path="/team/:id" element={<TeamDetailPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </HashRouter>
    </LiveProvider>
  </SettingsProvider>
);

export default App;
