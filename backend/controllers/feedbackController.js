import Feedback from '../models/Feedback.js';

export const createFeedback = async (req, res, next) => {
  try {
    const { name, email, rating, message } = req.body;
    const userId = req.user?._id || null;

    // Validate required fields
    if (!name || !email || !rating || !message) {
      return res.status(400).json({
        success: false,
        message: 'Todos os campos são obrigatórios.'
      });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Avaliação deve ser entre 1 e 5 estrelas.'
      });
    }

    // Create feedback
    const feedback = await Feedback.create({
      userId,
      name,
      email,
      rating: parseInt(rating),
      message
    });

    res.status(201).json({
      success: true,
      message: 'Feedback enviado com sucesso! Obrigado pela sua opinião.',
      feedback
    });
  } catch (error) {
    next(error);
  }
};

export const getAllFeedback = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const feedbacks = await Feedback.find(query)
      .populate('userId', 'name email')
      .populate('respondedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Feedback.countDocuments(query);

    res.json({
      success: true,
      count: feedbacks.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      feedbacks
    });
  } catch (error) {
    next(error);
  }
};

export const updateFeedbackStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, response } = req.body;

    const feedback = await Feedback.findById(id);
    
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback não encontrado.'
      });
    }

    const validStatuses = ['pending', 'reviewed', 'resolved', 'archived'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status inválido.'
      });
    }

    if (status) feedback.status = status;
    if (response !== undefined) {
      feedback.response = response;
      feedback.respondedAt = new Date();
      feedback.respondedBy = req.user._id;
    }

    await feedback.save();

    res.json({
      success: true,
      message: 'Feedback atualizado com sucesso.',
      feedback
    });
  } catch (error) {
    next(error);
  }
};

export const deleteFeedback = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const feedback = await Feedback.findByIdAndDelete(id);
    
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback não encontrado.'
      });
    }

    res.json({
      success: true,
      message: 'Feedback deletado com sucesso.'
    });
  } catch (error) {
    next(error);
  }
};

