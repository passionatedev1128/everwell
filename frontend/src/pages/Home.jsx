import { Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import FAQAccordion from '../components/FAQAccordion';
import GoalForm from '../components/GoalForm';
import JotForm from '../components/JotForm';
import Carousel from '../components/Carousel';
import { initScrollAnimations } from '../utils/scrollAnimations';
import { trackEvent as trackAnalyticsEvent } from '../utils/analytics';
import { trackEvent as trackGtmEvent } from '../utils/gtm';
import api from '../utils/api';
import { getResolvedFeedbacks } from '../utils/api';

const trustBadges = [
  {
    title: 'Suporte Médico Premium',
    subtitle: 'Equipe especializada para acompanhar cada etapa'
  },
  {
    title: 'Conformidade total Anvisa',
    subtitle: 'Produtos auditados e aprovados lote a lote'
  },
  {
    title: 'Entrega em todo Brasil',
    subtitle: 'Logística discreta e rastreável'
  },
  {
    title: 'Compra 100% Segura',
    subtitle: 'Protocolos de segurança avançados'
  }
];

const processSteps = [
  {
    number: '01',
    title: 'Consulta & Avaliação',
    copy: 'Conecte-se com médicos parceiros certificados e receba orientação personalizada.',
    link: {
      label: 'Agendar consulta',
      href: 'https://pro.quaddro.co/yourbestversion/servicos/vgwg3F'
    }
  },
  {
    number: '02',
    title: 'Autorização & Importação',
    copy: 'Acompanhamos o processo regulatório e garantimos importação segura e ágil.',
    link: {
      label: 'Solicitar autorização',
      href: 'https://pro.quaddro.co/yourbestversion/servicos/xUJjRT'
    }
  },
  {
    number: '03',
    title: 'Entrega & Performance',
    copy: 'Receba seus produtos com rastreio e suporte contínuo para resultados reais.'
  }
];

// productHighlights will be fetched from API
// testimonials will be fetched from API (resolved feedbacks)

const differentiators = [
  {
    icon: '✨',
    title: 'Formulações exclusivas',
    copy: 'Desenvolvidas por especialistas e testadas lote a lote com laudos certificados.'
  },
  {
    icon: '🛡️',
    title: 'Compliance integral',
    copy: 'Estrutura regulatória robusta, seguindo rigorosamente RDC 327/2019 e 660/2022.'
  },
  {
    icon: '🤝',
    title: 'Acompanhamento contínuo',
    copy: 'Equipe dedicada para ajustar protocolos e potencializar resultados.'
  },
  {
    icon: '📊',
    title: 'Insights orientados a dados',
    copy: 'Dashboard completo para monitorar evolução, adesão e performance.'
  }
];

const heroStats = [
  { label: 'Pacientes acompanhados', value: '2.1K+' },
  { label: 'Protocolos personalizados', value: '320+' },
  { label: 'Níveis de satisfação', value: '97%' }
];

const Home = () => {
  const [backgroundVisible, setBackgroundVisible] = useState(false);
  const [showJotForm, setShowJotForm] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [productHighlights, setProductHighlights] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const backgroundSectionRef = useRef(null);
  const testimonialsFetchedRef = useRef(false);

  // Monitor testimonials state for debugging
  useEffect(() => {
    console.log('Testimonials state updated:', testimonials.length, testimonials);
  }, [testimonials]);

  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowJotForm(false);
      setIsClosing(false);
    }, 300); // Match animation duration
  };

  useEffect(() => {
    initScrollAnimations();

    // Background image on scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setBackgroundVisible(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (backgroundSectionRef.current) {
      observer.observe(backgroundSectionRef.current);
    }

    // Fetch products for highlights
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        const products = response.data.products || [];
        // Get all visible products with images (not just first 3)
        const highlights = products
          .filter(p => p.visible && p.images && p.images.length > 0)
          .map(p => ({
            name: p.name,
            subtitle: p.subtitle || '',
            description: p.description || '',
            image: p.images[0] || '',
            slug: p.slug || '',
            price: p.price || 0
          }));
        setProductHighlights(highlights);
      } catch (error) {
        // Silently fail and use empty array
        console.error('Error fetching products:', error);
        setProductHighlights([]);
      }
    };

    // Fetch resolved feedbacks for testimonials
    const fetchTestimonials = async () => {
      // Prevent duplicate fetches in the same session
      if (testimonialsFetchedRef.current) {
        console.log('Testimonials already fetched, skipping...');
        return;
      }
      
      testimonialsFetchedRef.current = true;
      console.log('Fetching testimonials...');
      
      try {
        const response = await getResolvedFeedbacks(10);
        console.log('Testimonials API response:', response); // Debug log
        
        // Handle different response structures
        const feedbacks = response?.feedbacks || response?.data?.feedbacks || [];
        console.log('Extracted feedbacks:', feedbacks.length);
        
        if (feedbacks && Array.isArray(feedbacks) && feedbacks.length > 0) {
          // Map feedbacks to testimonial format with unique IDs
          const mappedTestimonials = feedbacks.map((feedback, index) => ({
            id: feedback._id || `testimonial-${index}-${Date.now()}`,
            quote: feedback.message,
            name: feedback.userId?.name || feedback.name,
            title: feedback.userId?.email ? feedback.userId.email.split('@')[0] : 'Cliente',
            avatar: feedback.userId?.photo || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80'
          }));
          console.log('Mapped testimonials:', mappedTestimonials); // Debug log
          console.log('Setting testimonials state, count:', mappedTestimonials.length); // Debug log
          setTestimonials(mappedTestimonials);
        } else {
          console.log('No testimonials found. Response:', response); // Debug log
          console.log('Feedbacks array:', feedbacks);
          setTestimonials([]);
          testimonialsFetchedRef.current = false; // Reset to allow retry
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        console.error('Error details:', error.response?.data || error.message);
        setTestimonials([]);
        testimonialsFetchedRef.current = false; // Reset on error to allow retry
      }
    };

    fetchProducts();
    fetchTestimonials();

    return () => {
      if (backgroundSectionRef.current) {
        observer.unobserve(backgroundSectionRef.current);
      }
      // Reset fetch flag on unmount to allow refetch on remount
      testimonialsFetchedRef.current = false;
    };
  }, []);

  return (
    <div className="bg-transparent">
      {/* Hero with diagonal split and gym background */}
      <section className="relative min-h-screen overflow-hidden -mt-16 sm:-mt-20">
        {/* Gym background image */}
        <div 
          className="absolute top-0 left-0 right-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: 'url(/images/landing_image.jpg)',
            marginTop: 0,
            paddingTop: 0,
          }}
        />
        
        {/* Frosted glass overlay on left and central parts */}
        <div 
          className="absolute top-0 left-0 right-0 w-full h-full hero-overlay"
          style={{
            background: 'linear-gradient(to right, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0.1) 70%, transparent 100%)',
            marginTop: 0,
            paddingTop: 0,
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 min-h-screen flex flex-col pt-16 sm:pt-20">
          {/* Top section with everwell banner */}
          <div className="pt-4 sm:pt-8 md:pt-12 px-4 sm:px-6 lg:px-8">
            
            {/* A NEW STANDARD IN CBD RECOVERY */}
            <p className="text-xs sm:text-sm font-sans font-medium text-white uppercase tracking-widest mb-8 sm:mb-12 relative z-20">
              A NEW STANDARD IN CBD RECOVERY
            </p>
            
            {/* Stacked headline: focus, performance, recovery */}
            <div className="space-y-2 sm:space-y-3 md:space-y-4 mb-4 sm:mb-6 relative z-20">
              <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-sans font-normal text-white lowercase leading-none animate-elegant-reveal" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
                focus
              </h2>
              <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-sans font-normal text-white lowercase leading-none animate-elegant-reveal" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
                performance
              </h2>
              <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-sans font-normal text-white lowercase leading-none animate-elegant-reveal" style={{ animationDelay: '0.8s', animationFillMode: 'both' }}>
                recovery
              </h2>
            </div>
            
            {/* every day. in lime green with elegant animation */}
            <p 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-normal text-primary lowercase italic mb-12 sm:mb-16 relative z-20 animate-elegant-fade-in" 
              style={{
                fontFamily: "monospace",
                animationDelay: '1.2s'
              }}
            >
              every day.
            </p>
          </div>
          
          {/* Bottom section with OUR PRODUCTS button and logo */}
          <div className="mt-auto pb-8 sm:pb-12 md:pb-16 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-end justify-between gap-6 relative z-20" style = {{ display: "flex", flexDirection: "column" }}>
            
            {/* OUR PRODUCTS button */}
            <Link
              to="/produtos"
              className="inline-block border-2 border-primary bg-transparent px-6 sm:px-8 py-3 sm:py-4 text-white uppercase font-sans font-medium text-sm sm:text-base tracking-wider hover:bg-primary hover:text-white transition-all duration-300"
              onClick={() => {
                trackAnalyticsEvent('cta_click', { cta: 'our_products', location: 'hero' });
                trackGtmEvent('cta_click', { cta: 'our_products', location: 'hero' });
              }}
            >
              OUR PRODUCTS
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="-mt-8 sm:-mt-12 md:-mt-16 relative z-20 px-4 sm:px-6 lg:px-8 scroll-animate">
        <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-xl shadow-lg border border-primary/20 p-4 sm:p-6 md:p-8 lg:p-10" style={{ borderRadius: '40px' }}>
          {/* First Row: Titles */}
          <div className="flex flex-wrap gap-4 sm:gap-6 mb-4 scroll-animate">
            {trustBadges.map((badge, index) => (
              <div key={`title-${index}`} className="flex-1 min-w-[200px] scroll-animate" style={{ animationDelay: `${index * 0.1}s` }}>
                <p className="text-xs sm:text-sm font-semibold text-primary uppercase tracking-wide">{badge.title}</p>
              </div>
            ))}
          </div>
          {/* Second Row: Subtitles */}
          <div className="flex flex-wrap gap-4 sm:gap-6 scroll-animate">
            {trustBadges.map((badge, index) => (
              <div key={`subtitle-${index}`} className="flex-1 min-w-[200px] scroll-animate" style={{ animationDelay: `${(index + 4) * 0.1}s` }}>
                <p className="text-mediumTeal text-xs sm:text-sm leading-relaxed advertise-text">{badge.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Define Goals */}
      <section className="py-12 sm:py-16 md:py-24 bg-gradient-to-br from-[#FFFEFB] via-primary-ultra-light to-[#FEFEFE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
            <p className="section-heading">Estratégia personalizada</p>
            <h2 className="section-title highlighted-text">Defina seus objetivos com especialistas EverWell</h2>
            <p className="muted-text">
              Compartilhe histórico, metas e desafios. Nossa equipe analisa seus dados, define a dosagem ideal e acompanha a evolução com métricas claras.
            </p>
          </div>
          <div className="text-center">
            <button
              onClick={() => setShowJotForm(true)}
              className="btn-primary inline-flex items-center gap-3"
            >
              Preencher Formulário
              <span aria-hidden>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* JotForm Modal */}
      {showJotForm && (
        <div 
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 transition-opacity duration-300 ${
            isClosing ? 'opacity-0' : 'opacity-100'
          }`}
          onClick={handleCloseModal}
        >
          <div 
            className={`relative bg-white shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden isolate transition-all duration-500 ${
              isClosing 
                ? 'opacity-0 scale-95 translate-y-4' 
                : 'opacity-100 scale-100 translate-y-0'
            }`}
            onClick={(e) => e.stopPropagation()}
            style={{ 
              borderRadius: '40px',
              contain: 'layout style paint',
              animation: isClosing ? 'none' : 'modalOpen 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {/* Close Button - Isolated Layer */}
            <div className="absolute top-6 right-6 z-[100] pointer-events-none">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloseModal();
                }}
                className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-200 pointer-events-auto"
                aria-label="Fechar formulário"
                style={{ 
                  isolation: 'isolate',
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden'
                }}
              >
                <svg 
                  className="w-6 h-6 text-gray-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  style={{ pointerEvents: 'none' }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Form Container - Isolated from button */}
            <div 
              className="p-4 sm:p-6 md:p-8 overflow-y-auto max-h-[90vh] hide-scrollbar"
              style={{ 
                isolation: 'isolate',
                transform: 'translateZ(0)',
              }}
            >
              <JotForm formId="252618050339051" height="800px" />
            </div>
          </div>
        </div>
      )}

      {/* Purchase Process */}
      <section className="py-12 sm:py-16 md:py-24 relative overflow-hidden">
        {/* Background Image on Scroll */}
        <div
          ref={backgroundSectionRef}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            backgroundVisible ? 'opacity-20' : 'opacity-0'
          }`}
          style={{
            backgroundImage: 'url(/images/middle_image.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <p className="section-heading">Onboarding premium</p>
            <h2 className="section-title highlighted-text">Uma experiência desenhada para alcançar resultados reais</h2>
            <p className="muted-text">
              Da primeira consulta à entrega, cada etapa é orientada por especialistas e acompanhada com total transparência.
            </p>
          </div>
          {processSteps.length > 3 ? (
            <Carousel
              items={processSteps.map((step) => (
                <div key={step.number} className="card space-y-4 mx-2 h-full flex flex-col">
                  <span className="text-sm uppercase tracking-[0.4em] text-primary/70">Etapa</span>
                  <p className="text-4xl font-heading primary-color-text-green">{step.number}</p>
                  <h3 className="text-2xl font-semibold primary-color-text-green">{step.title}</h3>
                  <p className="muted-text flex-grow">{step.copy}</p>
                  {step.link && (
                    <a
                      href={step.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-primary inline-flex items-center gap-2 uppercase tracking-wide hover:text-primary-dark transition-colors"
                    >
                      {step.link.label}
                      <span aria-hidden>↗</span>
                    </a>
                  )}
                </div>
              ))}
              itemsPerView={3}
            />
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {processSteps.map((step) => (
              <div 
                key={step.number} 
                className="card space-y-3 sm:space-y-4 h-full flex flex-col cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                onClick={() => step.link && window.open(step.link.href, '_blank', 'noopener,noreferrer')}
              >
                <span className="text-xs sm:text-sm uppercase tracking-[0.4em] text-primary/70">Etapa</span>
                <p className="text-3xl sm:text-4xl font-heading primary-color-text-green">{step.number}</p>
                <h3 className="text-xl sm:text-2xl font-semibold primary-color-text-green">{step.title}</h3>
                <p className="muted-text text-sm sm:text-base flex-grow">{step.copy}</p>
                  {step.link && (
                    <a
                      href={step.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    className="text-xs sm:text-sm font-semibold text-primary inline-flex items-center gap-2 uppercase tracking-wide hover:text-primary-dark transition-colors"
                    >
                      {step.link.label}
                      <span aria-hidden>↗</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Products Preview */}
      <section className="py-12 sm:py-16 md:py-24 bg-gradient-to-br from-primary-ultra-light via-[#FFFEFB] to-[#FEFEFE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 sm:gap-6 mb-8 sm:mb-12">
            <div className="mb-4 md:mb-0">
              <p className="section-heading text-xs sm:text-sm">Coleção exclusiva</p>
              <h2 className="section-title text-2xl sm:text-3xl md:text-4xl highlighted-text">Produtos desenhados para performance, foco e recuperação</h2>
            </div>
            <Link to="/produtos" className="primary-color-text-green btn-secondary px-6 sm:px-8 py-3 text-xs sm:text-sm font-semibold tracking-wide w-full md:w-auto text-center">
              Ver catálogo completo
            </Link>
          </div>
          {productHighlights.length >= 3 ? (
            <Carousel
              items={productHighlights.map((product, index) => (
                <Link 
                  key={product.name} 
                  to={product.slug ? `/produtos/${product.slug}` : "/produtos"}
                  className="product-card mx-2 relative flex flex-col bg-white rounded-[32px] overflow-hidden transition-all duration-700 ease-out hover:scale-[1.02] hover:-translate-y-2 cursor-pointer group"
                  style={{ 
                    minHeight: '520px', 
                    height: '520px', 
                    width: '100%', 
                    textDecoration: 'none',
                    border: '1px solid rgba(192, 223, 22, 0.08)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 20px 60px rgba(192, 223, 22, 0.15), 0 8px 24px rgba(0, 0, 0, 0.08)';
                    e.currentTarget.style.borderColor = 'rgba(192, 223, 22, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)';
                    e.currentTarget.style.borderColor = 'rgba(192, 223, 22, 0.08)';
                  }}
                >
                  {/* Elegant top border accent */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
                  
                  {/* Image section with refined presentation */}
                  <div className="relative mt-10 mx-8 mb-8 flex items-center justify-center flex-shrink-0" style={{ height: '260px', minHeight: '260px' }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-white to-primary/5 rounded-[24px]"></div>
                    <div className="relative w-full h-full flex items-center justify-center p-8">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-contain relative z-10 transition-all duration-700 group-hover:scale-110"
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: '260px', 
                          filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.08))'
                        }}
                        onError={(e) => {
                          e.target.src = '';
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Content section with refined typography */}
                  <div className="px-8 pb-8 flex flex-col flex-grow justify-between">
                    <div>
                      <h3 
                        className="text-xl font-semibold mb-2 transition-colors duration-300 group-hover:text-primary primary-color-text-green" 
                        style={{ 
                          color: '#1A1A1A',
                          letterSpacing: '-0.01em',
                          lineHeight: '1.3',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {product.name}
                      </h3>
                      {product.subtitle && (
                        <p 
                          className="text-sm primary-color-text-green mb-4 leading-relaxed"
                          style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {product.subtitle}
                        </p>
                      )}
                    </div>
                    <div className="flex items-baseline justify-between pt-4 border-t border-primary/10">
                      <div>
                        <span className="text-2xl font-bold text-primary" style={{ lineHeight: '1.2', marginBottom: '5px', whiteSpace: 'nowrap' }}>
                          R$ {product.price ? product.price.toFixed(2).replace('.', ',') : '0,00'}
                        </span>
                      </div>
                      <div className="flex items-center text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-sm font-medium mr-2">Ver detalhes</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              itemsPerView={3}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              {productHighlights.map((product) => (
                <Link
                  key={product.name}
                  to={product.slug ? `/produtos/${product.slug}` : "/produtos"}
                  className="product-card relative flex flex-col bg-white rounded-[32px] overflow-hidden transition-all duration-700 ease-out hover:scale-[1.02] hover:-translate-y-2 cursor-pointer group"
                  style={{
                    textDecoration: 'none',
                    border: '1px solid rgba(192, 223, 22, 0.08)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)',
                    minHeight: '520px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 20px 60px rgba(192, 223, 22, 0.15), 0 8px 24px rgba(0, 0, 0, 0.08)';
                    e.currentTarget.style.borderColor = 'rgba(192, 223, 22, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)';
                    e.currentTarget.style.borderColor = 'rgba(192, 223, 22, 0.08)';
                  }}
                >
                  {/* Elegant top border accent */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
                  
                  {/* Image section */}
                  <div className="relative mt-10 mx-8 mb-8 flex items-center justify-center flex-shrink-0" style={{ height: '260px', minHeight: '260px' }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-white to-primary/5 rounded-[24px]"></div>
                    <div className="relative w-full h-full flex items-center justify-center p-8">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-contain relative z-10 transition-all duration-700 group-hover:scale-110"
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: '260px', 
                          filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.08))'
                        }}
                        onError={(e) => {
                          e.target.src = '';
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Content section */}
                  <div className="px-8 pb-8 flex flex-col flex-grow justify-between">
                    <div>
                      <h3 
                        className="text-xl font-semibold mb-2 transition-colors duration-300 group-hover:text-primary" 
                        style={{ 
                          color: '#1A1A1A',
                          letterSpacing: '-0.01em',
                          lineHeight: '1.3',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {product.name}
                      </h3>
                      {product.subtitle && (
                        <p 
                          className="text-sm text-mediumTeal mb-3 leading-relaxed"
                          style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {product.subtitle}
                        </p>
                      )}
                      {product.description && (
                        <p className="text-mediumTeal text-sm leading-relaxed mb-4 line-clamp-2">
                          {product.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-baseline justify-between pt-4 border-t border-primary/10">
                      <div>
                        <span className="text-xs font-medium text-mediumTeal uppercase tracking-wider block mb-1">Preço</span>
                        <span className="text-2xl font-bold text-primary" style={{ lineHeight: '1.2', whiteSpace: 'nowrap' }}>
                          R$ {product.price ? product.price.toFixed(2).replace('.', ',') : '0,00'}
                        </span>
                      </div>
                      <div className="flex items-center text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-sm font-medium mr-2">Ver detalhes</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials - Only show if there are resolved feedbacks */}
      {testimonials && testimonials.length > 0 && (
      <section className="py-12 sm:py-16 md:py-24" data-testimonials-count={testimonials.length}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-14">
            <p className="section-heading text-xs sm:text-sm">Satisfied customers</p>
            <h2 className="section-title text-2xl sm:text-3xl md:text-4xl highlighted-text">Histórias reais de alta performance com EverWell</h2>
            <p className="muted-text text-sm sm:text-base">
              Resultados sustentáveis, suporte contínuo e uma comunidade que vive bem-estar todos os dias.
            </p>
          </div>
          {testimonials.length > 3 ? (
            <Carousel
              items={testimonials.map((testimonial) => (
                <div key={testimonial.id || testimonial.name} className="px-2 h-full" style={{ width: '100%' }}>
                  <div 
                    className="card text-left flex flex-col transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-2 cursor-pointer hover:border-primary/40 border-2 border-transparent group h-full"
                    style={{
                      transform: 'perspective(1000px) rotateX(0deg)',
                      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                      minHeight: '280px',
                      height: '280px',
                      padding: '1.5rem',
                      width: '100%'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'perspective(1000px) rotateX(2deg) translateY(-8px)';
                      e.currentTarget.style.boxShadow = '0 20px 60px -15px rgba(79, 179, 168, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) translateY(0px)';
                      e.currentTarget.style.boxShadow = '';
                    }}
                  >
                    {/* Avatar and Name Section - Fixed Height */}
                    <div className="flex items-center gap-4 mb-4" style={{ minHeight: '56px', height: '56px' }}>
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-14 h-14 rounded-2xl object-cover border-4 border-white/60 transition-transform duration-500 group-hover:scale-110 group-hover:border-primary/40 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-darkTeal transition-colors duration-300 group-hover:text-primary truncate">{testimonial.name}</p>
                      </div>
                    </div>
                    {/* Stars Section - Fixed Height */}
                    <div className="flex items-center gap-1 mb-4" style={{ minHeight: '24px', height: '24px' }}>
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-yellow-400 fill-current transition-transform duration-300 group-hover:scale-110 flex-shrink-0" style={{ transitionDelay: `${i * 50}ms` }} viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    {/* Quote Section - Fixed Height with Overflow */}
                    <div className="flex-1 overflow-hidden" style={{ minHeight: '120px', maxHeight: '120px' }}>
                      <p className="text-darkTeal/80 leading-relaxed" style={{ 
                        display: '-webkit-box',
                        WebkitLineClamp: 5,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>"{testimonial.quote}"</p>
                    </div>
                  </div>
                </div>
              ))}
              itemsPerView={3}
            />
          ) : (
            <div className={`${testimonials.length <= 2 ? 'flex flex-wrap justify-center' : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3'} gap-4 sm:gap-6 md:gap-8 justify-items-center`}>
              {testimonials.map((testimonial) => (
              <div 
                key={testimonial.id || testimonial.name} 
                className="card text-left flex flex-col transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-2 cursor-pointer hover:border-primary/40 border-2 border-transparent group h-full w-full max-w-sm mx-auto"
                style={{
                  transform: 'perspective(1000px) rotateX(0deg)',
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  minHeight: '280px',
                  height: '280px',
                  padding: '1.5rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'perspective(1000px) rotateX(2deg) translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 20px 60px -15px rgba(79, 179, 168, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) translateY(0px)';
                  e.currentTarget.style.boxShadow = '';
                }}
              >
                {/* Avatar and Name Section - Fixed Height */}
                <div className="flex items-center gap-4 mb-4" style={{ minHeight: '56px', height: '56px' }}>
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-2xl object-cover border-4 border-white/60 transition-transform duration-500 group-hover:scale-110 group-hover:border-primary/40 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-darkTeal transition-colors duration-300 group-hover:text-primary truncate">{testimonial.name}</p>
                  </div>
                </div>
                {/* Stars Section - Fixed Height */}
                <div className="flex items-center gap-1 mb-4" style={{ minHeight: '24px', height: '24px' }}>
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current transition-transform duration-300 group-hover:scale-110 flex-shrink-0" style={{ transitionDelay: `${i * 50}ms` }} viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                {/* Quote Section - Fixed Height with Overflow */}
                <div className="flex-1 overflow-hidden" style={{ minHeight: '120px', maxHeight: '120px' }}>
                  <p className="text-darkTeal/80 leading-relaxed" style={{ 
                    display: '-webkit-box',
                    WebkitLineClamp: 5,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>"{testimonial.quote}"</p>
                </div>
              </div>
            ))}
            </div>
          )}
        </div>
      </section>
      )}

      {/* Differentials */}
      <section className="py-12 sm:py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-14">
            <p className="section-heading text-xs sm:text-sm">Por que EverWell</p>
            <h2 className="section-title text-2xl sm:text-3xl md:text-4xl highlighted-text">Uma plataforma completa para alta performance e bem-estar</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
            {differentiators.map((item, index) => (
              <div 
                key={item.title} 
                className="differentiator-card group relative overflow-visible cursor-pointer"
                style={{
                  backgroundImage: `url(/images/differentiator-${index + 1}.jpg)`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  minHeight: '320px',
                  backgroundColor: 'transparent',
                  borderRadius: '40px',
                  border: 'none',
                  padding: '4px',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: 'translateY(0)',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-12px) scale(1.03)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                }}                         
              >
                {/* Inner Card Container with Raised Edges */}
                <div 
                  className="absolute inset-0 overflow-hidden"
                  style={{
                    borderRadius: '36px',
                    backgroundColor: 'transparent',
                    border: '2px solid rgba(168, 197, 18, 0.3)',
                    boxShadow: `
                      inset 0 4px 16px rgba(255, 255, 255, 0.2),
                      inset 0 -4px 16px rgba(0, 0, 0, 0.1)
                    `
                  }}
                >
                  {/* Image Background - No Color Overlay */}
                  <div 
                    className="absolute inset-0 transition-all duration-700 ease-out"
                    style={{
                      backgroundImage: `url(/images/differentiator-${index + 1}.jpg)`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      opacity: 1
                    }}
                  />
                  {/* Subtle Dark Overlay for Text Readability Only */}
                  <div 
                    className="absolute inset-0 transition-all duration-700 ease-out"
                    style={{
                      background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.1) 50%, rgba(0, 0, 0, 0.15) 100%)',
                      opacity: 0.4
                    }}
                  />
                </div>
                
                {/* Content */}
                <div className="relative z-10 h-full flex flex-col p-6 sm:p-8">
                  {/* Title at top-left */}
                  <h3 
                    className="text-xl sm:text-2xl font-bold transition-all duration-300 mb-auto"
                    style={{
                      color: 'white',
                      textShadow: '0 2px 8px rgba(255, 255, 255, 0.5), 0 1px 4px rgba(0, 0, 0, 0.2)',
                      letterSpacing: '-0.02em'
                    }}
                  >
                    {item.title}
                  </h3>
                  {/* Text at bottom-right */}
                  <div className="flex items-end justify-end flex-1 mt-auto">
                    <p 
                      className="text-sm sm:text-base leading-relaxed transition-all duration-300 text-right"
                      style={{
                        color: 'gray',
                        textShadow: '0 1px 3px rgba(255, 255, 255, 0.4)'
                      }}
                    >
                      {item.copy}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Certificates (COA) */}
      <section className="py-12 sm:py-16 md:py-24 bg-gradient-to-br from-white via-primary-ultra-light to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-14">
            <p className="section-heading text-xs sm:text-sm">Qualidade e transparência</p>
            <h2 className="section-title text-2xl sm:text-3xl md:text-4xl highlighted-text">Quality Certificates (COA)</h2>
            <p className="muted-text text-sm sm:text-base">
              Para assegurar a qualidade, cada produto que desenvolvemos passa por um controle rigoroso dentro do nosso laboratório.
              Prezamos pela transparência. Por isso, todos os lotes possuem laudos de análise e estão disponíveis para consulta.
              Basta verificar o número do lote impresso na embalagem do seu produto e acessar o certificado correspondente.
            </p>
          </div>
          
          {/* Certificate Gallery */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
            {/* Certificate Card 1 */}
            <div 
              className="bg-white rounded-2xl overflow-hidden border border-primary/10 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
              onClick={() => {
                const img = document.createElement('img');
                img.src = '/certificates/coa-1.jpg';
                img.onerror = () => window.open('/certificates/coa-1.pdf', '_blank');
                img.onload = () => {
                  const newWindow = window.open('', '_blank');
                  newWindow.document.write(`<html><head><title>COA - Lote #001</title></head><body style="margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#f5f5f5"><img src="${img.src}" style="max-width:100%;height:auto;" /></body></html>`);
                };
              }}
            >
              <div className="aspect-[3/4] bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center p-6 relative overflow-hidden">
                <img 
                  src="/certificates/coa-1.jpg" 
                  alt="Certificate of Analysis - Lote #001"
                  className="w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-white/50 group-hover:bg-white/20 transition-colors duration-300 flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-16 h-16 mx-auto mb-4 text-primary opacity-60 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-sm font-medium text-primary">Certificate of Analysis</p>
                  </div>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-2">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
              <div className="p-4 border-t border-primary/10">
                <h3 className="font-semibold text-sm mb-1" style={{ color: '#1A1A1A' }}>COA - Lote #001</h3>
                <p className="text-xs" style={{ color: '#4A4A4A' }}>Análise completa de canabinoides</p>
              </div>
            </div>

            {/* Certificate Card 2 */}
            <div 
              className="bg-white rounded-2xl overflow-hidden border border-primary/10 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
              onClick={() => {
                const img = document.createElement('img');
                img.src = '/certificates/coa-2.jpg';
                img.onerror = () => window.open('/certificates/coa-2.pdf', '_blank');
                img.onload = () => {
                  const newWindow = window.open('', '_blank');
                  newWindow.document.write(`<html><head><title>COA - Lote #002</title></head><body style="margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#f5f5f5"><img src="${img.src}" style="max-width:100%;height:auto;" /></body></html>`);
                };
              }}
            >
              <div className="aspect-[3/4] bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center p-6 relative overflow-hidden">
                <img 
                  src="/certificates/coa-2.jpg" 
                  alt="Certificate of Analysis - Lote #002"
                  className="w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-white/50 group-hover:bg-white/20 transition-colors duration-300 flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-16 h-16 mx-auto mb-4 text-primary opacity-60 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-sm font-medium text-primary">Certificate of Analysis</p>
                  </div>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-2">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
              <div className="p-4 border-t border-primary/10">
                <h3 className="font-semibold text-sm mb-1" style={{ color: '#1A1A1A' }}>COA - Lote #002</h3>
                <p className="text-xs" style={{ color: '#4A4A4A' }}>Testes de pureza e potência</p>
              </div>
            </div>

            {/* Certificate Card 3 */}
            <div 
              className="bg-white rounded-2xl overflow-hidden border border-primary/10 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
              onClick={() => {
                const img = document.createElement('img');
                img.src = '/certificates/coa-3.jpg';
                img.onerror = () => window.open('/certificates/coa-3.pdf', '_blank');
                img.onload = () => {
                  const newWindow = window.open('', '_blank');
                  newWindow.document.write(`<html><head><title>COA - Lote #003</title></head><body style="margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#f5f5f5"><img src="${img.src}" style="max-width:100%;height:auto;" /></body></html>`);
                };
              }}
            >
              <div className="aspect-[3/4] bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center p-6 relative overflow-hidden">
                <img 
                  src="/certificates/coa-3.jpg" 
                  alt="Certificate of Analysis - Lote #003"
                  className="w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-white/50 group-hover:bg-white/20 transition-colors duration-300 flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-16 h-16 mx-auto mb-4 text-primary opacity-60 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-sm font-medium text-primary">Certificate of Analysis</p>
                  </div>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-2">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
              <div className="p-4 border-t border-primary/10">
                <h3 className="font-semibold text-sm mb-1" style={{ color: '#1A1A1A' }}>COA - Lote #003</h3>
                <p className="text-xs" style={{ color: '#4A4A4A' }}>Análise de contaminantes</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-mediumTeal mb-4">
              Todos os certificados estão disponíveis para consulta. Entre em contato para solicitar o COA do seu produto.
            </p>
            <Link 
              to="/duvidas" 
              className="btn-secondary inline-flex items-center gap-2 primary-color-text-green"
            >
              Solicitar certificado
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden bg-gradient-to-br from-[#0f1f2b] via-primary/90 to-[#124f45] text-white p-6 sm:p-8 md:p-12 lg:p-16" style={{ borderRadius: '40px' }}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent)]" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 sm:gap-8 md:gap-10">
              <div className="max-w-2xl space-y-3 sm:space-y-4">
                <p className="section-heading text-white/70 text-xs sm:text-sm">Pronto para começar?</p>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight text-white">Sua melhor versão começa agora</h2>
                <p className="text-white/75 text-sm sm:text-base">
                  Avance para seu próximo nível com fórmulas EverWell, acompanhamento premium e métricas claras.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:gap-4 md:text-right">
                <a href="/agendar" target="_blank" rel="noopener noreferrer" className="btn-primary w-full md:w-auto text-center">
                  Agendar consulta
                </a>
                <Link to="/duvidas" className="btn-secondary bg-white/10 border-white/20 text-white hover:bg-white/20 inline-flex items-center justify-center gap-2 w-full md:w-auto">
                  Fale com especialistas
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 sm:py-16 md:py-24 bg-gradient-to-br from-white via-primary/5 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <p className="section-heading text-xs sm:text-sm">FAQ EverWell</p>
            <h2 className="section-title text-2xl sm:text-3xl md:text-4xl highlighted-text">Dúvidas frequentes</h2>
            <p className="muted-text text-sm sm:text-base">
              Transparência e clareza em cada etapa. Confira as respostas para as perguntas mais frequentes.
            </p>
          </div>
          <FAQAccordion />
          <div className="text-center mt-10">
            <Link to="/duvidas" className="btn-secondary inline-flex items-center gap-2 primary-color-text-green">
              Ver todas as dúvidas
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

