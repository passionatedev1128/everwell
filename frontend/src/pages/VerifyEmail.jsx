import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { verifyEmail } from '../utils/api';
import { toast } from 'react-hot-toast';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      handleVerify();
    } else {
      setError('Token de verificação não fornecido.');
      setLoading(false);
    }
  }, [token]);

  const handleVerify = async () => {
    try {
      setLoading(true);
      const response = await verifyEmail(token);
      if (response.success) {
        // If registration is pending, redirect to complete registration
        if (response.pending) {
          navigate(`/complete-registration/${token}`);
          return;
        }
        // Otherwise, email is verified
        setSuccess(true);
        toast.success('Email verificado com sucesso!');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao verificar email. Token inválido ou expirado.');
      toast.error('Erro ao verificar email.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bgSecondary flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-mediumTeal">Verificando email...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bgSecondary flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        {success ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-darkTeal mb-4 font-heading">Email Verificado!</h2>
            <p className="text-mediumTeal mb-6">
              Seu email foi verificado com sucesso. Você será redirecionado para a página de login em instantes.
            </p>
            <Link to="/login" className="btn-primary">
              Ir para Login
            </Link>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-darkTeal mb-4 font-heading">Verificação Falhou</h2>
            <p className="text-mediumTeal mb-6">
              {error || 'Token de verificação inválido ou expirado.'}
            </p>
            <div className="space-y-3">
              <Link to="/login" className="btn-primary block">
                Ir para Login
              </Link>
              <p className="text-sm text-lightTeal">
                Precisa de um novo link de verificação?{' '}
                <Link to="/login" className="text-primary hover:underline">
                  Faça login e solicite um novo
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;

