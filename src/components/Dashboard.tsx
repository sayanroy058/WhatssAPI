import { useState, useEffect, useCallback } from 'react';
import {
  Smartphone,
  Activity,
  Wifi,
  WifiOff,
  RefreshCw,
  ArrowRight,
  TrendingUp,
  Users,
  MessageCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getSessions, checkHealth, type Session } from '../api/wahaApi';

export function Dashboard() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setRefreshing(true);
      const [sessionsData, healthy] = await Promise.all([
        getSessions(),
        checkHealth(),
      ]);
      setSessions(sessionsData);
      setIsHealthy(healthy);
    } catch {
      setIsHealthy(false);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const activeSessions = sessions.filter(s => s.status === 'WORKING' || s.status === 'STARTING').length;
  const totalSessions = sessions.length;

  const stats = [
    {
      icon: Smartphone,
      label: 'Total Sessions',
      value: totalSessions,
      color: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-500/10',
      iconColor: 'text-blue-400',
    },
    {
      icon: Activity,
      label: 'Active Sessions',
      value: activeSessions,
      color: 'from-emerald-500 to-emerald-600',
      bg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-400',
    },
    {
      icon: Wifi,
      label: 'API Status',
      value: isHealthy === null ? '...' : isHealthy ? 'Connected' : 'Offline',
      color: isHealthy ? 'from-emerald-500 to-emerald-600' : 'from-red-500 to-red-600',
      bg: isHealthy ? 'bg-emerald-500/10' : 'bg-red-500/10',
      iconColor: isHealthy ? 'text-emerald-400' : 'text-red-400',
      isStatus: true,
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-app-surface rounded-xl p-6 border border-app-border">
              <div className="skeleton h-4 w-20 mb-3" />
              <div className="skeleton h-8 w-12" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-app-text">Dashboard</h1>
          <p className="text-app-text-muted mt-1">Overview of your WhatsApp API instance</p>
        </div>
        <button
          onClick={fetchData}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-app-surface border border-app-border text-sm text-app-text-secondary hover:text-white hover:border-app-border-hover transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map(({ icon: Icon, label, value, color, bg, iconColor, isStatus }) => (
          <div
            key={label}
            className="bg-app-surface rounded-xl p-6 border border-app-border hover:border-app-border-hover transition-all duration-200 relative overflow-hidden group"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${color} opacity-[0.03] rounded-bl-full`} />
            <div className="flex items-start justify-between relative">
              <div className="space-y-3">
                <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
                <div>
                  <p className="text-app-text-muted text-sm">{label}</p>
                  <p className="text-2xl font-bold text-app-text mt-0.5">
                    {isStatus ? (
                      <span className="flex items-center gap-2">
                        {isHealthy ? (
                          <Wifi className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <WifiOff className="w-4 h-4 text-red-400" />
                        )}
                        {value}
                      </span>
                    ) : (
                      value
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions & Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-app-surface rounded-xl border border-app-border p-6">
          <h2 className="text-lg font-semibold text-app-text mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#25D366]" />
            Quick Actions
          </h2>
          <div className="space-y-3">
            <Link
              to="/sessions"
              className="flex items-center justify-between p-4 rounded-lg bg-app-bg border border-app-border hover:border-[#25D366]/30 hover:bg-[#25D366]/[0.02] transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#25D366]/10 flex items-center justify-center">
                  <Smartphone className="w-4 h-4 text-[#25D366]" />
                </div>
                <div>
                  <p className="text-app-text text-sm font-medium">Manage Sessions</p>
                  <p className="text-app-text-muted text-xs">Create, view, or delete WhatsApp sessions</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-app-text-muted group-hover:text-[#25D366] group-hover:translate-x-1 transition-all" />
            </Link>
            <Link
              to="/chats"
              className="flex items-center justify-between p-4 rounded-lg bg-app-bg border border-app-border hover:border-[#25D366]/30 hover:bg-[#25D366]/[0.02] transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#25D366]/10 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                </div>
                <div>
                  <p className="text-app-text text-sm font-medium">View Chats</p>
                  <p className="text-app-text-muted text-xs">Browse conversations and send messages</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-app-text-muted group-hover:text-[#25D366] group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>

        {/* Session List */}
        <div className="bg-app-surface rounded-xl border border-app-border p-6">
          <h2 className="text-lg font-semibold text-app-text mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#25D366]" />
            Sessions ({totalSessions})
          </h2>
          {sessions.length === 0 ? (
            <div className="text-center py-8">
              <Smartphone className="w-10 h-10 text-app-text-muted mx-auto mb-3" />
              <p className="text-app-text-muted text-sm">No sessions yet</p>
              <Link
                to="/sessions"
                className="inline-block mt-3 text-sm text-[#25D366] hover:underline"
              >
                Create your first session →
              </Link>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {sessions.map(session => (
                <div
                  key={session.name}
                  className="flex items-center justify-between p-3 rounded-lg bg-app-bg border border-app-border hover:border-app-border-hover transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      session.status === 'WORKING' ? 'bg-[#22c55e]' :
                      session.status === 'STARTING' ? 'bg-[#f59e0b] animate-pulse' :
                      session.status === 'STOPPED' ? 'bg-[#6b7280]' :
                      'bg-[#ef4444]'
                    }`} />
                    <span className="text-app-text text-sm font-medium">{session.name}</span>
                  </div>
                  <span className="text-xs text-app-text-muted uppercase tracking-wider">{session.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
