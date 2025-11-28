import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

// Calculate reading time based on content length
const calculateReadingTime = (content) => {
  if (!content) return 1;
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return minutes;
};

// Format date to DD/MM/YYYY
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const blogCardsRef = useRef([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await api.get('/blogs');
        setBlogs(response.data.blogs || []);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    blogCardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => {
      blogCardsRef.current.forEach((card) => {
        if (card) observer.unobserve(card);
      });
    };
  }, [blogs]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5faf7]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-mediumTeal">Carregando artigos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5faf7]">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-white to-primary/5"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/3 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <p className="section-heading mb-4">Conhecimento e bem-estar</p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-darkTeal mb-6 leading-tight">
              Blog EverWell
            </h1>
            <p className="text-xl md:text-2xl text-mediumTeal max-w-3xl mx-auto">
              Artigos e informações sobre cannabis medicinal, bem-estar e performance para transformar sua rotina.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="py-12 md:py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {blogs.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-darkTeal mb-3">Nenhum artigo publicado ainda</h3>
              <p className="text-mediumTeal">Novos artigos serão publicados em breve.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {blogs.map((blog, index) => {
                const readingTime = calculateReadingTime(blog.contentMarkdown);
                const formattedDate = formatDate(blog.publishedAt);
                
                return (
                  <Link
                    key={blog._id}
                    to={`/blog/${blog.slug}`}
                    ref={(el) => (blogCardsRef.current[index] = el)}
                    className="group relative block"
                    style={{
                      opacity: 0,
                      transform: 'translateY(30px)',
                      transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
                      transitionDelay: `${index * 0.1}s`
                    }}
                  >
                    <article className="card h-full flex flex-col overflow-hidden">
                      {/* Image Container */}
                      {blog.imageUrl && (
                        <div className="relative w-full overflow-hidden rounded-t-3xl mb-6 -mx-8 -mt-8">
                          <div className="absolute inset-0 bg-gradient-to-t from-darkTeal/20 to-transparent z-10"></div>
                          <img
                            src={blog.imageUrl}
                            alt={blog.title}
                            className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-105"
                          />
                          {/* Overlay gradient on hover */}
                          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300 z-20"></div>
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex-grow flex flex-col">
                        {/* Date and Reading Time */}
                        <div className="flex items-center gap-4 mb-4 text-sm text-mediumTeal">
                          {formattedDate && (
                            <span className="flex items-center gap-1.5">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {formattedDate}
                            </span>
                          )}
                          {readingTime > 0 && (
                            <span className="flex items-center gap-1.5">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {readingTime} min. de leitura
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h2 className="text-2xl font-semibold text-darkTeal mb-3 group-hover:text-primary transition-colors duration-300 leading-tight">
                          {blog.title}
                        </h2>

                        {/* Excerpt */}
                        {blog.excerpt && (
                          <p className="text-mediumTeal mb-4 line-clamp-3 flex-grow">
                            {blog.excerpt}
                          </p>
                        )}

                        {/* Tags */}
                        {blog.tags && blog.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {blog.tags.slice(0, 3).map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Read More Link */}
                        <div className="mt-auto pt-4 border-t border-primary/10">
                          <span className="text-sm font-semibold text-primary inline-flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
                            Ler mais
                            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        </div>
                      </div>

                      {/* Hover effect overlay */}
                      <div className="absolute inset-0 rounded-3xl border-2 border-primary/0 group-hover:border-primary/20 transition-all duration-300 pointer-events-none"></div>
                    </article>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      {blogs.length > 0 && (
        <section className="py-16 md:py-24 relative">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="card bg-gradient-to-br from-primary/5 via-white to-primary/5 border-primary/20">
              <h2 className="text-3xl md:text-4xl font-semibold text-darkTeal mb-4">
                Pronto para começar sua jornada?
              </h2>
              <p className="text-mediumTeal mb-8 text-lg">
                Agende uma consulta e descubra como a EverWell pode transformar sua rotina.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://pro.quaddro.co/yourbestversion/servicos/vgwg3F"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-flex items-center justify-center gap-2"
                >
                  Agendar Consulta
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
                <a
                  href="https://form.jotform.com/252618050339051"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary inline-flex items-center justify-center gap-2"
                >
                  Comece agora
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Blog;
