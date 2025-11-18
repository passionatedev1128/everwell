import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import api from '../utils/api';
import { setToken, setUser } from '../utils/auth';
import OAuthButtons from '../components/OAuthButtons';
import { trackLogin, trackSignUp } from '../utils/analytics';
import { trackCompleteRegistration, identifyContact } from '../utils/hubspot';
import { trackSignUp as gtmTrackSignUp, trackLogin as gtmTrackLogin } from '../utils/gtm';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { register, handleSubmit, formState: { errors }, reset, getValues } = useForm();

  // Check for stored error messages on mount (from redirects)
  useEffect(() => {
    // Check sessionStorage for error messages
    const storedError = sessionStorage.getItem('authError');
    if (storedError) {
      toast.error(storedError, {
        duration: 3000,
        position: 'top-right',
      });
      sessionStorage.removeItem('authError'); // Clear after showing
    }

    // Check URL params for error messages
    const urlParams = new URLSearchParams(location.search);
    const errorParam = urlParams.get('error');
    if (errorParam) {
      toast.error(decodeURIComponent(errorParam), {
        duration: 3000,
        position: 'top-right',
      });
      // Clean URL
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const response = await api.post(endpoint, data);

      if (response.data.success) {
        setToken(response.data.token);
        setUser(response.data.user);
        // Identify contact in HubSpot
        identifyContact(response.data.user);
        
        // Track analytics events
        if (!isLogin) {
          // GA4: User acquisition analytics
          trackSignUp('email');
          // HubSpot: Workflow trigger for welcome emails and lead qualification
          trackCompleteRegistration('email');
          // GTM: For tag management
          gtmTrackSignUp('email');
          if (response.data.user && !response.data.user.emailVerified) {
            toast.success('Conta criada! Verifique seu email para ativar sua conta.');
          }
        } else {
          // Track login
          trackLogin('email');
          gtmTrackLogin('email');
          toast.success('Login realizado com sucesso!');
        }
        
        navigate('/');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erro ao processar solicitação. Tente novamente.';
      console.log('Login error:', errorMessage); // Debug log
      
      // Show toast error
      toast.error(errorMessage, {
        duration: 3000, // 3 seconds
        position: 'top-right',
      });
      
      // Keep email, only clear password
      if (isLogin) {
        // For login: keep email, clear password only
        const currentEmail = getValues('email');
        reset({
          email: currentEmail || '',
          password: '',
        });
      } else {
        // For registration: clear all fields (name, email, password)
        reset({
          name: '',
          email: '',
          password: '',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-accent flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center text-text-dark mb-2">
            {isLogin ? 'Login' : 'Criar Conta'}
          </h2>
          {!isLogin && (
            <p className="text-center text-mediumTeal text-sm mb-6">
              Use qualquer endereço de email para se registrar
            </p>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  {...register('name', { required: 'Nome é obrigatório' })}
                  className="input-field"
                  placeholder="Seu nome completo"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>
            )}

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
                    message: 'Email inválido. Use qualquer endereço de email válido (Gmail, Outlook, Yahoo, etc.)'
                  }
                })}
                className="input-field"
                placeholder="seu@email.com (qualquer provedor)"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
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

            {isLogin && (
              <div className="text-right">
                <a href="/reset-password" className="text-sm text-primary hover:underline">
                  Esqueceu a senha?
                </a>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50"
            >
              {loading ? 'Processando...' : (isLogin ? 'FAZER LOGIN' : 'Criar Conta')}
            </button>
          </form>

          <OAuthButtons />

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
              }}
              className="text-primary hover:underline"
            >
              {isLogin ? 'Cadastre-se e acesse os produtos disponíveis!' : 'Já tem uma conta? Faça login'}
            </button>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
            <p className="font-semibold mb-2">Informação Importante:</p>
            <p>
              Como solicitado pela Anvisa nas Resoluções da Diretoria Colegiada (RDC) 327/2019 e 660/2022 - 
              todos os produtos são restritos e não podem haver propagandas. É por isso que você precisa se 
              registrar para acessar as informações de cada produto indicado pelo(a) profissional da saúde responsável.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

