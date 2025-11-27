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

// Admin CRUD functions
export const getAllBlogsAdmin = async (req, res, next) => {
  try {
    const { published, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (published !== undefined) {
      query.published = published === 'true';
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Blog.countDocuments(query);

    res.json({
      success: true,
      count: blogs.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      blogs
    });
  } catch (error) {
    next(error);
  }
};

export const getBlogById = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

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

export const createBlog = async (req, res, next) => {
  try {
    const { title, contentMarkdown, excerpt, imageUrl, tags, published } = req.body;

    if (!title || !contentMarkdown) {
      return res.status(400).json({
        success: false,
        message: 'Título e conteúdo são obrigatórios.'
      });
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug already exists
    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
      return res.status(400).json({
        success: false,
        message: 'Um artigo com este título já existe.'
      });
    }

    const blog = await Blog.create({
      title,
      slug,
      contentMarkdown,
      excerpt,
      imageUrl,
      tags: tags || [],
      published: published || false,
      publishedAt: published ? new Date() : null
    });

    res.status(201).json({
      success: true,
      message: 'Artigo criado com sucesso.',
      blog
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Um artigo com este slug já existe.'
      });
    }
    next(error);
  }
};

export const updateBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, contentMarkdown, excerpt, imageUrl, tags, published } = req.body;

    const blog = await Blog.findById(id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Artigo não encontrado.'
      });
    }

    // Update fields
    if (title) {
      blog.title = title;
      // Regenerate slug if title changed
      const newSlug = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      // Check if new slug conflicts with another blog
      const existingBlog = await Blog.findOne({ slug: newSlug, _id: { $ne: id } });
      if (existingBlog) {
        return res.status(400).json({
          success: false,
          message: 'Um artigo com este título já existe.'
        });
      }
      blog.slug = newSlug;
    }
    if (contentMarkdown !== undefined) blog.contentMarkdown = contentMarkdown;
    if (excerpt !== undefined) blog.excerpt = excerpt;
    if (imageUrl !== undefined) blog.imageUrl = imageUrl;
    if (tags !== undefined) blog.tags = tags;
    if (published !== undefined) {
      blog.published = published;
      if (published && !blog.publishedAt) {
        blog.publishedAt = new Date();
      }
    }

    await blog.save();

    res.json({
      success: true,
      message: 'Artigo atualizado com sucesso.',
      blog
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Um artigo com este slug já existe.'
      });
    }
    next(error);
  }
};

export const deleteBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const blog = await Blog.findByIdAndDelete(id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Artigo não encontrado.'
      });
    }

    res.json({
      success: true,
      message: 'Artigo deletado com sucesso.'
    });
  } catch (error) {
    next(error);
  }
};

