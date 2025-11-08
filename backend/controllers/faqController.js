import Faq from '../models/Faq.js';

export const getAllFaqs = async (req, res, next) => {
  try {
    const faqs = await Faq.find({ active: true })
      .sort({ order: 1, createdAt: -1 });
    
    res.json({
      success: true,
      count: faqs.length,
      faqs
    });
  } catch (error) {
    next(error);
  }
};

