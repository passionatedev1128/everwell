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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando artigo...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-accent">
        <div className="max-w-md w-full mx-4 text-center">
          <h2 className="text-2xl font-semibold text-text-dark mb-4">Artigo não encontrado</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/blog" className="btn-primary">
            Voltar para Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-accent py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/blog" className="text-primary hover:underline mb-6 inline-block">
          ← Voltar para Blog
        </Link>

        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-text-dark mb-4">
            {blog.title}
          </h1>
          {blog.excerpt && (
            <p className="text-xl text-gray-600 mb-4">{blog.excerpt}</p>
          )}
          {blog.publishedAt && (
            <p className="text-sm text-gray-500">
              Publicado em {new Date(blog.publishedAt).toLocaleDateString('pt-BR')}
            </p>
          )}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {blog.imageUrl && (
          <img
            src={blog.imageUrl}
            alt={blog.title}
            className="w-full h-96 object-cover rounded-lg mb-8"
          />
        )}

        <div className="prose prose-lg max-w-none bg-white rounded-xl shadow-md p-8">
          <ReactMarkdown>{blog.contentMarkdown}</ReactMarkdown>
        </div>
      </div>
    </article>
  );
};

export default BlogPost;

