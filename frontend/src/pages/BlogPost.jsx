import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import api from '../utils/api';

const BlogPost = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await api.get(`/blogs/${slug}`);
        setBlog(response.data.blog);
      } catch (err) {
        setError(err.response?.data?.message || 'Artigo não encontrado.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5faf7]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-mediumTeal">Carregando artigo...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5faf7]">
        <div className="max-w-md w-full mx-4 text-center">
          <h2 className="text-2xl font-semibold text-darkTeal mb-4">Artigo não encontrado</h2>
          <p className="text-mediumTeal mb-6">{error}</p>
          <Link to="/blog" className="btn-primary">
            Voltar para Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-[#f5faf7] py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link 
          to="/blog" 
          className="text-primary hover:text-primary-dark mb-6 inline-flex items-center gap-2 transition-colors duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar para Blog
        </Link>

        <header className="mb-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-darkTeal mb-6 leading-tight">
            {blog.title}
          </h1>
          {blog.excerpt && (
            <p className="text-xl md:text-2xl text-mediumTeal mb-6 leading-relaxed">
              {blog.excerpt}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-4 text-sm text-mediumTeal">
            {blog.publishedAt && (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(blog.publishedAt).toLocaleDateString('pt-BR', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </span>
            )}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        {blog.imageUrl && (
          <div className="mb-10 rounded-3xl overflow-hidden shadow-2xl">
            <img
              src={blog.imageUrl}
              alt={blog.title}
              className="w-full h-[400px] md:h-[500px] object-cover"
            />
          </div>
        )}

        <div className="prose prose-lg max-w-none 
          prose-headings:text-darkTeal prose-headings:font-heading prose-headings:font-bold
          prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-8
          prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-10 prose-h2:border-b prose-h2:border-primary/20 prose-h2:pb-3
          prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-8 prose-h3:text-primary
          prose-p:text-mediumTeal prose-p:leading-relaxed prose-p:mb-6 prose-p:text-base md:prose-p:text-lg
          prose-strong:text-darkTeal prose-strong:font-semibold
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          prose-ul:list-none prose-ul:pl-0 prose-ul:my-6
          prose-li:mb-3 prose-li:text-mediumTeal
          prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-6 prose-blockquote:pr-4 prose-blockquote:py-4 prose-blockquote:my-8
          prose-blockquote:bg-primary/5 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
          prose-blockquote:text-darkTeal prose-blockquote:font-medium
          prose-hr:border-primary/20 prose-hr:my-10
          prose-code:text-primary prose-code:bg-primary/10 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
          prose-pre:bg-darkTeal prose-pre:text-white prose-pre:rounded-xl prose-pre:p-6
          bg-white rounded-3xl shadow-lg border border-primary/10 p-8 md:p-12">
          <ReactMarkdown
            components={{
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-primary bg-primary/5 rounded-r-lg p-6 my-8 not-italic">
                  {children}
                </blockquote>
              ),
              ul: ({ children }) => (
                <ul className="list-none pl-0 space-y-3 my-6">
                  {children}
                </ul>
              ),
              li: ({ children }) => (
                <li className="flex items-start gap-3 text-mediumTeal">
                  <span className="text-primary mt-1">•</span>
                  <span>{children}</span>
                </li>
              ),
              h2: ({ children }) => (
                <h2 className="text-3xl font-heading font-bold text-darkTeal mb-4 mt-10 pb-3 border-b border-primary/20">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-2xl font-heading font-semibold text-primary mb-3 mt-8">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-mediumTeal leading-relaxed mb-6 text-base md:text-lg">
                  {children}
                </p>
              ),
              strong: ({ children }) => (
                <strong className="text-darkTeal font-semibold">
                  {children}
                </strong>
              ),
              hr: () => (
                <hr className="border-primary/20 my-10" />
              ),
            }}
          >
            {blog.contentMarkdown}
          </ReactMarkdown>
        </div>

        {/* CTA Section */}
        <div className="mt-12 card bg-gradient-to-br from-primary/5 via-white to-primary/5 border-primary/20 text-center">
          <h3 className="text-2xl md:text-3xl font-semibold text-darkTeal mb-4">
            Pronto para começar sua jornada?
          </h3>
          <p className="text-mediumTeal mb-6">
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
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogPost;
