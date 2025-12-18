import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#C0DF16] text-white py-8 sm:py-10 md:py-12" style={{ color: 'white' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ minWidth: '85%' }}>
        <div className="flex flex-row justify-between">
          {/* Left Column - Logo and Copyright */}
          <div className="flex flex-col">
            {/* Logo - Stylized "ew" or "w" */}
            <div className="mb-6">
              <div 
                className="text-6xl sm:text-7xl md:text-8xl font-bold" 
                style={{ 
                  fontFamily: 'kodchasan', 
                  fontWeight: 700, 
                  letterSpacing: '-0.08em',
                  lineHeight: '1',
                  fontStyle: 'italic'
                }}                                            
              >
                <img src="/logos/logo_we_colored_white.png" alt="EverWell" className="w-full h-auto object-contain" style={{ width: '175px', marginLeft: '29px' }} />
              </div>
            </div>
            {/* Copyright */}
            <p className="text-sm sm:text-base font-normal text-white" style={{ fontFamily: 'kodchasan' }}>
              Copyright 2025 EverWell.
            </p>
            <p className="text-sm sm:text-base font-normal text-white" style={{ fontFamily: 'kodchasan', marginTop: '-20px', marginLeft: '29px' }}>
              All rights reserved.
            </p>
          </div>

          {/* Middle Column - Legal and Informational Text */}
          <div className="flex flex-col space-y-3 sm:space-y-4" style={{ alignItems: 'center' }}>
            <p className="text-sm sm:text-base font-normal leading-relaxed text-white" style={{ fontFamily: 'kodchasan' }}>
              Terms and Conditions for Healthcare Professionals | Terms and Conditions for Patients
            </p>
            <p className="text-sm sm:text-base font-normal leading-relaxed text-white" style={{ fontFamily: 'kodchasan' }}>
              EverWell is not intended to diagnose, treat, cure, or prevent any disease.
            </p>
            <p className="text-sm sm:text-base font-normal leading-relaxed text-white" style={{ fontFamily: 'kodchasan' }}>
              We connect doctors and patients.
            </p>
            <p className="text-sm sm:text-base font-normal leading-relaxed text-white" style={{ fontFamily: 'kodchasan' }}>
              The medications presented are under study and already have thousands of research studies and proven cases worldwide.
            </p>
          </div>

          {/* Right Column - Social Media Icons and Contact Links */}
          <div className="flex flex-col" style={{ alignItems: 'flex-end' }}>
            {/* Social Media Icons */}
            <div className="flex gap-4 mb-6 sm:mb-8">
              {/* Facebook Icon */}
              <a
                href="https://www.facebook.com/everwell"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border-2 border-white flex items-center justify-center hover:opacity-80 transition-opacity"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#C0DF16]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              {/* Email Icon */}
              <a
                href="mailto:contato@everwell.com"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border-2 border-white flex items-center justify-center hover:opacity-80 transition-opacity"
                aria-label="Email"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#C0DF16]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>

              {/* Instagram Icon */}
              <a
                href="https://www.instagram.com/everwell"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border-2 border-white flex items-center justify-center hover:opacity-80 transition-opacity"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#C0DF16]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>

            {/* Contact Links */}
            <div className="flex flex-col space-y-2 sm:space-y-3">
              <Link 
                to="https://wa.me/5521998170460?text=Gostaria%20de%20saber%20mais%20sobre%20os%20produtos%20EverWell" 
                className="text-sm sm:text-base font-normal hover:opacity-80 transition-opacity text-white"
                style={{ fontFamily: 'kodchasan' }}
              >
                Contact
              </Link>
              <Link 
                to="/duvidas" 
                className="text-sm sm:text-base font-normal hover:opacity-80 transition-opacity text-white"
                style={{ fontFamily: 'kodchasan' }}
              >
                Exchange Policy
              </Link>
              <Link 
                to="/duvidas" 
                className="text-sm sm:text-base font-normal hover:opacity-80 transition-opacity text-white"
                style={{ fontFamily: 'kodchasan' }}
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
