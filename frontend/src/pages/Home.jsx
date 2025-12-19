import { Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import FAQAccordion from '../components/FAQAccordion';
import GoalForm from '../components/GoalForm';
import JotForm from '../components/JotForm';
import Carousel from '../components/Carousel';
import SimpleCarousel from '../components/SimpleCarousel';
import PlantBackground from '../components/PlantBackground';
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
    title: 'Agende sua consulta online',
    image: '/images/schedule.png',
    imageWidth: '159px',
    imageHeight: '145px'
  },
  {
    number: '2',
    title: 'Fale com um Especialista',
    image: '/images/expert.svg',
    imageWidth: '159px',
    imageHeight: '157px'
  },
  {
    number: '3',
    title: 'Receba seus produtos em casa',
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
  const [fireworkVisible, setFireworkVisible] = useState(false);
  const [fallingLeaves, setFallingLeaves] = useState([]);
  const [continuousLeaves, setContinuousLeaves] = useState([]);
  const [trustBadgesVisible, setTrustBadgesVisible] = useState(false);
  const [nextLevelVisible, setNextLevelVisible] = useState(false);
  const [productsVisible, setProductsVisible] = useState(false);
  const [testimonialsVisible, setTestimonialsVisible] = useState(false);
  const [youDropped, setYouDropped] = useState(false);
  const [versionSectionVisible, setVersionSectionVisible] = useState(false);
  const [faqSectionVisible, setFaqSectionVisible] = useState(false);
  const backgroundSectionRef = useRef(null);
  const testimonialsFetchedRef = useRef(false);
  const heroSectionRef = useRef(null);
  const trustBadgesRef = useRef(null);
  const nextLevelRef = useRef(null);
  const productsRef = useRef(null);
  const testimonialsRef = useRef(null);
  const versionSectionRef = useRef(null);
  const faqSectionRef = useRef(null);

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

  // Firework effect for "every day" text
  useEffect(() => {
    const timer = setTimeout(() => {
      setFireworkVisible(true);
      setTimeout(() => setFireworkVisible(false), 800);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Falling leaves effect on homepage load
  useEffect(() => {
    const createLeaves = () => {
      const leaves = [];
      const leafCount = 20; // Increased number of leaves
      
      for (let i = 0; i < leafCount; i++) {
        leaves.push({
          id: `leaf-${i}-${Date.now()}`,
          startX: Math.random() * 100, // Random horizontal position (0-100%)
          appearDelay: Math.random() * 0.5, // Delay before first appearance (0-0.5s)
          disappearDelay: 1 + Math.random() * 0.5, // When to disappear (1-1.5s after appear)
          reappearDelay: 2 + Math.random() * 0.5, // When to reappear (2-2.5s after appear)
          fallDelay: 2.5 + Math.random() * 0.5, // When to start falling (2.5-3s after appear)
          duration: 6 + Math.random() * 3, // Fall duration (6-9 seconds)
          rotation: Math.random() * 360, // Random initial rotation
          rotationSpeed: (Math.random() - 0.5) * 3, // Random rotation speed (increased)
          size: 70 + Math.random() * 50, // Random size (70-120px, larger)
        });
      }
      
      //setFallingLeaves(leaves);
      
      // Remove leaves after animation completes
      const maxDuration = Math.max(...leaves.map(l => l.fallDelay + l.duration));
      setTimeout(() => {
        setFallingLeaves([]);
      }, (maxDuration + 1) * 1000);
    };
    
    // createLeaves();
  }, []);

  // Continuous falling leaves effect - large number of leaves (fall once)
  useEffect(() => {
    let isMounted = true;
    let cleanupTimeout = null;

    const createContinuousLeaves = () => {
      const leaves = [];
      const leafCount = 80; // Large number of leaves
      
      for (let i = 0; i < leafCount; i++) {
        leaves.push({
          id: `continuous-leaf-${i}-${Date.now()}`,
          startX: Math.random() * 100, // Random horizontal position (0-100%)
          startDelay: Math.random() * 15, // Staggered start times (0-15s)
          duration: 8 + Math.random() * 6, // Fall duration (8-14 seconds)
          rotation: Math.random() * 360, // Random initial rotation
          rotationSpeed: (Math.random() - 0.5) * 4, // Random rotation speed
          size: 40 + Math.random() * 40, // Random size (40-80px)
          opacity: 0.6 + Math.random() * 0.4, // Varying opacity (0.6-1.0)
          horizontalDrift: (Math.random() - 0.5) * 100, // Horizontal drift while falling
        });
      }
      
      if (isMounted) {
        setContinuousLeaves(leaves);

        // Remove leaves after all animations complete
        const maxDuration = Math.max(...leaves.map(l => l.startDelay + l.duration));
        cleanupTimeout = setTimeout(() => {
          if (isMounted) {
            setContinuousLeaves([]);
          }
        }, (maxDuration + 1) * 1000);
      }
    };

    createContinuousLeaves();
    
    // Cleanup function
    return () => {
      isMounted = false;
      if (cleanupTimeout) {
        clearTimeout(cleanupTimeout);
      }
      // Clear leaves on unmount to prevent state updates after unmount
      setContinuousLeaves([]);
    };
  }, []);

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

    // Trust Badges scroll observer
    const trustBadgesObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTrustBadgesVisible(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (trustBadgesRef.current) {
      trustBadgesObserver.observe(trustBadgesRef.current);
    }

    // Your next level section scroll observer
    const nextLevelObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setNextLevelVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (nextLevelRef.current) {
      nextLevelObserver.observe(nextLevelRef.current);
    }

    // Products section scroll observer
    const productsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setProductsVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (productsRef.current) {
      productsObserver.observe(productsRef.current);
    }

    // Version section scroll observer
    const versionSectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVersionSectionVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (versionSectionRef.current) {
      versionSectionObserver.observe(versionSectionRef.current);
    }

    // FAQ section scroll observer
    const faqSectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setFaqSectionVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (faqSectionRef.current) {
      faqSectionObserver.observe(faqSectionRef.current);
    }

    // Testimonials section scroll observer - will be set up when testimonials are loaded
    // This is handled in a separate useEffect that watches for testimonialsRef

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
            price: p.price || 0,
            usageTiming: p.usageTiming || ''
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
          setTestimonials(mappedTestimonials);
        } else {
          setTestimonials([]);
          testimonialsFetchedRef.current = false; // Reset to allow retry
        }
      } catch (error) {
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
      if (trustBadgesRef.current) {
        trustBadgesObserver.unobserve(trustBadgesRef.current);
      }
      if (nextLevelRef.current) {
        nextLevelObserver.unobserve(nextLevelRef.current);
      }
      if (productsRef.current) {
        productsObserver.unobserve(productsRef.current);
      }
      if (versionSectionRef.current) {
        versionSectionObserver.unobserve(versionSectionRef.current);
      }
      if (faqSectionRef.current) {
        faqSectionObserver.unobserve(faqSectionRef.current);
      }
      if (testimonialsRef.current) {
        testimonialsObserver.unobserve(testimonialsRef.current);
      }
      // Reset fetch flag on unmount to allow refetch on remount
      testimonialsFetchedRef.current = false;
    };
  }, []);

  // Set up testimonials observer when testimonials section is rendered
  useEffect(() => {
    if (!testimonials || testimonials.length === 0) {
      return;
    }

    let testimonialsObserver = null;

    // Wait a bit for the section to render
    const timer = setTimeout(() => {
      if (testimonialsRef.current) {
        testimonialsObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting && !testimonialsVisible) {
                console.log('✅ Testimonials section is visible, triggering animations');
                // Show testimonials section first (cards will be visible)
                setTestimonialsVisible(true);
                // Trigger "YOU" drop effect immediately (starts first)
                setYouDropped(true);
              }
            });
          },
          { threshold: 0.2 }
        );

        testimonialsObserver.observe(testimonialsRef.current);
        console.log('👀 Testimonials observer set up');
      } else {
        console.warn('⚠️ testimonialsRef.current is null');
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      if (testimonialsObserver && testimonialsRef.current) {
        testimonialsObserver.unobserve(testimonialsRef.current);
      }
    };
  }, [testimonials, testimonialsVisible]);

  return (
    <div 
      className="bg-transparent relative"
      style={{
        background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAFA 50%, #FFFFFF 100%)',
        position: 'relative'
      }}
    >
      {/* Subtle background effect - pleasing and non-stimulating */}
      <div className="homepage-bg-effect" />
      {/* Plant growth background animation */}
      <PlantBackground />
      
      {/* Falling leaves with "Everwell" text */}
      {fallingLeaves.map(leaf => (
        <div
          key={leaf.id}
          className="falling-leaf"
          style={{
            position: 'fixed',
            left: `${leaf.startX}%`,
            top: '-100px',
            width: `${leaf.size}px`,
            height: `${leaf.size}px`,
            zIndex: 9998,
            pointerEvents: 'none',
            animation: `fallLeafSequence${leaf.id} ${leaf.fallDelay + leaf.duration}s ease-in-out ${leaf.appearDelay}s forwards`,
          }}
        >
          <style>{`
            @keyframes fallLeafSequence${leaf.id} {
              /* Stage 1: Appear at top */
              0% {
                transform: translateY(0) rotate(${leaf.rotation}deg);
                opacity: 0;
              }
              ${(leaf.appearDelay / (leaf.fallDelay + leaf.duration) * 100)}% {
                transform: translateY(0) rotate(${leaf.rotation}deg);
                opacity: 1;
              }
              /* Stage 2: Disappear */
              ${(leaf.disappearDelay / (leaf.fallDelay + leaf.duration) * 100)}% {
                transform: translateY(0) rotate(${leaf.rotation}deg);
                opacity: 0;
              }
              /* Stage 3: Reappear */
              ${(leaf.reappearDelay / (leaf.fallDelay + leaf.duration) * 100)}% {
                transform: translateY(0) rotate(${leaf.rotation}deg);
                opacity: 1;
              }
              /* Stage 4: Start falling */
              ${(leaf.fallDelay / (leaf.fallDelay + leaf.duration) * 100)}% {
                transform: translateY(0) rotate(${leaf.rotation}deg);
                opacity: 1;
              }
              /* Stage 5: Fall down */
              100% {
                transform: translateY(calc(100vh + 200px)) rotate(${leaf.rotation + leaf.rotationSpeed * 360}deg);
                opacity: 0;
              }
            }
          `}</style>
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#C0DF16',
              clipPath: 'polygon(50% 0%, 60% 5%, 75% 15%, 85% 30%, 90% 45%, 88% 60%, 82% 70%, 75% 78%, 65% 85%, 50% 90%, 35% 85%, 25% 78%, 18% 70%, 12% 60%, 10% 45%, 15% 30%, 25% 15%, 40% 5%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 16px rgba(192, 223, 22, 0.6), 0 2px 8px rgba(0, 0, 0, 0.3), 0 0 20px rgba(192, 223, 22, 0.4)',
              position: 'relative',
              filter: 'brightness(1.1) saturate(1.2)',
            }}
          >
            {/* Leaf vein lines for more realism - more vivid */}
            <div
              style={{
                position: 'absolute',
                top: '0',
                left: '50%',
                width: '2px',
                height: '90%',
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                transform: 'translateX(-50%)',
                boxShadow: '0 0 4px rgba(255, 255, 255, 0.3)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '20%',
                left: '50%',
                width: '1.5px',
                height: '40%',
                backgroundColor: 'rgba(255, 255, 255, 0.4)',
                transform: 'translateX(-50%) rotate(-25deg)',
                boxShadow: '0 0 3px rgba(255, 255, 255, 0.2)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '20%',
                left: '50%',
                width: '1.5px',
                height: '40%',
                backgroundColor: 'rgba(255, 255, 255, 0.4)',
                transform: 'translateX(-50%) rotate(25deg)',
                boxShadow: '0 0 3px rgba(255, 255, 255, 0.2)',
              }}
            />
            <span
              style={{
                color: 'white',
                fontSize: `${leaf.size * 0.18}px`,
                fontWeight: 'bold',
                fontFamily: 'kodchasan',
                textShadow: '0 2px 6px rgba(0, 0, 0, 0.5), 0 0 10px rgba(255, 255, 255, 0.3)',
                zIndex: 1,
                position: 'relative',
                letterSpacing: '0.5px',
              }}
            >
              Everwell
            </span>
          </div>
        </div>
      ))}

      {/* Continuous falling leaves effect - large number */}
      {continuousLeaves.map(leaf => (
        <div
          key={leaf.id}
          className="falling-leaf-continuous"
          style={{
            position: 'fixed',
            left: `${leaf.startX}%`,
            top: '-100px',
            width: `${leaf.size}px`,
            height: `${leaf.size}px`,
            zIndex: 9997,
            pointerEvents: 'none',
            opacity: leaf.opacity,
            animation: `fallLeafContinuous${leaf.id.replace(/[^a-zA-Z0-9]/g, '_')} ${leaf.duration}s linear ${leaf.startDelay}s forwards`,
          }}
        >
          <style>{`
            @keyframes fallLeafContinuous${leaf.id.replace(/[^a-zA-Z0-9]/g, '_')} {
              0% {
                transform: translateY(0) translateX(0) rotate(${leaf.rotation}deg);
                opacity: ${leaf.opacity};
              }
              50% {
                transform: translateY(50vh) translateX(${leaf.horizontalDrift * 0.5}px) rotate(${leaf.rotation + leaf.rotationSpeed * 180}deg);
                opacity: ${leaf.opacity};
              }
              100% {
                transform: translateY(calc(100vh + 200px)) translateX(${leaf.horizontalDrift}px) rotate(${leaf.rotation + leaf.rotationSpeed * 360}deg);
                opacity: 0;
              }
            }
          `}</style>
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#C0DF16',
              clipPath: 'polygon(50% 0%, 60% 5%, 75% 15%, 85% 30%, 90% 45%, 88% 60%, 82% 70%, 75% 78%, 65% 85%, 50% 90%, 35% 85%, 25% 78%, 18% 70%, 12% 60%, 10% 45%, 15% 30%, 25% 15%, 40% 5%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(192, 223, 22, 0.5), 0 2px 6px rgba(0, 0, 0, 0.2)',
              position: 'relative',
              filter: 'brightness(1.05) saturate(1.1)',
            }}
          >
            {/* Leaf vein lines */}
            <div
              style={{
                position: 'absolute',
                top: '0',
                left: '50%',
                width: '1.5px',
                height: '90%',
                backgroundColor: 'rgba(255, 255, 255, 0.4)',
                transform: 'translateX(-50%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '20%',
                left: '50%',
                width: '1px',
                height: '40%',
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                transform: 'translateX(-50%) rotate(-25deg)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '20%',
                left: '50%',
                width: '1px',
                height: '40%',
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                transform: 'translateX(-50%) rotate(25deg)',
              }}
            />
            {/* Everwell text on leaf */}
            <span
              style={{
                color: 'white',
                fontSize: `${leaf.size * 0.18}px`,
                fontWeight: 'bold',
                fontFamily: 'kodchasan',
                textShadow: '0 2px 6px rgba(0, 0, 0, 0.5), 0 0 10px rgba(255, 255, 255, 0.3)',
                zIndex: 1,
                position: 'relative',
                letterSpacing: '0.5px',
              }}
            >
              Everwell
            </span>
          </div>
        </div>
      ))}
      
      <div className="relative z-10">
      {/* Hero Section - Focus Performance Recovery */}
      <section ref={heroSectionRef} className="relative" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', marginBottom: '60px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex" style = {{ alignItems: 'flex-start' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 w-full items-center">
            {/* Left Side - Text Content */}
            <div className="font-kodchasan flex flex-col justify-center z-10">
              {/* Stacked headline: focus, performance, recovery (lowercase) with cascading animation */}
              <div className="text-5xl md:text-6xl leading-[1.05] font-normal" style={{ fontFamily: 'kodchasan', fontSize: '88px', lineHeight: '1.05' }}>
                <span 
                  className="cascade-text-0 inline-block"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, #C0DF16 0%, #FF6B9D 25%, #4ECDC4 50%, #FFE66D 75%, #C0DF16 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    backgroundSize: '200% 200%',
                    animation: 'cascadeInFromLeft 0.8s ease-out 0.3s forwards, gradientShift 4s ease infinite',
                    display: 'inline-block',
                    fontWeight: 'normal',
                    color: '#C0DF16',
                    opacity: 0
                  }}
                >
                  foco
                </span><br />
                <span 
                  className="cascade-text-1 inline-block"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, #FF6B9D 0%, #4ECDC4 25%, #FFE66D 50%, #C0DF16 75%, #FF6B9D 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    backgroundSize: '200% 200%',
                    animation: 'cascadeInFromLeft 0.8s ease-out 0.6s forwards, gradientShift 4s ease infinite 0.3s',
                    display: 'inline-block',
                    fontWeight: 'normal',
                    color: '#FF6B9D',
                    opacity: 0
                  }}
                >
                  desempenho
                </span><br />
                <span 
                  className="cascade-text-2 inline-block"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, #4ECDC4 0%, #FFE66D 25%, #C0DF16 50%, #FF6B9D 75%, #4ECDC4 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    backgroundSize: '200% 200%',
                    animation: 'cascadeInFromLeft 0.8s ease-out 0.9s forwards, gradientShift 4s ease infinite 0.6s',
                    display: 'inline-block',
                    fontWeight: 'normal',
                    color: '#4ECDC4',
                    opacity: 0,
                    paddingBottom: '11px'
                  }}
                >
                  recuperação
                </span>
              </div>
              <br />
              
              {/* every day. in lime green - appears after firework */}
              <div style={{ position: 'relative', display: 'inline-block' }}>
                {/* Firework burst effect */}
                {fireworkVisible && (
                  <div style={{ position: 'absolute', left: '60%', top: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none', zIndex: 100 }}>
                    {[...Array(12)].map((_, i) => {
                      const angle = (i / 12) * Math.PI * 2;
                      const distance = 40;
                      const x = Math.cos(angle) * distance;
                      const y = Math.sin(angle) * distance;
                      return (
                        <div
                          key={i}
                          className="firework-particle"
                          style={{
                            left: '50%',
                            top: '50%',
                            animation: `fireworkExplode${i} 0.8s ease-out forwards`,
                          }}
                        >
                          <style>{`
                            @keyframes fireworkExplode${i} {
                              0% {
                                opacity: 0;
                                transform: translate(-50%, -50%) scale(0);
                              }
                              50% {
                                opacity: 1;
                                transform: translate(-50%, -50%) scale(1);
                              }
                              100% {
                                opacity: 0;
                                transform: translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(1.5);
                              }
                            }
                          `}</style>
                        </div>
                      );
                    })}
                  </div>
                )}
                <p 
                  className="fade-in-after-firework text-5xl md:text-6xl leading-[1.05] font-normal" 
                  style={{
                    color: '#C0DF16',
                    fontWeight: 400,
                    fontFamily: 'kodchasan'
                  }}
                >
                  diariamente
                </p>
              </div>
              <br />                                
              {/* OUR PRODUCTS Button - descends after "every day" */}
              <Link
                to="/produtos"
                className="button-descend inline-block border-2 border-black bg-transparent px-6 sm:px-8 py-3 sm:py-4 uppercase tracking-wider transition-all duration-300 rounded-sm"
                style={{
                  borderRadius: '10px',
                  maxWidth: 'fit-content',
                  color: '#C0DF16',
                  borderColor: '#C0DF16'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#C0DF16';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#C0DF16';
                }}
                onClick={() => {
                  trackAnalyticsEvent('cta_click', { cta: 'our_products', location: 'hero' });
                  trackGtmEvent('cta_click', { cta: 'our_products', location: 'hero' });
                }}
              >
                NOSSOS PRODUTOS
              </Link>
            </div>
            
            {/* Right Side - Blurred Image with fade in from right */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <img src="/images/focus.png" alt="Focus" className="fade-in-from-right"
                style={{ width: '90%', height: '40%', marginTop: '40px', zIndex: 1000 }}
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
      <section ref={heroSectionRef} className="relative" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', marginLeft: '130px', marginBottom: '60px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex" style = {{ minWidth: '100%', justifyContent: 'center', alignItems: 'flex-start'}}>
        {/* Left Side - Product Image */}
        <img 
          src="/images/unlock.png" 
          alt="CBD Oil Product - EverWell"
          className="unlock-image-slide h-auto object-contain" 
          style={{ maxHeight: '450px' }}
          onError={(e) => {
            // Fallback if image doesn't exist - create placeholder
            e.target.style.display = 'none';
            const placeholder = document.createElement('div');
            placeholder.className = 'w-full h-96 bg-gray-100 flex items-center justify-center rounded-lg';
            placeholder.innerHTML = '<div class="text-gray-400 text-sm">Product Image Placeholder<br/>Add /images/unlock.png</div>';
            e.target.parentNode.appendChild(placeholder);
          }}
        />
        {/* Right Side - Text Content */}
        <div className="w-full md:w-1/2 flex flex-col justify-center text-left" style={{ fontFamily: 'kodchasan', minWidth: '65%', marginLeft: '60px' }}>
          <p className="on-bounce text-black text-5xl md:text-6xl leading-[1.05] font-normal" style={{ fontSize: '40px', color: 'limegreen' }}>
            sobre
          </p>
          <p 
            className="unlock-text-slide unlock-gradient-text text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-normal leading-tight mb-4 md:mb-6" 
            style={{ 
              fontWeight: 400, 
              fontFamily: 'kodchasan', 
              letterSpacing: '-0.02em',
              paddingBottom: '14px'
            }}
          >
            Desbloqueie seu próximo nível.
          </p>
          <h3 className="break-through text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-normal text-black leading-tight mb-6 md:mb-8" style={{ fontWeight: 100, fontFamily: 'kodchasan', letterSpacing: '-0.02em', color: '#b3cf19' }}>
            É todo bem-estar.
          </h3>
          <p className="fade-in-slow text-base sm:text-lg md:text-xl text-black leading-relaxed max-w-lg" style={{ fontWeight: 400, color: 'gray', minWidth: '100%' }}>
            Criamos produtos à base de CBD para quem busca melhoria constante.
          </p>
        </div>
        </div>                      
      </section>
      {/* Trust Badges - Right below header */}
      <section ref={trustBadgesRef} className="w-full pt-16 sm:pt-20 pb-6 sm:pb-8 px-4 sm:px-6 lg:px-8 relative z-40" style={{ backgroundColor: '#C0DF16', padding: '15px' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 md:gap-10 lg:gap-12">
            {trustBadges.map((badge, index) => (
              <div 
                key={index} 
                className={`trust-badge-slide flex items-center gap-3 sm:gap-4`}
                style={{ 
                  minWidth: '150px', 
                  flex: '1 1 auto',
                  animation: trustBadgesVisible ? `trustBadgeSlideIn 0.6s ease-out ${index * 0.1}s forwards` : 'none',
                  opacity: trustBadgesVisible ? 0 : 0
                }}
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
      <section ref={nextLevelRef} className="py-12 sm:py-16 md:py-24" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title Section - Left Aligned */}
          <div className="mb-12 sm:mb-16 md:mb-20 text-left">
            <h2 
              className="text-2xl sm:text-3xl md:text-4xl font-sans font-normal text-black mb-2" 
              style={{ 
                fontWeight: 400,
                color: 'olivedrab',
                fontFamily: 'kodchasan',
                animation: nextLevelVisible ? 'nextLevelTitleSlide 0.8s ease-out 0s forwards' : 'none',
                opacity: nextLevelVisible ? 0 : 0
              }}
            >
              Seu próximo nível
            </h2>
            <h3 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-bold text-black" 
              style={{ 
                fontWeight: 500, 
                fontFamily: 'kodchasan',
                display: 'inline-block'
              }}
            >
              <span
                style={{
                  opacity: nextLevelVisible ? 0 : 0,
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #C0DF16 0%, #A8C912 25%, #90B30E 50%, #A8C912 75%, #C0DF16 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  backgroundSize: '200% 200%',
                  animation: nextLevelVisible ? 'inStepsSlow 1.2s ease-out 0.8s forwards, gradientShift 3s ease infinite' : 'gradientShift 3s ease infinite'
                }}
              >
                em
              </span>
              {' '}
              <span
                style={{
                  opacity: nextLevelVisible ? 0 : 0,
                  display: 'inline-block',
                  transform: nextLevelVisible ? 'translateY(-30px)' : 'translateY(-30px)',
                  background: 'linear-gradient(135deg, #C0DF16 0%, #A8C912 25%, #90B30E 50%, #A8C912 75%, #C0DF16 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  backgroundSize: '200% 200%',
                  animation: nextLevelVisible ? 'numberThreeDrop 0.6s ease-out 2.0s forwards, gradientShift 3s ease infinite' : 'gradientShift 3s ease infinite'
                }}
              >
                3
              </span>
              {' '}
              <span
                style={{
                  opacity: nextLevelVisible ? 0 : 0,
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #C0DF16 0%, #A8C912 25%, #90B30E 50%, #A8C912 75%, #C0DF16 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  backgroundSize: '200% 200%',
                  animation: nextLevelVisible ? 'inStepsSlow 1.2s ease-out 1.2s forwards, gradientShift 3s ease infinite' : 'gradientShift 3s ease infinite'
                }}
              >
                passos
              </span>
            </h3>
          </div>

          {/* Three Step Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10 mb-12 sm:mb-16">
            {processSteps.map((step, stepIndex) => (
              <div 
                key={step.number}
                className="relative bg-white border-2 border-black rounded-lg p-6 sm:p-8 flex flex-col"
                style={{
                  borderRadius: '30px',
                  minHeight: '400px',
                  borderColor: '#C0DF16',
                  animation: nextLevelVisible ? `stepCardAppear 0.5s ease-out ${1.0 + stepIndex * 0.15}s forwards` : 'none',
                  opacity: nextLevelVisible ? 0 : 0,
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                  boxShadow: '0 8px 32px rgba(192, 223, 22, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.8), inset 0 -1px 0 rgba(0, 0, 0, 0.05)',
                  border: '1px solid rgba(192, 223, 22, 0.3)',
                  position: 'relative',
                  overflow: 'visible'
                }}
              >
                {/* Circular Lime Green Badge - Top Left, Overlapping Border */}
                <div 
                  className="absolute -top-2 -left-2 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center z-10"
                  style={{
                    backgroundColor: 'white',
                    border: '2px solid black',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    borderColor: '#C0DF16',
                    animation: nextLevelVisible ? `numberThreeDrop 0.5s ease-out ${0.8 + stepIndex * 0.15}s forwards` : 'none',
                    opacity: nextLevelVisible ? 0 : 0,
                    transform: nextLevelVisible ? 'translateY(-30px)' : 'translateY(-30px)'
                  }}
                >
                  <span className="text-white font-bold text-xl sm:text-2xl" style={{ fontFamily: 'kodchasan', color: '#C0DF16' }}>
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
                    fontSize: '30px',
                    color: '#C0DF16',
                    animation: nextLevelVisible ? `stepTitleAppear 0.5s ease-out ${1.2 + stepIndex * 0.15}s forwards` : 'none',
                    opacity: nextLevelVisible ? 0 : 0
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
              className="start-now-button-slide inline-block border-2 px-8 sm:px-12 py-3 sm:py-4 uppercase font-sans font-medium text-sm sm:text-base tracking-wider tansition-all duration-300"
              style={{
                borderRadius: '8px',
                borderColor: '#C0DF16',
                color: '#C0DF16',
                backgroundColor: 'transparent',
                fontWeight: 500,
                fontFamily: 'kodchasan',
                width: '50%',
                animation: nextLevelVisible ? 'buttonSlideInFromLeft 0.6s ease-out 3.3s forwards' : 'none',
                opacity: nextLevelVisible ? 0 : 0
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#C0DF16';
                e.target.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#C0DF16';
              }}
              onClick={() => {
                trackAnalyticsEvent('cta_click', { cta: 'start_now', location: 'purchase_process' });
                trackGtmEvent('cta_click', { cta: 'start_now', location: 'purchase_process' });
              }}
            >
              COMECE AGORA
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
      <section 
        ref={productsRef} 
        className="py-12 sm:py-16 md:py-24 products-section" 
        style={{ 
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Wave gradient background */}
        <div 
          className="products-wave-bg"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(ellipse 800px 400px at 20% 30%, rgba(192, 223, 22, 0.08) 0%, transparent 100%),
              radial-gradient(ellipse 600px 300px at 80% 70%, rgba(192, 223, 22, 0.06) 0%, transparent 100%),
              radial-gradient(ellipse 1000px 500px at 50% 50%, rgba(192, 223, 22, 0.05) 0%, transparent 60%),
              linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(250, 250, 250, 0.98) 50%, rgba(255, 255, 255, 0.95) 100%)
            `,
            backgroundSize: '100% 100%, 100% 100%, 100% 100%, 100% 100%',
            backgroundPosition: '0% 0%, 100% 100%, 50% 50%, 0% 0%',
            animation: 'waveFloat 20s ease-in-out infinite',
            zIndex: 10,
            pointerEvents: 'none'
          }}
        />
        <style>{`
          @keyframes waveFloat {
            0%, 100% {
              background-position: 0% 0%, 100% 100%, 50% 50%, 0% 0%;
              opacity: 1;
            }
            25% {
              background-position: 5% 10%, 95% 90%, 55% 45%, 0% 0%;
              opacity: 0.95;
            }
            50% {
              background-position: 10% 5%, 90% 95%, 45% 55%, 0% 0%;
              opacity: 1;
            }
            75% {
              background-position: 5% 15%, 95% 85%, 55% 40%, 0% 0%;
              opacity: 0.95;
            }
          }                                                    
        `}</style>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ position: 'relative', zIndex: 11 }}>
          {/* Title at Top Right */}
          <div className="flex justify-end mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-bold" style={{ fontWeight: 300, fontFamily: 'kodchasan', color: '#C0DF16' }}>
              Nossos produtos
            </h2>
          </div>
          {/* Product Cards Container with Carousel */}
          <div className="mb-12 sm:mb-16">
            <SimpleCarousel
              items={productHighlights.map((product, productIndex) => (
                <div key={product.name || product.slug} className="flex flex-col items-center" style={{ minWidth: "100%"}}>
                  {/* Product Frame with Lime Green Border */}
                  <div 
                    className="relative w-full rounded-lg p-6 sm:p-8 mb-6 product-card"
                    style={{
                      border: '2px solid #C0DF16',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(250, 255, 240, 0.98) 50%, rgba(255, 255, 255, 0.95) 100%)',
                      animation: productsVisible ? `productCardSlideIn 0.4s ease-out ${productIndex * 0.1}s forwards` : 'none',
                      opacity: productsVisible ? 0 : 0,
                      transform: productsVisible ? 'translateX(-100px)' : 'translateX(-100px)',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 16px 48px rgba(192, 223, 22, 0.4), 0 8px 24px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 0 30px rgba(192, 223, 22, 0.3)';
                      e.currentTarget.style.borderColor = '#D4E83A';
                      // Add shimmer effect
                      const shimmer = document.createElement('div');
                      shimmer.className = 'product-shimmer';
                      shimmer.style.cssText = `
                        position: absolute;
                        top: -50%;
                        left: -50%;
                        width: 200%;
                        height: 200%;
                        background: linear-gradient(45deg, transparent 30%, rgba(192, 223, 22, 0.2) 50%, transparent 70%);
                        animation: shimmerSlide 1.5s ease-in-out;
                        pointer-events: none;
                        z-index: 1;
                      `;
                      e.currentTarget.appendChild(shimmer);
                      setTimeout(() => {
                        if (shimmer.parentNode) {
                          shimmer.parentNode.removeChild(shimmer);
                        }
                      }, 1500);
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.borderColor = '#C0DF16';
                    }}
                  >
                    <style>{`
                      @keyframes shimmerSlide {
                        0% {
                          transform: translateX(-100%) translateY(-100%) rotate(45deg);
                        }
                        100% {
                          transform: translateX(100%) translateY(100%) rotate(45deg);
                        }
                      }
                    `}</style>
                    {/* Product Image Container with White Circular Pedestal */}
                    <div className="relative flex items-center justify-center mb-6" style={{ minHeight: '300px', zIndex: 1 }}>
                      {/* Product Image - Only Clickable */}
                      <div 
                        className="relative z-10 overflow-hidden"
                        style={{
                          animation: productsVisible ? `productImageAppear 0.4s ease-out ${0.3 + productIndex * 0.1}s forwards` : 'none',
                          opacity: productsVisible ? 0 : 0,
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {product?.image ? (
                          <Link
                            to={product.slug ? `/produtos/${product.slug}` : "/produtos"}
                            className="block w-full h-full overflow-hidden"
                            style={{ textDecoration: 'none' }}
                            onClick={() => {
                              trackAnalyticsEvent('product_click', { product: product.name, location: 'products_preview' });
                              trackGtmEvent('product_click', { product: product.name, location: 'products_preview' });
                            }}
                            onMouseEnter={(e) => {
                              const img = e.currentTarget.querySelector('img');
                              if (img) {
                                img.style.transform = 'scale(1.15)';
                                img.style.filter = 'drop-shadow(0 12px 24px rgba(192, 223, 22, 0.3))';
                                img.style.transition = 'all 0.4s ease-in-out';
                              }
                            }}
                            onMouseLeave={(e) => {
                              const img = e.currentTarget.querySelector('img');
                              if (img) {
                                img.style.transform = 'scale(1)';
                                img.style.filter = 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.1))';
                              }
                            }}
                          >
                            {/* Usage Timing Badge */}
                            {product?.usageTiming && product.usageTiming.trim() !== '' && (
                              <div 
                                className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide shadow-lg"
                                style={{
                                  background: product.usageTiming === 'Recovery' 
                                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                    : product.usageTiming === 'Post-workout'
                                    ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                                    : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                  color: '#FFFFFF',
                                  backdropFilter: 'blur(10px)',
                                  border: '1px solid rgba(255, 255, 255, 0.3)',
                                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
                                  pointerEvents: 'none',
                                  zIndex: 100,
                                  position: 'absolute'
                                }}
                              >
                                {product.usageTiming}
                              </div>
                            )}
                            <img                                                                          
                              src={product.image} 
                              alt={product.name || 'Product - EverWell'}
                              className="w-full h-auto max-h-64 object-contain product-image"
                              style={{ 
                                filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.1))',
                                cursor: 'pointer',
                                transition: 'all 0.4s ease-in-out',
                                position: 'relative',
                                zIndex: 1
                              }}
                              crossOrigin="anonymous"
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
                    <h3 className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold text-black mb-3" style={{ fontWeight: 200, fontSize: '40px', fontFamily: 'kodchasan', color: '#C0DF16' }}>
                      {product?.name || 'Product'}
                    </h3>
                    <p className="text-base sm:text-lg text-black font-normal" style={{ fontFamily: 'kodchasan', fontSize: '15px' }}>
                      {product?.subtitle || product?.description || 'Product description'}
                    </p>
                  </div>
                </div>
              ))}
              itemsPerView={3}
              gap="gap-8 sm:gap-10 md:gap-12"
            />
          </div>

          {/* DISCOVER THE PRODUCTS Button - Centered */}
          <div className="text-center">
            <Link
              to="/produtos"
              className="discover-products-button-slide inline-block border-2 px-8 sm:px-12 py-3 sm:py-4 uppercase font-sans font-medium text-sm sm:text-base tracking-wider transition-all duration-300"
              style={{
                borderRadius: '8px',
                borderColor: '#C0DF16',
                color: '#C0DF16',
                backgroundColor: 'white',
                fontWeight: 500,
                fontFamily: 'kodchasan',
                width: '50%',
                animation: productsVisible ? 'buttonSlideInFromLeft 0.6s ease-out 0.5s forwards' : 'none',
                opacity: productsVisible ? 0 : 0
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#C0DF16';
                e.target.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'white';
                e.target.style.color = '#C0DF16';
              }}
              onClick={() => {
                trackAnalyticsEvent('cta_click', { cta: 'discover_products', location: 'products_preview' });
                trackGtmEvent('cta_click', { cta: 'discover_products', location: 'products_preview' });
              }}
            >
              DESCUBRA OS PRODUTOS
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials - We are recognized */}
      {testimonials && testimonials.length > 0 && (
      <section 
        ref={testimonialsRef}
        className="py-12 sm:py-16 md:py-24" 
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }} 
        data-testimonials-count={testimonials.length}
      >
        <style>{`
          @keyframes slideUpFromBottom {
            0% {
              transform: translateY(100px);
              opacity: 0;
            }
            100% {
              transform: translateY(0);
              opacity: 1;
            }
          }
          
          @keyframes dropAndImpact {
            0% {
              transform: translateY(-200px) scale(1);
              opacity: 0;
            }
            40% {
              transform: translateY(20px) scale(1.1);
              opacity: 1;
            }
            50% {
              transform: translateY(0) scale(0.95);
            }
            60% {
              transform: translateY(0) scale(1.05);
            }
            70% {
              transform: translateY(0) scale(1);
            }
            100% {
              transform: translateY(0) scale(1);
              opacity: 1;
            }
          }
          
          @keyframes dustRise {
            0% {
              transform: translateY(0) scale(0);
              opacity: 0.8;
            }
            50% {
              opacity: 0.6;
            }
            100% {
              transform: translateY(-100px) scale(2);
              opacity: 0;
            }
          }
          
          @keyframes smokeRise {
            0% {
              transform: translateY(0) scale(0.5);
              opacity: 0.7;
            }
            100% {
              transform: translateY(-150px) scale(3);
              opacity: 0;
            }
          }
          
          @keyframes inkMorph {
            0% {
              clip-path: circle(0% at 50% 50%);
              transform: scale(0.8) rotate(0deg);
              opacity: 0;
            }
            30% {
              clip-path: circle(30% at 50% 50%);
              transform: scale(1.1) rotate(5deg);
              opacity: 0.7;
            }
            60% {
              clip-path: circle(60% at 50% 50%);
              transform: scale(0.95) rotate(-3deg);
              opacity: 0.9;
            }
            100% {
              clip-path: circle(100% at 50% 50%);
              transform: scale(1) rotate(0deg);
              opacity: 1;
            }
          }
          
          .testimonial-recognized {
            animation: slideUpFromBottom 0.8s ease-out forwards;
            opacity: 0;
          }
          
          .testimonial-matter {
            animation: slideUpFromBottom 0.8s ease-out 0.3s forwards;
            opacity: 0;
          }
          
          .testimonial-you {
            position: relative;
            animation: dropAndImpact 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
            opacity: 0;
          }
          
          .dust-particle {
            position: absolute;
            width: 8px;
            height: 8px;
            background: radial-gradient(circle, rgba(100, 100, 100, 0.6) 0%, rgba(100, 100, 100, 0) 70%);
            border-radius: 50%;
            animation: dustRise 1.5s ease-out forwards;
          }
          
          .smoke-particle {
            position: absolute;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, rgba(150, 150, 150, 0.4) 0%, rgba(150, 150, 150, 0) 70%);
            border-radius: 50%;
            animation: smokeRise 2s ease-out forwards;
          }
          
          .testimonial-card-ink {
            animation: inkMorph 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            opacity: 0;
          }
        `}</style>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading - Left Aligned */}
          <div className="text-left mb-12 sm:mb-16 md:mb-20" style={{ position: 'relative' }}>
            <h2 
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-sans font-normal text-black mb-2"
              style={{ 
                fontWeight: 400, 
                fontFamily: 'kodchasan',
                animation: testimonialsVisible ? 'slideUpFromBottom 0.8s ease-out forwards' : 'none',
                opacity: testimonialsVisible ? 1 : 0,
                transform: testimonialsVisible ? 'translateY(0)' : 'translateY(100px)'
              }}
            >
              <span
                style={{
                  background: 'linear-gradient(135deg, #C0DF16 0%, #D4E83A 20%, #E8F15C 40%, #FFB6C1 60%, #B0E0E6 80%, #C0DF16 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  backgroundSize: '200% 200%',
                  animation: 'gradientShift 4s ease infinite'
                }}
              >
                Somos reconhecidos.
              </span>
            </h2>
            <h3 
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-sans font-normal mb-2"
              style={{ 
                fontWeight: 400, 
                fontFamily: 'kodchasan',
                animation: testimonialsVisible ? 'slideUpFromBottom 0.8s ease-out 0.3s forwards' : 'none',
                opacity: testimonialsVisible ? 1 : 0,
                transform: testimonialsVisible ? 'translateY(0)' : 'translateY(100px)',
                background: 'linear-gradient(135deg, #C0DF16 0%, #D4E83A 20%, #E8F15C 40%, #FFB6C1 60%, #B0E0E6 80%, #C0DF16 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                backgroundSize: '200% 200%',
                animation: testimonialsVisible ? 'slideUpFromBottom 0.8s ease-out 0.3s forwards, gradientShift 4s ease infinite 0.3s' : 'gradientShift 4s ease infinite'
              }}
            >
              Para aqueles que importam,
            </h3>
            <h4 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-bold"
              style={{ 
                fontWeight: 700, 
                fontFamily: 'kodchasan', 
                color: '#C0DF16',
                position: 'relative',
                display: 'inline-block',
                animation: youDropped ? 'dropAndImpact 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards' : 'none',
                opacity: youDropped ? 1 : 0,
                transform: youDropped ? 'translateY(0) scale(1)' : 'translateY(-200px) scale(1)'
              }}
            >
              Você
              {/* Dust particles */}
              {youDropped && [...Array(12)].map((_, i) => {
                const angle = (i / 12) * Math.PI * 2;
                const distance = 30 + Math.random() * 20;
                const x = Math.cos(angle) * distance;
                return (
                  <div
                    key={`dust-${i}`}
                    className="dust-particle"
                    style={{
                      left: '50%',
                      bottom: '0',
                      transform: `translateX(calc(-50% + ${x}px))`,
                      animationDelay: `${0.4 + (i * 0.05)}s`,
                    }}
                  />
                );
              })}
              {/* Smoke particles */}
              {youDropped && [...Array(8)].map((_, i) => {
                const angle = (i / 8) * Math.PI * 2;
                const distance = 20 + Math.random() * 15;
                const x = Math.cos(angle) * distance;
                return (
                  <div
                    key={`smoke-${i}`}
                    className="smoke-particle"
                    style={{
                      left: '50%',
                      bottom: '0',
                      transform: `translateX(calc(-50% + ${x}px))`,
                      animationDelay: `${0.5 + (i * 0.08)}s`,
                    }}
                  />
                );
              })}
            </h4>
          </div>
          {/* Testimonial Cards Container with Carousel */}
          <SimpleCarousel
            items={testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id || testimonial.name}
                className="flex flex-col items-center"
              >
                <div 
                  className="flex flex-col items-center testimonial-card"
                  style={{
                    borderRadius: '12px',
                    backgroundColor: 'white',
                    padding: '2rem',
                    height: '400px',
                    minHeight: '400px',
                    maxHeight: '400px',
                    width: '314px',
                    color: 'white',
                    animation: testimonialsVisible ? `testimonialCardSlideInFromRight 0.8s ease-out ${index * 0.15}s forwards` : 'none',
                    opacity: testimonialsVisible ? 0 : 0,
                    border: '2px solid #C0DF16',
                    boxShadow: '0 8px 32px rgba(192, 223, 22, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.8), inset 0 -1px 0 rgba(0, 0, 0, 0.05)',
                    position: 'relative',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 16px 48px rgba(192, 223, 22, 0.4), 0 8px 24px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 0 30px rgba(192, 223, 22, 0.3)';
                    e.currentTarget.style.backgroundColor = 'white';
                    // Add shimmer effect
                    const shimmer = document.createElement('div');
                    shimmer.className = 'testimonial-shimmer';
                    shimmer.style.cssText = `
                      position: absolute;
                      top: -50%;
                      left: -50%;
                      width: 200%;
                      height: 200%;
                      background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.3) 50%, transparent 70%);
                      animation: shimmerSlide 1.5s ease-in-out;
                      pointer-events: none;
                      z-index: 1;
                    `;
                    e.currentTarget.appendChild(shimmer);
                    setTimeout(() => {
                      if (shimmer.parentNode) {
                        shimmer.parentNode.removeChild(shimmer);
                      }
                    }, 1500);
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(192, 223, 22, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.8), inset 0 -1px 0 rgba(0, 0, 0, 0.05)';
                    e.currentTarget.style.backgroundColor = 'white';
                  }}
                >
                  <style>{`
                    @keyframes shimmerSlide {
                      0% {
                        transform: translateX(-100%) translateY(-100%) rotate(45deg);
                      }
                      100% {
                        transform: translateX(100%) translateY(100%) rotate(45deg);
                      }
                    }
                  `}</style>
                  {/* Person Image - Centered */}
                  <div className="mb-4 flex items-center justify-center">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full object-cover testimonial-avatar"
                      style={{
                        border: '3px solid white',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                        transition: 'all 0.3s ease-in-out'
                      }}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80';
                      }}
                    />
                    <style>{`
                      .testimonial-card:hover .testimonial-avatar {
                        transform: scale(1.1);
                        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 255, 255, 0.5);
                        border-color: rgba(255, 255, 255, 0.9);
                      }
                    `}</style>
                  </div>

                  {/* Name - Bold Black */}
                  <h3 
                    className="text-xl sm:text-2xl font-bold mb-4 text-center"
                    style={{ 
                      fontWeight: 700, 
                      fontFamily: 'kodchasan',
                      color: '#C0DF16'
                    }}
                  >
                    {testimonial.name}
                  </h3>

                  {/* Testimonial Text */}
                  <p 
                    className="text-sm sm:text-base mb-4 text-center flex-grow"
                    style={{ 
                      fontFamily: 'kodchasan',
                      lineHeight: '1.6',
                      color: 'olivedrab'
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
              </div>
            ))}
            itemsPerView={3}
            gap="gap-6 sm:gap-8 md:gap-10"
          />
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
      <section ref={versionSectionRef} className="relative min-h-screen overflow-hidden" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-screen flex items-center" style={{ minWidth: '69%'}}>
          {/* Left Side - Blurred Image (1/3 width) */}
          <div className="w-full md:w-1/3">
            <img 
              src="/images/version.png"
              alt="Version"
              className="version-image-slide absolute inset-0 w-full h-full bg-cover bg-center"
              style={{ 
                width: '50%', 
                height: '100%',
                animation: versionSectionVisible ? 'versionImageSlideIn 0.8s ease-out 0s forwards' : 'none',
                opacity: versionSectionVisible ? 0 : 0
              }}
            />
          </div>

          {/* Right Side - Text and Buttons (2/3 width) */}
          <div className="w-full md:w-2/3 flex flex-col justify-center px-6 sm:px-8 md:px-12 lg:px-16 py-12 md:py-16" style={{ alignItems: 'flex-end' }}>
            {/* Text Content */}
            <div className="mb-8 sm:mb-12 text-left">
              <h2 className="version-text-your-best text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans font-normal mb-2" style={{ 
                float: "right", 
                fontWeight: 400, 
                fontFamily: 'kodchasan',
                opacity: versionSectionVisible ? 0 : 0,
                background: 'linear-gradient(135deg, #C0DF16 0%, #A8C912 25%, #90B30E 50%, #A8C912 75%, #C0DF16 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                backgroundSize: '200% 200%',
                animation: versionSectionVisible ? 'versionTextSlideInFromRight 0.8s ease-out 0.8s forwards, gradientShift 3s ease infinite' : 'none'
              }}>
                Sua melhor
              </h2>
              <h3 className="version-text-starts text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans font-normal mb-2" style={{ 
                fontWeight: 400, 
                fontFamily: 'kodchasan',
                opacity: versionSectionVisible ? 0 : 0,
                background: 'linear-gradient(135deg, #C0DF16 0%, #A8C912 25%, #90B30E 50%, #A8C912 75%, #C0DF16 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                backgroundSize: '200% 200%',
                animation: versionSectionVisible ? 'versionTextSlideInFromRight 0.8s ease-out 1.2s forwards, gradientShift 3s ease infinite' : 'none'
              }}>
                versão começa.
              </h3>
              <h4 className="version-text-now text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-sans font-bold" style={{ 
                float: "right", 
                fontWeight: 200, 
                fontFamily: 'kodchasan', 
                color: '#C0DF16',
                animation: versionSectionVisible ? 'versionNowSmokePulse 1.5s ease-in-out 1.6s infinite' : 'none',
                opacity: versionSectionVisible ? 0 : 0,
                animationFillMode: versionSectionVisible ? 'forwards' : 'none'
              }}>
                agora
              </h4>
            </div>
                     
            {/* Three Buttons Stacked */}
            <div className="flex flex-col gap-4 sm:gap-5">
              {/* Button 1: SCHEDULE YOUR APPOINTMENT */}
              <Link
                to="/agendar"
                className="version-button-1 inline-block border-2 px-6 sm:px-8 py-3 sm:py-4 uppercase font-sans font-medium text-sm sm:text-base tracking-wider transition-all duration-300 text-left"
                style={{
                  borderRadius: '8px',
                  borderColor: '#C0DF16',
                  color: '#C0DF16',
                  backgroundColor: 'white',
                  fontWeight: 500,
                  fontFamily: 'kodchasan',
                  animation: versionSectionVisible ? 'versionButtonSlideIn 0.6s ease-out 2.4s forwards' : 'none',
                  opacity: versionSectionVisible ? 0 : 0
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#C0DF16';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.color = '#C0DF16';
                }}
                onClick={() => {
                  trackAnalyticsEvent('cta_click', { cta: 'schedule_appointment', location: 'cta' });
                  trackGtmEvent('cta_click', { cta: 'schedule_appointment', location: 'cta' });
                }}
              >
                AGENDE SUA CONSULTA.
              </Link>

              {/* Button 2: DISCOVER THE PRODUCTS */}
              <Link
                to="/produtos"
                className="version-button-2 inline-block border-2 px-6 sm:px-8 py-3 sm:py-4 uppercase font-sans font-medium text-sm sm:text-base tracking-wider transition-all duration-300 text-left"
                style={{
                  borderRadius: '8px',
                  borderColor: '#C0DF16',
                  color: '#C0DF16',
                  backgroundColor: 'white',
                  fontWeight: 500,
                  fontFamily: 'kodchasan',
                  animation: versionSectionVisible ? 'versionButtonSlideIn 0.6s ease-out 2.7s forwards' : 'none',
                  opacity: versionSectionVisible ? 0 : 0,
                  textAlign: 'center'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#C0DF16';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.color = '#C0DF16';
                }}
                onClick={() => {
                  trackAnalyticsEvent('cta_click', { cta: 'discover_products', location: 'cta' });
                  trackGtmEvent('cta_click', { cta: 'discover_products', location: 'cta' });
                }}
              >
                DESCUBRA OS PRODUTOS
              </Link>

              {/* Button 3: GET YOUR QUESTIONS ANSWERED */}
              <Link
                to="/duvidas"
                className="version-button-3 inline-block border-2 px-6 sm:px-8 py-3 sm:py-4 uppercase font-sans font-medium text-sm sm:text-base tracking-wider transition-all duration-300 text-left"
                style={{
                  borderRadius: '8px',
                  borderColor: '#C0DF16',
                  color: '#C0DF16',
                  backgroundColor: 'transparent',
                  fontWeight: 500,
                  fontFamily: 'kodchasan',
                  animation: versionSectionVisible ? 'versionButtonSlideIn 0.6s ease-out 3.0s forwards' : 'none',
                  opacity: versionSectionVisible ? 0 : 0,
                  textAlign: 'center'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#C0DF16';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#C0DF16';
                }}
                onClick={() => {
                  trackAnalyticsEvent('cta_click', { cta: 'get_questions_answered', location: 'cta' });
                  trackGtmEvent('cta_click', { cta: 'get_questions_answered', location: 'cta' });
                }}
              >
                TIRE SUAS DÚVIDAS
              </Link>
            </div>
          </div>
        </div>

        {/* Thin Dark Horizontal Line at Bottom */}
        <div className="w-full h-px" style={{ height: '2px', backgroundColor: '#C0DF16' }} />
      </section>

      {/* FAQ */}
      <section ref={faqSectionRef} className="py-12 sm:py-16 md:py-24" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <p className="section-heading text-xs sm:text-sm">FAQ EverWell</p>
            <h2 className="section-title text-2xl sm:text-3xl md:text-4xl highlighted-text">Dúvidas frequentes</h2>
            <p className="muted-text text-sm sm:text-base">
              Transparência e clareza em cada etapa. Confira as respostas para as perguntas mais frequentes.
            </p>
          </div>
          <FAQAccordion isVisible={faqSectionVisible} />
          <div className="text-center mt-10">
            <Link to="/duvidas" className="btn-secondary inline-flex items-center gap-2 primary-color-text-green">
              Ver todas as dúvidas
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>
      <section className="py-12 sm:py-16 md:py-24" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '38px', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
        <img src="/images/brand.png" alt="EverWell" className="w-full h-auto object-contain" style={{ width: '30%' }} />
      </section>
      </div>
    </div>
  );
};

export default Home;

