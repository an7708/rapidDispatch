import { useState, useEffect, useMemo } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import './App.css';

export default function App() {
  const [agentRaw, setAgentRaw] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('rd_agent');
    if (stored) setAgentRaw(JSON.parse(stored));
  }, []);

  const agent = useMemo(() => agentRaw, [agentRaw?.id]);

  const handleLogin = (agentData, token) => {
    localStorage.setItem('rd_token', token);
    localStorage.setItem('rd_agent', JSON.stringify(agentData));
    setAgentRaw(agentData);
  };

  const handleLogout = () => {
    localStorage.removeItem('rd_token');
    localStorage.removeItem('rd_agent');
    setAgentRaw(null);
  };

  if (!agent) return <Login onLogin={handleLogin} />;
  return <Dashboard agent={agent} onLogout={handleLogout} />;
}