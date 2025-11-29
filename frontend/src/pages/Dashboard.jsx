import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getCurrentUser, getOrders, getNotifications } from '../utils/api';
import DocumentUpload from '../components/DocumentUpload';
import ProfileForm from '../components/ProfileForm';
import { DashboardCardSkeleton } from '../components/SkeletonLoader';
import { EmptyDocuments } from '../components/EmptyState';

const Dashboard = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.tab || 'overview');
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabTransition, setTabTransition] = useState(false);

  useEffect(() => {
    setTabTransition(true);
    const timer = setTimeout(() => {
      setTabTransition(false);
      fetchUserData();
      if (activeTab === 'overview') {
        fetchOrders();
      } else if (activeTab === 'messages') {
        fetchNotifications();
      }
    }, 150);
    return () => clearTimeout(timer);
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

  const fetchNotifications = async () => {
    try {
      const response = await getNotifications();
      if (response.success) {
        setNotifications(response.notifications || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
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
  
  // Calculate purchase statistics
  const totalProducts = orders.reduce((sum, order) => 
    sum + (order.products?.reduce((qty, item) => qty + item.quantity, 0) || 0), 0
  );
  const totalSpent = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const productCounts = {};
  orders.forEach(order => {
    order.products?.forEach(item => {
      const productName = item.name || 'Produto desconhecido';
      productCounts[productName] = (productCounts[productName] || 0) + item.quantity;
    });
  });

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
                  style={{
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <span className="relative z-10">Visão Geral</span>
                  {activeTab === 'overview' && (
                    <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dark opacity-90"></span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-4 py-2 rounded-md transition-all duration-300 relative overflow-hidden ${
                    activeTab === 'profile'
                      ? 'bg-primary text-white shadow-md transform scale-[1.02]'
                      : 'text-darkTeal hover:bg-bgSecondary hover:translate-x-1'
                  }`}
                  style={{
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <span className="relative z-10">Perfil</span>
                  {activeTab === 'profile' && (
                    <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dark opacity-90"></span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full text-left px-4 py-2 rounded-md transition-all duration-300 relative overflow-hidden ${
                    activeTab === 'orders'
                      ? 'bg-primary text-white shadow-md transform scale-[1.02]'
                      : 'text-darkTeal hover:bg-bgSecondary hover:translate-x-1'
                  }`}
                  style={{
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <span className="relative z-10">Pedidos</span>
                  {activeTab === 'orders' && (
                    <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dark opacity-90"></span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('documents')}
                  className={`w-full text-left px-4 py-2 rounded-md transition-all duration-300 relative overflow-hidden ${
                    activeTab === 'documents'
                      ? 'bg-primary text-white shadow-md transform scale-[1.02]'
                      : 'text-darkTeal hover:bg-bgSecondary hover:translate-x-1'
                  }`}
                  style={{
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <span className="relative z-10">Documentos</span>
                  {activeTab === 'documents' && (
                    <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dark opacity-90"></span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('messages')}
                  className={`w-full text-left px-4 py-2 rounded-md transition-all duration-300 relative overflow-hidden ${
                    activeTab === 'messages'
                      ? 'bg-primary text-white shadow-md transform scale-[1.02]'
                      : 'text-darkTeal hover:bg-bgSecondary hover:translate-x-1'
                  }`}
                  style={{
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <span className="relative z-10">Mensagens</span>
                  {activeTab === 'messages' && (
                    <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dark opacity-90"></span>
                  )}
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className={`transition-all duration-300 ${tabTransition ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-2xl font-bold text-darkTeal mb-6 font-heading">Visão Geral</h2>
                  
                  {/* User Information */}
                  <div className="mb-6 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20">
                    <h3 className="text-lg font-semibold text-darkTeal mb-4">Suas Informações</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-mediumTeal">Nome</p>
                        <p className="text-darkTeal font-medium">{user?.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-mediumTeal">Email</p>
                        <p className="text-darkTeal font-medium">{user?.email}</p>
                      </div>
                      {user?.phone && (
                        <div>
                          <p className="text-sm text-mediumTeal">Telefone</p>
                          <p className="text-darkTeal font-medium">{user.phone}</p>
                        </div>
                      )}
                      {user?.gender && (
                        <div>
                          <p className="text-sm text-mediumTeal">Gênero</p>
                          <p className="text-darkTeal font-medium">
                            {user.gender === 'male' ? 'Masculino' : user.gender === 'female' ? 'Feminino' : user.gender}
                          </p>
                        </div>
                      )}
                      {user?.dateOfBirth && (
                        <div>
                          <p className="text-sm text-mediumTeal">Data de Nascimento</p>
                          <p className="text-darkTeal font-medium">
                            {new Date(user.dateOfBirth).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-mediumTeal">Data de Cadastro</p>
                        <p className="text-darkTeal font-medium">
                          {new Date(user?.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="bg-bgSecondary rounded-lg p-4 border-l-4 border-primary">
                      <h3 className="text-sm font-medium text-mediumTeal mb-1">Total de Pedidos</h3>
                      <p className="text-3xl font-bold text-darkTeal">{orders.length}</p>
                    </div>
                    <div className="bg-bgSecondary rounded-lg p-4 border-l-4 border-primary">
                      <h3 className="text-sm font-medium text-mediumTeal mb-1">Produtos Comprados</h3>
                      <p className="text-3xl font-bold text-darkTeal">{totalProducts}</p>
                    </div>
                    <div className="bg-bgSecondary rounded-lg p-4 border-l-4 border-primary">
                      <h3 className="text-sm font-medium text-mediumTeal mb-1">Total Gasto</h3>
                      <p className="text-3xl font-bold text-primary">R$ {totalSpent.toFixed(2)}</p>
                    </div>
                    <div className="bg-bgSecondary rounded-lg p-4 border-l-4 border-primary">
                      <h3 className="text-sm font-medium text-mediumTeal mb-1">Documentos</h3>
                      <p className="text-3xl font-bold text-darkTeal">{totalDocuments}/3</p>
                    </div>
                  </div>

                  {/* Products Purchased */}
                  {Object.keys(productCounts).length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold text-darkTeal mb-4">Produtos Comprados</h3>
                      <div className="bg-bgSecondary rounded-lg p-4">
                        <div className="space-y-2">
                          {Object.entries(productCounts).map(([productName, quantity]) => (
                            <div key={productName} className="flex justify-between items-center p-2 bg-white rounded-md">
                              <span className="text-darkTeal font-medium">{productName}</span>
                              <span className="text-primary font-semibold">Quantidade: {quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

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
                            <span 
                              className={`badge ${getStatusBadge(docInfo.status)}`}
                              style={{
                                backgroundColor: docInfo.status === 'approved' ? '#10b981' : docInfo.status === 'pending' ? '#f59e0b' : docInfo.status === 'rejected' ? '#ef4444' : '#6b7280',
                                color: '#ffffff'
                              }}
                            >
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

              {activeTab === 'messages' && (
                <div>
                  <h2 className="text-2xl font-bold text-darkTeal mb-6 font-heading">Mensagens</h2>
                  {notifications.length === 0 ? (
                    <div className="text-center py-12">
                      <svg className="mx-auto h-12 w-12 text-primary/40 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <h3 className="text-sm font-medium text-darkTeal mb-1">Nenhuma mensagem</h3>
                      <p className="text-sm text-mediumTeal">Você não possui mensagens no momento.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {notifications.map((notification) => (
                        <div
                          key={notification._id}
                          className={`bg-primary/5 rounded-lg border border-primary/20 p-4 hover:shadow-md transition-all ${
                            !notification.read ? 'bg-primary/10 border-l-4 border-l-primary' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <p className="font-semibold text-darkTeal">{notification.title || 'Notificação'}</p>
                                {!notification.read && (
                                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                                )}
                              </div>
                              <p className="text-sm text-mediumTeal mb-2">{notification.message || notification.content || ''}</p>
                              <p className="text-xs text-mediumTeal/70">
                                {new Date(notification.createdAt).toLocaleDateString('pt-BR', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
