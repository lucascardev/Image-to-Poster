import React from 'react';
import { useTranslations } from '../hooks/useTranslations';

const VideoTutorial: React.FC = () => {
  const { t } = useTranslations();
  // TODO: Replace this placeholder with the final VEO-generated video URL.
  const videoUrl = 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4';

  return (
    <div className="flex flex-col items-center justify-top bg-white border-2 border-dashed border-slate-300 rounded-lg p-8 h-full min-h-[400px] text-center shadow-inner">
      <h3 className="text-2xl font-bold text-slate-800 mb-2">{t('videoTutorialTitle')}</h3>
       <p className="text-slate-500 mb-6 max-w-md mx-auto">
        {t('videoTutorialSubtitle')}
      </p>

      <div className="w-full max-w-xl rounded-lg overflow-hidden shadow-lg">
        <video
            key={videoUrl}
            className="w-full h-full"
            autoPlay
            loop
            muted
            playsInline
        >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default VideoTutorial;