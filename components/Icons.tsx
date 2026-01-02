



import React from 'react';

// Common props for icons
interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const UploadIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
  </svg>
);

export const LogoIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <rect x="3" y="3" width="8" height="8" rx="1.5" />
        <rect x="13" y="3" width="8" height="8" rx="1.5" opacity="0.6" />
        <rect x="3" y="13" width="8" height="8" rx="1.5" opacity="0.6" />
        <rect x="13" y="13" width="8" height="8" rx="1.5" opacity="0.6" />
    </svg>
);

// FIX: Add missing PixIcon component
export const PixIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.91 3.483c-1.25-.7-2.54-.97-3.9-.97H6.52c-2.48 0-4.5 2.02-4.5 4.5v9c0 1.94.93 3.65 2.37 4.67.24.16.53.18.79.05.26-.13.43-.39.43-.68v-2.3c0-.39-.23-.74-.58-.9-1.03-.45-1.76-1.48-1.76-2.65v-9c0-1.57 1.28-2.85 2.85-2.85h8.49c.89 0 1.76.22 2.54.64.28.15.62.07.82-.19.2-.26.22-.61.05-.89zM19.16 8.783v6.57c0 .29.17.55.43.68.26.13.55.11.79-.05 1.44-1.02 2.37-2.73 2.37-4.67v-1.48c0-.39-.23-.74-.58-.9-1.03-.45-1.76-1.48-1.76-2.65v-2.15c0-.41-.34-.75-.75-.75s-.75.34-.75.75v4.3z" />
  </svg>
);

export const PayPalIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M10.428 4.026h6.444c3.344 0 6.026 2.58 6.026 5.756 0 3.178-2.682 5.756-6.026 5.756h-1.99L13.1 21.344H8.484l3.522-11.562H9.37C6.026 9.782 3.344 7.202 3.344 4.026h7.084zM11.97 9.782h2.462c1.682 0 3.013-1.28 3.013-2.878 0-1.598-1.33-2.878-3.013-2.878h-2.462v5.756z" />
  </svg>
);

export const GridIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3.75v16.5m3.75-16.5v16.5m3.75-16.5v16.5m3.75-16.5v16.5" />
  </svg>
);

export const MarginIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 21H3.75A2.25 2.25 0 011.5 18.75V17.25m19.5 0v1.5A2.25 2.25 0 0118.75 21h-3M3.75 6.75V5.25A2.25 2.25 0 016 3h1.5m13.5 0h1.5A2.25 2.25 0 0122.5 5.25v1.5M3.75 12h16.5" />
  </svg>
);

export const CutIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3.75L6 6m2.25-2.25L10.5 6M8.25 20.25L6 18m2.25 2.25L10.5 18m5.25-14.25L18 6m-2.25-2.25L13.5 6M15.75 20.25L18 18m-2.25 2.25L13.5 18M3.75 12h16.5" />
  </svg>
);

export const LoadingIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
  </svg>
);

export const DownloadIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

export const AssembleIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
  </svg>
);

export const WarningIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
  </svg>
);

export const CloseIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const ShoppingCartIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c.51 0 .962-.328 1.093-.828l2.857-8.571A.75.75 0 0018.89 4.5H5.25L4.817 2.625A.75.75 0 004.05 2H2.25zM7.5 15.75A2.25 2.25 0 105.25 18a2.25 2.25 0 002.25-2.25zM15 15.75A2.25 2.25 0 1012.75 18a2.25 2.25 0 002.25-2.25z" />
  </svg>
);

export const PlayIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.742 1.295 2.545 0 3.286L7.279 20.99c-1.25.722-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
    </svg>
);

export const GlueIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v11.482l-4.5-1.636M9.75 3.104l4.5 1.636V14.586l-4.5-1.636m0 .002L12 12.25l2.25 1.696M9.75 14.586V12.25m0 2.336L12 12.25m-2.25 2.336L12 12.25m2.25 2.336L12 12.25m0 0V3.104m0 9.146L12 2.25l-2.25.854m4.5 0L12 2.25l2.25.854M12 15a2.25 2.25 0 00-2.25 2.25v4.5A2.25 2.25 0 0012 24a2.25 2.25 0 002.25-2.25v-4.5A2.25 2.25 0 0012 15z" />
  </svg>
);

export const HoneygainLogoIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="7.5 12 10.5 15 16.5 9"></polyline>
  </svg>
);

export const SevenKBetLogoIcon: React.FC<IconProps> = (props) => (
    <svg viewBox="0 0 130 24" fill="white" xmlns="http://www.w3.org/2000/svg" {...props}>
        <text x="0" y="19" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold">7K</text>
        <text x="38" y="19" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="normal">BET.BR</text>
        <rect x="110" y="2" width="20" height="20" rx="4" fill="#84cc16"/>
        <path d="M115 12h10m-5-5v10" stroke="white" strokeWidth="2"/>
    </svg>
);

export const CashIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

export const FaceScanIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.5v.75A.75.75 0 004.5 6h15a.75.75 0 00.75-.75V4.5M3.75 19.5v-.75A.75.75 0 014.5 18h15a.75.75 0 01.75.75v.75M8.25 12h7.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9.375c.328-.328.788-.525 1.28-.525h3.44c.492 0 .952.197 1.28.525M9 14.625c.328.328.788-.525 1.28.525h3.44c.492 0 .952-.197 1.28.525" />
    </svg>
);

export const PowerIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
    </svg>
);

export const BrazilFlagIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <defs>
      <clipPath id="br-clip">
        <circle cx="10" cy="10" r="10" />
      </clipPath>
    </defs>
    <g clipPath="url(#br-clip)">
      <rect width="20" height="20" fill="#009B3A" />
      <path d="M10 3L18.5 10L10 17L1.5 10L10 3Z" fill="#FFCC29" />
      <circle cx="10" cy="10" r="3.5" fill="#002776" />
    </g>
  </svg>
);

export const SpainFlagIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <defs>
      <clipPath id="es-clip">
        <circle cx="10" cy="10" r="10" />
      </clipPath>
    </defs>
    <g clipPath="url(#es-clip)">
      <rect width="20" height="20" fill="#c60b1e" />
      <rect y="5" width="20" height="10" fill="#ffc400" />
    </g>
  </svg>
);

export const JapanFlagIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <defs>
      <clipPath id="jp-clip">
        <circle cx="10" cy="10" r="10" />
      </clipPath>
    </defs>
    <g clipPath="url(#jp-clip)">
      <rect width="20" height="20" fill="#fff" />
      <circle cx="10" cy="10" r="4.5" fill="#bc002d" />
    </g>
  </svg>
);

export const ChinaFlagIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <defs>
      <clipPath id="cn-clip">
        <circle cx="10" cy="10" r="10" />
      </clipPath>
    </defs>
    <g clipPath="url(#cn-clip)">
      <rect width="20" height="20" fill="#ee1c25" />
      <path d="M5 4L5.588 5.854 4.146 4.708 6.031 4.708 4.588 5.854 5 4z" fill="#ff0" transform="scale(1.2) translate(0.5, -0.5)"/>
    </g>
  </svg>
);


export const UkFlagIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
     <defs>
      <clipPath id="uk-clip">
        <circle cx="10" cy="10" r="10" />
      </clipPath>
    </defs>
    <g clipPath="url(#uk-clip)">
      <rect width="20" height="20" fill="#012169" />
      <path d="M0 0L20 20M20 0L0 20" stroke="#FFF" strokeWidth="3" />
      <path d="M0 0L20 20M20 0L0 20" stroke="#C8102E" strokeWidth="2" />
      <path d="M10 0V20M0 10H20" stroke="#FFF" strokeWidth="5" />
      <path d="M10 0V20M0 10H20" stroke="#C8102E" strokeWidth="3" />
    </g>
  </svg>
);

export const GermanFlagIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <defs>
      <clipPath id="de-clip">
        <circle cx="10" cy="10" r="10" />
      </clipPath>
    </defs>
    <g clipPath="url(#de-clip)">
      <rect width="20" height="20" fill="#000" />
      <rect y="6.67" width="20" height="6.66" fill="#D00" />
      <rect y="13.33" width="20" height="6.67" fill="#FFCE00" />
    </g>
  </svg>
);

export const FranceFlagIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <defs>
      <clipPath id="fr-clip">
        <circle cx="10" cy="10" r="10" />
      </clipPath>
    </defs>
    <g clipPath="url(#fr-clip)">
      <rect width="20" height="20" fill="#fff" />
      <rect x="0" width="6.67" height="20" fill="#0055A4" />
      <rect x="13.33" width="6.67" height="20" fill="#EF4135" />
    </g>
  </svg>
);

export const ItalyFlagIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <defs>
      <clipPath id="it-clip">
        <circle cx="10" cy="10" r="10" />
      </clipPath>
    </defs>
    <g clipPath="url(#it-clip)">
      <rect width="20" height="20" fill="#fff" />
      <rect x="0" width="6.67" height="20" fill="#009246" />
      <rect x="13.33" width="6.67" height="20" fill="#CE2B37" />
    </g>
  </svg>
);

export const RussiaFlagIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <defs>
      <clipPath id="ru-clip">
        <circle cx="10" cy="10" r="10" />
      </clipPath>
    </defs>
    <g clipPath="url(#ru-clip)">
      <rect width="20" height="20" fill="#fff" />
      <rect y="6.67" width="20" height="6.66" fill="#0039A6" />
      <rect y="13.33" width="20" height="6.67" fill="#D52B1E" />
    </g>
  </svg>
);

export const ExpandIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75v4.5m0-4.5h-4.5m4.5 0L15 9m5.25 11.25v-4.5m0 4.5h-4.5m4.5 0L15 15" />
    </svg>
);

export const ShareIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

export const LockClosedIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 00-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
);

export const CheckCircleIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const ChevronDownIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);

export const ChevronUpIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
  </svg>
);

export const InformationCircleIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
  </svg>
);
