import { Link } from 'react-router-dom';
import FAQAccordion from '../components/FAQAccordion';

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
  return (
    <div className="bg-transparent">
      {/* Hero with video background */}
      <section className="relative min-h-[640px] overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={heroVideo}
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f1f2b]/80 via-[#0f2f2b]/75 to-primary/60" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-28 text-center text-white">
          <p className="section-heading text-white/70">EverWell Performance Lab</p>
          <h1 className="hero-title text-white">Focus. Performance. Recovery.</h1>
          <p className="hero-subtitle">
            Protocolos personalizados com cannabis medicinal e inovação científica para alcançar a sua melhor versão.
          </p>
          <div className="hero-cta">
            <Link to="/agendar" className="btn-primary">
              Agendar consulta
            </Link>
            <Link to="/produtos" className="btn-secondary">
              Catálogo exclusivo
            </Link>
          </div>
          <div className="mt-12 flex justify-center">
            <div className="glass-panel px-8 py-5 flex flex-col md:flex-row gap-6 md:gap-12 text-left md:text-center">
              {heroStats.map((item) => (
                <div key={item.label} className="flex flex-col">
                  <span className="text-3xl md:text-4xl font-heading font-semibold text-white">{item.value}</span>
                  <span className="text-sm uppercase tracking-[0.35em] text-white/70">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="-mt-20 relative z-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto glass-panel p-8 md:p-10">
          <div className="grid md:grid-cols-4 gap-6">
            {trustBadges.map((badge) => (
              <div key={badge.title} className="space-y-2">
                <p className="text-sm uppercase tracking-[0.3em] text-primary/80">{badge.title}</p>
                <p className="text-darkTeal/80 text-sm leading-relaxed">{badge.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Define Goals */}
      <section className="py-24 bg-gradient-to-br from-white via-primary/5 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
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
          <div className="glass-panel p-6 md:p-8">
            <div className="mb-6 text-left">
              <h3 className="text-2xl font-semibold text-darkTeal mb-2">Mapeie sua melhor versão</h3>
              <p className="text-sm text-mediumTeal">
                Responda ao diagnóstico oficial e receba plano personalizado.
              </p>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-inner border border-white/50">
              <iframe
                src="https://form.jotform.com/252618050339051"
                title="Formulário de Objetivos"
                className="w-full h-[520px] border-0"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Purchase Process */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <p className="section-heading">Onboarding premium</p>
            <h2 className="section-title">Uma experiência desenhada para alcançar resultados reais</h2>
            <p className="muted-text">
              Da primeira consulta à entrega, cada etapa é orientada por especialistas e acompanhada com total transparência.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {processSteps.map((step) => (
              <div key={step.number} className="card space-y-4">
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
          </div>
        </div>
      </section>

      {/* Products Preview */}
      <section className="py-24 bg-gradient-to-br from-primary/5 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <p className="section-heading">Coleção exclusiva</p>
              <h2 className="section-title">Produtos desenhados para performance, foco e recuperação</h2>
            </div>
            <Link to="/produtos" className="btn-secondary">
              Ver catálogo completo
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {productHighlights.map((product) => (
              <div key={product.name} className="product-card space-y-4">
                <img src={product.image} alt={product.name} className="product-card-image" />
                <h3 className="text-xl font-semibold text-darkTeal">{product.name}</h3>
                <p className="text-mediumTeal">{product.description}</p>
                <Link to="/produtos" className="text-sm font-semibold uppercase tracking-wide text-primary inline-flex items-center gap-2">
                  Detalhes
                  <span aria-hidden>→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <p className="section-heading">Satisfied customers</p>
            <h2 className="section-title">Histórias reais de alta performance com EverWell</h2>
            <p className="muted-text">
              Resultados sustentáveis, suporte contínuo e uma comunidade que vive bem-estar todos os dias.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="card text-left flex flex-col gap-6">
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
                <p className="text-darkTeal/80 italic leading-relaxed">“{testimonial.quote}”</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Differentials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <p className="section-heading">Por que EverWell</p>
            <h2 className="section-title">Uma plataforma completa para alta performance e bem-estar</h2>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
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
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f1f2b] via-primary/90 to-[#124f45] text-white p-12 md:p-16">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent)]" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-10">
              <div className="max-w-2xl space-y-4">
                <p className="section-heading text-white/70">Pronto para começar?</p>
                <h2 className="text-4xl md:text-5xl font-semibold leading-tight">Sua melhor versão começa agora</h2>
                <p className="text-white/75">
                  Avance para seu próximo nível com fórmulas EverWell, acompanhamento premium e métricas claras.
                </p>
              </div>
              <div className="flex flex-col gap-4 md:text-right">
                <Link to="/agendar" className="btn-primary">
                  Agendar consulta
                </Link>
                <Link to="/duvidas" className="btn-secondary inline-flex items-center gap-2 self-start md:self-end">
                  Fale com especialistas
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-gradient-to-br from-white via-primary/5 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="section-heading">FAQ EverWell</p>
            <h2 className="section-title">Dúvidas frequentes</h2>
            <p className="muted-text">
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

