import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Login } from './components/Login';
import { Payment } from './components/Payment';
import { Dashboard } from './components/Dashboard';
import { Sessions } from './components/Sessions';
import { Chats } from './components/Chats';
import { Settings } from './components/Settings';
import { APIReference } from './components/APIReference';
import { isAuthenticated } from './auth';

function ProtectedRoutes() {
  const location = useLocation();
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  return (
    <Layout>
      <Routes>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="sessions" element={<Sessions />} />
        <Route path="chats" element={<Chats />} />
        <Route path="chats/:session" element={<Chats />} />
        <Route path="settings" element={<Settings />} />
        <Route path="api-docs" element={<APIReference />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/payment/:plan" element={<Payment />} />
        <Route path="/*" element={<ProtectedRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
