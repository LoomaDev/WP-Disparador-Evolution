import React from 'react';

const iconProps = {
  className: "w-6 h-6",
  strokeWidth: 1.5,
  stroke: "currentColor",
  fill: "none",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const ReportIcon = () => (
  <svg {...iconProps} viewBox="0 0 24 24">
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M8 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h5.697" />
    <path d="M18 14v4h4" />
    <path d="M18 11h-7a2 2 0 0 0 -2 2v7" />
    <path d="M16 5l-4 -4l-4 4" />
    <path d="M12 3v12" />
  </svg>
);

export const SendIcon = () => (
  <svg {...iconProps} viewBox="0 0 24 24">
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <line x1="10" y1="14" x2="21" y2="3" />
    <path d="M21 3l-6.5 18a0.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a0.55 .55 0 0 1 0 -1l18 -6.5" />
  </svg>
);

export const SettingsIcon = () => (
  <svg {...iconProps} viewBox="0 0 24 24">
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const WhatsAppIcon = () => (
    <svg {...iconProps} className="w-8 h-8 text-green-400" viewBox="0 0 24 24">
        <path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9" />
        <path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a4 4 0 0 1 -4 -4v-1a.5 .5 0 0 0 -1 0v1" />
    </svg>
);

export const SentIcon = () => (
    <svg {...iconProps}><path d="M5 12l5 5l10 -10" /></svg>
);
export const PendingIcon = () => (
    <svg {...iconProps}><path d="M12 8v4l3 3" /><circle cx="12" cy="12" r="9" /></svg>
);
export const ErrorIcon = () => (
    <svg {...iconProps}><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M12 9v4" /><path d="M12 16v.01" /></svg>
);
export const TotalIcon = () => (
    <svg {...iconProps}><path d="M8 4h8l-4 16" /><path d="M4 12h16" /></svg>
);

export const RefreshIcon: React.FC<{loading: boolean}> = ({loading}) => (
    <svg {...iconProps} className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`}><path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" /><path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" /></svg>
);

export const UploadIcon = () => (
    <svg {...iconProps} className="w-10 h-10 text-gray-400" viewBox="0 0 24 24"><path d="M7 18a4.6 4.4 0 0 1 0 -9a5 4.5 0 0 1 11 2h1a3.5 3.5 0 0 1 0 7h-1" /><path d="M9 15l3 -3l3 3" /><path d="M12 12v9" /></svg>
);
export const UserGroupIcon = () => (
    <svg {...iconProps} className="w-5 h-5"><circle cx="9" cy="7" r="4" /><path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /><path d="M21 21v-2a4 4 0 0 0 -3 -3.85" /></svg>
);
export const PaperPlaneIcon = () => (
    <svg {...iconProps} className="w-5 h-5"><path d="M15 10l-4 4l6 6l4 -16l-18 7l4 2l2 6l3 -4" /></svg>
);
export const CheckCircleIcon = () => (
    <svg {...iconProps} className="w-5 h-5"><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="m9 12l2 2l4 -4" /></svg>
);
export const XCircleIcon = () => (
    <svg {...iconProps} className="w-5 h-5"><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="m10 10l4 4m0 -4l-4 4" /></svg>
);
export const EyeIcon = () => (
    <svg {...iconProps} className="w-5 h-5"><path d="M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M22 12c-2.667 4.667 -6 7 -10 7s-7.333 -2.333 -10 -7c2.667 -4.667 6 -7 10 -7s7.333 2.333 10 7" /></svg>
);
export const EyeOffIcon = () => (
    <svg {...iconProps} className="w-5 h-5"><path d="M10.585 10.587a2 2 0 0 0 2.829 2.828" /><path d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.22 2.875 -3.774 4.736 -4.707" /><path d="M9.172 9.172a4 4 0 0 1 5.656 0" /><path d="M3 3l18 18" /></svg>
);

export const WarningIcon = () => (
    <svg {...iconProps} className="w-6 h-6 text-yellow-600" viewBox="0 0 24 24">
        <path d="M12 9v2m0 4v.01" />
        <path d="M5.07 19H18.93a2 2 0 0 0 1.79 -3.09L13.79 4.09a2 2 0 0 0 -3.58 0L3.28 15.91a2 2 0 0 0 1.79 3.09z" />
    </svg>
);