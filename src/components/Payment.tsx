import { useEffect, useState, type ChangeEvent } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Check, Upload, Clock, Copy } from 'lucide-react';
import Logo from '../assets/Logo.png';
import MonthlyQR from '../assets/Monthly QR.png';
import YearlyQR from '../assets/Yearly QR.png';

const WAIT_SECONDS = 50;

export function Payment() {
  const { plan } = useParams<{ plan: string }>();
  const isYearly = plan === 'yearly';

  const [secondsLeft, setSecondsLeft] = useState(WAIT_SECONDS);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setScreenshot(file.name);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen bg-app-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img src={Logo} alt="RelayX Logo" className="h-10 w-auto" />
        </div>

        <div className="bg-app-surface border border-app-border rounded-2xl p-6 shadow-lg">
          {!screenshot ? (
            <>
              <h1 className="text-app-text font-bold text-xl mb-1 text-center">
                {isYearly ? 'Yearly Plan' : 'Monthly Plan'} — {isYearly ? '₹12000/year' : '₹1200/month'}
              </h1>
              <p className="text-app-text-muted text-sm mb-6 text-center">
                Scan the QR code below to complete your payment
              </p>

              <div className="flex justify-center mb-6">
                <img
                  src={isYearly ? YearlyQR : MonthlyQR}
                  alt={`${isYearly ? 'Yearly' : 'Monthly'} payment QR code`}
                  className="w-56 h-56 rounded-xl border border-app-border object-contain bg-white p-2"
                />
              </div>

              {secondsLeft > 0 ? (
                <div className="flex items-center justify-center gap-2 text-app-text-muted text-sm">
                  <Clock className="w-4 h-4" />
                  Upload option unlocks in {secondsLeft}s
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#25D366] text-white font-medium text-sm cursor-pointer hover:bg-[#1fb855] transition-colors">
                    <Upload className="w-4 h-4" />
                    Upload Payment Screenshot
                    <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                  </label>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <Check className="w-7 h-7 text-emerald-400" />
                </div>
              </div>
              <h1 className="text-app-text font-bold text-xl mb-1 text-center">Payment Successful</h1>
              <p className="text-app-text-muted text-sm mb-6 text-center">
                Use these credentials to sign in to your RelayX dashboard
              </p>

              <div className="space-y-3">
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

              <Link
                to="/login"
                className="mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#25D366] text-white font-medium text-sm hover:bg-[#1fb855] transition-colors"
              >
                Continue to Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
