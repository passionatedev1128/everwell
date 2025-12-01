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

const testimonials = [
  {
    quote: 'Experiência impecável do início ao fim. Performance elevada, sono equilibrado e suporte de alto nível.',
    name: 'Joana Fontes',
    title: 'Executiva de Marketing',
    avatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80'
  },
  {
    quote: 'Os protocolos personalizados transformaram minha rotina esportiva. Recuperação mais rápida e foco absoluto.',
    name: 'Maria Silva',
    title: 'Atleta Profissional',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
  },
  {
    quote: 'Nunca tive um acompanhamento tão humanizado. A EverWell entrega ciência, sofisticação e resultado.',
    name: 'Antônio Santos',
    title: 'Empreendedor',
    avatar: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=200&q=80'
  }
];

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
  const backgroundSectionRef = useRef(null);

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
        // Get first 3 visible products with images
        const highlights = products
          .filter(p => p.visible && p.images && p.images.length > 0)
          .slice(0, 3)
          .map(p => ({
            name: p.name,
            description: p.description || p.subtitle || '',
            image: p.images[0] || '',
            slug: p.slug || ''
          }));
        setProductHighlights(highlights);
      } catch (error) {
        // Silently fail and use empty array
        console.error('Error fetching products:', error);
        setProductHighlights([]);
      }
    };

    fetchProducts();

    return () => {
      if (backgroundSectionRef.current) {
        observer.unobserve(backgroundSectionRef.current);
      }
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
          className="absolute top-0 left-0 right-0 w-full h-full"
          style={{
            background: 'linear-gradient(to right, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0.1) 70%, transparent 100%)',
            backdropFilter: 'blur(3px)',
            WebkitBackdropFilter: 'blur(3px)',
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
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-normal text-lime-green lowercase italic mb-12 sm:mb-16 relative z-20 animate-elegant-fade-in" 
              style={{
                color: "#BBE02A", 
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
              className="inline-block border-2 border-lime-green bg-transparent px-6 sm:px-8 py-3 sm:py-4 text-white uppercase font-sans font-medium text-sm sm:text-base tracking-wider hover:bg-lime-green hover:text-white transition-all duration-300"
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
        <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-xl rounded-lg shadow-lg border border-primary/20 p-4 sm:p-6 md:p-8 lg:p-10">
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
                <p className="text-mediumTeal text-xs sm:text-sm leading-relaxed">{badge.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Define Goals */}
      <section className="py-12 sm:py-16 md:py-24 bg-gradient-to-br from-white via-primary/5 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
            <p className="section-heading">Estratégia personalizada</p>
            <h2 className="section-title">Defina seus objetivos com especialistas EverWell</h2>
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
            className={`relative bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden isolate transition-all duration-500 ${
              isClosing 
                ? 'opacity-0 scale-95 translate-y-4' 
                : 'opacity-100 scale-100 translate-y-0'
            }`}
            onClick={(e) => e.stopPropagation()}
            style={{ 
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
            <h2 className="section-title">Uma experiência desenhada para alcançar resultados reais</h2>
            <p className="muted-text">
              Da primeira consulta à entrega, cada etapa é orientada por especialistas e acompanhada com total transparência.
            </p>
          </div>
          {processSteps.length > 3 ? (
            <Carousel
              items={processSteps.map((step) => (
                <div key={step.number} className="card space-y-4 mx-2 h-full flex flex-col">
                  <span className="text-sm uppercase tracking-[0.4em] text-primary/70">Etapa</span>
                  <p className="text-4xl font-heading text-darkTeal">{step.number}</p>
                  <h3 className="text-2xl font-semibold text-darkTeal">{step.title}</h3>
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
                <p className="text-3xl sm:text-4xl font-heading text-darkTeal">{step.number}</p>
                <h3 className="text-xl sm:text-2xl font-semibold text-darkTeal">{step.title}</h3>
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
      <section className="py-12 sm:py-16 md:py-24 bg-gradient-to-br from-primary/5 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 sm:gap-6 mb-8 sm:mb-12">
            <div className="mb-4 md:mb-0">
              <p className="section-heading text-xs sm:text-sm">Coleção exclusiva</p>
              <h2 className="section-title text-2xl sm:text-3xl md:text-4xl">Produtos desenhados para performance, foco e recuperação</h2>
            </div>
            <Link to="/produtos" className="btn-secondary px-6 sm:px-8 py-3 text-xs sm:text-sm font-semibold tracking-wide w-full md:w-auto text-center">
              Ver catálogo completo
            </Link>
          </div>
          {productHighlights.length > 3 ? (
            <Carousel
              items={productHighlights.map((product) => (
                <div key={product.name} className="product-card mx-2 relative flex flex-col">
                  <div className="relative -mt-8 -mx-4 mb-4 flex items-center justify-center bg-primary/5 rounded-lg" style={{ minHeight: '200px', maxHeight: '300px' }}>
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-contain rounded-lg shadow-lg"
                      style={{ maxHeight: '300px' }}
                      onError={(e) => {
                        // Fallback to a placeholder if image fails to load
                        e.target.src = '';
                      }}
                    />
                  </div>
                  <div className="flex flex-col h-full space-y-3 sm:space-y-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-darkTeal">{product.name}</h3>
                    <p className="text-mediumTeal text-sm sm:text-base flex-grow">{product.description}</p>
                    <Link to={product.slug ? `/produtos/${product.slug}` : "/produtos"} className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-primary inline-flex items-center gap-2 mt-auto">
                      Detalhes
                      <span aria-hidden>→</span>
                    </Link>
                  </div>
                </div>
              ))}
              itemsPerView={3}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {productHighlights.map((product) => (
                <div key={product.name} className="product-card relative flex flex-col">
                  <div className="relative -mt-8 -mx-4 mb-4 flex items-center justify-center bg-primary/5 rounded-lg" style={{ minHeight: '200px', maxHeight: '300px' }}>
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-contain rounded-lg shadow-lg"
                      style={{ maxHeight: '300px' }}
                      onError={(e) => {
                        // Fallback to a placeholder if image fails to load
                        e.target.src = '';
                      }}
                    />
                  </div>
                  <div className="flex flex-col h-full space-y-3 sm:space-y-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-darkTeal">{product.name}</h3>
                    <p className="text-mediumTeal text-sm sm:text-base flex-grow">{product.description}</p>
                    <Link to={product.slug ? `/produtos/${product.slug}` : "/produtos"} className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-primary inline-flex items-center gap-2 mt-auto">
                      Detalhes
                      <span aria-hidden>→</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 sm:py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-14">
            <p className="section-heading text-xs sm:text-sm">Satisfied customers</p>
            <h2 className="section-title text-2xl sm:text-3xl md:text-4xl">Histórias reais de alta performance com EverWell</h2>
            <p className="muted-text text-sm sm:text-base">
              Resultados sustentáveis, suporte contínuo e uma comunidade que vive bem-estar todos os dias.
            </p>
          </div>
          {testimonials.length > 3 ? (
            <Carousel
              items={testimonials.map((testimonial) => (
                <div key={testimonial.name} className="px-2">
                  <div 
                    className="card text-left flex flex-col gap-4 scroll-animate transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-2 cursor-pointer hover:border-primary/40 border-2 border-transparent group"
                    style={{
                      transform: 'perspective(1000px) rotateX(0deg)',
                      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
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
                    <div className="flex items-center gap-4">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-14 h-14 rounded-2xl object-cover border-4 border-white/60 transition-transform duration-500 group-hover:scale-110 group-hover:border-primary/40"
                      />
                      <div>
                        <p className="font-semibold text-darkTeal transition-colors duration-300 group-hover:text-primary">{testimonial.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-yellow-400 fill-current transition-transform duration-300 group-hover:scale-110" style={{ transitionDelay: `${i * 50}ms` }} viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-darkTeal/80 leading-relaxed mt-2">"{testimonial.quote}"</p>
                  </div>
                </div>
              ))}
              itemsPerView={3}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {testimonials.map((testimonial) => (
              <div 
                key={testimonial.name} 
                className="card text-left flex flex-col gap-4 scroll-animate transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-2 cursor-pointer hover:border-primary/40 border-2 border-transparent group"
                style={{
                  transform: 'perspective(1000px) rotateX(0deg)',
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
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
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-2xl object-cover border-4 border-white/60 transition-transform duration-500 group-hover:scale-110 group-hover:border-primary/40"
                  />
                  <div>
                    <p className="font-semibold text-darkTeal transition-colors duration-300 group-hover:text-primary">{testimonial.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current transition-transform duration-300 group-hover:scale-110" style={{ transitionDelay: `${i * 50}ms` }} viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-darkTeal/80 leading-relaxed mt-2">"{testimonial.quote}"</p>
              </div>
            ))}
            </div>
          )}
        </div>
      </section>

      {/* Differentials */}
      <section className="py-12 sm:py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-14">
            <p className="section-heading text-xs sm:text-sm">Por que EverWell</p>
            <h2 className="section-title text-2xl sm:text-3xl md:text-4xl">Uma plataforma completa para alta performance e bem-estar</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
            {differentiators.map((item, index) => (
              <div 
                key={item.title} 
                className="card space-y-4 overflow-hidden group relative shadow-2xl"
                style={{
                  backgroundImage: `url(/images/differentiator-${index + 1}.jpg)`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  minHeight: '300px',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-90 transition-opacity duration-500"></div>
                <div className="relative z-10 space-y-4">
                  <span className="text-4xl block">{item.icon}</span>
                  <h3 className="text-xl font-semibold transition-colors duration-300" style={{ color: 'rgb(79 179 168 / var(--tw-bg-opacity, 1))' }}>{item.title}</h3>
                  <p className="transition-colors duration-300" style={{ color: 'rgb(79 179 168 / var(--tw-bg-opacity, 1))' }}>{item.copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#0f1f2b] via-primary/90 to-[#124f45] text-white p-6 sm:p-8 md:p-12 lg:p-16">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent)]" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 sm:gap-8 md:gap-10">
              <div className="max-w-2xl space-y-3 sm:space-y-4">
                <p className="section-heading text-white/70 text-xs sm:text-sm">Pronto para começar?</p>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight">Sua melhor versão começa agora</h2>
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
            <h2 className="section-title text-2xl sm:text-3xl md:text-4xl">Dúvidas frequentes</h2>
            <p className="muted-text text-sm sm:text-base">
              Transparência e clareza em cada etapa. Confira as respostas para as perguntas mais frequentes.
            </p>
          </div>
          <FAQAccordion />
          <div className="text-center mt-10">
            <Link to="/duvidas" className="btn-secondary inline-flex items-center gap-2">
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

