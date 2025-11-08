const EmailProviderLogos = () => {
  const providers = [
    {
      name: 'Gmail',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5">
          <path fill="#EA4335" d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
        </svg>
      )
    },
    {
      name: 'Outlook',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5">
          <path fill="#0078D4" d="M7.5 7.5h9v9h-9v-9zm1.5 1.5v6h6v-6h-6z"/>
          <path fill="#0078D4" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
        </svg>
      )
    },
    {
      name: 'Yahoo',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5">
          <path fill="#6001D2" d="M12 2L2 22h3l7-12 7 12h3L12 2z"/>
        </svg>
      )
    },
    {
      name: 'ProtonMail',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5">
          <path fill="#6D4AFF" d="M12 20.351s-1.096-.108-1.955-.705c-.86-.596-6.045-4.688-6.045-9.014C4 6.756 7.582 3 12 3s8 3.756 8 7.632c0 4.326-5.186 8.418-6.045 9.014-.86.597-1.955.705-1.955.705zM12 5.025c-2.478 0-4.5 1.967-4.5 4.377 0 3.169 4.028 6.644 4.5 7.02.472-.376 4.5-3.851 4.5-7.02 0-2.41-2.022-4.377-4.5-4.377z"/>
        </svg>
      )
    },
    {
      name: 'iCloud',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5">
          <path fill="#007AFF" d="M13.762 4.29a6.51 6.51 0 0 0-1.762.27 4.75 4.75 0 0 0-4.533 4.533 4.504 4.504 0 0 0 .006.648 4.996 4.996 0 0 0-2.643 1.633 4.25 4.25 0 0 0-1.832 4.8 4.247 4.247 0 0 0 3.678 2.83 4.5 4.5 0 0 0 .534 0h9.75a4.25 4.25 0 0 0 4.245-4.246 4.5 4.5 0 0 0-.3-1.59 4.25 4.25 0 0 0-3.955-2.9 4.5 4.5 0 0 0-.45 0 4.251 4.251 0 0 0-4.155-3.746z"/>
        </svg>
      )
    },
    {
      name: 'AOL',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5">
          <path fill="#FF6600" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
          <path fill="#FF6600" d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
        </svg>
      )
    }
  ];

  return (
    <div className="mt-4">
      <p className="text-xs text-mediumTeal text-center mb-3">
        Aceitamos emails de qualquer provedor:
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {providers.map((provider) => (
          <div
            key={provider.name}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-borderLight rounded-md hover:border-primary hover:shadow-sm transition-all cursor-default"
            title={`${provider.name} e outros provedores`}
          >
            <span className="flex-shrink-0">
              {provider.icon}
            </span>
            <span className="text-xs text-darkTeal font-medium hidden sm:inline">
              {provider.name}
            </span>
          </div>
        ))}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-borderLight rounded-md">
          <span className="text-xs text-mediumTeal font-medium">+ Mais</span>
        </div>
      </div>
      <p className="text-xs text-lightTeal text-center mt-2">
        Gmail, Outlook, Yahoo, ProtonMail, iCloud, AOL e qualquer outro provedor
      </p>
    </div>
  );
};

export default EmailProviderLogos;
