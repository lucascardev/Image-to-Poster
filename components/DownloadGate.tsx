import React, { useEffect, useRef, useState } from 'react';
import { useTranslations } from '../hooks/useTranslations';

const AD_URL = 'https://www.effectivecpmnetwork.com/sx4e2juqdp?key=329243324bd75ed09c3b022d56d0520b';
const COUNTDOWN_SECONDS = 15;

interface DownloadGateProps {
  onConfirm: () => void;
  onClose: () => void;
}

const DownloadGate: React.FC<DownloadGateProps> = ({ onConfirm, onClose }) => {
  const { t } = useTranslations();
  const [seconds, setSeconds] = useState(COUNTDOWN_SECONDS);
  const [ready, setReady] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Open the ad URL and start the countdown as soon as the gate mounts
  useEffect(() => {
    window.open(AD_URL, '_blank', 'noopener,noreferrer');

    intervalRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(intervalRef.current!);
          setReady(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  // Fraction of the circle that is filled (0 → 1)
  const progress = (COUNTDOWN_SECONDS - seconds) / COUNTDOWN_SECONDS;
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(6px)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dlgate-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-5 text-white">
          <h2 id="dlgate-title" className="text-xl font-bold">
            {t('downloadGateTitle')}
          </h2>
          <p className="text-indigo-200 text-sm mt-1">{t('downloadGateSubtitle')}</p>
        </div>

        {/* Body */}
        <div className="px-6 py-8 flex flex-col items-center gap-6">
          {/* Circular countdown */}
          <div className="relative flex items-center justify-center" style={{ width: 80, height: 80 }}>
            <svg width="80" height="80" className="-rotate-90">
              {/* Track */}
              <circle cx="40" cy="40" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="6" />
              {/* Progress */}
              <circle
                cx="40"
                cy="40"
                r={radius}
                fill="none"
                stroke={ready ? '#22c55e' : '#6366f1'}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.3s' }}
              />
            </svg>
            <span
              className="absolute text-2xl font-bold"
              style={{ color: ready ? '#16a34a' : '#4f46e5' }}
            >
              {ready ? '✓' : seconds}
            </span>
          </div>

          <p className="text-slate-600 text-center text-sm leading-relaxed">
            {ready ? t('downloadGateReady') : t('downloadGateWaiting')}
          </p>

          {/* Ad notice */}
          <div className="w-full bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-xs text-amber-700 flex items-start gap-2">
            <span className="mt-0.5">💡</span>
            <span>{t('downloadGateAdNotice')}</span>
          </div>

          {/* Actions */}
          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-slate-300 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              {t('cancel')}
            </button>
            <button
              onClick={handleConfirm}
              disabled={!ready}
              className="flex-1 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors shadow-md"
            >
              {ready ? t('downloadGateDownloadNow') : `${t('downloadGateWaitBtn')} ${seconds}s`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadGate;
