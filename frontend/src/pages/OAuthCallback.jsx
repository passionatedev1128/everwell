import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { setToken, setUser } from '../utils/auth';
import { toast } from 'react-hot-toast';
import { trackLogin } from '../utils/analytics';
import { trackLogin as gtmTrackLogin } from '../utils/gtm';
import { identifyContact } from '../utils/hubspot';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const success = searchParams.get('success');
  const error = searchParams.get('error');
  const emailError = searchParams.get('emailError');
  const processedRef = useRef(false);

  useEffect(() => {
    // Prevent duplicate execution (e.g., from React StrictMode)
    if (processedRef.current) {
      return;
    }

    if (error) {
      processedRef.current = true;
      toast.error('Falha na autenticação. Tente novamente.');
      navigate('/login');
      return;
    }

    if (success && token) {
      // Decode token to get user info
      const processOAuth = async () => {
        try {
          processedRef.current = true;
          const payload = JSON.parse(atob(token.split('.')[1]));
          
          // Set token and user
          setToken(token);
          // Fetch full user data to get name
          try {
            const userResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/me`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            if (userResponse.ok) {
              const userData = await userResponse.json();
              if (userData.success && userData.user) {
                const user = {
                  id: userData.user._id || payload.id,
                  _id: userData.user._id || payload.id,
                  email: userData.user.email || payload.email,
                  role: userData.user.role || payload.role,
                  name: userData.user.name,
                  isAuthorized: userData.user.isAuthorized
                };
                setUser(user);
                // Identify contact in HubSpot (essential CRM function)
                identifyContact(user);
                // Dispatch event to update user in Header
                window.dispatchEvent(new CustomEvent('userUpdated'));
              } else {
                const user = {
                  id: payload.id,
                  _id: payload.id,
                  email: payload.email,
                  role: payload.role
                };
                setUser(user);
                identifyContact(user);
              }
            } else {
              const user = {
                id: payload.id,
                _id: payload.id,
                email: payload.email,
                role: payload.role
              };
              setUser(user);
              identifyContact(user);
            }
          } catch (fetchError) {
            console.error('Error fetching user data:', fetchError);
            const user = {
              id: payload.id,
              _id: payload.id,
              email: payload.email,
              role: payload.role
            };
            setUser(user);
            identifyContact(user);
          }

          // Track Google OAuth login (check if it's a new user by checking creation time)
          // For simplicity, we'll track as login. In production, you might want to check if user is new
          trackLogin('google');
          gtmTrackLogin('google');

          // Show email error if verification email couldn't be sent
          if (emailError === 'true') {
            toast.error('The verification link can\'t be sent to your email.');
          } else {
            toast.success('Login realizado com sucesso!');
          }
          navigate('/');
        } catch (err) {
          console.error('Error processing OAuth callback:', err);
          processedRef.current = true;
          toast.error('Erro ao processar autenticação.');
          navigate('/login');
        }
      };
      
      processOAuth();
    } else {
      processedRef.current = true;
      navigate('/login');
    }
  }, [token, success, error, emailError, navigate]);

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

