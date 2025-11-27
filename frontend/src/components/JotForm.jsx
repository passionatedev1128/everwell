import { useState, useEffect } from 'react';

const JotForm = ({ formId = '252618050339051', height = '800px' }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const iframe = document.getElementById(`JotFormIFrame-${formId}`);
    if (iframe) {
      const handleLoad = () => {
        setIsLoading(false);
      };
      iframe.addEventListener('load', handleLoad);
      return () => {
        iframe.removeEventListener('load', handleLoad);
      };
    }
  }, [formId]);

  return (
    <div className="w-full relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
          <div className="w-full max-w-md px-4">
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full animate-loading-bar"
                style={{
                  width: '100%',
                  animation: 'loadingBar 2s ease-in-out infinite'
                }}
              />
            </div>
            <p className="text-center text-mediumTeal mt-4 text-sm">Carregando formulário...</p>
          </div>
        </div>
      )}
      <iframe
        id={`JotFormIFrame-${formId}`}
        title="JotForm"
        src={`https://form.jotform.com/${formId}`}
        style={{
          minWidth: '100%',
          maxWidth: '100%',
          height: height,
          border: 'none',
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s ease-in-out'
        }}
        allow="geolocation; microphone; camera"
        allowTransparency="true"
        scrolling="no"
        className="w-full"
      />
    </div>
  );
};

export default JotForm;

