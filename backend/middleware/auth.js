import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        message: 'Não autorizado. Token necessário.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-passwordHash');
    
    if (!user) {
      return res.status(401).json({ 
        message: 'Usuário não encontrado.' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ 
        message: 'Token inválido.' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ 
        message: 'Token expirado. Faça login novamente.' 
      });
    }
    res.status(500).json({ 
      message: 'Erro na autenticação.', 
      error: error.message 
    });
  }
};

export const requireAuthorization = (req, res, next) => {
  if (!req.user.isAuthorized) {
    return res.status(403).json({ 
      message: 'Acesso negado. Você precisa ser autorizado para acessar este recurso.' 
    });
  }
  next();
};

export const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      message: 'Acesso negado. Apenas administradores podem acessar este recurso.' 
    });
  }
  next();
};

