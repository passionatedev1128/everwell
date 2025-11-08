import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { resetPassword, forgotPassword } from '../utils/api';
import { toast } from 'react-hot-toast';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(!token);
  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  const onSubmitReset = async (data) => {
    if (!token) {
      toast.error('Token de redefinição não encontrado.');
      return;
    }

    try {
      setLoading(true);
      const response = await resetPassword(token, data.password);
      if (response.success) {
        setSuccess(true);
        toast.success('Senha redefinida com sucesso!');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao redefinir senha. Token inválido ou expirado.');
    } finally {
      setLoading(false);
    }
  };

  const onSubmitForgot = async (data) => {
    try {
      setLoading(true);
      const response = await forgotPassword(data.email);
      if (response.success) {
        toast.success('Se o email existir, você receberá um link para redefinir sua senha.');
        setShowForgotPassword(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao solicitar redefinição de senha.');
    } finally {
      setLoading(false);
    }
  };

  const password = watch('password');

  if (success) {
    return (
      <div className="min-h-screen bg-bgSecondary flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-darkTeal mb-4 font-heading">Senha Redefinida!</h2>
          <p className="text-mediumTeal mb-6">
            Sua senha foi redefinida com sucesso. Você será redirecionado para a página de login em instantes.
          </p>
          <Link to="/login" className="btn-primary">
            Ir para Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bgSecondary flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-darkTeal mb-8 font-heading">
          {showForgotPassword ? 'Esqueceu a Senha?' : 'Redefinir Senha'}
        </h2>

        {showForgotPassword ? (
          <form onSubmit={handleSubmit(onSubmitForgot)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-mail
              </label>
              <input
                type="email"
                {...register('email', { 
                  required: 'Email é obrigatório',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Email inválido.'
                  }
                })}
                className="input-field"
                placeholder="seu@email.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50"
            >
              {loading ? 'Enviando...' : 'Enviar Link de Redefinição'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-primary hover:underline text-sm"
              >
                Voltar para Login
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit(onSubmitReset)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nova Senha
              </label>
              <input
                type="password"
                {...register('password', { 
                  required: 'Senha é obrigatória',
                  minLength: {
                    value: 6,
                    message: 'Senha deve ter no mínimo 6 caracteres'
                  }
                })}
                className="input-field"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Nova Senha
              </label>
              <input
                type="password"
                {...register('confirmPassword', { 
                  required: 'Confirmação de senha é obrigatória',
                  validate: value => value === password || 'As senhas não coincidem'
                })}
                className="input-field"
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50"
            >
              {loading ? 'Redefinindo...' : 'Redefinir Senha'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-primary hover:underline text-sm"
              >
                Voltar para Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;

