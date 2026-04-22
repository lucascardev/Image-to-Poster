import React from 'react';
import { useTranslations } from '../hooks/useTranslations';

const BlogSection: React.FC = () => {
  const { t } = useTranslations();

  return (
    <div className="mt-20 max-w-4xl mx-auto px-4 prose prose-indigo text-slate-700">
      <article className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-3xl font-bold text-slate-800 mb-6 text-center">
          {t('blogTitle')}
        </h2>

        <section className="mb-8">
          <h3 className="text-2xl font-semibold mb-4 text-indigo-700">
            {t('blogSec1Title')}
          </h3>
          <p className="mb-4 leading-relaxed" dangerouslySetInnerHTML={{ __html: t('blogSec1P1') }} />
          <p className="mb-4 leading-relaxed">
            {t('blogSec1P2')}
          </p>
        </section>

        <section className="mb-8">
          <h3 className="text-2xl font-semibold mb-4 text-indigo-700">
            {t('blogSec2Title')}
          </h3>
          <ul className="list-disc pl-6 space-y-3 mb-6">
            <li dangerouslySetInnerHTML={{ __html: t('blogSec2Li1') }} />
            <li dangerouslySetInnerHTML={{ __html: t('blogSec2Li2') }} />
            <li dangerouslySetInnerHTML={{ __html: t('blogSec2Li3') }} />
          </ul>
        </section>

        <section>
          <h3 className="text-2xl font-semibold mb-4 text-indigo-700">
            {t('blogSec3Title')}
          </h3>
          <p className="mb-4 leading-relaxed">
            {t('blogSec3P1')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h4 className="font-bold text-slate-800">{t('blogSec3Card1Title')}</h4>
              <p className="text-sm text-slate-600">{t('blogSec3Card1Desc')}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h4 className="font-bold text-slate-800">{t('blogSec3Card2Title')}</h4>
              <p className="text-sm text-slate-600">{t('blogSec3Card2Desc')}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h4 className="font-bold text-slate-800">{t('blogSec3Card3Title')}</h4>
              <p className="text-sm text-slate-600">{t('blogSec3Card3Desc')}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h4 className="font-bold text-slate-800">{t('blogSec3Card4Title')}</h4>
              <p className="text-sm text-slate-600">{t('blogSec3Card4Desc')}</p>
            </div>
          </div>
        </section>

      </article>
    </div>
  );
};

export default BlogSection;
