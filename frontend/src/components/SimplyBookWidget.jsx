import { useEffect, useRef } from 'react';

const SimplyBookWidget = ({ companyId, serviceId = null }) => {
  const widgetRef = useRef(null);

  useEffect(() => {
    // Load SimplyBook widget script
    const script = document.createElement('script');
    script.src = 'https://widget.simplybook.me/v2/widget/widget.js';
    script.async = true;
    
    script.onload = () => {
      // Initialize widget after script loads
      if (window.SimplybookWidget && widgetRef.current) {
        const widgetConfig = {
          widget_type: 'iframe',
          url: `https://${companyId}.simplybook.me/v2/`,
          theme: 'minimal',
          theme_settings: {
            timeline_show_end_time: '1',
            timeline_hide_unavailable: '1',
            sb_base_color: '#4fb3a8', // EverWell primary color
            display_item_mode: 'block',
            body_bg_color: '#ffffff',
            sb_review_image: '1',
            dark_font_color: '#1a3d3a', // EverWell dark teal
            light_font_color: '#ffffff',
            sb_company_label_color: '#ffffff',
            hide_img_mode: '0',
            timeline_modern_theme_color: '#4fb3a8',
            timeline_modern_theme_dark_color: '#1a3d3a',
          },
          timeline: 'modern',
          datepicker: 'top_calendar',
          is_rtl: false,
          app_config: {
            clear_session: 0,
            allow_switch_to_ada: 0,
            predefined: serviceId ? { service: serviceId } : {},
          },
        };

        // Create widget instance
        const widget = new window.SimplybookWidget(widgetConfig);
        widget.init(widgetRef.current);
      }
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup: remove script on unmount
      const existingScript = document.querySelector('script[src*="simplybook.me"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [companyId, serviceId]);

  return (
    <div className="w-full min-h-screen bg-bgSecondary py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-darkTeal mb-2 font-heading">
            Agendar Consulta
          </h1>
          <p className="text-mediumTeal">
            Selecione uma data e horário para sua consulta médica
          </p>
        </div>
        
        <div 
          ref={widgetRef}
          id="sbw_booking_widget"
          className="bg-white rounded-lg shadow-md p-6 min-h-[600px]"
        >
          {/* Widget will be injected here */}
          <div className="flex items-center justify-center min-h-[600px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-mediumTeal">Carregando sistema de agendamento...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimplyBookWidget;

