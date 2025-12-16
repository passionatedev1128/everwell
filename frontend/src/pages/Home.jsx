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
    icon: '/images/check.png',
    line1: 'Produtos Aprovados',
    line2: 'pela Anvisa',
    size: 'w-6 h-6'
  },
  {
    icon: '/images/human.png',
    line1: 'Suporte Médico',
    line2: 'Especializado',
    size: 'w-6 h-6'
  },
  {
    icon: '/images/car.png',
    line1: 'Entrega em',
    line2: 'todo o Brasil',
    size: 'w-10 h-6'
  },
  {
    icon: '/images/cart.png',
    line1: 'Compra 100%',
    line2: 'Segura',
    size: 'w-8 h-6'
  },
  {
    icon: '/images/book.png',
    line1: 'Embalagem',
    line2: 'Discreta',
    size: 'w-6 h-6'
  }
];

const processSteps = [
  {
    number: '1',
    title: 'Schedule your online consultation',
    image: '/images/schedule.png',
    imageWidth: '159px',
    imageHeight: '145px'
  },
  {
    number: '2',
    title: 'Talk to an Expert',
    image: '/images/expert.svg',
    imageWidth: '159px',
    imageHeight: '157px'
  },
  {
    number: '3',
    title: 'Receive your products at home',
    image: '/images/deliverable.png',
    imageWidth: '178px',
    imageHeight: '145px'
  }
];

// productHighlights will be fetched from API
// testimonials will be fetched from API (resolved feedbacks)

const differentiators = [
  {
    icon: '✨',
    title: 'Qualidade é Inegociável',
    copy: 'Produtos importados, testados e com qualidade reconhecida. Desenvolvidas por especialistas e testadas lote a lote com laudos certificados.'
  },
  {
    icon: '🛡️',
    title: 'Transparência e Conformidade Legal',
    copy: 'Estrutura regulatória robusta, seguindo rigorosamente RDC 327/2019 e 660/2022. Total conformidade com a Anvisa.'
  },
  {
    icon: '🤝',
    title: 'Foco em Wellness',
    copy: 'Produtos desenhados para promover bem-estar e alta performance, apoiando sua jornada pessoal ou profissional.'
  },
  {
    icon: '📊',
    title: 'Acompanhamento de Ponta a Ponta',
    copy: 'Equipe dedicada para ajustar protocolos e potencializar resultados. Dashboard completo para monitorar evolução.'
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

  // Helper function to find product by name (case-insensitive)
  const findProductByName = (productName) => {
    return productHighlights.find(p => 
      p.name.toLowerCase().includes(productName.toLowerCase()) ||
      p.slug?.toLowerCase().includes(productName.toLowerCase())
    );
  };

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
      {/* Hero Section - Focus Performance Recovery */}
      <section className="relative min-h-screen bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-screen flex items-center" style={{ minWidth: '95%'}}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 w-full items-center">
            {/* Left Side - Text Content */}
            <div className="font-kodchasan flex flex-col justify-center z-10">
              {/* Stacked headline: focus, performance, recovery (lowercase) */}
              <div className="text-black text-5xl md:text-6xl leading-[1.05] font-normal" style={{ fontFamily: 'kodchasan', fontSize: '88px' }}>
                focus<br />
                performance<br />
                recovery
              </div>
              <br />
              {/* every day. in lime green */}
              <p 
                className="text-black text-5xl md:text-6xl leading-[1.05] font-normal" 
                style={{
                  color: '#C0DF16',
                  fontWeight: 400,
                  fontFamily: 'kodchasan'
                }}
              >
                every day
              </p>
              <br />
              {/* OUR PRODUCTS Button */}
              <Link
                to="/produtos"
                className="inline-block border-2 border-black bg-transparent px-6 sm:px-8 py-3 sm:py-4 uppercase tracking-wider hover:bg-black hover:text-white transition-all duration-300 rounded-sm"
                style={{
                  borderRadius: '10px',
                  maxWidth: 'fit-content',
                  color: '#C0DF16'
                }}
                onClick={() => {
                  trackAnalyticsEvent('cta_click', { cta: 'our_products', location: 'hero' });
                  trackGtmEvent('cta_click', { cta: 'our_products', location: 'hero' });
                }}
              >
                OUR PRODUCTS
              </Link>
            </div>
            
            {/* Right Side - Blurred Image */}
            <div className="relative w-full h-full min-h-[500px] md:min-h-[600px] lg:min-h-[700px] overflow-hidden rounded-lg">
              <div 
                className="absolute inset-0 w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: 'url(/images/landing_image.jpg)',
                  filter: 'blur(30px) brightness(1.1)',
                  transform: 'scale(1.2)',
                  backgroundPosition: 'center',
                  backgroundSize: 'cover'
                }}
              />
              {/* Overlay with warm earthy tones (browns, beiges) */}
              <div 
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(135deg, rgba(139, 90, 43, 0.25) 0%, rgba(205, 133, 63, 0.2) 30%, rgba(192, 223, 22, 0.3) 60%, rgba(139, 90, 43, 0.15) 100%)',
                  mixBlendMode: 'multiply'
                }}
              />
              {/* Light blues, greys, whites overlay */}
              <div 
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(180deg, rgba(173, 216, 230, 0.15) 0%, rgba(192, 192, 192, 0.1) 50%, rgba(255, 255, 255, 0.1) 100%)',
                  mixBlendMode: 'overlay'
                }}
              />
              {/* Prominent lime green accent at bottom right */}
              <div 
                className="absolute bottom-0 right-0 w-2/3 h-2/3"
                style={{
                  background: 'radial-gradient(ellipse at bottom right, rgba(192, 223, 22, 0.6) 0%, rgba(192, 223, 22, 0.2) 50%, transparent 80%)',
                  mixBlendMode: 'screen'
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quality Statement */}
      {/* <section className="py-12 sm:py-16 md:py-24 bg-gradient-to-br from-white via-primary-ultra-light to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ display: "flex", flexDirection: "row", alignItems: "flex-start" }}>
          <div className="text-center mb-8 sm:mb-12" style={{ flex: "4" }}>
            <p className="text-lg sm:text-xl md:text-2xl font-medium text-darkTeal leading-relaxed mb-6 sm:mb-8">
              Produtos importados, testados e com qualidade reconhecida
            </p>
          </div>          
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 md:gap-10 lg:gap-12" style={{ flex: "6" }}>
            <div className="flex items-center justify-center" style={{ height: '60px', maxWidth: '150px' }}>
              <img 
                src="/images/brand-1.png" 
                alt="Brand 1" 
                className="h-full w-auto object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <div className="flex items-center justify-center" style={{ height: '60px', maxWidth: '150px' }}>
              <img 
                src="/images/brand-2.png" 
                alt="Brand 2" 
                className="h-full w-auto object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <div className="flex items-center justify-center" style={{ height: '60px', maxWidth: '150px' }}>
              <img 
                src="/images/brand-3.png" 
                alt="Brand 3" 
                className="h-full w-auto object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <div className="flex items-center justify-center" style={{ height: '60px', maxWidth: '150px' }}>
              <img 
                src="/images/brand-4.png" 
                alt="Brand 4" 
                className="h-full w-auto object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          </div>
        </div>
      </section> */}

      {/* Value Proposition - Unlock your next level */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-white" style={{ padding: '65 0 65 0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ minWidth: '100%'}}>
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:gap-20" style={{ minWidth: '100%'}}>
            {/* Left Side - Product Image */}
            <div className="w-full md:w-1/2 flex items-center justify-center md:justify-start" style={{ minWidth: '100%'}}>
              <div className="relative w-full max-w-md" style={{ minWidth: '20%', marginRight: '10%' }}>
                <img 
                  src="/images/cbd-oil-product.png" 
                  alt="CBD Oil Product - EverWell"
                  className="w-full h-auto object-contain"
                  style={{ maxHeight: '600px' }}
                  onError={(e) => {
                    // Fallback if image doesn't exist - create placeholder
                    e.target.style.display = 'none';
                    const placeholder = document.createElement('div');
                    placeholder.className = 'w-full h-96 bg-gray-100 flex items-center justify-center rounded-lg';
                    placeholder.innerHTML = '<div class="text-gray-400 text-sm">Product Image Placeholder<br/>Add /images/cbd-oil-product.png</div>';
                    e.target.parentNode.appendChild(placeholder);
                  }}
                />
              </div>
              {/* Right Side - Text Content */}
              <div className="w-full md:w-1/2 flex flex-col justify-center text-left" style={{ fontFamily: 'kodchasan', minWidth: '100%' }}>
                <p className="text-black text-5xl md:text-6xl leading-[1.05] font-normal" style={{ fontSize: '40px' }}>
                  on
                </p>
                <p className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-normal text-black leading-tight mb-4 md:mb-6" style={{ fontWeight: 400, fontFamily: 'kodchasan', letterSpacing: '-0.02em' }}>
                  Unlock your next level.
                </p>
                <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-normal text-black leading-tight mb-6 md:mb-8" style={{ fontWeight: 100, fontFamily: 'kodchasan', letterSpacing: '-0.02em' }}>
                  It's every well.
                </h3>
                <p className="text-base sm:text-lg md:text-xl text-black leading-relaxed max-w-lg" style={{ fontWeight: 400, minWidth: '100%' }}>
                  We create CBD-based products for those seeking constant improvement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Trust Badges - Right below header */}
      <section className="w-full pt-16 sm:pt-20 pb-6 sm:pb-8 px-4 sm:px-6 lg:px-8 relative z-40" style={{ backgroundColor: '#C0DF16', padding: '15px' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 md:gap-10 lg:gap-12">
            {trustBadges.map((badge, index) => (
              <div 
                key={index} 
                className="flex items-center gap-3 sm:gap-4"
                style={{ minWidth: '150px', flex: '1 1 auto' }}
              >
                <div className="flex-shrink-0" style={{ color: '#C0DF16' }}>
                  <img src={badge.icon} alt={badge.alt} className={badge.size} />
                </div>
                <div className="flex flex-col" style={{ color: 'white' }}>
                  <span className="text-xs sm:text-sm font-medium leading-tight whitespace-nowrap">{badge.line1}</span>
                  <span className="text-xs sm:text-sm font-medium leading-tight whitespace-nowrap">{badge.line2}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Your next level in 3 Steps */}
      <section className="py-12 sm:py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title Section - Left Aligned */}
          <div className="mb-12 sm:mb-16 md:mb-20 text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-sans font-normal text-black mb-2" style={{ fontWeight: 400, fontFamily: 'kodchasan' }}>
              Your next level
            </h2>
            <h3 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-bold text-black" style={{ fontWeight: 500, fontFamily: 'kodchasan' }}>
              in 3 Steps
            </h3>
          </div>

          {/* Three Step Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10 mb-12 sm:mb-16">
            {processSteps.map((step) => (
              <div 
                key={step.number} 
                className="relative bg-white border-2 border-black rounded-lg p-6 sm:p-8 flex flex-col"
                style={{
                  borderRadius: '30px',
                  minHeight: '400px'
                }}
              >
                {/* Circular Lime Green Badge - Top Left, Overlapping Border */}
                <div 
                  className="absolute -top-4 -left-4 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center z-10"
                  style={{
                    backgroundColor: '#C0DF16',
                    border: '2px solid black',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  <span className="text-white font-bold text-xl sm:text-2xl" style={{ fontFamily: 'kodchasan' }}>
                    {step.number}
                  </span>
                </div>

                {/* Light Lime Green Blurred Square Graphic - Centered */}
                <div className="flex-1 flex items-center justify-center my-6 sm:my-8">
                  <div 
                    className="w-full h-48 sm:h-56 md:h-64 rounded-lg"
                    style={{
                      backgroundImage: 'url(' + step.image + ')',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      width: step.imageWidth,
                      height: step.imageHeight
                    }}
                  />
                </div>

                {/* Text Below Graphic - Left Aligned */}
                <h3 
                  className="text-lg sm:text-xl md:text-2xl font-sans font-normal text-black text-left"
                  style={{ 
                    fontWeight: 400, 
                    fontFamily: 'kodchasan',
                    lineHeight: '1.4',
                    textAlign: 'center',
                    fontSize: '30px'
                  }}
                >
                  {step.title}
                </h3>
              </div>
            ))}
          </div>

          {/* START NOW Button - Centered */}
          <div className="text-center">
            <Link
              to="/agendar"
              className="inline-block border-2 px-8 sm:px-12 py-3 sm:py-4 uppercase font-sans font-medium text-sm sm:text-base tracking-wider transition-all duration-300"
              style={{
                borderRadius: '8px',
                borderColor: '#C0DF16',
                color: '#000000',
                backgroundColor: 'transparent',
                fontWeight: 500,
                fontFamily: 'kodchasan',
                width: '50%'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#C0DF16';
                e.target.style.color = '#000000';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#000000';
              }}
              onClick={() => {
                trackAnalyticsEvent('cta_click', { cta: 'start_now', location: 'purchase_process' });
                trackGtmEvent('cta_click', { cta: 'start_now', location: 'purchase_process' });
              }}
            >
              START NOW
            </Link>
          </div>
        </div>
      </section>

      {/* <section className="py-12 sm:py-16 md:py-24 bg-gradient-to-br from-[#FFFEFB] via-primary-ultra-light to-[#FEFEFE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 lowercase" style={{ color: '#0f1f2b' }}>
              defina seus objetivos
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-darkTeal leading-relaxed">
              Compartilhe seus objetivos e histórico de saúde para que possamos criar a melhor estratégia de bem-estar e performance para você.
            </p>
          </div>

          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden" style={{ 
            backgroundColor: '#f5f5f5',
            minHeight: '500px',
            backgroundImage: 'url(/images/objectives-section.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}>
          
            <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-white/40 to-transparent"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center h-full min-h-[500px] p-6 sm:p-8 md:p-12">
              <div className="hidden md:block md:w-1/2"></div>
              <div className="w-full md:w-1/2 flex flex-col justify-center items-start gap-4 sm:gap-6 text-left">
                <p className="text-lg sm:text-xl md:text-2xl font-medium text-darkTeal leading-relaxed">
                  Atinja sua melhor perfomance, seja pessoal ou profissional.
                </p>
                <p className="text-base sm:text-lg md:text-xl text-darkTeal leading-relaxed">
                  Avance para seu próximo nível e se surpreenda do que você é capaz
                </p>
                <button
                  onClick={() => setShowJotForm(true)}
                  className="mt-4 sm:mt-6 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white uppercase tracking-wide rounded-lg transition-all duration-300 hover:opacity-90"
                  style={{ backgroundColor: '#0f1f2b' }}
                >
                  DEFINA SEUS OBJETIVOS
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

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
      )} */}

      {/* Our Products */}
      <section className="py-12 sm:py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title at Top Right */}
          <div className="flex justify-end mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-bold text-black" style={{ fontWeight: 300, fontFamily: 'kodchasan' }}>
              Our Products
            </h2>
          </div>
          {/* All Product Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12 mb-12 sm:mb-16">
            {productHighlights.map((product) => (
              <div
                key={product.name || product.slug}
                className="flex flex-col items-center"
              >
                {/* Product Frame with Lime Green Border */}
                <div 
                  className="relative w-full rounded-lg p-6 sm:p-8 mb-6"
                  style={{
                    border: '2px solid #C0DF16',
                    borderRadius: '12px',
                    backgroundColor: 'white'
                  }}
                >
                  {/* Product Image Container with White Circular Pedestal */}
                  <div className="relative flex items-center justify-center mb-6" style={{ minHeight: '300px' }}>
                    {/* White Circular Pedestal with Shadow */}
                    <div 
                      className="absolute bottom-0 w-32 h-8 rounded-full"
                      style={{
                        backgroundColor: 'white',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        transform: 'translateY(50%)'
                      }}
                    />
                    {/* Product Image - Only Clickable */}
                    <div className="relative z-10">
                      {product?.image ? (
                        <Link
                          to={product.slug ? `/produtos/${product.slug}` : "/produtos"}
                          className="block"
                          style={{ textDecoration: 'none' }}
                          onClick={() => {
                            trackAnalyticsEvent('product_click', { product: product.name, location: 'products_preview' });
                            trackGtmEvent('product_click', { product: product.name, location: 'products_preview' });
                          }}
                        >
                          <img 
                            src={product.image} 
                            alt={product.name || 'Product - EverWell'}
                            className="w-full h-auto max-h-64 object-contain"
                            style={{ 
                              filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.1))',
                              cursor: 'pointer'
                            }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              const placeholder = e.target.parentNode;
                              placeholder.innerHTML = '<div class="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center"><div class="text-gray-400 text-sm">Product Image</div></div>';
                            }}
                          />
                        </Link>
                      ) : (
                        <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                          <div className="text-gray-400 text-sm">Product Image</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Product Title and Description - Not Clickable */}
                <div className="text-center w-full">
                  <h3 className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold text-black mb-3" style={{ fontWeight: 200, fontFamily: 'kodchasan' }}>
                    {product?.name || 'Product'}
                  </h3>
                  <p className="text-base sm:text-lg text-black font-normal" style={{ fontFamily: 'kodchasan' }}>
                    {product?.subtitle || product?.description || 'Product description'}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* DISCOVER THE PRODUCTS Button - Centered */}
          <div className="text-center">
            <Link
              to="/produtos"
              className="inline-block border-2 px-8 sm:px-12 py-3 sm:py-4 uppercase font-sans font-medium text-sm sm:text-base tracking-wider transition-all duration-300"
              style={{
                borderRadius: '8px',
                borderColor: '#C0DF16',
                color: '#000000',
                backgroundColor: 'white',
                fontWeight: 500,
                fontFamily: 'kodchasan',
                width: '50%'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#C0DF16';
                e.target.style.color = '#000000';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'white';
                e.target.style.color = '#000000';
              }}
              onClick={() => {
                trackAnalyticsEvent('cta_click', { cta: 'discover_products', location: 'products_preview' });
                trackGtmEvent('cta_click', { cta: 'discover_products', location: 'products_preview' });
              }}
            >
              DISCOVER THE PRODUCTS
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials - We are recognized */}
      {testimonials && testimonials.length > 0 && (
      <section className="py-12 sm:py-16 md:py-24 bg-white" data-testimonials-count={testimonials.length}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading - Left Aligned */}
          <div className="text-left mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-sans font-normal text-black mb-2" style={{ fontWeight: 400, fontFamily: 'kodchasan' }}>
              We are recognized.
            </h2>
            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-sans font-normal text-black mb-2" style={{ fontWeight: 400, fontFamily: 'kodchasan' }}>
              For those who matter,
            </h3>
            <h4 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-bold" style={{ fontWeight: 700, fontFamily: 'kodchasan', color: '#C0DF16' }}>
              YOU
            </h4>
          </div>
          {/* Three Testimonial Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
            {testimonials.slice(0, 3).map((testimonial) => (
              <div 
                key={testimonial.id || testimonial.name}
                className="flex flex-col items-center"
                style={{
                  border: '2px solid black',
                  borderRadius: '12px',
                  backgroundColor: '#C0DF16',
                  padding: '2rem',
                  minHeight: '400px'
                }}
              >
                {/* Person Image - Centered */}
                <div className="mb-4 flex items-center justify-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full object-cover"
                    style={{
                      border: '3px solid white',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                    }}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80';
                    }}
                  />
                </div>

                {/* Name - Bold Black */}
                <h3 
                  className="text-xl sm:text-2xl font-bold text-black mb-4 text-center"
                  style={{ 
                    fontWeight: 700, 
                    fontFamily: 'kodchasan' 
                  }}
                >
                  {testimonial.name}
                </h3>

                {/* Testimonial Text */}
                <p 
                  className="text-sm sm:text-base text-black mb-4 text-center flex-grow"
                  style={{ 
                    fontFamily: 'kodchasan',
                    lineHeight: '1.6'
                  }}
                >
                  "{testimonial.quote}"
                </p>

                {/* 5 Yellow Stars */}
                <div className="flex items-center justify-center gap-1 mt-auto">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i} 
                      className="w-5 h-5 sm:w-6 sm:h-6 fill-current" 
                      style={{ color: '#FFD700' }}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/*
      <section className="py-12 sm:py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-14">
            <p className="section-heading text-xs sm:text-sm">Por que a EverWell ?</p>
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
                
                  <div 
                    className="absolute inset-0 transition-all duration-700 ease-out"
                    style={{
                      backgroundImage: `url(/images/differentiator-${index + 1}.jpg)`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      opacity: 1
                    }}
                  />
                  
                  <div 
                    className="absolute inset-0 transition-all duration-700 ease-out"
                    style={{
                      background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 0.6) 100%)',
                      opacity: 0.7
                    }}
                  />
                </div>
                
                <div className="relative z-10 h-full flex flex-col p-6 sm:p-8">                
                  <div className="flex items-end justify-end flex-1 mt-auto">
                    <h3 
                      className="text-xl sm:text-2xl font-bold transition-all duration-300 text-right"
                      style={{
                        color: '#FFFFFF',
                        textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8), 0 0 12px rgba(0, 0, 0, 0.5), 0 1px 3px rgba(0, 0, 0, 0.9)',
                        letterSpacing: '-0.02em',
                        fontWeight: '700',
                        lineHeight: '1.3'
                      }}
                    >
                      {item.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Quality Certificates (COA) */}
      {/* <section className="py-12 sm:py-16 md:py-24 bg-gradient-to-br from-white via-primary-ultra-light to-white">
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
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
      </section> */}

      {/* CTA - Your best version starts now */}
      <section className="relative min-h-screen bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-screen flex items-center" style={{ minWidth: '69%'}}>
          {/* Left Side - Blurred Image (1/3 width) */}
          <div className="w-full md:w-1/3 relative overflow-hidden">
            <div 
              className="absolute inset-0 w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: 'url(/images/cta-background.jpg)',
                filter: 'blur(20px) brightness(1.1)',
                transform: 'scale(1.1)',
                backgroundPosition: 'center',
                backgroundSize: 'cover'
              }}
            />
            {/* Overlay with green/yellow tones blending to brown */}
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(180deg, rgba(192, 223, 22, 0.3) 0%, rgba(255, 255, 0, 0.2) 30%, rgba(139, 90, 43, 0.4) 70%, rgba(101, 67, 33, 0.5) 100%)',
                mixBlendMode: 'multiply'
              }}
            />
          </div>

          {/* Right Side - Text and Buttons (2/3 width) */}
          <div className="w-full md:w-2/3 flex flex-col justify-center px-6 sm:px-8 md:px-12 lg:px-16 py-12 md:py-16" style={{ alignItems: 'flex-end' }}>
            {/* Text Content */}
            <div className="mb-8 sm:mb-12 text-left">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans font-normal text-black mb-2" style={{ float: "right", fontWeight: 400, fontFamily: 'kodchasan' }}>
                Your best
              </h2>
              <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans font-normal text-black mb-2" style={{ fontWeight: 400, fontFamily: 'kodchasan' }}>
                version starts
              </h3>
              <h4 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-sans font-bold" style={{ float: "right", fontWeight: 200, fontFamily: 'kodchasan', color: '#C0DF16' }}>
                now
              </h4>
            </div>

            {/* Three Buttons Stacked */}
            <div className="flex flex-col gap-4 sm:gap-5">
              {/* Button 1: SCHEDULE YOUR APPOINTMENT */}
              <Link
                to="/agendar"
                className="inline-block border-2 px-6 sm:px-8 py-3 sm:py-4 uppercase font-sans font-medium text-sm sm:text-base tracking-wider transition-all duration-300 text-left"
                style={{
                  borderRadius: '8px',
                  borderColor: '#C0DF16',
                  color: '#000000',
                  backgroundColor: 'white',
                  fontWeight: 500,
                  fontFamily: 'kodchasan'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f9f9f9';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'white';
                }}
                onClick={() => {
                  trackAnalyticsEvent('cta_click', { cta: 'schedule_appointment', location: 'cta' });
                  trackGtmEvent('cta_click', { cta: 'schedule_appointment', location: 'cta' });
                }}
              >
                SCHEDULE YOUR APPOINTMENT.
              </Link>

              {/* Button 2: DISCOVER THE PRODUCTS */}
              <Link
                to="/produtos"
                className="inline-block border-2 px-6 sm:px-8 py-3 sm:py-4 uppercase font-sans font-medium text-sm sm:text-base tracking-wider transition-all duration-300 text-left"
                style={{
                  borderRadius: '8px',
                  borderColor: '#C0DF16',
                  color: '#000000',
                  backgroundColor: 'white',
                  fontWeight: 500,
                  fontFamily: 'kodchasan'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f9f9f9';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'white';
                }}
                onClick={() => {
                  trackAnalyticsEvent('cta_click', { cta: 'discover_products', location: 'cta' });
                  trackGtmEvent('cta_click', { cta: 'discover_products', location: 'cta' });
                }}
              >
                DISCOVER THE PRODUCTS
              </Link>

              {/* Button 3: GET YOUR QUESTIONS ANSWERED */}
              <Link
                to="/duvidas"
                className="inline-block border-2 px-6 sm:px-8 py-3 sm:py-4 uppercase font-sans font-medium text-sm sm:text-base tracking-wider transition-all duration-300 text-left"
                style={{
                  borderRadius: '8px',
                  borderColor: '#000000',
                  color: '#000000',
                  backgroundColor: '#C0DF16',
                  fontWeight: 500,
                  fontFamily: 'kodchasan'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#b8d014';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#C0DF16';
                }}
                onClick={() => {
                  trackAnalyticsEvent('cta_click', { cta: 'get_questions_answered', location: 'cta' });
                  trackGtmEvent('cta_click', { cta: 'get_questions_answered', location: 'cta' });
                }}
              >
                GET YOUR QUESTIONS ANSWERED
              </Link>
            </div>
          </div>
        </div>

        {/* Thin Dark Horizontal Line at Bottom */}
        <div className="w-full h-px bg-black" style={{ height: '1px' }} />
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
      <section className="py-12 sm:py-16 md:py-24 bg-white" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '38px' }}>
        <img src="/images/brand.png" alt="EverWell" className="w-full h-auto object-contain" style={{ width: '30%' }} />
      </section>
    </div>
  );
};

export default Home;

