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

  const totalUsers = users.length;
  const authorizedUsers = users.filter((user) => user.isAuthorized).length;
  const pendingUsers = totalUsers - authorizedUsers;
  const totalOrders = orders.length;
  const deliveredOrders = orders.filter((order) => order.status === 'delivered').length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const processingOrders = orders.filter((order) => ['pending', 'processing', 'paid'].includes(order.status)).length;

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f5faf7] via-white to-[#e7f5f1]">
        <div className="glass-panel px-10 py-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-mediumTeal">Carregando painel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7fbf9] via-white to-[#eaf6f3] py-14 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="section-heading">Painel EverWell</p>
            <h1 className="text-4xl md:text-5xl font-bold text-darkTeal font-heading">Painel Administrativo</h1>
            <p className="text-mediumTeal max-w-2xl mt-3">
              Acompanhe usuários, pedidos e evolução do negócio com uma visão centrada em dados.
            </p>
          </div>
          <div className="glass-panel px-6 py-4 flex items-center gap-6">
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.35em] text-primary/70">Usuários ativos</p>
              <p className="text-2xl font-heading text-darkTeal">{authorizedUsers}</p>
            </div>
            <div className="w-px h-10 bg-white/60" />
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.35em] text-primary/70">Pedidos em andamento</p>
              <p className="text-2xl font-heading text-darkTeal">{processingOrders}</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="glass-panel border border-red-200/60 bg-red-50/60 text-red-700 px-6 py-5">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="card">
            <p className="text-xs uppercase tracking-[0.35em] text-primary/70 mb-2">Usuários cadastrados</p>
            <p className="text-3xl font-heading text-darkTeal">{totalUsers}</p>
            <p className="text-xs text-mediumTeal mt-2">{authorizedUsers} autorizados · {pendingUsers} pendentes</p>
          </div>
          <div className="card">
            <p className="text-xs uppercase tracking-[0.35em] text-primary/70 mb-2">Pedidos totais</p>
            <p className="text-3xl font-heading text-darkTeal">{totalOrders}</p>
            <p className="text-xs text-mediumTeal mt-2">{deliveredOrders} entregues · {processingOrders} em processamento</p>
          </div>
          <div className="card">
            <p className="text-xs uppercase tracking-[0.35em] text-primary/70 mb-2">Receita acumulada</p>
            <p className="text-3xl font-heading text-darkTeal">R$ {totalRevenue.toFixed(2)}</p>
            <p className="text-xs text-mediumTeal mt-2">Baseado nos pedidos confirmados</p>
          </div>
          <div className="card">
            <p className="text-xs uppercase tracking-[0.35em] text-primary/70 mb-2">Status geral</p>
            <div className="flex flex-wrap gap-3 mt-3">
              <span className="badge badge-success">Autorizados {authorizedUsers}</span>
              <span className="badge badge-warning">Pendentes {pendingUsers}</span>
            </div>
          </div>
        </div>

        <div className="glass-panel p-3 inline-flex gap-2">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-2 rounded-full text-sm font-semibold uppercase tracking-wide transition-all ${
              activeTab === 'users'
                ? 'bg-primary text-white shadow-[0_18px_38px_-20px_rgba(79,179,168,0.8)]'
                : 'text-darkTeal/70 bg-white/70'
            }`}
          >
            Usuários
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-2 rounded-full text-sm font-semibold uppercase tracking-wide transition-all ${
              activeTab === 'orders'
                ? 'bg-primary text-white shadow-[0_18px_38px_-20px_rgba(79,179,168,0.8)]'
                : 'text-darkTeal/70 bg-white/70'
            }`}
          >
            Pedidos
          </button>
        </div>

        {activeTab === 'users' && (
          <div className="glass-panel p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-darkTeal mb-2 font-heading">Gerenciar usuários</h2>
              <p className="text-mediumTeal">
                Aprove ou revogue acessos à área restrita de produtos e acompanhe novos cadastros em tempo real.
              </p>
            </div>
            <AdminTable
              users={users}
              onToggleAuthorization={handleToggleAuthorization}
            />
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-8">
            {orders.length > 0 && (
              <div className="glass-panel p-8 space-y-6">
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                  <div>
                    <label className="form-label">Buscar pedidos</label>
                    <input
                      type="text"
                      placeholder="ID do pedido, cliente, email ou produto..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="form-label">Data inicial</label>
                    <input
                      type="date"
                      value={dateFilter.from}
                      onChange={(e) => setDateFilter({ ...dateFilter, from: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="form-label">Data final</label>
                    <input
                      type="date"
                      value={dateFilter.to}
                      onChange={(e) => setDateFilter({ ...dateFilter, to: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="form-label">Ordenar por</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="input-field"
                    >
                      <option value="date-desc">Data (Mais recente)</option>
                      <option value="date-asc">Data (Mais antigo)</option>
                      <option value="amount-desc">Valor (Maior)</option>
                      <option value="amount-asc">Valor (Menor)</option>
                      <option value="status">Status</option>
                      <option value="customer">Cliente (A-Z)</option>
                    </select>
                  </div>
                </div>

                {(dateFilter.from || dateFilter.to || searchQuery || userFilter) && (
                  <button
                    onClick={() => {
                      setDateFilter({ from: '', to: '' });
                      setSearchQuery('');
                      setUserFilter('');
                    }}
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    Limpar filtros ativos
                  </button>
                )}

                <div className="flex flex-wrap gap-3 pt-4 border-t border-white/40">
                  <button
                    onClick={() => setStatusFilter('all')}
                    className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wide ${
                      statusFilter === 'all'
                        ? 'bg-primary text-white'
                        : 'bg-white/70 text-darkTeal/80'
                    }`}
                  >
                    Todos ({orders.length})
                  </button>
                  {['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => {
                    const count = orders.filter((o) => o.status === status).length;
                    if (count === 0) return null;
                    const badge = getStatusBadge(status);
                    return (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wide ${
                          statusFilter === status
                            ? 'bg-primary text-white'
                            : 'bg-white/70 text-darkTeal/80'
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
              <div className="glass-panel p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-mediumTeal">Carregando pedidos...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="glass-panel p-10 text-center space-y-4">
                <p className="text-mediumTeal">
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
                    Limpar filtros
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const badge = getStatusBadge(order.status);
                  return (
                    <div key={order._id} className="glass-panel p-6 animate-fade-in">
                      <div className="flex justify-between items-start mb-4 gap-4">
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
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => handleViewOrderDetails(order._id)}
                              className="btn-secondary text-xs"
                            >
                              Ver detalhes
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

        {selectedOrder && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
            onClick={() => setSelectedOrder(null)}
          >
            <div
              className="glass-panel max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-scale-in"
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="card bg-white/80">
                      <p className="text-xs uppercase tracking-[0.35em] text-primary/70 mb-2">Cliente</p>
                      <p className="text-darkTeal font-semibold">
                        {selectedOrder.userId?.name || 'N/A'}
                      </p>
                      <p className="text-sm text-mediumTeal">
                        {selectedOrder.userId?.email || 'N/A'}
                      </p>
                    </div>
                    <div className="card bg-white/80">
                      <p className="text-xs uppercase tracking-[0.35em] text-primary/70 mb-2">Status</p>
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="card bg-white/80">
                      <p className="text-xs uppercase tracking-[0.35em] text-primary/70 mb-2">Data do pedido</p>
                      <p className="text-darkTeal font-semibold">{formatDate(selectedOrder.createdAt)}</p>
                      <p className="text-sm text-mediumTeal">Atualizado em {formatDate(selectedOrder.updatedAt)}</p>
                    </div>
                    <div className="card bg-white/80">
                      <p className="text-xs uppercase tracking-[0.35em] text-primary/70 mb-2">Total do pedido</p>
                      <p className="text-darkTeal font-semibold">R$ {selectedOrder.totalAmount?.toFixed(2) || '0.00'}</p>
                      <p className="text-sm text-mediumTeal">Itens: {selectedOrder.products?.length || 0}</p>
                    </div>
                  </div>

                  <div className="card bg-white/80">
                    <h3 className="text-lg font-semibold text-darkTeal mb-4">Itens</h3>
                    <div className="space-y-3">
                      {selectedOrder.products?.map((product, idx) => (
                        <div key={`${product.productId?._id || product.productId || product._id}-${idx}`} className="flex justify-between items-center">
                          <div>
                            <p className="text-darkTeal font-medium">{product.name}</p>
                            <p className="text-sm text-mediumTeal">Quantidade: {product.quantity || 1}</p>
                          </div>
                          <p className="text-sm font-semibold text-primary">R$ {(product.price || 0).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedOrder.shippingAddress && (
                    <div className="card bg-white/80">
                      <h3 className="text-lg font-semibold text-darkTeal mb-4">Endereço de envio</h3>
                      <div className="text-mediumTeal space-y-1">
                        <p>{selectedOrder.shippingAddress.fullName}</p>
                        <p>{selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.number}</p>
                        <p>{selectedOrder.shippingAddress.neighborhood}</p>
                        <p>{selectedOrder.shippingAddress.city} - {selectedOrder.shippingAddress.state}</p>
                        <p>{selectedOrder.shippingAddress.zipCode}</p>
                        <p>{selectedOrder.shippingAddress.country}</p>
                      </div>
                    </div>
                  )}

                  {selectedOrder.paymentProof && (
                    <div className="card bg-white/80">
                      <h3 className="text-lg font-semibold text-darkTeal mb-3">Comprovante de pagamento</h3>
                      <a
                        href={selectedOrder.paymentProof}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary inline-flex items-center gap-2"
                      >
                        Ver comprovante
                        <span aria-hidden>↗</span>
                      </a>
                    </div>
                  )}
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
