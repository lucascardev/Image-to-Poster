import React from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { DownloadIcon, ShoppingCartIcon } from './Icons';

const InstallInstructions: React.FC = () => {
    const { t } = useTranslations();
    const affiliateLink = "https://s.shopee.com.br/5L2LDyPjr3";

    return (
        <div className="space-y-8">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg shadow-md">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <DownloadIcon className="h-6 w-6 text-blue-500" />
                    </div>
                    <div className="ml-4">
                        <h3 className="text-lg font-bold text-blue-900">{t('installAppTitle')}</h3>
                        <p className="mt-2 text-sm text-blue-800">
                            {t('installAppDescription')}
                        </p>
                        <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-blue-700">
                            <li>{t('installStep1')}</li>
                            <li>{t('installStep2')}</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Recommended Tool Section */}
            <div className="bg-emerald-50 border-l-4 border-emerald-400 p-6 rounded-r-lg shadow-md">
                <div className="flex flex-col items-center text-center">
                    <div className="flex-shrink-0 mb-4">
                        <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center border border-slate-200">
                            <img src="https://down-br.img.susercontent.com/file/e5911e1c10d17311c2eac01e911d9f11.webp" alt="Cola em fita" className="w-28 h-28 object-contain" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-emerald-900">{t('recommendedToolTitle')}</h3>
                        <p className="mt-1 text-sm text-emerald-800">
                            {t('recommendedToolDesc')}
                        </p>
                    </div>
                </div>
                <div className="mt-4">
                     <p className="text-sm italic text-emerald-700 bg-emerald-100 p-3 rounded-md">
                        {t('recommendedToolTip')}
                    </p>
                </div>
                 <div className="mt-4 text-right">
                    <a
                        href={affiliateLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-emerald-600 text-white font-bold py-2 px-4 rounded-md hover:bg-emerald-700 transition-colors shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                    >
                        <ShoppingCartIcon className="w-5 h-5" />
                        {t('buyNowButton')}
                    </a>
                 </div>
            </div>
        </div>
    );
};

export default InstallInstructions;