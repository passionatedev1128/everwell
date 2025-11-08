import { Navigate } from 'react-router-dom';
import { isAuthenticated, isAuthorized, isAdmin } from '../utils/auth';

const ProtectedRoute = ({ children, requireAuth = false, requireAuthorization = false, requireAdmin = false }) => {
  if (requireAuth && !isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (requireAuthorization && !isAuthorized()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-accent">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="mb-4">
              <svg className="mx-auto h-16 w-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-text-dark mb-4">Acesso Restrito</h2>
            <p className="text-gray-600 mb-6">
              Você precisa ser autorizado por um administrador para acessar os produtos.
              Conforme as resoluções RDC 327/2019 e 660/2022 da Anvisa, os produtos são restritos.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Entre em contato ou aguarde a autorização após a consulta médica.
            </p>
            <button
              onClick={() => window.location.href = '/login'}
              className="btn-primary"
            >
              Verificar Status
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

