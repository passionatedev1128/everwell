import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../utils/api';
import { getAllOrdersAdmin, updateOrderStatus, getOrderById } from '../utils/api';
import AdminTable from '../components/AdminTable';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState({ from: '', to: '' });
  const [userFilter, setUserFilter] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  useEffect(() => {
    filterAndSortOrders();
  }, [orders, statusFilter, searchQuery, dateFilter, userFilter, sortBy]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/users');
      setUsers(response.data.users || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao carregar usuários.');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const response = await getAllOrdersAdmin();
      if (response.success) {
        setOrders(response.orders || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao carregar pedidos.');
      toast.error('Erro ao carregar pedidos.');
    } finally {
      setOrdersLoading(false);
    }
  };

  const filterAndSortOrders = () => {
    let filtered = [...orders];

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Filter by search query (order ID, customer name, email, product name)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order => {
        const orderId = order._id.toLowerCase();
        const customerName = order.userId?.name?.toLowerCase() || '';
        const customerEmail = order.userId?.email?.toLowerCase() || '';
        const productNames = order.products?.map(p => p.name?.toLowerCase() || '').join(' ') || '';
        return orderId.includes(query) || 
               customerName.includes(query) || 
               customerEmail.includes(query) ||
               productNames.includes(query);
      });
    }

    // Filter by date range
    if (dateFilter.from) {
      const fromDate = new Date(dateFilter.from);
      fromDate.setHours(0, 0, 0, 0);
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= fromDate;
      });
    }
    if (dateFilter.to) {
      const toDate = new Date(dateFilter.to);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate <= toDate;
      });
    }

    // Filter by user
    if (userFilter) {
      filtered = filtered.filter(order => {
        const userId = order.userId?._id?.toString() || order.userId?.toString() || '';
        return userId === userFilter;
      });
    }

    // Sort orders
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'date-asc':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'amount-desc':
          return (b.totalAmount || 0) - (a.totalAmount || 0);
        case 'amount-asc':
          return (a.totalAmount || 0) - (b.totalAmount || 0);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'customer':
          const nameA = a.userId?.name || '';
          const nameB = b.userId?.name || '';
          return nameA.localeCompare(nameB);
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    setFilteredOrders(filtered);
  };

  const handleToggleAuthorization = async (userId) => {
    try {
      await api.patch(`/admin/users/${userId}/authorize`);
      fetchUsers(); // Refresh list
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao atualizar autorização.');
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    if (!confirm(`Tem certeza que deseja alterar o status do pedido para "${newStatus}"?`)) {
      return;
    }

    try {
      const response = await updateOrderStatus(orderId, newStatus);
      if (response.success) {
        toast.success('Status do pedido atualizado com sucesso!');
        fetchOrders();
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(response.order);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao atualizar status do pedido.');
    }
  };

  const handleViewOrderDetails = async (orderId) => {
    try {
      // Use admin endpoint to get full order details with populated user info
      const response = await getAllOrdersAdmin();
      if (response.success) {
        const order = response.orders.find(o => o._id === orderId);
        if (order) {
          setSelectedOrder(order);
        } else {
          // Fallback to regular getOrderById
          const fallbackResponse = await getOrderById(orderId);
          if (fallbackResponse.success) {
            setSelectedOrder(fallbackResponse.order);
          }
        }
      }
    } catch (err) {
      toast.error('Erro ao carregar detalhes do pedido.');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { class: 'badge-warning', label: 'Pendente' },
      paid: { class: 'badge-info', label: 'Pago' },
      processing: { class: 'badge-info', label: 'Processando' },
      shipped: { class: 'badge-info', label: 'Enviado' },
      delivered: { class: 'badge-success', label: 'Entregue' },
      cancelled: { class: 'badge-error', label: 'Cancelado' }
    };
    return badges[status] || { class: 'badge-secondary', label: status };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && activeTab === 'users') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bgSecondary">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-mediumTeal">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bgSecondary py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-darkTeal mb-8 font-heading">
          Painel Administrativo
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 bg-white rounded-lg shadow-md p-2 flex gap-2">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-2 rounded-md transition-colors ${
              activeTab === 'users'
                ? 'bg-primary text-white'
                : 'text-darkTeal hover:bg-bgSecondary'
            }`}
          >
            Usuários
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-2 rounded-md transition-colors ${
              activeTab === 'orders'
                ? 'bg-primary text-white'
                : 'text-darkTeal hover:bg-bgSecondary'
            }`}
          >
            Pedidos
          </button>
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-darkTeal mb-4 font-heading">Gerenciar Usuários</h2>
            <p className="text-mediumTeal mb-6">
              Autorize ou desautorize usuários para acessar os produtos restritos.
            </p>
            <AdminTable
              users={users}
              onToggleAuthorization={handleToggleAuthorization}
            />
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            {/* Enhanced Filters and Search */}
            {orders.length > 0 && (
              <div className="mb-6 bg-white rounded-lg shadow-md p-6 space-y-4">
                {/* Search Bar */}
                <div>
                  <label className="block text-sm font-medium text-darkTeal mb-2">
                    Buscar Pedidos
                  </label>
                  <input
                    type="text"
                    placeholder="Buscar por ID do pedido, cliente, email ou produto..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full input-field"
                  />
                </div>

                {/* Date Range and User Filter */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-darkTeal mb-2">
                      Data Inicial
                    </label>
                    <input
                      type="date"
                      value={dateFilter.from}
                      onChange={(e) => setDateFilter({ ...dateFilter, from: e.target.value })}
                      className="w-full input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-darkTeal mb-2">
                      Data Final
                    </label>
                    <input
                      type="date"
                      value={dateFilter.to}
                      onChange={(e) => setDateFilter({ ...dateFilter, to: e.target.value })}
                      className="w-full input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-darkTeal mb-2">
                      Ordenar por
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full input-field"
                    >
                      <option value="date-desc">Data (Mais Recente)</option>
                      <option value="date-asc">Data (Mais Antigo)</option>
                      <option value="amount-desc">Valor (Maior)</option>
                      <option value="amount-asc">Valor (Menor)</option>
                      <option value="status">Status</option>
                      <option value="customer">Cliente (A-Z)</option>
                    </select>
                  </div>
                </div>

                {/* Clear Filters Button */}
                {(dateFilter.from || dateFilter.to || searchQuery || userFilter) && (
                  <button
                    onClick={() => {
                      setDateFilter({ from: '', to: '' });
                      setSearchQuery('');
                      setUserFilter('');
                    }}
                    className="text-sm text-primary hover:underline"
                  >
                    Limpar Filtros
                  </button>
                )}

                {/* Status Filters */}
                <div className="flex flex-wrap gap-2 pt-2 border-t">
                  <button
                    onClick={() => setStatusFilter('all')}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      statusFilter === 'all'
                        ? 'bg-primary text-white'
                        : 'bg-bgSecondary text-darkTeal hover:bg-primary hover:text-white'
                    }`}
                  >
                    Todos ({orders.length})
                  </button>
                  {['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => {
                    const count = orders.filter(o => o.status === status).length;
                    if (count === 0) return null;
                    const badge = getStatusBadge(status);
                    return (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-4 py-2 rounded-md transition-colors ${
                          statusFilter === status
                            ? 'bg-primary text-white'
                            : 'bg-bgSecondary text-darkTeal hover:bg-primary hover:text-white'
                        }`}
                      >
                        {badge.label} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {ordersLoading ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-mediumTeal">Carregando pedidos...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-mediumTeal mb-4">
                  {orders.length === 0 
                    ? 'Nenhum pedido encontrado.' 
                    : 'Nenhum pedido encontrado com os filtros selecionados.'}
                </p>
                {(dateFilter.from || dateFilter.to || searchQuery || userFilter || statusFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setStatusFilter('all');
                      setDateFilter({ from: '', to: '' });
                      setSearchQuery('');
                      setUserFilter('');
                    }}
                    className="btn-secondary"
                  >
                    Limpar Filtros
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const badge = getStatusBadge(order.status);
                  return (
                    <div key={order._id} className="bg-white rounded-lg shadow-md p-6 animate-fade-in hover:shadow-lg transition-all duration-300">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-darkTeal mb-2">
                            Pedido #{order._id.slice(-8).toUpperCase()}
                          </h3>
                          <p className="text-sm text-mediumTeal">
                            {order.userId?.name || 'Usuário'} ({order.userId?.email || 'N/A'})
                          </p>
                          <p className="text-sm text-mediumTeal">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <span className={`badge ${badge.class}`}>
                          {badge.label}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-mediumTeal mb-1">Itens</p>
                          <p className="text-darkTeal font-semibold">
                            {order.products?.length || 0} produto(s)
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-mediumTeal mb-1">Total</p>
                          <p className="text-xl font-bold text-primary">
                            R$ {order.totalAmount?.toFixed(2) || '0.00'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-mediumTeal mb-1">Ações</p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleViewOrderDetails(order._id)}
                              className="btn-secondary text-sm"
                            >
                              Ver Detalhes
                            </button>
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                              className="form-input text-sm"
                            >
                              <option value="pending">Pendente</option>
                              <option value="paid">Pago</option>
                              <option value="processing">Processando</option>
                              <option value="shipped">Enviado</option>
                              <option value="delivered">Entregue</option>
                              <option value="cancelled">Cancelado</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in"
            onClick={() => setSelectedOrder(null)}
          >
            <div 
              className="bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-darkTeal font-heading">
                    Detalhes do Pedido #{selectedOrder._id.slice(-8).toUpperCase()}
                  </h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-mediumTeal hover:text-darkTeal text-2xl font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Order Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-mediumTeal mb-1">Cliente</p>
                      <p className="text-darkTeal font-semibold">
                        {selectedOrder.userId?.name || 'N/A'}
                      </p>
                      <p className="text-sm text-mediumTeal">
                        {selectedOrder.userId?.email || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-mediumTeal mb-1">Status</p>
                      <select
                        value={selectedOrder.status}
                        onChange={(e) => handleStatusUpdate(selectedOrder._id, e.target.value)}
                        className="form-input"
                      >
                        <option value="pending">Pendente</option>
                        <option value="paid">Pago</option>
                        <option value="processing">Processando</option>
                        <option value="shipped">Enviado</option>
                        <option value="delivered">Entregue</option>
                        <option value="cancelled">Cancelado</option>
                      </select>
                    </div>
                  </div>

                  {/* Order Date */}
                  <div>
                    <p className="text-sm text-mediumTeal mb-1">Data do Pedido</p>
                    <p className="text-darkTeal font-semibold">{formatDate(selectedOrder.createdAt)}</p>
                  </div>

                  {/* Products */}
                  <div>
                    <h3 className="font-semibold text-darkTeal mb-3">Itens do Pedido</h3>
                    <div className="space-y-3">
                      {selectedOrder.products?.map((item, index) => (
                        <div key={index} className="flex gap-4 p-4 bg-bgSecondary rounded-md">
                          {item.productId?.images?.[0] ? (
                            <img
                              src={item.productId.images[0]}
                              alt={item.name}
                              className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                            />
                          ) : (
                            <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center flex-shrink-0">
                              <span className="text-gray-400 text-xs text-center px-2">Sem imagem</span>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-darkTeal font-medium mb-1">{item.name || 'Produto'}</p>
                            <p className="text-sm text-mediumTeal mb-2">
                              Quantidade: {item.quantity} × R$ {item.price?.toFixed(2)}
                            </p>
                            {item.productId?.slug && (
                              <a
                                href={`/produtos/${item.productId.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline"
                              >
                                Ver produto →
                              </a>
                            )}
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-darkTeal font-semibold text-lg">
                              R$ {(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  {selectedOrder.shippingAddress && (
                    <div>
                      <h3 className="font-semibold text-darkTeal mb-3">Endereço de Entrega</h3>
                      <div className="p-3 bg-bgSecondary rounded-md">
                        <p className="text-darkTeal">
                          {selectedOrder.shippingAddress.street}
                        </p>
                        <p className="text-darkTeal">
                          {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}
                        </p>
                        <p className="text-darkTeal">
                          CEP: {selectedOrder.shippingAddress.zipCode}
                        </p>
                        {selectedOrder.shippingAddress.country && (
                          <p className="text-darkTeal">
                            {selectedOrder.shippingAddress.country}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Payment Proof */}
                  <div>
                    <h3 className="font-semibold text-darkTeal mb-3">Comprovante de Pagamento</h3>
                    {selectedOrder.paymentProof?.url ? (
                      <div className="p-4 bg-bgSecondary rounded-md space-y-3">
                        <div className="flex items-center gap-4">
                          <a
                            href={selectedOrder.paymentProof.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary-dark font-medium"
                          >
                            Ver comprovante →
                          </a>
                          {selectedOrder.paymentProof.uploadedAt && (
                            <p className="text-xs text-lightTeal">
                              Enviado em: {formatDate(selectedOrder.paymentProof.uploadedAt)}
                            </p>
                          )}
                        </div>
                        {selectedOrder.paymentProof.status && (
                          <div>
                            <p className="text-sm text-mediumTeal mb-1">Status do Comprovante:</p>
                            <span className={`badge ${getStatusBadge(selectedOrder.paymentProof.status).class}`}>
                              {getStatusBadge(selectedOrder.paymentProof.status).label}
                            </span>
                          </div>
                        )}
                        {/* Preview if image */}
                        {selectedOrder.paymentProof.url.match(/\.(jpg|jpeg|png|gif|webp)$/i) && (
                          <div className="mt-3">
                            <img
                              src={selectedOrder.paymentProof.url}
                              alt="Comprovante de pagamento"
                              className="max-w-full h-auto rounded-md border border-gray-300"
                              style={{ maxHeight: '300px' }}
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                        <p className="text-sm text-yellow-800">
                          Nenhum comprovante de pagamento foi enviado ainda.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Total */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-xl font-bold text-darkTeal">
                      <span>Total:</span>
                      <span className="text-primary">R$ {selectedOrder.totalAmount?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
          <p className="text-sm text-yellow-700">
            <strong>Nota:</strong> Apenas usuários autorizados podem acessar a área de produtos, 
            conforme as regulamentações da Anvisa (RDC 327/2019 e 660/2022).
          </p>
        </div>
      </div>
    </div>
  );
};

export default Admin;
