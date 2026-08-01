import { useState, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { login } from '../auth';
import Logo from '../assets/Logo.png';

const VALID_USERNAME = 'user9443';
const VALID_PASSWORD = 'V7#mQ2!xLp9@Rd4K';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (email.trim() !== VALID_USERNAME || password !== VALID_PASSWORD) {
      setError('Invalid username or password.');
      return;
    }
    login();
    const from = (location.state as { from?: string })?.from || '/dashboard';
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-app-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <img src={Logo} alt="RelayX Logo" className="h-12 w-auto" />
        </div>
        <div className="bg-app-surface border border-app-border rounded-2xl p-6 shadow-lg">
          <h1 className="text-app-text font-bold text-xl mb-1 text-center">Sign in</h1>
          <p className="text-app-text-muted text-sm mb-6 text-center">Access your RelayX dashboard</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-app-text-secondary mb-1">Username</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-app-bg border border-app-border text-app-text text-sm focus:outline-none focus:border-[#25D366]"
                placeholder="Username"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-app-text-secondary mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-app-bg border border-app-border text-app-text text-sm focus:outline-none focus:border-[#25D366]"
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <button
              type="submit"
              className="w-full text-sm font-medium px-4 py-2.5 rounded-lg bg-[#25D366] text-white hover:bg-[#1fb855] transition-colors shadow-lg shadow-[#25D366]/20"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
