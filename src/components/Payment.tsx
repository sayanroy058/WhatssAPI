import { useEffect, useState, type ChangeEvent } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Check, Upload, Clock, Copy, InfinityIcon, Loader2, KeyRound } from 'lucide-react';
import Logo from '../assets/Logo.png';
import MonthlyQR from '../assets/Monthly QR.png';
import YearlyQR from '../assets/Yearly QR.png';

const WAIT_SECONDS = 20;
const GENERATING_SECONDS = 3;

const planFeatures = [
  'Unlimited WhatsApp messages',
  'Multiple sessions',
  'Full HTTP API access',
  'Real-time webhooks',
  'Chat history & media support',
  'Priority support',
  '99.9% uptime guarantee',
  'No setup or hidden fees',
];

export function Payment() {
  const { plan } = useParams<{ plan: string }>();
  const isYearly = plan === 'yearly';

  const [secondsLeft, setSecondsLeft] = useState(WAIT_SECONDS);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [credentialsReady, setCredentialsReady] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  useEffect(() => {
    if (!generating) return;
    const timer = setTimeout(() => {
      setGenerating(false);
      setCredentialsReady(true);
    }, GENERATING_SECONDS * 1000);
    return () => clearTimeout(timer);
  }, [generating]);

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setScreenshot(dataUrl);
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan, dataUrl }),
        });
        if (!res.ok) {
          const body = await res.text();
          throw new Error(`${res.status}: ${body}`);
        }
      } catch (err) {
        console.error('Failed to upload payment screenshot to Blob storage:', err);
        setUploadError('Could not save the screenshot to storage. It is only visible in this browser session.');
      }
      setUploading(false);
      setGenerating(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen bg-app-bg flex flex-col">
      <header className="flex items-center justify-center py-6 border-b border-app-border">
        <img src={Logo} alt="RelayX Logo" className="h-9 w-auto" />
      </header>

      {!screenshot ? (
        <div className="flex-1 grid lg:grid-cols-2">
          {/* Left: plan details */}
          <div className="flex flex-col justify-center px-6 md:px-12 py-10 lg:py-0">
            <div className="max-w-md mx-auto lg:mx-0 w-full">
              <div className="inline-flex items-center gap-2 text-app-text-secondary text-sm mb-3">
                <InfinityIcon className="w-4 h-4 text-[#25D366]" />
                Unlimited Plan{isYearly ? ' · Yearly' : ''}
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-app-text">
                {isYearly ? '₹12000' : '₹1200'}
                <span className="text-base font-medium text-app-text-muted"> / {isYearly ? 'year' : 'month'}</span>
              </h1>
              <p className="mt-2 text-app-text-secondary text-sm">
                {isYearly
                  ? 'Pay once a year and save ₹2400 — equivalent of 2 months free.'
                  : 'Unlimited messages, full API access, and priority support.'}
              </p>

              <div className="mt-8 space-y-3">
                {planFeatures.map(feature => (
                  <div key={feature} className="flex items-start gap-3">
                    <div className="mt-0.5 w-5 h-5 rounded-full bg-[#25D366]/15 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-[#25D366]" />
                    </div>
                    <span className="text-sm text-app-text">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: QR code */}
          <div className="flex flex-col items-center justify-center px-6 py-10 lg:py-0 bg-app-surface border-t lg:border-t-0 lg:border-l border-app-border">
            <p className="text-app-text-secondary text-sm mb-4">Scan the QR code below to complete your payment</p>
            <img
              src={isYearly ? YearlyQR : MonthlyQR}
              alt={`${isYearly ? 'Yearly' : 'Monthly'} payment QR code`}
              className="w-full max-w-[min(80vh,26rem)] h-auto rounded-xl border border-app-border bg-white p-3"
            />

            {secondsLeft > 0 ? (
              <div className="flex items-center justify-center gap-2 text-app-text-muted text-sm mt-6">
                <Clock className="w-4 h-4" />
                Upload option unlocks in {secondsLeft}s
              </div>
            ) : (
              <label className="mt-6 w-full max-w-[min(80vh,26rem)] flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#25D366] text-white font-medium text-sm cursor-pointer hover:bg-[#1fb855] transition-colors">
                <Upload className="w-4 h-4" />
                {uploading ? 'Uploading...' : 'Upload Payment Screenshot'}
                <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={handleUpload} />
              </label>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center px-4 py-10">
          <div className="w-full max-w-md">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Check className="w-7 h-7 text-emerald-400" />
              </div>
            </div>
            <h1 className="text-app-text font-bold text-xl mb-1 text-center">Payment Successful</h1>
            <p className="text-app-text-muted text-sm mb-6 text-center">
              {generating ? 'Verifying your payment and generating access credentials...' : 'Generating credentials to sign in to your RelayX dashboard - Stay on the Same Page. Don\'t Leave.'}
            </p>
            {uploadError && (
              <p className="text-amber-400 text-xs text-center mb-4">{uploadError}</p>
            )}

            <div className="flex justify-center mb-6">
              <img
                src={screenshot}
                alt="Uploaded payment screenshot"
                className="max-w-full h-auto rounded-xl border border-app-border"
              />
            </div>

            {generating ? (
              <div className="flex flex-col items-center justify-center gap-3 py-6">
                <div className="relative w-12 h-12">
                  <Loader2 className="w-12 h-12 text-[#25D366] animate-spin" />
                  <KeyRound className="w-5 h-5 text-[#25D366] absolute inset-0 m-auto" />
                </div>
                <p className="text-app-text-secondary text-sm animate-pulse">Generating your login credentials...</p>
              </div>
            ) : credentialsReady && (
            <div className="space-y-3 animate-fade-in">
              <div className="p-3 rounded-lg bg-app-bg border border-app-border flex items-center justify-between">
                <div>
                  <p className="text-app-text-muted text-xs">Username</p>
                  <p className="text-app-text font-mono text-sm">user9443</p>
                </div>
                <button onClick={() => handleCopy('user9443')} className="text-app-text-muted hover:text-app-text">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <div className="p-3 rounded-lg bg-app-bg border border-app-border flex items-center justify-between">
                <div>
                  <p className="text-app-text-muted text-xs">Password</p>
                  <p className="text-app-text font-mono text-sm">V7#mQ2!xLp9@Rd4K</p>
                </div>
                <button onClick={() => handleCopy('V7#mQ2!xLp9@Rd4K')} className="text-app-text-muted hover:text-app-text">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              {copied && <p className="text-emerald-400 text-xs text-center">Copied to clipboard!</p>}
            </div>
            )}

            {credentialsReady && (
            <Link
              to="/login"
              className="mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#25D366] text-white font-medium text-sm hover:bg-[#1fb855] transition-colors"
            >
              Continue to Login
            </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
