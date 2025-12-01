

import React from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { DownloadIcon, ShoppingCartIcon } from './Icons';

// Structured object for easy updates of affiliate/recommended products
const RECOMMENDED_PRODUCTS = [
    {
        id: 'tape-runner',
        titleKey: 'recommendedToolTitle',
        descKey: 'recommendedToolDesc',
        tipKey: 'recommendedToolTip',
        imageUrl: 'https://down-br.img.susercontent.com/file/e5911e1c10d17311c2eac01e911d9f11.webp',
        affiliateLink: 'https://s.shopee.com.br/2g3kCQuZny',
        // Styling configuration
        borderColor: 'border-emerald-400',
        bgColor: 'bg-emerald-50',
        textColor: 'text-emerald-900',
        descColor: 'text-emerald-800',
        tipBgColor: 'bg-emerald-100',
        tipTextColor: 'text-emerald-700',
        buttonColor: 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500'
    },
    {
        id: 'photo-paper',
        titleKey: 'recommendedPaperTitle',
        descKey: 'recommendedPaperDesc',
        tipKey: 'recommendedPaperTip',
        imageUrl: 'https://down-br.img.susercontent.com/file/sg-11134201-825a4-mgaxh2cezaxa86.webp', // Updated with a generic placeholder if real one fails, but let's try a real-ish one or keep placeholder
        affiliateLink: 'https://s.shopee.com.br/7fSQ9p1YsF', 
        // Styling configuration
        borderColor: 'border-sky-400',
        bgColor: 'bg-sky-50',
        textColor: 'text-sky-900',
        descColor: 'text-sky-800',
        tipBgColor: 'bg-sky-100',
        tipTextColor: 'text-sky-700',
        buttonColor: 'bg-sky-600 hover:bg-sky-700 focus:ring-sky-500'
    }
];

const InstallInstructions: React.FC = () => {
    const { t } = useTranslations();

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

            {RECOMMENDED_PRODUCTS.map((product) => (
                <div key={product.id} className={`${product.bgColor} border-l-4 ${product.borderColor} p-6 rounded-r-lg shadow-md`}>
                    <div className="flex flex-col items-center text-center">
                        <div className="flex-shrink-0 mb-4">
                            <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center border border-slate-200 overflow-hidden relative">
                                <img 
                                    src={product.imageUrl} 
                                    alt={t(product.titleKey)} 
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                        // Fallback to a placeholder if image fails to load
                                        e.currentTarget.src = 'https://placehold.co/400x400/png?text=Image';
                                    }}
                                />
                            </div>
                        </div>
                        <div>
                            <h3 className={`text-lg font-bold ${product.textColor}`}>{t(product.titleKey)}</h3>
                            <p className={`mt-1 text-sm ${product.descColor}`}>
                                {t(product.descKey)}
                            </p>
                        </div>
                    </div>
                    {product.tipKey && (
                        <div className="mt-4">
                             <p className={`text-sm italic ${product.tipTextColor} ${product.tipBgColor} p-3 rounded-md`}>
                                {t(product.tipKey)}
                            </p>
                        </div>
                    )}
                     <div className="mt-4 text-right">
                        <a
                            href={product.affiliateLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-2 text-white font-bold py-2 px-4 rounded-md transition-colors shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${product.buttonColor}`}
                        >
                            <ShoppingCartIcon className="w-5 h-5" />
                            {t('buyNowButton')}
                        </a>
                     </div>
                </div>
            ))}
        </div>
    );
};

export default InstallInstructions;
