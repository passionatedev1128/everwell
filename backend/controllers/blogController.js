import Blog from '../models/Blog.js';

export const getAllBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find({ published: true })
      .sort({ publishedAt: -1 })
      .select('-contentMarkdown');
    
    res.json({
      success: true,
      count: blogs.length,
      blogs
    });
  } catch (error) {
    next(error);
  }
};

export const getBlogBySlug = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ 
      slug: req.params.slug,
      published: true 
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Artigo não encontrado.'
      });
    }

    res.json({
      success: true,
      blog
    });
  } catch (error) {
    next(error);
  }
};

