import React from 'react';
import { DownloadIcon, CutIcon, AssembleIcon } from './Icons';
import { useTranslations } from '../hooks/useTranslations';

const Instructions: React.FC = () => {
    const { t } = useTranslations();

    const Step: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
        <div className="flex">
            <div className="flex-shrink-0 mr-4">
                <div className="bg-indigo-500 rounded-full w-12 h-12 flex items-center justify-center text-white">
                    {icon}
                </div>
            </div>
            <div>
                <h4 className="text-lg font-bold">{title}</h4>
                <p className="mt-1 text-slate-600">{children}</p>
            </div>
        </div>
    );

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mt-8">
            <h3 className="text-2xl font-bold mb-4">{t('instructionsTitle')}</h3>
            <div className="space-y-6">
                <Step icon={<DownloadIcon className="w-6 h-6" />} title={t('step1Title')}>
                    {t('step1Desc')}
                </Step>
                <Step icon={<CutIcon className="w-6 h-6" />} title={t('step2Title')}>
                    {t('step2Desc')}
                </Step>
                <Step icon={<AssembleIcon className="w-6 h-6" />} title={t('step3Title')}>
                    {t('step3Desc')}
                </Step>
            </div>
        </div>
    );
};

export default Instructions;