import React from 'react';
import type { AppSettings, CropMarkType } from '../types';
import { UploadIcon, GridIcon, MarginIcon, CutIcon } from './Icons';
import { useTranslations } from '../hooks/useTranslations';
import AdPlaceholder from './AdPlaceholder';
import ModernSlider from './ModernSlider';
import { MM_PER_INCH } from '../constants';

interface SettingsPanelProps {
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
  onImageUpload: (file: File) => void;
  hasImage: boolean;
}

const RadioPill: React.FC<{
  label: string;
  value: CropMarkType;
  checked: boolean;
  onChange: (value: CropMarkType) => void;
}> = ({ label, value, checked, onChange }) => {
  const baseClasses = "w-full text-center px-2 py-1 rounded-md transition-colors text-sm font-medium cursor-pointer";
  const activeClasses = "bg-white shadow text-slate-800";
  const inactiveClasses = "text-slate-600 hover:bg-slate-200";

  return (
    <label className={`${baseClasses} ${checked ? activeClasses : inactiveClasses}`}>
      <input
        type="radio"
        name="crop-mark-type"
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="sr-only"
        aria-label={label}
      />
      {label}
    </label>
  );
};

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onSettingsChange, onImageUpload, hasImage }) => {
  const { t } = useTranslations();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const handleSettingChange = <K extends keyof AppSettings,>(key: K, value: AppSettings[K]) => {
    onSettingsChange({ ...settings, [key]: value });
  };
  
  const handleUnitChange = (newUnit: 'mm' | 'in') => {
    if (settings.marginUnit === newUnit) return;

    const currentMargin = settings.printerMargin;
    let newMargin;

    if (newUnit === 'in') { // from mm to in
      newMargin = parseFloat((currentMargin / MM_PER_INCH).toFixed(2));
    } else { // from in to mm
      newMargin = Math.round(currentMargin * MM_PER_INCH);
    }
    
    onSettingsChange({
      ...settings,
      marginUnit: newUnit,
      printerMargin: newMargin,
    });
  };

  const isMm = settings.marginUnit === 'mm';
  const sliderMax = isMm ? 20 : 1;
  const sliderStep = isMm ? 1 : 0.05;

  const unitButtonClasses = "px-2 py-0.5 rounded-md transition-colors text-sm font-medium";
  const activeUnitClasses = "bg-white shadow text-slate-800";
  const inactiveUnitClasses = "text-slate-500 hover:bg-slate-200";

  const InputGroup: React.FC<{ label: string; icon: React.ReactNode; children: React.ReactNode }> = ({ label, icon, children }) => (
    <div className="mb-6">
      <label className="flex items-center text-lg font-semibold text-slate-700 mb-2">
        {icon}
        <span className="ml-2">{label}</span>
      </label>
      {children}
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
      <h2 className="text-2xl font-bold mb-6 border-b pb-4">{t('configTitle')}</h2>
      
      <InputGroup label={t('step1Label')} icon={<UploadIcon className="w-6 h-6 text-indigo-500" />}>
        <div className="mt-1 flex flex-col items-center justify-center px-6 pt-8 pb-8 border-2 border-slate-300 border-dashed rounded-md text-center">
          <UploadIcon className="w-10 h-10 text-slate-400 mb-4" />
          <label htmlFor="file-upload" className="relative cursor-pointer bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500 transition-colors">
            <span>{hasImage ? t('replaceImage') : t('uploadFile')}</span>
            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
          </label>
          <p className="mt-2 text-sm text-slate-600">{t('dragAndDrop')}</p>
          <p className="mt-1 text-xs text-slate-500">{t('fileTypes')}</p>
        </div>
      </InputGroup>

      <InputGroup label={t('step2Label')} icon={<GridIcon className="w-6 h-6 text-indigo-500" />}>
        <div className="space-y-4 pt-2">
          <ModernSlider
            label={t('columnsLabel')}
            value={settings.gridCols}
            min={1}
            max={10}
            onChange={(e) => handleSettingChange('gridCols', parseInt(e.target.value, 10))}
          />
          <ModernSlider
            label={t('rowsLabel')}
            value={settings.gridRows}
            min={1}
            max={10}
            onChange={(e) => handleSettingChange('gridRows', parseInt(e.target.value, 10))}
          />
        </div>
        <p className="text-sm text-slate-500 mt-4 text-center font-medium">{t('totalPages', { count: settings.gridCols * settings.gridRows })}</p>
      </InputGroup>

      <InputGroup label={t('step3Label')} icon={<MarginIcon className="w-6 h-6 text-indigo-500" />}>
        <div className="flex justify-end mb-2">
            <div className="inline-flex bg-slate-100 border border-slate-200 rounded-lg p-0.5">
                <button 
                  onClick={() => handleUnitChange('mm')} 
                  className={`${unitButtonClasses} ${isMm ? activeUnitClasses : inactiveUnitClasses}`}
                  aria-pressed={isMm}
                >
                  {t('marginUnitMm')}
                </button>
                <button 
                  onClick={() => handleUnitChange('in')} 
                  className={`${unitButtonClasses} ${!isMm ? activeUnitClasses : inactiveUnitClasses}`}
                  aria-pressed={!isMm}
                >
                  {t('marginUnitIn')}
                </button>
            </div>
        </div>
         <div className="pt-2">
           <ModernSlider
              value={settings.printerMargin}
              min={0}
              max={sliderMax}
              step={sliderStep}
              unit={settings.marginUnit}
              onChange={(e) => handleSettingChange('printerMargin', parseFloat(e.target.value))}
            />
         </div>
         <p className="text-sm text-slate-500 mt-2">{t('marginDescription')}</p>
      </InputGroup>

      <InputGroup label={t('step4Label')} icon={<CutIcon className="w-6 h-6 text-indigo-500" />}>
        <div className="flex flex-col space-y-2">
            <label className="font-medium text-slate-700">{t('cropMarksStyleLabel')}</label>
            <div className="flex w-full bg-slate-100 border border-slate-200 rounded-lg p-1">
                <RadioPill
                    label={t('cropMarkTypeNone')}
                    value="none"
                    checked={settings.cropMarkType === 'none'}
                    onChange={(v) => handleSettingChange('cropMarkType', v)}
                />
                <RadioPill
                    label={t('cropMarkTypeCorners')}
                    value="corners"
                    checked={settings.cropMarkType === 'corners'}
                    onChange={(v) => handleSettingChange('cropMarkType', v)}
                />
                <RadioPill
                    label={t('cropMarkTypeFull')}
                    value="full"
                    checked={settings.cropMarkType === 'full'}
                    onChange={(v) => handleSettingChange('cropMarkType', v)}
                />
            </div>
        </div>
        <p className="text-sm text-slate-500 mt-2">{t('cropMarksDescription')}</p>
      </InputGroup>

      <div className="mt-8">
        <AdPlaceholder className="h-64 w-full" />
      </div>
    </div>
  );
};

export default SettingsPanel;