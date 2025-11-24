import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'react-hot-toast';
import api from '../utils/api';
import { getAllOrdersAdmin, updateOrderStatus, getOrderById, getAllProductsAdmin, createProduct, updateProduct, deleteProduct, uploadProductImages } from '../utils/api';
import AdminTable from '../components/AdminTable';
import DatePicker from '../components/DatePicker';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productModal, setProductModal] = useState({ open: false, product: null, mode: 'create' });
  const [deleteProductModal, setDeleteProductModal] = useState({ open: false, product: null });
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    subtitle: '',
    price: '',
    images: [''],
    restrictions: 'Produto restrito conforme RDC 327/2019 e 660/2022 da Anvisa. Acesso apenas para usuários autorizados.',
    visible: true,
    category: 'gummy',
    productUrl: 'https://pro.quaddro.co/yourbestversion/servicos/vgwg3F'
  });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState({ from: '', to: '' });
  const [userFilter, setUserFilter] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  const [userSortConfig, setUserSortConfig] = useState({ field: null, direction: 'asc' });
  const [deleteModal, setDeleteModal] = useState({ open: false, user: null });
  const [tabTransition, setTabTransition] = useState(false);
  const isMountedRef = useRef(true);

  const totalUsers = users.length;
  const authorizedUsers = users.filter((user) => user.isAuthorized).length;
  const pendingUsers = totalUsers - authorizedUsers;
  const totalOrders = orders.length;
  const deliveredOrders = orders.filter((order) => order.status === 'delivered').length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const processingOrders = orders.filter((order) => ['pending', 'processing', 'paid'].includes(order.status)).length;

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    setTabTransition(true);
    const timer = setTimeout(() => {
      setTabTransition(false);
      if (activeTab === 'users') {
        fetchUsers();
      } else if (activeTab === 'orders') {
        fetchOrders();
      } else if (activeTab === 'products') {
        fetchProducts();
      }
    }, 150);
    return () => clearTimeout(timer);
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

  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      const response = await getAllProductsAdmin();
      if (response.success) {
        setProducts(response.products || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao carregar produtos.');
      toast.error('Erro ao carregar produtos.');
    } finally {
      setProductsLoading(false);
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
      const response = await api.patch(`/admin/users/${userId}/authorize`);
      const user = users.find(u => u._id === userId);
      const newStatus = !user?.isAuthorized;
      toast.success(
        <span>
          Usuário <strong className="text-primary font-bold">{user?.name}</strong> {newStatus ? 'autorizado' : 'revogado'} com sucesso.
        </span>,
        {
          duration: 3000,
          style: {
            background: '#f6fffa',
            borderRadius: '18px',
            border: '1px solid #b7eb8f',
            color: '#1a3d3a',
          },
        }
      );
      fetchUsers(); // Refresh list
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao atualizar autorização.', {
        style: {
          background: '#ffffff',
          borderRadius: '18px',
          border: '1px solid #f5d2d2',
          color: '#b20032',
        },
      });
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    setDeleteModal({ open: true, user: { id: userId, name: userName } });
  };

  const handleUserSort = (field) => {
    setUserSortConfig((prevConfig) => {
      if (prevConfig.field === field) {
        return {
          field,
          direction: prevConfig.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      return {
        field,
        direction: 'asc'
      };
    });
  };

  const getSortedUsers = () => {
    if (!userSortConfig.field) return users;

    const sorted = [...users].sort((a, b) => {
      let aValue, bValue;

      switch (userSortConfig.field) {
        case 'name':
          aValue = a.name?.toLowerCase() || '';
          bValue = b.name?.toLowerCase() || '';
          break;
        case 'email':
          aValue = a.email?.toLowerCase() || '';
          bValue = b.email?.toLowerCase() || '';
          break;
        case 'role':
          aValue = a.role || '';
          bValue = b.role || '';
          break;
        case 'status':
          aValue = a.isAuthorized ? 1 : 0;
          bValue = b.isAuthorized ? 1 : 0;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return userSortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return userSortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  };

  const confirmDeleteUser = async () => {
    if (!deleteModal.user) return;

    try {
      const response = await api.delete(`/admin/users/${deleteModal.user.id}`);
      if (response.data.success) {
        const message = response.data.message || 'Usuário deletado com sucesso!';
        // Parse message to highlight user name
        const userNameMatch = message.match(/Usuário (.+?) deletado/);
        if (userNameMatch) {
          toast.success(
            <span>
              Usuário <strong className="text-primary font-bold">{userNameMatch[1]}</strong> deletado com sucesso. {response.data.ordersDeleted || 0} pedido(s) associado(s) também foram removidos.
            </span>,
            {
              duration: 5000,
              style: {
                background: '#f6fffa',
                borderRadius: '18px',
                border: '1px solid #b7eb8f',
                color: '#1a3d3a',
              },
            }
          );
        } else {
          toast.success(message, {
            style: {
              background: '#f6fffa',
              borderRadius: '18px',
              border: '1px solid #b7eb8f',
              color: '#1a3d3a',
            },
          });
        }
        setDeleteModal({ open: false, user: null });
        fetchUsers(); // Refresh list
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao deletar usuário.', {
        style: {
          background: '#ffffff',
          borderRadius: '18px',
          border: '1px solid #f5d2d2',
          color: '#b20032',
        },
      });
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    if (!confirm(`Tem certeza que deseja alterar o status do pedido para "${newStatus}"?`)) {
      return;
    }

    try {
      const response = await updateOrderStatus(orderId, newStatus);
      if (response.success && isMountedRef.current) {
        toast.success('Status do pedido atualizado com sucesso!');
        fetchOrders();
        if (selectedOrder && selectedOrder._id === orderId && isMountedRef.current) {
          setSelectedOrder(response.order);
        }
      }
    } catch (err) {
      if (isMountedRef.current) {
        toast.error(err.response?.data?.message || 'Erro ao atualizar status do pedido.');
      }
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

  // Product CRUD handlers
  const handleOpenProductModal = (product = null) => {
    setUploadedFiles([]);
    if (product) {
      setProductForm({
        name: product.name || '',
        description: product.description || '',
        subtitle: product.subtitle || '',
        price: product.price?.toString() || '',
        images: product.images && product.images.length > 0 ? [...product.images] : [''],
        restrictions: product.restrictions || 'Produto restrito conforme RDC 327/2019 e 660/2022 da Anvisa. Acesso apenas para usuários autorizados.',
        visible: product.visible !== undefined ? product.visible : true,
        category: product.category || 'gummy',
        productUrl: product.productUrl || 'https://pro.quaddro.co/yourbestversion/servicos/vgwg3F'
      });
      setProductModal({ open: true, product, mode: 'edit' });
    } else {
      setProductForm({
        name: '',
        description: '',
        subtitle: '',
        price: '',
        images: [''],
        restrictions: 'Produto restrito conforme RDC 327/2019 e 660/2022 da Anvisa. Acesso apenas para usuários autorizados.',
        visible: true,
        category: 'gummy',
        productUrl: 'https://pro.quaddro.co/yourbestversion/servicos/vgwg3F'
      });
      setProductModal({ open: true, product: null, mode: 'create' });
    }
  };

  const handleCloseProductModal = () => {
    setProductModal({ open: false, product: null, mode: 'create' });
    setProductForm({
      name: '',
      description: '',
      subtitle: '',
      price: '',
      images: [''],
      restrictions: 'Produto restrito conforme RDC 327/2019 e 660/2022 da Anvisa. Acesso apenas para usuários autorizados.',
      visible: true,
      category: 'gummy',
      productUrl: 'https://pro.quaddro.co/yourbestversion/servicos/vgwg3F'
    });
    setUploadedFiles([]);
  };

  const handleAddImageField = () => {
    setProductForm({
      ...productForm,
      images: [...productForm.images, '']
    });
  };

  const handleRemoveImageField = (index) => {
    const newImages = productForm.images.filter((_, i) => i !== index);
    if (newImages.length === 0) {
      newImages.push('');
    }
    setProductForm({
      ...productForm,
      images: newImages
    });
  };

  const handleImageChange = (index, value) => {
    const newImages = [...productForm.images];
    newImages[index] = value;
    setProductForm({
      ...productForm,
      images: newImages
    });
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Validate files
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`Arquivo ${file.name}: Tipo não permitido. Use JPG, PNG ou WEBP.`);
        return;
      }
      if (file.size > maxSize) {
        toast.error(`Arquivo ${file.name}: Tamanho máximo é 5MB.`);
        return;
      }
    }

    try {
      setUploadingImages(true);
      const response = await uploadProductImages(files);
      
      if (response.success && response.images) {
        // Add uploaded image URLs to the form
        // Replace empty strings first, then add to the end
        const newImages = [...productForm.images];
        let imageIndex = 0;
        
        response.images.forEach((url) => {
          // Find first empty string to replace
          const emptyIndex = newImages.findIndex(img => !img || img.trim() === '');
          if (emptyIndex !== -1) {
            newImages[emptyIndex] = url;
          } else {
            // All slots are filled, add to the end
            newImages.push(url);
          }
        });
        
        // Remove any remaining empty strings at the end (but keep at least one if all were empty)
        const filteredImages = newImages.filter(img => img && img.trim() !== '');
        const finalImages = filteredImages.length > 0 ? filteredImages : [''];
        
        setProductForm({
          ...productForm,
          images: finalImages
        });
        toast.success(`${response.images.length} imagem(ns) enviada(s) com sucesso!`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao enviar imagens.');
    } finally {
      setUploadingImages(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!productForm.name || !productForm.description || !productForm.price || !productForm.category) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const validImages = productForm.images.filter(img => img.trim() !== '');
    if (validImages.length === 0) {
      toast.error('Adicione pelo menos uma imagem.');
      return;
    }

    try {
      const productData = {
        name: productForm.name.trim(),
        description: productForm.description.trim(),
        subtitle: productForm.subtitle.trim(),
        price: parseFloat(productForm.price),
        images: validImages,
        restrictions: productForm.restrictions.trim(),
        visible: productForm.visible,
        category: productForm.category,
        productUrl: productForm.productUrl.trim()
      };

      if (productModal.mode === 'create') {
        const response = await createProduct(productData);
        if (response.success) {
          toast.success('Produto criado com sucesso!');
          handleCloseProductModal();
          fetchProducts();
        }
      } else {
        const response = await updateProduct(productModal.product._id, productData);
        if (response.success) {
          toast.success('Produto atualizado com sucesso!');
          handleCloseProductModal();
          fetchProducts();
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao salvar produto.');
    }
  };

  const handleDeleteProduct = (product) => {
    setDeleteProductModal({ open: true, product });
  };

  const confirmDeleteProduct = async () => {
    if (!deleteProductModal.product) return;

    try {
      const response = await deleteProduct(deleteProductModal.product._id);
      if (response.success) {
        toast.success(`Produto ${deleteProductModal.product.name} deletado com sucesso!`);
        setDeleteProductModal({ open: false, product: null });
        fetchProducts();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao deletar produto.');
    }
  };

  const getFilteredProducts = () => {
    if (!productSearchQuery.trim()) return products;
    const query = productSearchQuery.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    );
  };

  const statusFilterStyles = {
    pending: 'bg-amber-200 text-amber-800',
    paid: 'bg-sky-200 text-sky-800',
    processing: 'bg-indigo-200 text-indigo-800',
    shipped: 'bg-blue-200 text-blue-800',
    delivered: 'bg-emerald-200 text-emerald-800',
    cancelled: 'bg-rose-200 text-rose-800'
  };

  const orderStatusBadgeStyles = {
    pending: 'bg-amber-100 text-amber-700',
    paid: 'bg-sky-100 text-sky-700',
    processing: 'bg-indigo-100 text-indigo-700',
    shipped: 'bg-blue-100 text-blue-700',
    delivered: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-rose-100 text-rose-700'
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary/5">
        <div className="bg-white rounded-lg px-12 py-10 text-center shadow-sm border border-primary/20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary mx-auto mb-4" />
          <p className="text-mediumTeal text-sm font-medium">Carregando painel administrativo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary/5 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-darkTeal mb-2">Dashboard Administrativo</h1>
          <p className="text-mediumTeal">Monitore usuários, pedidos e desempenho da operação</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-primary/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-mediumTeal uppercase tracking-wide">Usuários</span>
              <div className="p-2 bg-primary/10 rounded-lg">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <div className="flex items-baseline">
              <p className="text-3xl font-bold text-darkTeal">{totalUsers}</p>
              <p className="ml-2 text-sm text-mediumTeal">total</p>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">{authorizedUsers} autorizados</span>
              <span className="mx-2 text-primary/40">•</span>
              <span className="text-amber-600 font-medium">{pendingUsers} pendentes</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-primary/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-mediumTeal uppercase tracking-wide">Pedidos</span>
              <div className="p-2 bg-primary/10 rounded-lg">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <div className="flex items-baseline">
              <p className="text-3xl font-bold text-darkTeal">{totalOrders}</p>
              <p className="ml-2 text-sm text-mediumTeal">total</p>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">{deliveredOrders} entregues</span>
              <span className="mx-2 text-primary/40">•</span>
              <span className="text-primary font-medium">{processingOrders} processando</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-primary/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-mediumTeal uppercase tracking-wide">Receita</span>
              <div className="p-2 bg-primary/10 rounded-lg">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="flex items-baseline">
              <p className="text-3xl font-bold text-darkTeal">R$ {totalRevenue.toFixed(2)}</p>
            </div>
            <p className="mt-4 text-sm text-mediumTeal">Receita acumulada</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-primary/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-mediumTeal uppercase tracking-wide">Status</span>
              <div className="p-2 bg-primary/10 rounded-lg">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between cursor-pointer hover:bg-primary/5 p-2 rounded transition-colors">
                <span className="text-sm text-mediumTeal">Autorizados</span>
                <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded">{authorizedUsers}</span>
              </div>
              <div className="flex items-center justify-between cursor-pointer hover:bg-primary/5 p-2 rounded transition-colors">
                <span className="text-sm text-mediumTeal">Pendentes</span>
                <span className="px-2 py-1 text-xs font-semibold text-amber-700 bg-amber-100 rounded">{pendingUsers}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-primary/20 p-1 inline-flex relative">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-2.5 text-sm font-medium rounded-md transition-all duration-300 relative z-10 overflow-hidden ${
              activeTab === 'users'
                ? 'bg-primary text-white shadow-md transform scale-105'
                : 'text-mediumTeal hover:text-darkTeal hover:bg-primary/10'
            }`}
          >
            <span className="relative z-10">Usuários</span>
            {activeTab === 'users' && (
              <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dark opacity-90 animate-pulse"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-2.5 text-sm font-medium rounded-md transition-all duration-300 relative z-10 overflow-hidden ${
              activeTab === 'orders'
                ? 'bg-primary text-white shadow-md transform scale-105'
                : 'text-mediumTeal hover:text-darkTeal hover:bg-primary/10'
            }`}
          >
            <span className="relative z-10">Pedidos</span>
            {activeTab === 'orders' && (
              <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dark opacity-90 animate-pulse"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-2.5 text-sm font-medium rounded-md transition-all duration-300 relative z-10 overflow-hidden ${
              activeTab === 'products'
                ? 'bg-primary text-white shadow-md transform scale-105'
                : 'text-mediumTeal hover:text-darkTeal hover:bg-primary/10'
            }`}
          >
            <span className="relative z-10">Produtos</span>
            {activeTab === 'products' && (
              <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dark opacity-90 animate-pulse"></span>
            )}
          </button>
        </div>

        {activeTab === 'users' && (
          <div 
            className={`bg-white rounded-lg shadow-sm border border-primary/20 transition-all duration-300 ${
              tabTransition ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
            }`}
          >
            <div className="px-6 py-4 border-b border-primary/20">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-darkTeal">Usuários Cadastrados</h2>
                  <p className="text-sm text-mediumTeal mt-1">Gerencie permissões e acessos dos usuários</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded cursor-pointer hover:bg-green-200 transition-colors">
                    {authorizedUsers} autorizados
                  </span>
                  <span className="px-3 py-1 text-xs font-semibold text-amber-700 bg-amber-100 rounded cursor-pointer hover:bg-amber-200 transition-colors">
                    {pendingUsers} pendentes
                  </span>
                  <span className="px-3 py-1 text-xs font-semibold text-primary bg-primary/10 rounded cursor-pointer hover:bg-primary/20 transition-colors">
                    {totalUsers} total
                  </span>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Buscar por nome ou email..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  className="w-full max-w-md rounded-md border border-primary/30 bg-white px-4 py-2 text-sm text-darkTeal placeholder:text-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <AdminTable
                users={getSortedUsers().filter(user => {
                  if (!userSearchQuery.trim()) return true;
                  const query = userSearchQuery.toLowerCase();
                  return user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query);
                })}
                onToggleAuthorization={handleToggleAuthorization}
                onDeleteUser={handleDeleteUser}
                sortConfig={userSortConfig}
                onSort={handleUserSort}
              />
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div 
            className={`transition-all duration-300 ${
              tabTransition ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
            }`}
          >
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-primary/20">
              <div className="px-6 py-4 border-b border-primary/20">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-darkTeal">Pedidos</h2>
                    <p className="text-sm text-mediumTeal mt-1">Gerencie e monitore todos os pedidos</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm pb-6">
                    <div className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md font-medium">
                      {processingOrders} em andamento
                    </div>
                    <div className="px-3 py-1.5 bg-green-50 text-green-700 rounded-md font-medium">
                      {deliveredOrders} entregues
                    </div>
                    <div className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-md font-medium">
                      R$ {totalRevenue.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <div>
                    <label className="block text-sm font-medium text-darkTeal mb-1">
                      Buscar
                    </label>
                    <input
                      type="text"
                    placeholder="ID, cliente, email ou produto"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-md border border-primary/30 bg-white px-3 py-2 text-sm text-darkTeal placeholder:text-primary/60 focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-darkTeal mb-1">
                      Data inicial
                    </label>
                    <DatePicker
                      value={dateFilter.from}
                      onChange={(e) => setDateFilter({ ...dateFilter, from: e.target.value })}
                      placeholder="Data inicial"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-darkTeal mb-1">
                      Data final
                    </label>
                    <DatePicker
                      value={dateFilter.to}
                      onChange={(e) => setDateFilter({ ...dateFilter, to: e.target.value })}
                      placeholder="Data final"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-darkTeal mb-1">
                      Ordenar por
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full rounded-md border border-primary/30 bg-white px-3 py-2 text-sm text-darkTeal focus:border-primary focus:ring-1 focus:ring-primary"
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
                    className="inline-flex items-center gap-2 text-sm font-medium text-mediumTeal hover:text-darkTeal transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Limpar filtros
                  </button>
                )}

                <div className="flex flex-wrap gap-2 pt-4 border-t border-primary/20">
                  <button
                    onClick={() => setStatusFilter('all')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      statusFilter === 'all'
                        ? 'bg-primary text-white'
                        : 'bg-primary/10 text-darkTeal hover:bg-primary/20'
                    }`}
                  >
                    Todos ({orders.length})
                  </button>
                  {['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => {
                    const count = orders.filter((o) => o.status === status).length;
                    if (count === 0) return null;
                    const statusColors = {
                      pending: 'bg-amber-100 text-amber-800 hover:bg-amber-200',
                      paid: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
                      processing: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200',
                      shipped: 'bg-cyan-100 text-cyan-800 hover:bg-cyan-200',
                      delivered: 'bg-green-100 text-green-800 hover:bg-green-200',
                      cancelled: 'bg-red-100 text-red-800 hover:bg-red-200'
                    };
                    return (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                          statusFilter === status
                            ? statusColors[status] || 'bg-primary/10 text-gray-800'
                            : 'bg-primary/10 text-darkTeal hover:bg-primary/20'
                        }`}
                      >
                        {getStatusBadge(status).label} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            

            {ordersLoading ? (
              <div className="bg-white rounded-lg shadow-sm border border-primary/20 p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary mx-auto mb-4" />
                <p className="text-mediumTeal text-sm font-medium">Carregando pedidos...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-primary/20 p-12 text-center">
                <svg className="mx-auto h-12 w-12 text-primary/40 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="text-sm font-medium text-darkTeal mb-1">
                  {orders.length === 0 ? 'Nenhum pedido encontrado' : 'Nenhum pedido com os filtros selecionados'}
                </h3>
                <p className="text-sm text-mediumTeal mb-4">
                  {orders.length === 0 ? 'Ainda não há pedidos no sistema.' : 'Tente ajustar os filtros de busca.'}
                </p>
                {(dateFilter.from || dateFilter.to || searchQuery || userFilter || statusFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setStatusFilter('all');
                      setDateFilter({ from: '', to: '' });
                      setSearchQuery('');
                      setUserFilter('');
                    }}
                    className="inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Limpar filtros
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const badge = getStatusBadge(order.status);
                  const badgeColors = {
                    pending: 'bg-amber-100 text-amber-800',
                    paid: 'bg-blue-100 text-blue-800',
                    processing: 'bg-indigo-100 text-indigo-800',
                    shipped: 'bg-cyan-100 text-cyan-800',
                    delivered: 'bg-green-100 text-green-800',
                    cancelled: 'bg-red-100 text-red-800'
                  };
                  const badgePalette = badgeColors[order.status] || 'bg-primary/10 text-gray-800';
                  return (
                    <div
                      key={order._id}
                      className="bg-white rounded-lg shadow-sm border border-primary/20 p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold text-darkTeal">
                              Pedido #{order._id.slice(-8).toUpperCase()}
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgePalette}`}>
                              {badge.label}
                            </span>
                          </div>
                          <p className="text-sm text-mediumTeal">
                            {formatDate(order.createdAt)}
                          </p>
                          <div className="text-sm">
                            <span className="font-medium text-darkTeal">{order.userId?.name || 'Usuário'}</span>
                            <span className="text-mediumTeal ml-2">({order.userId?.email || 'N/A'})</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                          <p className="text-xs font-medium text-mediumTeal uppercase tracking-wide mb-1">Itens</p>
                          <p className="text-lg font-semibold text-darkTeal">
                            {order.products?.length || 0} produto(s)
                          </p>
                        </div>
                        <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                          <p className="text-xs font-medium text-mediumTeal uppercase tracking-wide mb-1">Total</p>
                          <p className="text-xl font-bold text-primary">
                            R$ {order.totalAmount?.toFixed(2) || '0.00'}
                          </p>
                        </div>
                        <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                          <p className="text-xs font-medium text-mediumTeal uppercase tracking-wide mb-2">Ações</p>
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => handleViewOrderDetails(order._id)}
                              className="px-3 py-1.5 bg-darkTeal text-white text-xs font-medium rounded-md hover:bg-darkTeal/90 transition-colors"
                            >
                              Ver detalhes
                            </button>
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                              className="rounded-md border border-primary/30 bg-white px-2.5 py-1.5 text-xs font-medium text-darkTeal focus:border-primary focus:ring-1 focus:ring-primary"
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
          </div>
        )}

        {activeTab === 'products' && (
          <div 
            className={`bg-white rounded-lg shadow-sm border border-primary/20 transition-all duration-300 ${
              tabTransition ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
            }`}
          >
            <div className="px-6 py-4 border-b border-primary/20">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-darkTeal">Gerenciar Produtos</h2>
                  <p className="text-sm text-mediumTeal mt-1">Crie, edite e remova produtos do catálogo</p>
                </div>
                <button
                  onClick={() => handleOpenProductModal()}
                  className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Novo Produto
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Buscar produtos por nome, descrição ou categoria..."
                  value={productSearchQuery}
                  onChange={(e) => setProductSearchQuery(e.target.value)}
                  className="w-full max-w-md rounded-md border border-primary/30 bg-white px-4 py-2 text-sm text-darkTeal placeholder:text-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {productsLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary mx-auto mb-4" />
                  <p className="text-mediumTeal text-sm font-medium">Carregando produtos...</p>
                </div>
              ) : getFilteredProducts().length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-primary/40 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <h3 className="text-sm font-medium text-darkTeal mb-1">
                    {products.length === 0 ? 'Nenhum produto cadastrado' : 'Nenhum produto encontrado'}
                  </h3>
                  <p className="text-sm text-mediumTeal mb-4">
                    {products.length === 0 ? 'Comece criando seu primeiro produto.' : 'Tente ajustar os termos de busca.'}
                  </p>
                  {products.length === 0 && (
                    <button
                      onClick={() => handleOpenProductModal()}
                      className="inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90 transition-colors"
                    >
                      Criar Produto
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getFilteredProducts().map((product) => (
                    <div
                      key={product._id}
                      className="bg-primary/5 rounded-lg border border-primary/20 p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-darkTeal mb-1">{product.name}</h3>
                          {product.subtitle && (
                            <p className="text-sm text-mediumTeal mb-2">{product.subtitle}</p>
                          )}
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded ${
                              product.category === 'gummy' ? 'bg-purple-100 text-purple-700' :
                              product.category === 'oleo' ? 'bg-amber-100 text-amber-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {product.category}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded ${
                              product.visible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {product.visible ? 'Visível' : 'Oculto'}
                            </span>
                          </div>
                        </div>
                      </div>
                      {product.images && product.images.length > 0 && (
                        <div className="mb-3">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-32 object-cover rounded-md"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/400x300?text=Imagem+Indisponível';
                            }}
                          />
                        </div>
                      )}
                      <div className="mb-3">
                        <p className="text-sm text-mediumTeal line-clamp-2">{product.description}</p>
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xl font-bold text-primary">R$ {product.price?.toFixed(2) || '0.00'}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenProductModal(product)}
                          className="flex-1 px-3 py-2 bg-primary text-white text-xs font-medium rounded-md hover:bg-primary/90 transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product)}
                          className="px-3 py-2 bg-red-600 text-white text-xs font-medium rounded-md hover:bg-red-700 transition-colors"
                        >
                          Deletar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {selectedOrder && createPortal(
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedOrder(null)}
          >
            <div
              className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-primary/20">
                  <h2 className="text-xl font-semibold text-darkTeal">
                    Detalhes do Pedido #{selectedOrder._id.slice(-8).toUpperCase()}
                  </h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-mediumTeal hover:text-darkTeal transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                      <p className="text-xs font-medium text-mediumTeal uppercase tracking-wide mb-2">Cliente</p>
                      <p className="text-darkTeal font-semibold">
                        {selectedOrder.userId?.name || 'N/A'}
                      </p>
                      <p className="text-sm text-mediumTeal mt-1">
                        {selectedOrder.userId?.email || 'N/A'}
                      </p>
                    </div>
                    <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                      <p className="text-xs font-medium text-mediumTeal uppercase tracking-wide mb-2">Status</p>
                      <select
                        value={selectedOrder.status}
                        onChange={(e) => handleStatusUpdate(selectedOrder._id, e.target.value)}
                        className="w-full rounded-md border border-primary/30 bg-white px-3 py-2 text-sm text-darkTeal focus:border-primary focus:ring-1 focus:ring-primary"
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
                    <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                      <p className="text-xs font-medium text-mediumTeal uppercase tracking-wide mb-2">Data do pedido</p>
                      <p className="text-darkTeal font-semibold">{formatDate(selectedOrder.createdAt)}</p>
                      <p className="text-sm text-mediumTeal mt-1">Atualizado em {formatDate(selectedOrder.updatedAt)}</p>
                    </div>
                    <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                      <p className="text-xs font-medium text-mediumTeal uppercase tracking-wide mb-2">Total do pedido</p>
                      <p className="text-darkTeal font-semibold text-lg">R$ {selectedOrder.totalAmount?.toFixed(2) || '0.00'}</p>
                      <p className="text-sm text-mediumTeal mt-1">Itens: {selectedOrder.products?.length || 0}</p>
                    </div>
                  </div>

                  <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                    <h3 className="text-base font-semibold text-darkTeal mb-4">Itens do Pedido</h3>
                    <div className="space-y-3">
                      {selectedOrder.products?.map((product, idx) => (
                        <div key={`${product.productId?._id || product.productId || product._id}-${idx}`} className="flex justify-between items-center py-2 border-b border-primary/20 last:border-0">
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
                    <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                      <h3 className="text-base font-semibold text-darkTeal mb-3">Endereço de Envio</h3>
                      <div className="text-mediumTeal space-y-1 text-sm">
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
                    <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                      <h3 className="text-base font-semibold text-darkTeal mb-3">Comprovante de Pagamento</h3>
                      <a
                        href={selectedOrder.paymentProof}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-mediumTeal text-sm font-medium rounded-md hover:bg-primary/20 transition-colors"
                      >
                        Ver comprovante
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

        {/* Product Create/Edit Modal */}
        {productModal.open && createPortal(
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={handleCloseProductModal}
          >
            <div
              className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-primary/20">
                  <h2 className="text-xl font-semibold text-darkTeal">
                    {productModal.mode === 'create' ? 'Criar Novo Produto' : 'Editar Produto'}
                  </h2>
                  <button
                    onClick={handleCloseProductModal}
                    className="text-mediumTeal hover:text-darkTeal transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmitProduct} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-darkTeal mb-1">
                        Nome do Produto *
                      </label>
                      <input
                        type="text"
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        className="w-full rounded-md border border-primary/30 bg-white px-3 py-2 text-sm text-darkTeal focus:border-primary focus:ring-1 focus:ring-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-darkTeal mb-1">
                        Categoria *
                      </label>
                      <select
                        value={productForm.category}
                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                        className="w-full rounded-md border border-primary/30 bg-white px-3 py-2 text-sm text-darkTeal focus:border-primary focus:ring-1 focus:ring-primary"
                        required
                      >
                        <option value="gummy">Gummy</option>
                        <option value="oleo">Óleo</option>
                        <option value="creme">Creme</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-darkTeal mb-1">
                      Subtítulo
                    </label>
                    <input
                      type="text"
                      value={productForm.subtitle}
                      onChange={(e) => setProductForm({ ...productForm, subtitle: e.target.value })}
                      className="w-full rounded-md border border-primary/30 bg-white px-3 py-2 text-sm text-darkTeal focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="Ex: Sono Profundo, noites reparadoras"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-darkTeal mb-1">
                      Descrição *
                    </label>
                    <textarea
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      rows={4}
                      className="w-full rounded-md border border-primary/30 bg-white px-3 py-2 text-sm text-darkTeal focus:border-primary focus:ring-1 focus:ring-primary"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-darkTeal mb-1">
                        Preço (R$) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                        className="w-full rounded-md border border-primary/30 bg-white px-3 py-2 text-sm text-darkTeal focus:border-primary focus:ring-1 focus:ring-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-darkTeal mb-1">
                        Visibilidade
                      </label>
                      <div className="flex items-center gap-4 mt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={productForm.visible}
                            onChange={(e) => setProductForm({ ...productForm, visible: e.target.checked })}
                            className="w-4 h-4 text-primary border-primary/30 rounded focus:ring-primary"
                          />
                          <span className="text-sm text-darkTeal">Produto visível</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-darkTeal mb-1">
                      Imagens *
                    </label>
                    <div className="mb-3">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-primary/30 rounded-lg cursor-pointer bg-primary/5 hover:bg-primary/10 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          {uploadingImages ? (
                            <>
                              <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary/20 border-t-primary mb-2"></div>
                              <p className="text-sm text-mediumTeal">Enviando imagens...</p>
                            </>
                          ) : (
                            <>
                              <svg className="w-8 h-8 mb-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <p className="mb-2 text-sm text-darkTeal">
                                <span className="font-semibold">Clique para fazer upload</span> ou arraste e solte
                              </p>
                              <p className="text-xs text-mediumTeal">JPG, PNG ou WEBP (máx. 5MB cada)</p>
                            </>
                          )}
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          multiple
                          onChange={handleFileSelect}
                          disabled={uploadingImages}
                        />
                      </label>
                    </div>
                    {productForm.images.map((image, index) => (
                      <div key={index} className="flex gap-2 mb-2 items-center">
                        {image && (
                          <div className="w-32 h-32 rounded-md overflow-hidden border border-primary/20 flex-shrink-0">
                            <img
                              src={image}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/128?text=Erro';
                              }}
                            />
                          </div>
                        )}
                        <input
                          type="url"
                          value={image}
                          onChange={(e) => handleImageChange(index, e.target.value)}
                          placeholder="URL da imagem ou faça upload acima"
                          className="flex-1 rounded-md border border-primary/30 bg-white px-3 py-2 text-sm text-darkTeal focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                        {image && (
                          <div className="flex gap-1 flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                const newImages = [...productForm.images];
                                newImages[index] = '';
                                setProductForm({ ...productForm, images: newImages });
                              }}
                              className="px-3 py-2 bg-yellow-600 text-white text-sm rounded-md hover:bg-yellow-700 transition-colors"
                              title="Atualizar imagem"
                            >
                              Atualizar
                            </button>
                            {productForm.images.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveImageField(index)}
                                className="px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                                title="Remover imagem"
                              >
                                Remover
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddImageField}
                      className="mt-2 px-3 py-2 bg-primary/10 text-primary text-sm font-medium rounded-md hover:bg-primary/20 transition-colors"
                    >
                      + Adicionar Campo de URL
                    </button>
                    <p className="mt-2 text-xs text-mediumTeal">
                      Você pode fazer upload de imagens ou inserir URLs. Faça upload de múltiplas imagens de uma vez.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-darkTeal mb-1">
                      URL do Produto (Agendar Consulta)
                    </label>
                    <input
                      type="url"
                      value={productForm.productUrl}
                      onChange={(e) => setProductForm({ ...productForm, productUrl: e.target.value })}
                      placeholder="https://pro.quaddro.co/yourbestversion/servicos/vgwg3F"
                      className="w-full rounded-md border border-primary/30 bg-white px-3 py-2 text-sm text-darkTeal focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                    <p className="mt-1 text-xs text-mediumTeal">URL que será aberta quando o usuário clicar em "Agendar Consulta"</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-darkTeal mb-1">
                      Restrições
                    </label>
                    <textarea
                      value={productForm.restrictions}
                      onChange={(e) => setProductForm({ ...productForm, restrictions: e.target.value })}
                      rows={2}
                      className="w-full rounded-md border border-primary/30 bg-white px-3 py-2 text-sm text-darkTeal focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="flex gap-3 justify-end pt-4 border-t border-primary/20">
                    <button
                      type="button"
                      onClick={handleCloseProductModal}
                      className="px-4 py-2 text-sm font-medium text-mediumTeal hover:text-darkTeal transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                    >
                      {productModal.mode === 'create' ? 'Criar Produto' : 'Salvar Alterações'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>,
          document.body
        )}

        {/* Delete Product Modal */}
        {deleteProductModal.open && createPortal(
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setDeleteProductModal({ open: false, product: null })}
          >
            <div
              className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-darkTeal">Confirmar exclusão</h3>
                  <p className="text-sm text-mediumTeal">Esta ação é irreversível</p>
                </div>
              </div>
              <p className="text-mediumTeal mb-6">
                Tem certeza que deseja deletar o produto <strong className="text-darkTeal">{deleteProductModal.product?.name}</strong>?
                <br />
                <br />
                Esta ação não pode ser desfeita. Se o produto estiver associado a pedidos, a exclusão será bloqueada.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteProductModal({ open: false, product: null })}
                  className="px-4 py-2 text-sm font-medium text-mediumTeal hover:text-darkTeal transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDeleteProduct}
                  className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Deletar
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

        {/* Delete User Modal */}
        {deleteModal.open && createPortal(
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setDeleteModal({ open: false, user: null })}
          >
            <div
              className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-darkTeal">Confirmar exclusão</h3>
                  <p className="text-sm text-mediumTeal">Esta ação é irreversível</p>
                </div>
              </div>
              <p className="text-mediumTeal mb-6">
                Tem certeza que deseja deletar o usuário <strong className="text-darkTeal">{deleteModal.user?.name}</strong>?
                <br />
                <br />
                Esta ação também removerá todos os pedidos associados a este usuário.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteModal({ open: false, user: null })}
                  className="px-4 py-2 text-sm font-medium text-mediumTeal hover:text-darkTeal transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDeleteUser}
                  className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Deletar
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

        <div className="mt-6 bg-amber-50 border-l-4 border-amber-400 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-amber-700">
                <strong>Nota:</strong> Apenas usuários autorizados podem acessar a área de produtos, 
                conforme as regulamentações da Anvisa (RDC 327/2019 e 660/2022).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
