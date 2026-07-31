import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Dashboard } from './components/Dashboard';
import { Sessions } from './components/Sessions';
import { Chats } from './components/Chats';
import { Settings } from './components/Settings';
import { APIReference } from './components/APIReference';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/*"
          element={
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
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
