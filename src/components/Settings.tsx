import { useState } from 'react';
import { Save, Check, AlertCircle, Key, Globe, Shield, ExternalLink } from 'lucide-react';
import { getConfig, saveConfig, checkHealth, type WahaConfig } from '../api/wahaApi';

export function Settings() {
  const [config, setConfig] = useState<WahaConfig>(() => {
    const c = getConfig();
    // If using the default proxy setup, show empty for clarity
    return c;
  });
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<boolean | null>(null);

  const handleSave = () => {
    saveConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    // Save temporarily to test
    saveConfig(config);
    const healthy = await checkHealth();
    setTestResult(healthy);

    // Test completed — result shown below
    setTesting(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-app-text">Settings</h1>
        <p className="text-app-text-muted mt-1">Configure your WAHA API connection</p>
      </div>

      {/* Connection Settings */}
      <div className="bg-app-surface rounded-xl border border-app-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <Globe className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-app-text">Connection</h2>
            <p className="text-app-text-muted text-sm">WAHA API server configuration</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-app-text-secondary mb-1.5">Base URL</label>
            <input
              type="text"
              value={config.baseUrl}
              onChange={e => setConfig({ ...config, baseUrl: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg bg-app-bg border border-app-border text-white placeholder-app-text-muted focus:outline-none focus:border-[#25D366] transition-colors text-sm font-mono"
              placeholder="http://localhost:3000"
            />
          </div>

          <div>
            <label className="block text-sm text-app-text-secondary mb-1.5 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5" />
              API Key
            </label>
            <input
              type="password"
              value={config.apiKey}
              onChange={e => setConfig({ ...config, apiKey: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg bg-app-bg border border-app-border text-white placeholder-app-text-muted focus:outline-none focus:border-[#25D366] transition-colors text-sm font-mono"
              placeholder="Your WAHA API key"
            />
          </div>
        </div>

        {/* Test Result */}
        {testResult !== null && (
          <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 text-sm ${
            testResult
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
              : 'bg-red-500/10 border border-red-500/20 text-red-400'
          }`}>
            {testResult ? (
              <>
                <Check className="w-4 h-4" />
                Connection successful! WAHA API is reachable.
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4" />
                Connection failed. Is WAHA running at the configured URL?
              </>
            )}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleTest}
            disabled={testing}
            className="px-4 py-2.5 rounded-lg bg-app-bg border border-app-border text-app-text-secondary hover:text-white hover:border-app-border-hover text-sm font-medium transition-all disabled:opacity-50"
          >
            {testing ? 'Testing...' : 'Test Connection'}
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#25D366] hover:bg-[#1fb855] text-black font-medium text-sm transition-all active:scale-95"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4" />
                Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </div>

      {/* Security Info */}
      <div className="bg-app-surface rounded-xl border border-app-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-app-text">Security</h2>
            <p className="text-app-text-muted text-sm">Authentication information</p>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div className="p-3 rounded-lg bg-app-bg border border-app-border">
            <p className="text-app-text-secondary">
              <span className="text-app-text font-medium">Dashboard:</span> Access the WAHA dashboard at{' '}
              <code className="px-1.5 py-0.5 rounded bg-[#1e2532] text-[#25D366] text-xs">{config.baseUrl}</code>
              {' '}with username <code className="px-1.5 py-0.5 rounded bg-[#1e2532] text-white text-xs">admin</code>
            </p>
          </div>
          <div className="p-3 rounded-lg bg-app-bg border border-app-border">
            <p className="text-app-text-secondary">
              <span className="text-app-text font-medium">API:</span> All API requests use the{' '}
              <code className="px-1.5 py-0.5 rounded bg-[#1e2532] text-[#25D366] text-xs">X-Api-Key</code> header
            </p>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <a
          href={config.baseUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-4 rounded-xl bg-app-surface border border-app-border hover:border-[#25D366]/30 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#25D366]/10 flex items-center justify-center">
              <ExternalLink className="w-4 h-4 text-[#25D366]" />
            </div>
            <div>
              <p className="text-app-text text-sm font-medium">WAHA Dashboard</p>
              <p className="text-app-text-muted text-xs">Open the native dashboard</p>
            </div>
          </div>
        </a>
        <a
          href="https://waha.devlike.pro/docs/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-4 rounded-xl bg-app-surface border border-app-border hover:border-[#25D366]/30 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <ExternalLink className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="text-app-text text-sm font-medium">API Docs</p>
              <p className="text-app-text-muted text-xs">View WAHA documentation</p>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}
