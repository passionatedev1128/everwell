export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Erro interno do servidor';

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(e => e.message).join(', ');
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyPattern)[0];
    message = `${field} já está em uso.`;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token inválido.';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expirado.';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

