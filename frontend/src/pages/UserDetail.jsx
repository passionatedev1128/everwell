import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api, { updateDocumentStatus } from '../utils/api';
import { toast } from 'react-hot-toast';

const UserDetail = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
    fetchUserOrders();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/users/${userId}`);
      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Erro ao carregar dados do usuário.');
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserOrders = async () => {
    try {
      const response = await api.get('/admin/orders', { params: { userId } });
      if (response.data.success) {
        setOrders(response.data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching user orders:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Usuário não encontrado.</p>
          <Link to="/admin" className="btn-primary">Voltar para Admin</Link>
        </div>
      </div>
    );
  }

  // Calculate purchase statistics
  const totalOrders = orders.length;
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
    <div className="min-h-screen bg-bgSecondary py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link to="/admin" className="text-primary hover:underline mb-4 inline-block">
            ← Voltar para Admin
          </Link>
          <h1 className="text-3xl font-bold text-darkTeal">Detalhes do Usuário</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-darkTeal mb-6">Informações do Usuário</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
                  {user.photo ? (
                    <img src={user.photo} alt={user.name} className="w-20 h-20 rounded-full object-cover" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-semibold">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-semibold text-darkTeal">{user.name}</h3>
                    <p className="text-mediumTeal">{user.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-mediumTeal">Telefone</label>
                    <p className="text-darkTeal">{user.phone || 'Não informado'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-mediumTeal">Gênero</label>
                    <p className="text-darkTeal">
                      {user.gender === 'male' ? 'Masculino' : user.gender === 'female' ? 'Feminino' : 'Não informado'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-mediumTeal">Data de Nascimento</label>
                    <p className="text-darkTeal">
                      {user.dateOfBirth 
                        ? new Date(user.dateOfBirth).toLocaleDateString('pt-BR')
                        : 'Não informado'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-mediumTeal">Data de Cadastro</label>
                    <p className="text-darkTeal">
                      {new Date(user.createdAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                {user.address && (
                  <div>
                    <label className="text-sm font-medium text-mediumTeal">Endereço</label>
                    <p className="text-darkTeal">
                      {user.address.street && `${user.address.street}, `}
                      {user.address.city && `${user.address.city}, `}
                      {user.address.state && `${user.address.state} `}
                      {user.address.zipCode && `- ${user.address.zipCode}`}
                      {user.address.country && `, ${user.address.country}`}
                    </p>
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role === 'admin' ? 'Admin' : 'Usuário'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.isAuthorized 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {user.isAuthorized ? 'Autorizado' : 'Pendente'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.emailVerified 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.emailVerified ? 'Email Verificado' : 'Email Não Verificado'}
                  </span>
                </div>
              </div>
            </div>

            {/* Document Status Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-semibold text-darkTeal mb-6">Status dos Documentos</h2>
              <div className="space-y-3">
                {['medicalPrescription', 'importAuthorization', 'proofOfResidence'].map((docType) => {
                  const doc = user.documents?.[docType];
                  const docLabels = {
                    medicalPrescription: 'Receita Médica',
                    importAuthorization: 'Autorização Anvisa',
                    proofOfResidence: 'Comprovante de Residência'
                  };
                  const statusLabels = {
                    pending: 'Pendente',
                    approved: 'Aprovado',
                    rejected: 'Rejeitado'
                  };
                  const statusColors = {
                    pending: 'bg-amber-100 text-amber-800',
                    approved: 'bg-green-100 text-green-800',
                    rejected: 'bg-red-100 text-red-800'
                  };
                  return (
                    <div key={docType} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                      <span className="text-mediumTeal font-medium">{docLabels[docType]}</span>
                      {doc ? (
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[doc.status] || 'bg-gray-100 text-gray-800'}`}>
                            {statusLabels[doc.status] || 'Desconhecido'}
                          </span>
                          {doc.url && (
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline text-xs"
                            >
                              Ver documento
                            </a>
                          )}
                          {doc.status === 'pending' && (
                            <div className="flex gap-1">
                              <button
                                onClick={async () => {
                                  try {
                                    const response = await updateDocumentStatus(userId, docType, 'approved');
                                    if (response.success) {
                                      toast.success('Documento aprovado com sucesso!');
                                      fetchUserData();
                                    }
                                  } catch (error) {
                                    toast.error(error.response?.data?.message || 'Erro ao aprovar documento.');
                                  }
                                }}
                                className="px-2 py-1 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 transition-colors"
                              >
                                Aprovar
                              </button>
                              <button
                                onClick={async () => {
                                  try {
                                    const response = await updateDocumentStatus(userId, docType, 'rejected');
                                    if (response.success) {
                                      toast.success('Documento rejeitado.');
                                      fetchUserData();
                                    }
                                  } catch (error) {
                                    toast.error(error.response?.data?.message || 'Erro ao rejeitar documento.');
                                  }
                                }}
                                className="px-2 py-1 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700 transition-colors"
                              >
                                Rejeitar
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Não enviado
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Purchase History */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-darkTeal mb-6">Histórico de Compras</h2>
              
              {orders.length === 0 ? (
                <p className="text-mediumTeal">Nenhum pedido encontrado.</p>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold text-darkTeal">Pedido #{order._id.slice(-8)}</p>
                          <p className="text-sm text-mediumTeal">
                            {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {order.status === 'delivered' ? 'Entregue' :
                           order.status === 'cancelled' ? 'Cancelado' :
                           order.status === 'paid' ? 'Pago' :
                           order.status === 'processing' ? 'Processando' :
                           order.status === 'shipped' ? 'Enviado' : 'Pendente'}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {order.products?.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-darkTeal">
                              {item.name} × {item.quantity}
                            </span>
                            <span className="text-mediumTeal">
                              R$ {(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between">
                        <span className="font-semibold text-darkTeal">Total:</span>
                        <span className="font-semibold text-primary">R$ {order.totalAmount?.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Statistics Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-darkTeal mb-4">Estatísticas</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-mediumTeal">Total de Pedidos</p>
                  <p className="text-2xl font-bold text-primary">{totalOrders}</p>
                </div>
                <div>
                  <p className="text-sm text-mediumTeal">Total de Produtos Comprados</p>
                  <p className="text-2xl font-bold text-primary">{totalProducts}</p>
                </div>
                <div>
                  <p className="text-sm text-mediumTeal">Total Gasto</p>
                  <p className="text-2xl font-bold text-primary">R$ {totalSpent.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-darkTeal mb-4">Produtos Comprados</h3>
              {Object.keys(productCounts).length === 0 ? (
                <p className="text-mediumTeal text-sm">Nenhum produto comprado ainda.</p>
              ) : (
                <div className="space-y-2">
                  {Object.entries(productCounts).map(([productName, quantity]) => (
                    <div key={productName} className="flex justify-between text-sm">
                      <span className="text-darkTeal">{productName}</span>
                      <span className="text-primary font-semibold">{quantity}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;

