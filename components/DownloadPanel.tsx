import React from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { DownloadIcon, LoadingIcon } from './Icons';

interface DownloadPanelProps {
    onDownload: () => void;
    disabled: boolean;
    isGenerating: boolean;
}

const DownloadPanel: React.FC<DownloadPanelProps> = ({ onDownload, disabled, isGenerating }) => {
    const { t } = useTranslations();

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mt-8 text-center">
            <h3 className="text-2xl font-bold mb-2 text-indigo-600">{t('downloadStepTitle')}</h3>
            <p className="text-slate-600 mb-6">{t('downloadStepDesc')}</p>
            <button
                onClick={onDownload}
                disabled={disabled}
                className="inline-flex items-center justify-center bg-indigo-600 text-white font-bold py-3 px-8 rounded-md hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors text-lg shadow-lg hover:shadow-indigo-500/50"
            >
                {isGenerating ? (
                    <>
                        <LoadingIcon className="w-6 h-6 mr-3 animate-spin" />
                        {t('downloadingMessage')}
                    </>
                ) : (
                    <>
                        <DownloadIcon className="w-6 h-6 mr-3" />
                        {t('downloadPdfButton')}
                    </>
                )}
            </button>
        </div>
    );
};

export default DownloadPanel;
