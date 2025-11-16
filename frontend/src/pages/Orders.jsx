import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getOrders, getOrderById } from '../utils/api';
import { OrderCardSkeleton } from '../components/SkeletonLoader';
import { EmptyOrders, EmptySearch } from '../components/EmptyState';
import PaymentProofUpload from '../components/PaymentProofUpload';
import DatePicker from '../components/DatePicker';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  const [dateFilter, setDateFilter] = useState({ from: '', to: '' });
  const location = useLocation();

  useEffect(() => {
    fetchOrders();
    
    // Show success message if coming from checkout
    if (location.state?.message) {
      setTimeout(() => {
        toast.success(location.state.message);
      }, 500);
    }
  }, [location]);

  useEffect(() => {
    filterAndSortOrders();
  }, [orders, statusFilter, searchQuery, sortBy, dateFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getOrders();
      if (response.success) {
        const sortedOrders = (response.orders || []).sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sortedOrders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Erro ao carregar pedidos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortOrders = () => {
    let filtered = [...orders];

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order => {
        const orderId = order._id.toLowerCase();
        const productNames = order.products?.map(p => p.name?.toLowerCase() || '').join(' ') || '';
        return orderId.includes(query) || productNames.includes(query);
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
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    setFilteredOrders(filtered);
  };

  const handleViewDetails = async (orderId) => {
    try {
      const response = await getOrderById(orderId);
      if (response.success) {
        setSelectedOrder(response.order);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Erro ao carregar detalhes do pedido.');
    }
  };

  const handleUploadSuccess = async () => {
    // Refresh order details if modal is open
    if (selectedOrder) {
      await handleViewDetails(selectedOrder._id);
    }
    // Refresh orders list
    await fetchOrders();
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

  const generateInvoice = (order) => {
    const statusLabels = {
      pending: 'Pendente',
      paid: 'Pago',
      processing: 'Processando',
      shipped: 'Enviado',
      delivered: 'Entregue',
      cancelled: 'Cancelado'
    };

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Recibo - Pedido #${order._id.slice(-8).toUpperCase()}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
    .header { text-align: center; margin-bottom: 30px; }
    .order-info { margin-bottom: 20px; }
    .products { margin: 20px 0; }
    .product-item { padding: 10px; border-bottom: 1px solid #eee; }
    .total { font-size: 18px; font-weight: bold; margin-top: 20px; text-align: right; }
    .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>EverWell</h1>
    <h2>Recibo de Pedido</h2>
  </div>
  <div class="order-info">
    <p><strong>Número do Pedido:</strong> #${order._id.slice(-8).toUpperCase()}</p>
    <p><strong>Data:</strong> ${formatDate(order.createdAt)}</p>
    <p><strong>Status:</strong> ${statusLabels[order.status] || order.status}</p>
  </div>
  <div class="products">
    <h3>Itens do Pedido</h3>
    ${order.products?.map(item => `
      <div class="product-item">
        <p><strong>${item.name}</strong></p>
        <p>Quantidade: ${item.quantity} × R$ ${item.price?.toFixed(2)} = R$ ${(item.price * item.quantity).toFixed(2)}</p>
      </div>
    `).join('') || ''}
  </div>
  ${order.shippingAddress ? `
    <div class="order-info">
      <h3>Endereço de Entrega</h3>
      <p>${order.shippingAddress.street}</p>
      <p>${order.shippingAddress.city}, ${order.shippingAddress.state}</p>
      <p>CEP: ${order.shippingAddress.zipCode}</p>
    </div>
  ` : ''}
  <div class="total">
    <p>Total: R$ ${order.totalAmount?.toFixed(2)}</p>
  </div>
  <div class="footer">
    <p>EverWell - Produtos à base de CBD</p>
    <p>Este é um recibo gerado automaticamente.</p>
  </div>
</body>
</html>
    `;
  };

      if (loading) {
        return (
          <div className="min-h-screen bg-bgSecondary py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-4xl font-bold text-darkTeal mb-8 font-heading">Meus Pedidos</h1>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <OrderCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
        );
      }

  return (
    <div className="min-h-screen bg-bgSecondary py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-darkTeal font-heading">Meus Pedidos</h1>
          <Link to="/produtos" className="btn-primary">
            Ver Produtos
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
            {error}
          </div>
        )}

        {/* Filters and Search */}
        {orders.length > 0 && (
          <div className="mb-6 bg-white rounded-lg shadow-md p-6 space-y-4">
            {/* Search Bar */}
            <div>
              <label className="block text-sm font-medium text-darkTeal mb-2">
                Buscar Pedidos
              </label>
              <input
                type="text"
                placeholder="Buscar por ID do pedido ou nome do produto..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full input-field"
              />
            </div>

            {/* Date Range Filter */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-darkTeal mb-2">
                  Data Inicial
                </label>
                <DatePicker
                  value={dateFilter.from}
                  onChange={(e) => setDateFilter({ ...dateFilter, from: e.target.value })}
                  placeholder="Data Inicial"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-darkTeal mb-2">
                  Data Final
                </label>
                <DatePicker
                  value={dateFilter.to}
                  onChange={(e) => setDateFilter({ ...dateFilter, to: e.target.value })}
                  placeholder="Data Final"
                  className="w-full"
                />
              </div>
            </div>

            {/* Sort Options */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-darkTeal">Ordenar por:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-field"
                >
                  <option value="date-desc">Data (Mais Recente)</option>
                  <option value="date-asc">Data (Mais Antigo)</option>
                  <option value="amount-desc">Valor (Maior)</option>
                  <option value="amount-asc">Valor (Menor)</option>
                  <option value="status">Status</option>
                </select>
              </div>
              {(dateFilter.from || dateFilter.to || searchQuery) && (
                <button
                  onClick={() => {
                    setDateFilter({ from: '', to: '' });
                    setSearchQuery('');
                  }}
                  className="text-sm text-primary hover:underline"
                >
                  Limpar Filtros
                </button>
              )}
            </div>

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

            {orders.length === 0 ? (
              <EmptyOrders />
            ) : filteredOrders.length === 0 ? (
              <EmptySearch 
                onClear={() => {
                  setStatusFilter('all');
                  setDateFilter({ from: '', to: '' });
                  setSearchQuery('');
                }}
              />
            ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const badge = getStatusBadge(order.status);
                  return (
                    <div key={order._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 animate-fade-in">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-darkTeal mb-2">
                        Pedido #{order._id.slice(-8).toUpperCase()}
                      </h3>
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
                    {order.shippingAddress && (
                      <div>
                        <p className="text-sm text-mediumTeal mb-1">Entrega</p>
                        <p className="text-darkTeal text-sm">
                          {order.shippingAddress.city}, {order.shippingAddress.state}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewDetails(order._id)}
                      className="btn-secondary"
                    >
                      Ver Detalhes
                    </button>
                        {order.status === 'pending' && (
                          <button
                            onClick={() => handleViewDetails(order._id)}
                            className="btn-primary"
                          >
                            {order.paymentProof?.url ? 'Ver/Atualizar Comprovante' : 'Enviar Comprovante'}
                          </button>
                        )}
                  </div>
                </div>
              );
            })}
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
                      <p className="text-sm text-mediumTeal mb-1">Data do Pedido</p>
                      <p className="text-darkTeal font-semibold">{formatDate(selectedOrder.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-mediumTeal mb-1">Status</p>
                      <span className={`badge ${getStatusBadge(selectedOrder.status).class}`}>
                        {getStatusBadge(selectedOrder.status).label}
                      </span>
                    </div>
                  </div>

                  {/* Order Status Timeline */}
                  <div>
                    <h3 className="font-semibold text-darkTeal mb-3">Status do Pedido</h3>
                    <div className="relative">
                      <div className="flex items-center space-x-2 md:space-x-4 overflow-x-auto pb-4">
                        {['pending', 'paid', 'processing', 'shipped', 'delivered'].map((status, index) => {
                          const statusIndex = ['pending', 'paid', 'processing', 'shipped', 'delivered'].indexOf(selectedOrder.status);
                          const isCompleted = index <= statusIndex;
                          const isCurrent = index === statusIndex;
                          const statusLabels = {
                            pending: 'Pendente',
                            paid: 'Pago',
                            processing: 'Processando',
                            shipped: 'Enviado',
                            delivered: 'Entregue'
                          };
                          return (
                            <div key={status} className="flex items-center flex-shrink-0">
                              <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                                  isCompleted 
                                    ? 'bg-primary border-primary text-white' 
                                    : 'bg-white border-gray-300 text-gray-400'
                                }`}>
                                  {isCompleted ? '✓' : index + 1}
                                </div>
                                <p className={`text-xs mt-1 text-center ${isCurrent ? 'font-semibold text-primary' : 'text-mediumTeal'}`}>
                                  {statusLabels[status]}
                                </p>
                              </div>
                              {index < 4 && (
                                <div className={`w-8 md:w-12 h-0.5 ${isCompleted ? 'bg-primary' : 'bg-gray-300'}`}></div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
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
                              <Link
                                to={`/produtos/${item.productId.slug}`}
                                className="text-sm text-primary hover:underline"
                                onClick={() => setSelectedOrder(null)}
                              >
                                Ver produto →
                              </Link>
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
                        <p className="text-darkTeal">
                          {selectedOrder.shippingAddress.country || 'Brasil'}
                        </p>
                      </div>
                    </div>
                  )}

                      {/* Payment Proof */}
                      <div>
                        <h3 className="font-semibold text-darkTeal mb-3">Comprovante de Pagamento</h3>
                        <PaymentProofUpload
                          orderId={selectedOrder._id}
                          currentProof={selectedOrder.paymentProof}
                          onUploadSuccess={handleUploadSuccess}
                        />
                      </div>

                  {/* Total */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-xl font-bold text-darkTeal mb-4">
                      <span>Total:</span>
                      <span className="text-primary">R$ {selectedOrder.totalAmount?.toFixed(2)}</span>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => {
                          window.print();
                        }}
                        className="btn-secondary"
                      >
                        Imprimir Pedido
                      </button>
                      <button
                        onClick={() => {
                          // Generate and download invoice
                          const invoiceContent = generateInvoice(selectedOrder);
                          const blob = new Blob([invoiceContent], { type: 'text/html' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `pedido-${selectedOrder._id.slice(-8).toUpperCase()}.html`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                        className="btn-secondary"
                      >
                        Baixar Recibo
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
