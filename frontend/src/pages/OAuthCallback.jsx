import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { setToken, setUser } from '../utils/auth';
import { toast } from 'react-hot-toast';
import { trackLogin, trackSignUp } from '../utils/analytics';
import { trackCompleteRegistration } from '../utils/hubspot';
import { trackLogin as gtmTrackLogin } from '../utils/gtm';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const success = searchParams.get('success');
  const error = searchParams.get('error');

  useEffect(() => {
    if (error) {
      toast.error('Falha na autenticação. Tente novamente.');
      navigate('/login');
      return;
    }

    if (success && token) {
      // Decode token to get user info
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        // Set token and user
        setToken(token);
        setUser({
          id: payload.id,
          email: payload.email,
          role: payload.role
        });

        // Track Google OAuth login (check if it's a new user by checking creation time)
        // For simplicity, we'll track as login. In production, you might want to check if user is new
        trackLogin('google');
        gtmTrackLogin('google');
        // Also track as registration completion for HubSpot behavioral events
        trackCompleteRegistration('google');

        toast.success('Login realizado com sucesso!');
        navigate('/');
      } catch (err) {
        console.error('Error processing OAuth callback:', err);
        toast.error('Erro ao processar autenticação.');
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [token, success, error, navigate]);

  return (
    <div className="min-h-screen bg-bgSecondary flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-mediumTeal">Processando autenticação...</p>
      </div>
    </div>
  );
};

export default OAuthCallback;

