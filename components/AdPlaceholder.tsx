import React from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { HoneygainLogoIcon, SevenKBetLogoIcon, CashIcon, FaceScanIcon, PowerIcon } from './Icons';

interface AdPlaceholderProps {
  className?: string;
  type?: 'honeygain' | 'sevenkbet' | 'honeygain-alt' | 'sevenkbet-alt';
}

const HoneyGainAd: React.FC<{ affiliateLink: string; className?: string }> = ({ affiliateLink, className }) => {
    const { t } = useTranslations();

    return (
        <a 
          href={affiliateLink} 
          target="_blank" 
          rel="noopener noreferrer" 
          className={`block bg-gradient-to-r from-sky-800 to-indigo-900 text-white rounded-lg shadow-lg overflow-hidden p-4 hover:scale-[1.02] transition-transform duration-200 ${className}`}
        >
            <div className="flex items-center justify-between gap-4">
                <div className="flex-shrink-0">
                    <HoneygainLogoIcon className="h-12 w-12 text-amber-400" />
                </div>
                <div className="flex-grow text-left">
                    <h4 className="font-bold text-base sm:text-lg text-amber-300">{t('honeygainTitle')}</h4>
                    <p className="text-xs sm:text-sm text-sky-200">{t('honeygainDescription')}</p>
                </div>
                <div className="flex-shrink-0">
                    <span className="bg-amber-400 text-amber-900 font-bold py-2 px-3 sm:py-3 sm:px-5 rounded-lg text-sm sm:text-base whitespace-nowrap">
                        {t('honeygainCTA')}
                    </span>
                </div>
            </div>
        </a>
    );
};

const HoneyGainAdAlt: React.FC<{ affiliateLink: string; className?: string }> = ({ affiliateLink, className }) => {
    const { t } = useTranslations();
    return (
        <a 
          href={affiliateLink} 
          target="_blank" 
          rel="noopener noreferrer" 
          className={`flex flex-col items-center justify-center text-center bg-gradient-to-b from-slate-700 to-slate-900 text-white rounded-lg shadow-lg overflow-hidden p-6 hover:scale-[1.02] transition-transform duration-200 ${className}`}
        >
            <div className="p-4 bg-slate-600 rounded-full mb-4">
                <PowerIcon className="h-10 w-10 text-amber-300" />
            </div>
            <h4 className="font-bold text-lg text-amber-300">{t('honeygainAltTitle')}</h4>
            <p className="text-sm text-slate-300 my-2">{t('honeygainAltDescription')}</p>
            <span className="mt-4 bg-amber-400 text-amber-900 font-bold py-2 px-5 rounded-lg text-base whitespace-nowrap">
                {t('honeygainAltCTA')}
            </span>
        </a>
    );
};


const SevenKBetAd: React.FC<{ affiliateLink: string; className?: string }> = ({ affiliateLink, className }) => {
    const { t } = useTranslations();

    return (
        <a 
          href={affiliateLink} 
          target="_blank" 
          rel="noopener noreferrer" 
          className={`block bg-gradient-to-br from-slate-900 to-[#1a1f3c] text-white rounded-lg shadow-lg overflow-hidden p-4 hover:scale-[1.02] transition-transform duration-200 ${className}`}
        >
            <div className="flex items-center justify-between gap-4">
                 <div className="flex-shrink-0 hidden sm:block">
                    <CashIcon className="h-12 w-12 text-lime-400/50" />
                </div>
                <div className="flex-grow text-center sm:text-left">
                    <SevenKBetLogoIcon className="h-8 w-auto mx-auto sm:mx-0 mb-1" />
                    <p className="text-xs sm:text-sm text-slate-300 font-medium">{t('sevenKBetTitle')}</p>
                </div>
                <div className="flex-shrink-0">
                    <span className="bg-gradient-to-br from-lime-400 to-lime-600 text-lime-950 font-bold py-3 px-5 rounded-lg text-base whitespace-nowrap shadow-md hover:shadow-lime-400/30 transition-shadow">
                        {t('sevenKBetCTA')}
                    </span>
                </div>
            </div>
        </a>
    );
};

const SevenKBetAdAlt: React.FC<{ affiliateLink: string; className?: string }> = ({ affiliateLink, className }) => {
    const { t } = useTranslations();

    return (
        <a 
          href={affiliateLink} 
          target="_blank" 
          rel="noopener noreferrer" 
          className={`block bg-gradient-to-br from-[#1e3a8a] to-[#1e1b4b] text-white rounded-lg shadow-lg overflow-hidden p-4 hover:scale-[1.02] transition-transform duration-200 ${className}`}
        >
            <div className="flex items-center justify-between gap-4">
                 <div className="flex-shrink-0">
                    <FaceScanIcon className="h-12 w-12 text-sky-300" />
                </div>
                <div className="flex-grow text-left">
                    <SevenKBetLogoIcon className="h-6 w-auto mb-1" />
                    <h4 className="font-bold text-base sm:text-lg text-sky-200">{t('sevenKBetAltTitle')}</h4>
                    <p className="text-xs sm:text-sm text-slate-300 font-medium">{t('sevenKBetAltDescription')}</p>
                </div>
                <div className="flex-shrink-0">
                    <span className="bg-sky-400 text-sky-950 font-bold py-2 px-4 rounded-lg text-sm whitespace-nowrap shadow-md transition-shadow">
                        {t('sevenKBetAltCTA')}
                    </span>
                </div>
            </div>
        </a>
    );
};


const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ className, type }) => {
  const { t } = useTranslations();
  
  if (type === 'honeygain') {
    const affiliateLink = "https://r.honeygain.me/LUCASBA132";
    return <HoneyGainAd affiliateLink={affiliateLink} className={className} />;
  }

  if (type === 'honeygain-alt') {
    const affiliateLink = "https://r.honeygain.me/LUCASBA132";
    return <HoneyGainAdAlt affiliateLink={affiliateLink} className={className} />;
  }

  if (type === 'sevenkbet') {
    const affiliateLink = "https://7k.bet.br?ref=384af674e59e";
    return <SevenKBetAd affiliateLink={affiliateLink} className={className} />;
  }

  if (type === 'sevenkbet-alt') {
    const affiliateLink = "https://7k.bet.br?ref=384af674e59e";
    return <SevenKBetAdAlt affiliateLink={affiliateLink} className={className} />;
  }

  return (
    <div
      className={`flex items-center justify-center bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 text-sm ${className}`}
      aria-label={t('advertisement')}
    >
      <span>{t('advertisement')}</span>
    </div>
  );
};

export default AdPlaceholder;