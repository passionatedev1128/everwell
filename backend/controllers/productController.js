import Product from '../models/Product.js';

export const getAllProducts = async (req, res, next) => {
  try {
    // Products are now public - no authorization check needed
    const products = await Product.find({ visible: true }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    // Products are now public - no authorization check needed
    const product = await Product.findOne({ 
      _id: req.params.id,
      visible: true 
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado.'
      });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

export const getProductBySlug = async (req, res, next) => {
  try {
    // Products are now public - no authorization check needed
    const product = await Product.findOne({ 
      slug: req.params.slug,
      visible: true 
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado.'
      });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

