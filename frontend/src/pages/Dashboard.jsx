import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUser, getOrders } from '../utils/api';
import DocumentUpload from '../components/DocumentUpload';
import ProfileForm from '../components/ProfileForm';
import { DashboardCardSkeleton } from '../components/SkeletonLoader';
import { EmptyDocuments } from '../components/EmptyState';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserData();
    if (activeTab === 'overview') {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await getCurrentUser();
      if (response.success) {
        setUser(response.user);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Erro ao carregar dados do usuário.');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await getOrders();
      if (response.success) {
        setOrders(response.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const getDocumentStatus = (documentType) => {
    if (!user?.documents?.[documentType]) {
      return { status: 'missing', label: 'Não enviado', color: 'text-gray-500' };
    }
    const doc = user.documents[documentType];
    const statusMap = {
      pending: { label: 'Pendente', color: 'text-warning' },
      approved: { label: 'Aprovado', color: 'text-success' },
      rejected: { label: 'Rejeitado', color: 'text-error' }
    };
    return statusMap[doc.status] || { label: 'Desconhecido', color: 'text-gray-500' };
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'badge-warning',
      approved: 'badge-success',
      rejected: 'badge-error',
      missing: 'badge-secondary'
    };
    return badges[status] || 'badge-secondary';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bgSecondary py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-darkTeal mb-8 font-heading">Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <DashboardCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const totalDocuments = user?.documents ? Object.keys(user.documents).filter(
    key => user.documents[key]?.url
  ).length : 0;

  return (
    <div className="min-h-screen bg-bgSecondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-darkTeal mb-6 sm:mb-8 font-heading">Dashboard</h1>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
              <nav className="space-y-1.5 sm:space-y-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full text-left px-4 py-2 rounded-md transition-all duration-300 relative overflow-hidden ${
                    activeTab === 'overview'
                      ? 'bg-primary text-white shadow-md transform scale-[1.02]'
                      : 'text-darkTeal hover:bg-bgSecondary hover:translate-x-1'
                  }`}
                >
                  <span className="relative z-10">Visão Geral</span>
                  {activeTab === 'overview' && (
                    <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dark opacity-90 animate-pulse"></span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-4 py-2 rounded-md transition-all duration-300 relative overflow-hidden ${
                    activeTab === 'profile'
                      ? 'bg-primary text-white shadow-md transform scale-[1.02]'
                      : 'text-darkTeal hover:bg-bgSecondary hover:translate-x-1'
                  }`}
                >
                  <span className="relative z-10">Perfil</span>
                  {activeTab === 'profile' && (
                    <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dark opacity-90 animate-pulse"></span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full text-left px-4 py-2 rounded-md transition-all duration-300 relative overflow-hidden ${
                    activeTab === 'orders'
                      ? 'bg-primary text-white shadow-md transform scale-[1.02]'
                      : 'text-darkTeal hover:bg-bgSecondary hover:translate-x-1'
                  }`}
                >
                  <span className="relative z-10">Pedidos</span>
                  {activeTab === 'orders' && (
                    <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dark opacity-90 animate-pulse"></span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('documents')}
                  className={`w-full text-left px-4 py-2 rounded-md transition-all duration-300 relative overflow-hidden ${
                    activeTab === 'documents'
                      ? 'bg-primary text-white shadow-md transform scale-[1.02]'
                      : 'text-darkTeal hover:bg-bgSecondary hover:translate-x-1'
                  }`}
                >
                  <span className="relative z-10">Documentos</span>
                  {activeTab === 'documents' && (
                    <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dark opacity-90 animate-pulse"></span>
                  )}
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-6">
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-2xl font-bold text-darkTeal mb-6 font-heading">Visão Geral</h2>
                  
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="bg-bgSecondary rounded-lg p-4 border-l-4 border-primary">
                      <h3 className="text-sm font-medium text-mediumTeal mb-1">Total de Pedidos</h3>
                      <p className="text-3xl font-bold text-darkTeal">{orders.length}</p>
                    </div>
                    <div className="bg-bgSecondary rounded-lg p-4 border-l-4 border-primary">
                      <h3 className="text-sm font-medium text-mediumTeal mb-1">Pedidos Pendentes</h3>
                      <p className="text-3xl font-bold text-darkTeal">{pendingOrders}</p>
                    </div>
                    <div className="bg-bgSecondary rounded-lg p-4 border-l-4 border-primary">
                      <h3 className="text-sm font-medium text-mediumTeal mb-1">Documentos Enviados</h3>
                      <p className="text-3xl font-bold text-darkTeal">{totalDocuments}/3</p>
                    </div>
                  </div>

                  {/* Recent Orders */}
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-darkTeal mb-4">Pedidos Recentes</h3>
                    {orders.length === 0 ? (
                      <div>
                        <p className="text-mediumTeal mb-2">Nenhum pedido ainda.</p>
                        <Link to="/produtos" className="text-primary hover:text-primary-dark inline-block">
                          Ver produtos →
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {orders.slice(0, 3).map((order) => (
                          <div key={order._id} className="flex justify-between items-center p-3 bg-bgSecondary rounded-md">
                            <div>
                              <p className="text-darkTeal font-medium">Pedido #{order._id.slice(-6)}</p>
                              <p className="text-sm text-mediumTeal">
                                {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-primary font-bold">R$ {order.totalAmount?.toFixed(2)}</p>
                              <span className={`badge ${getStatusBadge(order.status)}`}>
                                {order.status}
                              </span>
                            </div>
                          </div>
                        ))}
                        <Link to="/pedidos" className="text-primary hover:text-primary-dark mt-2 inline-block">
                          Ver todos os pedidos →
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Document Status */}
                  <div>
                    <h3 className="text-xl font-semibold text-darkTeal mb-4">Status dos Documentos</h3>
                    <div className="space-y-2">
                      {['medicalPrescription', 'importAuthorization', 'proofOfResidence'].map((docType) => {
                        const docInfo = getDocumentStatus(docType);
                        const docLabels = {
                          medicalPrescription: 'Receita Médica',
                          importAuthorization: 'Autorização Anvisa',
                          proofOfResidence: 'Comprovante de Residência'
                        };
                        return (
                          <div key={docType} className="flex justify-between items-center p-3 bg-bgSecondary rounded-md">
                            <span className="text-mediumTeal">{docLabels[docType]}</span>
                            <span className={`badge ${getStatusBadge(docInfo.status)}`}>
                              {docInfo.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <ProfileForm user={user} onUpdateSuccess={fetchUserData} />
              )}

              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-bold text-darkTeal mb-6 font-heading">Pedidos</h2>
                  <Link to="/pedidos" className="btn-primary">
                    Ver Todos os Pedidos
                  </Link>
                </div>
              )}

              {activeTab === 'documents' && (
                <div>
                  <h2 className="text-2xl font-bold text-darkTeal mb-6 font-heading">Documentos</h2>
                  <p className="text-mediumTeal mb-6">
                    Envie os documentos necessários para autorização de compra. Todos os documentos serão analisados pela nossa equipe.
                  </p>
                  <DocumentUpload user={user} onUploadSuccess={fetchUserData} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
