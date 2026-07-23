import { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Trash2,
  RefreshCw,
  Camera,
  LogOut,
  Copy,
  AlertCircle,
  Play,
  Square,
} from 'lucide-react';
import {
  getSessions,
  createSession,
  deleteSession,
  startSession,
  stopSession,
  logoutSession,
  getScreenshot,
  getQrCode,
  revokeBlobUrl,
  type Session,
} from '../api/wahaApi';

export function Sessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('default');
  const [qrSession, setQrSession] = useState<string | null>(null);
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [screenshotSession, setScreenshotSession] = useState<string | null>(null);
  const [screenshotImg, setScreenshotImg] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    try {
      setError(null);
      const data = await getSessions();
      setSessions(data);
    } catch {
      setError('Failed to fetch sessions. Is WAHA running?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    try {
      setActionLoading('create');
      setError(null);
      await createSession(newName.trim());
      setShowCreate(false);
      setNewName('default');
    } catch {
      setError('Failed to create session. Check if WAHA is running.');
    } finally {
      await fetchSessions();
      setActionLoading(null);
    }
  };

  const handleDelete = async (name: string) => {
    if (!confirm(`Delete session "${name}"? This cannot be undone.`)) return;
    try {
      setActionLoading(`delete-${name}`);
      await deleteSession(name);
      await fetchSessions();
    } catch {
      setError(`Failed to delete session "${name}"`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleStart = async (name: string) => {
    try {
      setActionLoading(`start-${name}`);
      await startSession(name);
      await fetchSessions();
    } catch {
      setError(`Failed to start "${name}"`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleStop = async (name: string) => {
    try {
      setActionLoading(`stop-${name}`);
      await stopSession(name);
      await fetchSessions();
    } catch {
      setError(`Failed to stop "${name}"`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogout = async (name: string) => {
    if (!confirm(`Logout session "${name}"? You'll need to scan QR again.`)) return;
    try {
      setActionLoading(`logout-${name}`);
      await logoutSession(name);
      await fetchSessions();
    } catch {
      setError(`Failed to logout "${name}"`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleShowScreenshot = async (name: string) => {
    try {
      setActionLoading(`screenshot-${name}`);
      // Revoke previous URL
      if (screenshotImg) revokeBlobUrl(screenshotImg);
      const url = await getScreenshot(name);
      setScreenshotImg(url);
      setScreenshotSession(name);
    } catch {
      setError(`Failed to get screenshot for "${name}"`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleShowQR = async (name: string) => {
    try {
      setActionLoading(`qr-${name}`);
      // Revoke previous URL
      if (qrImage) revokeBlobUrl(qrImage);
      const img = await getQrCode(name);
      setQrImage(img);
      setQrSession(name);
    } catch {
      setError(`Failed to get QR code for "${name}"`);
    } finally {
      setActionLoading(null);
    }
  };

  const closeQrModal = () => {
    if (qrImage) revokeBlobUrl(qrImage);
    setQrSession(null);
    setQrImage(null);
  };

  const closeScreenshotModal = () => {
    if (screenshotImg) revokeBlobUrl(screenshotImg);
    setScreenshotSession(null);
    setScreenshotImg(null);
  };

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      WORKING: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      STARTING: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      STOPPED: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
      FAILED: 'bg-red-500/10 text-red-400 border-red-500/20',
      'SCAN_QR_CODE': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    };
    return `px-2 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles.STOPPED}`;
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
        <div className="skeleton h-8 w-48" />
        <div className="grid gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton h-20 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-app-text">Sessions</h1>
          <p className="text-app-text-muted mt-1">Manage your WhatsApp sessions</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchSessions}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-app-surface border border-app-border text-sm text-app-text-secondary hover:text-white hover:border-app-border-hover transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#25D366] hover:bg-[#1fb855] text-black font-medium text-sm transition-all shadow-lg shadow-[#25D366]/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            New Session
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
          <button onClick={() => setError(null)} className="ml-auto hover:text-red-300">Dismiss</button>
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-app-surface rounded-xl border border-app-border p-6 w-full max-w-md animate-fade-in">
            <h2 className="text-lg font-semibold text-app-text mb-4">Create New Session</h2>
            <label className="block text-sm text-app-text-secondary mb-2">Session Name</label>
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
              className="w-full px-4 py-2.5 rounded-lg bg-app-bg border border-app-border text-white placeholder-app-text-muted focus:outline-none focus:border-[#25D366] transition-colors text-sm"
              placeholder="e.g., default"
              autoFocus
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowCreate(false)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-app-border text-app-text-secondary hover:text-white hover:border-app-border-hover text-sm transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!newName.trim() || actionLoading === 'create'}
                className="flex-1 px-4 py-2.5 rounded-lg bg-[#25D366] hover:bg-[#1fb855] text-black font-medium text-sm transition-all disabled:opacity-50"
              >
                {actionLoading === 'create' ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Modal */}
      {qrSession && qrImage && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={closeQrModal}>
          <div className="bg-app-surface rounded-xl border border-app-border p-6 w-full max-w-sm animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-app-text">Scan QR Code</h2>
              <span className="text-sm text-app-text-secondary">{qrSession}</span>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <img src={qrImage} alt="QR Code" className="w-full rounded" />
            </div>
            <p className="text-xs text-app-text-muted mt-3 text-center">
              Open WhatsApp on your phone → Settings → Linked Devices → Scan QR
            </p>
            <button
              onClick={closeQrModal}
              className="w-full mt-3 px-4 py-2 rounded-lg border border-app-border text-app-text-secondary hover:text-white text-sm transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Screenshot Modal */}
      {screenshotSession && screenshotImg && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={closeScreenshotModal}>
          <div className="bg-app-surface rounded-xl border border-app-border p-6 w-full max-w-md animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-app-text">Screenshot</h2>
              <span className="text-sm text-app-text-secondary">{screenshotSession}</span>
            </div>
            <img src={screenshotImg} alt="Screenshot" className="w-full rounded-lg border border-app-border" />
            <button
              onClick={closeScreenshotModal}
              className="w-full mt-3 px-4 py-2 rounded-lg border border-app-border text-app-text-secondary hover:text-white text-sm transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Session List */}
      {sessions.length === 0 ? (
        <div className="text-center py-16 bg-app-surface rounded-xl border border-app-border">
          <SmartphoneIcon className="w-16 h-16 text-app-text-muted mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-app-text mb-2">No Sessions Yet</h2>
          <p className="text-app-text-muted mb-4">Create your first WhatsApp session to get started</p>
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#25D366] hover:bg-[#1fb855] text-black font-medium transition-all"
          >
            <Plus className="w-4 h-4" /> Create Session
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map(session => (
            <div
              key={session.name}
              className="bg-app-surface rounded-xl border border-app-border hover:border-app-border-hover transition-all overflow-hidden"
            >
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full animate-pulse ${
                    session.status === 'WORKING' ? 'bg-[#22c55e]' :
                    session.status === 'STARTING' ? 'bg-[#f59e0b]' :
                    session.status === 'STOPPED' ? 'bg-[#6b7280]' :
                    'bg-[#ef4444]'
                  }`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-app-text font-medium">{session.name}</span>
                      <button
                        onClick={() => navigator.clipboard.writeText(session.name)}
                        className="p-0.5 hover:bg-app-surface-hover rounded transition-colors"
                        title="Copy name"
                      >
                        <Copy className="w-3 h-3 text-app-text-muted hover:text-white" />
                      </button>
                    </div>
                    <span className={statusBadge(session.status)}>{session.status}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {session.status === 'STOPPED' && (
                    <button
                      onClick={() => handleStart(session.name)}
                      disabled={actionLoading === `start-${session.name}`}
                      className="p-2 rounded-lg hover:bg-emerald-500/10 text-app-text-secondary hover:text-emerald-400 transition-all"
                      title="Start"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                  )}
                  {session.status === 'WORKING' && (
                    <button
                      onClick={() => handleStop(session.name)}
                      disabled={actionLoading === `stop-${session.name}`}
                      className="p-2 rounded-lg hover:bg-amber-500/10 text-app-text-secondary hover:text-amber-400 transition-all"
                      title="Stop"
                    >
                      <Square className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleShowQR(session.name)}
                    disabled={actionLoading === `qr-${session.name}`}
                    className="p-2 rounded-lg hover:bg-[#25D366]/10 text-app-text-secondary hover:text-[#25D366] transition-all"
                    title="Show QR Code"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleShowScreenshot(session.name)}
                    disabled={actionLoading === `screenshot-${session.name}`}
                    className="p-2 rounded-lg hover:bg-blue-500/10 text-app-text-secondary hover:text-blue-400 transition-all"
                    title="Screenshot"
                  >
                    <Camera className={`w-4 h-4 ${actionLoading === `screenshot-${session.name}` ? 'animate-pulse' : ''}`} />
                  </button>
                  <button
                    onClick={() => handleLogout(session.name)}
                    disabled={actionLoading === `logout-${session.name}`}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-app-text-secondary hover:text-red-400 transition-all"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(session.name)}
                    disabled={actionLoading === `delete-${session.name}`}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-app-text-secondary hover:text-red-400 transition-all"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SmartphoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  );
}
