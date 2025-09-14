import React from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { UploadIcon, GridIcon, CutIcon, DownloadIcon, AssembleIcon } from './Icons';

const HowItWorks: React.FC = () => {
  const { t } = useTranslations();

  const steps = [
    {
      icon: <UploadIcon className="w-8 h-8 text-indigo-500" />,
      title: t('tutorialStep1Title'),
      description: t('tutorialStep1Desc'),
    },
    {
      icon: <GridIcon className="w-8 h-8 text-indigo-500" />,
      title: t('tutorialStep2Title'),
      description: t('tutorialStep2Desc'),
    },
    {
      icon: <CutIcon className="w-8 h-8 text-indigo-500" />,
      title: t('tutorialStep3Title'),
      description: t('tutorialStep3Desc'),
    },
    {
      icon: <DownloadIcon className="w-8 h-8 text-indigo-500" />,
      title: t('tutorialStep4Title'),
      description: t('tutorialStep4Desc'),
    },
    {
      icon: <AssembleIcon className="w-8 h-8 text-indigo-500" />,
      title: t('tutorialStep5Title'),
      description: t('tutorialStep5Desc'),
    },
  ];

  const StepCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="flex flex-col items-center text-center p-4">
      <div className="bg-indigo-100 rounded-full p-4 mb-4">
        {icon}
      </div>
      <h4 className="text-lg font-bold text-slate-800 mb-2">{title}</h4>
      <p className="text-sm text-slate-600">{description}</p>
    </div>
  );

  return (
    <div className="bg-white rounded-lg p-8 shadow-md">
      <h2 className="text-3xl font-bold text-center text-slate-800 mb-2">{t('howItWorksTitle')}</h2>
      <p className="text-slate-500 text-center mb-8 max-w-2xl mx-auto">{t('howItWorksSubtitle')}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
        {steps.map((step, index) => (
          <StepCard key={index} {...step} />
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;
