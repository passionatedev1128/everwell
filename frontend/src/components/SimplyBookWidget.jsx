import { useEffect, useState } from 'react';

const injectHubspotBookingHandler = () => {
  window.onSimplyBookBookingComplete = function onSimplyBookBookingComplete(booking) {
    try {
      if (window._hsq) {
        window._hsq.push([
          'trackCustomBehavioralEvent',
          {
            name: 'booking_completed',
            properties: {
              email: booking.customerEmail,
              service: booking.serviceName,
              date: booking.date,
            },
          },
        ]);
      }

      if (window.HubSpotConversations?.trackEvent) {
        window.HubSpotConversations.trackEvent({
          id: 'booking_completed',
          email: booking.customerEmail,
          service: booking.serviceName,
          date: booking.date,
        });
      }
    } catch (error) {
      console.warn('HubSpot booking tracking failed:', error);
    }
  };
};

const SimplyBookWidget = ({ companyId, serviceId = null }) => {
  const [status, setStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Validate companyId
    if (!companyId || companyId.trim() === '') {
      setStatus('error');
      setErrorMessage('SimplyBook Company ID não configurado. Por favor, configure VITE_SIMPLYBOOK_COMPANY_ID no arquivo .env');
      return;
    }

    let loadTimeout;
    let initTimeout;
    let iframeCheckInterval;

    const script = document.createElement('script');
    script.src = 'https://widget.simplybook.me/v2/widget/widget.js';
    script.async = true;

    // Set timeout for script loading
    loadTimeout = setTimeout(() => {
      setStatus('error');
      setErrorMessage('O widget de agendamento está demorando para carregar. Por favor, tente novamente ou entre em contato via WhatsApp.');
    }, 15000); // 15 second timeout

    script.onload = () => {
      clearTimeout(loadTimeout);
      setStatus('ready');
      injectHubspotBookingHandler();

      // Check for iframe after widget initialization
      initTimeout = setTimeout(() => {
        const widgetElement = document.getElementById('simplybook_widget');
        const iframe = widgetElement?.querySelector('iframe');
        
        if (!iframe) {
          setStatus('error');
          setErrorMessage('Não foi possível conectar ao sistema de agendamento. O serviço pode estar temporariamente indisponível. Por favor, tente novamente mais tarde ou entre em contato via WhatsApp.');
        } else {
          // Monitor iframe for errors
          iframe.onerror = () => {
            setStatus('error');
            setErrorMessage('Erro ao carregar o sistema de agendamento. Por favor, verifique sua conexão ou tente novamente mais tarde.');
          };

          // Check if iframe loaded successfully after a delay
          iframeCheckInterval = setInterval(() => {
            try {
              // Try to access iframe content (will fail if 502 or other error)
              if (iframe.contentWindow) {
                clearInterval(iframeCheckInterval);
              }
            } catch (e) {
              // Cross-origin error is expected, but if we can't access it at all, there might be an issue
              // This is a best-effort check
            }
          }, 2000);

          // Clear interval after 10 seconds
          setTimeout(() => {
            if (iframeCheckInterval) {
              clearInterval(iframeCheckInterval);
            }
          }, 10000);
        }
      }, 8000);

      if (window.SimplybookWidget) {
        try {
          // Validate companyId format
          if (!companyId || companyId.includes('.') || companyId.includes('/')) {
            throw new Error('Invalid SimplyBook Company ID format');
          }

          const widget = new window.SimplybookWidget({
            widget_type: 'iframe',
            url: `https://${companyId}.simplybook.me`,
            theme: 'minimal',
            theme_settings: {
              timeline_show_end_time: '1',
              timeline_hide_unavailable: '1',
              sb_base_color: '#4fb3a8',
              display_item_mode: 'block',
              body_bg_color: '#ffffff',
              sb_review_image: '1',
              dark_font_color: '#1a3d3a',
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
          });

          widget.init('simplybook_widget');
        } catch (error) {
          clearTimeout(initTimeout);
          if (iframeCheckInterval) clearInterval(iframeCheckInterval);
          console.error('Error initializing SimplyBook widget:', error);
          setStatus('error');
          setErrorMessage('Erro ao inicializar o widget de agendamento. Por favor, tente novamente.');
        }
      } else {
        clearTimeout(initTimeout);
        if (iframeCheckInterval) clearInterval(iframeCheckInterval);
        setStatus('error');
        setErrorMessage('Biblioteca do SimplyBook não carregou corretamente. Por favor, recarregue a página.');
      }
    };

    script.onerror = () => {
      clearTimeout(loadTimeout);
      if (initTimeout) clearTimeout(initTimeout);
      if (iframeCheckInterval) clearInterval(iframeCheckInterval);
      console.error('SimplyBook widget script failed to load.');
      setStatus('error');
      setErrorMessage('Não foi possível carregar o sistema de agendamento. Verifique sua conexão com a internet.');
    };

    // Suppress 404 errors from SimplyBook iframe (they're expected if company ID is not configured)
    window.addEventListener('error', (event) => {
      if (event.target && event.target.tagName === 'IFRAME' && 
          event.target.src && event.target.src.includes('simplybook.me')) {
        // Suppress console errors for SimplyBook iframe 404s
        event.preventDefault();
        return false;
      }
    }, true);

    document.body.appendChild(script);

    return () => {
      if (loadTimeout) clearTimeout(loadTimeout);
      if (initTimeout) clearTimeout(initTimeout);
      if (iframeCheckInterval) clearInterval(iframeCheckInterval);
      window.onSimplyBookBookingComplete = null;
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [companyId, serviceId]);

  return (
    <div className="w-full min-h-screen bg-[#f5faf7] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="space-y-2 text-center md:text-left">
          <h1 className="text-4xl font-heading font-semibold text-darkTeal">Agendar consulta</h1>
          <p className="text-mediumTeal max-w-2xl">
            Escolha o horário ideal com a equipe médica EverWell e receba suporte premium em toda a jornada.
          </p>
        </div>
        {status === 'error' ? (
          <div className="bg-white rounded-lg shadow-sm border border-primary/20 p-10 text-center space-y-4">
            <div className="text-6xl mb-4">📅</div>
            <p className="text-darkTeal text-lg font-semibold">
              {errorMessage || 'Estamos finalizando o preparo da agenda.'}
            </p>
            <p className="text-mediumTeal">
              Atualize a página em alguns instantes ou fale diretamente conosco via WhatsApp.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <a
                href="https://wa.me/5521998170460?text=Gostaria%20de%20agendar%20uma%20consulta"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                WhatsApp: +55 21 99817-0460
              </a>
              <button
                onClick={() => window.location.reload()}
                className="btn-secondary"
              >
                Recarregar Página
              </button>
            </div>
          </div>
        ) : (
          <div
            id="simplybook_widget"
            className="rounded-3xl bg-white/90 border border-white/60 shadow-[0_24px_60px_-30px_rgba(15,41,61,0.45)] min-h-[640px]"
          >
            {status === 'loading' && (
              <div className="flex items-center justify-center min-h-[640px]">
                <div className="text-center space-y-3">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
                  <p className="text-mediumTeal">Conectando à agenda segura da EverWell…</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SimplyBookWidget;

