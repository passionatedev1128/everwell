import { Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import FAQAccordion from '../components/FAQAccordion';
import GoalForm from '../components/GoalForm';
import Carousel from '../components/Carousel';
import { initScrollAnimations } from '../utils/scrollAnimations';
import { trackEvent as trackAnalyticsEvent } from '../utils/analytics';
import { trackEvent as trackGtmEvent } from '../utils/gtm';

const heroVideo = 'https://cdn.coverr.co/videos/coverr-balance-your-body-1689250530998?download=1';

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

const productHighlights = [
  {
    name: 'EverWell Focus Gummies',
    description: 'Blend inteligente de CBD e nootrópicos para foco sustentado e equilíbrio mental.',
    image: 'https://images.unsplash.com/photo-1545239351-ef35f43d514b?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'EverWell Performance Oil',
    description: 'Formulação full spectrum com absorção otimizada e controle preciso de dosagem.',
    image: 'https://images.unsplash.com/photo-1617653513183-0e3d963902df?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'EverWell Recovery Cream',
    description: 'Tecnologia transdérmica com CBD e ativos naturais para alívio e recuperação muscular.',
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf100?auto=format&fit=crop&w=900&q=80'
  }
];

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
  const backgroundSectionRef = useRef(null);

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

    return () => {
      if (backgroundSectionRef.current) {
        observer.unobserve(backgroundSectionRef.current);
      }
    };
  }, []);

  return (
    <div className="bg-transparent">
      {/* Hero with video background */}
      <section className="relative min-h-[500px] sm:min-h-[600px] overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          src={heroVideo}
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24 text-center text-white">
          <p className="text-xs sm:text-sm font-medium text-gray-300 uppercase tracking-wide mb-3 sm:mb-4">EverWell Performance Lab</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">Focus. Performance. Recovery.</h1>
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto mb-6 sm:mb-8 px-2">
            Protocolos personalizados com cannabis medicinal e inovação científica para alcançar a sua melhor versão.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 px-4">
            <Link
              to="/agendar"
              className="btn-primary w-full sm:w-auto text-center"
              onClick={() => {
                trackAnalyticsEvent('cta_click', { cta: 'agendar_consulta', location: 'hero' });
                trackGtmEvent('cta_click', { cta: 'agendar_consulta', location: 'hero' });
              }}
            >
              Agendar consulta
            </Link>
            <Link
              to="/produtos"
              className="btn-secondary bg-white/10 border-white/20 text-white hover:bg-white/20 w-full sm:w-auto text-center"
              onClick={() => {
                trackAnalyticsEvent('cta_click', { cta: 'ver_catalogo', location: 'hero' });
                trackGtmEvent('cta_click', { cta: 'ver_catalogo', location: 'hero' });
              }}
            >
              Catálogo exclusivo
            </Link>
          </div>
          <div className="flex justify-center px-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 sm:px-6 md:px-8 py-4 sm:py-6 flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 lg:gap-12 w-full sm:w-auto" style = {{ backgroundColor: "rgb(79 179 168 / var(--tw-bg-opacity, 1))" }}>
              {heroStats.map((item) => (
                <div key={item.label} className="flex flex-col">
                  <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1">{item.value}</span>
                  <span className="text-xs sm:text-xs uppercase tracking-wider text-gray-300 leading-tight">{item.label}</span>
                </div>
              ))}
            </div>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
          <div className="space-y-6">
            <p className="section-heading">Estratégia personalizada</p>
            <h2 className="section-title">Defina seus objetivos com especialistas EverWell</h2>
            <p className="muted-text">
              Compartilhe histórico, metas e desafios. Nossa equipe analisa seus dados, define a dosagem ideal e acompanha a evolução com métricas claras.
            </p>
            <div className="grid gap-4">
              {['Ajustes contínuos guiados por dados', 'Suporte médico premium', 'Protocolos exclusivos de performance'].map((item) => (
                <div key={item} className="flex items-center gap-3 text-darkTeal/85">
                  <span className="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center">•</span>
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
            <Link to="/agendar" className="btn-primary inline-flex items-center gap-3">
              Iniciar jornada
              <span aria-hidden>→</span>
            </Link>
          </div>
          <GoalForm />
        </div>
      </section>

      {/* Purchase Process */}
      <section className="py-12 sm:py-16 md:py-24 relative overflow-hidden">
        {/* Background Image on Scroll */}
        <div
          ref={backgroundSectionRef}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            backgroundVisible ? 'opacity-20' : 'opacity-0'
          }`}
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=2000&q=80)',
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
                <div key={step.number} className="card space-y-4 mx-2">
                  <span className="text-sm uppercase tracking-[0.4em] text-primary/70">Etapa</span>
                  <p className="text-4xl font-heading text-darkTeal">{step.number}</p>
                  <h3 className="text-2xl font-semibold text-darkTeal">{step.title}</h3>
                  <p className="muted-text">{step.copy}</p>
                  {step.link && (
                    <a
                      href={step.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-primary inline-flex items-center gap-2 uppercase tracking-wide"
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
              <div key={step.number} className="card space-y-3 sm:space-y-4">
                <span className="text-xs sm:text-sm uppercase tracking-[0.4em] text-primary/70">Etapa</span>
                <p className="text-3xl sm:text-4xl font-heading text-darkTeal">{step.number}</p>
                <h3 className="text-xl sm:text-2xl font-semibold text-darkTeal">{step.title}</h3>
                <p className="muted-text text-sm sm:text-base">{step.copy}</p>
                  {step.link && (
                    <a
                      href={step.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    className="text-xs sm:text-sm font-semibold text-primary inline-flex items-center gap-2 uppercase tracking-wide"
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
                <div key={product.name} className="product-card space-y-3 sm:space-y-4 mx-2">
                  <img src={product.image} alt={product.name} className="product-card-image" />
                  <h3 className="text-lg sm:text-xl font-semibold text-darkTeal">{product.name}</h3>
                  <p className="text-mediumTeal text-sm sm:text-base">{product.description}</p>
                  <Link to="/produtos" className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-primary inline-flex items-center gap-2">
                    Detalhes
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              ))}
              itemsPerView={3}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {productHighlights.map((product) => (
                <div key={product.name} className="product-card space-y-3 sm:space-y-4">
                  <img src={product.image} alt={product.name} className="product-card-image" />
                  <h3 className="text-lg sm:text-xl font-semibold text-darkTeal">{product.name}</h3>
                  <p className="text-mediumTeal text-sm sm:text-base">{product.description}</p>
                  <Link to="/produtos" className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-primary inline-flex items-center gap-2">
                    Detalhes
                    <span aria-hidden>→</span>
                  </Link>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="card text-left flex flex-col gap-6 scroll-animate">
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-2xl object-cover border-4 border-white/60"
                  />
                  <div>
                    <p className="font-semibold text-darkTeal">{testimonial.name}</p>
                    <p className="text-xs uppercase tracking-[0.35em] text-primary/70">{testimonial.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-darkTeal/80 italic leading-relaxed">“{testimonial.quote}”</p>
              </div>
            ))}
          </div>
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
            {differentiators.map((item) => (
              <div key={item.title} className="card space-y-4">
                <span className="text-4xl">{item.icon}</span>
                <h3 className="text-xl font-semibold text-darkTeal">{item.title}</h3>
                <p className="muted-text">{item.copy}</p>
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
                <Link to="/agendar" className="btn-primary w-full md:w-auto text-center">
                  Agendar consulta
                </Link>
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

