import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'react-hot-toast';
import api from '../utils/api';
import { getAllOrdersAdmin, updateOrderStatus, getOrderById, getAllProductsAdmin, createProduct, updateProduct, deleteProduct, uploadProductImages, getAllBlogsAdmin, getBlogById, createBlog, updateBlog, deleteBlog, getAllFeedbacksAdmin, updateFeedbackStatus, deleteFeedback, getAllNotificationsAdmin, createNotificationAdmin, sendNotificationToAllUsers, updateNotificationAdmin, deleteNotificationAdmin, updateUserPasswordAdmin } from '../utils/api';
import AdminTable from '../components/AdminTable';
import DatePicker from '../components/DatePicker';
import ElegantSelect from '../components/ElegantSelect';

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
  const [deleteBlogModal, setDeleteBlogModal] = useState({ open: false, blog: null });
  const [deleteFeedbackModal, setDeleteFeedbackModal] = useState({ open: false, feedback: null });
  const [deleteMessageModal, setDeleteMessageModal] = useState({ open: false, message: null });
  const [passwordModal, setPasswordModal] = useState({ open: false, userId: null, userName: '', lastSetPassword: '' });
  const [passwordModalClosing, setPasswordModalClosing] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordSetSuccess, setPasswordSetSuccess] = useState(false);
  const passwordModalAnimatedRef = useRef(false);
  const [tabTransition, setTabTransition] = useState(false);
  const isMountedRef = useRef(true);
  const [blogs, setBlogs] = useState([]);
  const [blogsLoading, setBlogsLoading] = useState(false);
  const [blogModal, setBlogModal] = useState({ open: false, blog: null, mode: 'create' });
  const [blogForm, setBlogForm] = useState({
    title: '',
    contentMarkdown: '',
    excerpt: '',
    imageUrl: '',
    tags: [],
    published: false
  });
  const [blogTagsInput, setBlogTagsInput] = useState(''); // Raw input for tags to allow comma typing
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbacksLoading, setFeedbacksLoading] = useState(false);
  const [feedbackStatusFilter, setFeedbackStatusFilter] = useState('all');
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messageModal, setMessageModal] = useState({ open: false, mode: 'single', editingMessage: null });
  const [messageModalClosing, setMessageModalClosing] = useState(false);
  const [faqs, setFaqs] = useState([]);
  const [faqsLoading, setFaqsLoading] = useState(false);
  const [faqModal, setFaqModal] = useState({ open: false, faq: null, mode: 'create' });
  const [faqModalClosing, setFaqModalClosing] = useState(false);
  const [deleteFaqModal, setDeleteFaqModal] = useState({ open: false, faq: null });
  const [deleteFaqModalClosing, setDeleteFaqModalClosing] = useState(false);
  const [faqForm, setFaqForm] = useState({
    question: '',
    answer: '',
    order: 0,
    active: true
  });
  const [productModalClosing, setProductModalClosing] = useState(false);
  const [blogModalClosing, setBlogModalClosing] = useState(false);
  const [deleteProductModalClosing, setDeleteProductModalClosing] = useState(false);
  const [deleteModalClosing, setDeleteModalClosing] = useState(false);
  const [deleteBlogModalClosing, setDeleteBlogModalClosing] = useState(false);
  const [deleteFeedbackModalClosing, setDeleteFeedbackModalClosing] = useState(false);
  const [deleteMessageModalClosing, setDeleteMessageModalClosing] = useState(false);
  const [orderModalClosing, setOrderModalClosing] = useState(false);
  const [messageForm, setMessageForm] = useState({
    userId: '',
    sendToAll: false,
    title: '',
    message: '',
    type: 'info',
    link: ''
  });

  const totalUsers = users.length;
  const authorizedUsers = users.filter((user) => user.isAuthorized).length;
  const pendingUsers = totalUsers - authorizedUsers;
  const totalOrders = orders.length;
  const deliveredOrders = orders.filter((order) => order.status === 'delivered').length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const processingOrders = orders.filter((order) => ['pending', 'processing', 'paid'].includes(order.status)).length;
  const totalProducts = products.length;
  const visibleProducts = products.filter((p) => p.visible).length;
  const totalBlogs = blogs.length;
  const publishedBlogs = blogs.filter((b) => b.published).length;
  const totalFeedbacks = feedbacks.length;
  const pendingFeedbacks = feedbacks.filter((f) => f.status === 'pending').length;
  const totalMessages = messages.length;
  const unreadMessages = messages.filter((m) => !m.read).length;

  useEffect(() => {
    isMountedRef.current = true;
    // Load all data on initial mount for dashboard overview
    fetchUsers();
    fetchOrders();
    fetchProducts();
    fetchBlogs();
    fetchFeedbacks();
    fetchMessages();
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
      } else if (activeTab === 'blogs') {
        fetchBlogs();
      } else if (activeTab === 'feedbacks') {
        fetchFeedbacks();
      } else if (activeTab === 'messages') {
        fetchMessages();
      } else if (activeTab === 'faqs') {
        fetchFaqs();
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [activeTab]);

  useEffect(() => {
    filterAndSortOrders();
  }, [orders, statusFilter, searchQuery, dateFilter, userFilter, sortBy]);

  // Listen for feedback creation events to refresh feedbacks list
  useEffect(() => {
    const handleFeedbackCreated = () => {
      // Refresh feedbacks if we're on the feedbacks tab
      if (activeTab === 'feedbacks') {
        fetchFeedbacks();
      }
    };

    // Also refresh when window regains focus and we're on feedbacks tab
    const handleWindowFocus = () => {
      if (activeTab === 'feedbacks') {
        fetchFeedbacks();
      }
    };

    window.addEventListener('feedbackCreated', handleFeedbackCreated);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      window.removeEventListener('feedbackCreated', handleFeedbackCreated);
      window.removeEventListener('focus', handleWindowFocus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, feedbackStatusFilter]);

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

  const fetchBlogs = async () => {
    try {
      setBlogsLoading(true);
      const response = await getAllBlogsAdmin();
      if (response.success) {
        setBlogs(response.blogs || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao carregar blogs.');
      toast.error('Erro ao carregar blogs.');
    } finally {
      setBlogsLoading(false);
    }
  };

  const fetchFeedbacks = async (statusFilter = null) => {
    try {
      setFeedbacksLoading(true);
      const statusToUse = statusFilter !== null ? statusFilter : feedbackStatusFilter;
      const status = statusToUse !== 'all' ? statusToUse : null;
      const response = await getAllFeedbacksAdmin(status);
      if (response.success) {
        setFeedbacks(response.feedbacks || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao carregar feedbacks.');
      toast.error('Erro ao carregar feedbacks.');
    } finally {
      setFeedbacksLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      setMessagesLoading(true);
      const response = await getAllNotificationsAdmin();
      if (response.success) {
        setMessages(response.notifications || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao carregar mensagens.');
      toast.error('Erro ao carregar mensagens.');
    } finally {
      setMessagesLoading(false);
    }
  };

  const fetchFaqs = async () => {
    try {
      setFaqsLoading(true);
      // Try admin endpoint first, fallback to public endpoint
      try {
        const response = await api.get('/admin/faqs');
        if (response.data.success) {
          setFaqs(response.data.faqs || []);
        }
      } catch (adminErr) {
        // If admin endpoint doesn't exist, use public endpoint
        const response = await api.get('/faqs');
        if (response.data.success) {
          setFaqs(response.data.faqs || []);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao carregar FAQs.');
      toast.error('Erro ao carregar FAQs.');
    } finally {
      setFaqsLoading(false);
    }
  };

  const handleCreateFaq = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/admin/faqs', faqForm);
      if (response.data.success) {
        toast.success('FAQ criado com sucesso!');
        setFaqModalClosing(true);
        setTimeout(() => {
          setFaqModal({ open: false, faq: null, mode: 'create' });
          setFaqModalClosing(false);
          setFaqForm({ question: '', answer: '', order: 0, active: true });
          fetchFaqs();
        }, 300);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao criar FAQ.');
    }
  };

  const handleUpdateFaq = async (e) => {
    e.preventDefault();
    try {
      const response = await api.patch(`/admin/faqs/${faqModal.faq._id}`, faqForm);
      if (response.data.success) {
        toast.success('FAQ atualizado com sucesso!');
        setFaqModalClosing(true);
        setTimeout(() => {
          setFaqModal({ open: false, faq: null, mode: 'create' });
          setFaqModalClosing(false);
          setFaqForm({ question: '', answer: '', order: 0, active: true });
          fetchFaqs();
        }, 300);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao atualizar FAQ.');
    }
  };

  const confirmDeleteFaq = async () => {
    try {
      const response = await api.delete(`/admin/faqs/${deleteFaqModal.faq._id}`);
      if (response.data.success) {
        toast.success('FAQ deletado com sucesso!');
        setDeleteFaqModalClosing(true);
        setTimeout(() => {
          setDeleteFaqModal({ open: false, faq: null });
          setDeleteFaqModalClosing(false);
          fetchFaqs();
        }, 300);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao deletar FAQ.');
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
        setDeleteModalClosing(true);
        setTimeout(() => {
          setDeleteModal({ open: false, user: null });
          setDeleteModalClosing(false);
          fetchUsers();
        }, 300); // Refresh list
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

  const confirmDeleteBlog = async () => {
    if (!deleteBlogModal.blog) return;

    try {
      const response = await deleteBlog(deleteBlogModal.blog._id);
      if (response.success) {
        toast.success(`Artigo "${deleteBlogModal.blog.title}" foi deletado com sucesso!`);
        setDeleteBlogModalClosing(true);
        setTimeout(() => {
          setDeleteBlogModal({ open: false, blog: null });
          setDeleteBlogModalClosing(false);
          fetchBlogs();
        }, 300);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao deletar artigo.');
    }
  };

  const confirmDeleteFeedback = async () => {
    if (!deleteFeedbackModal.feedback) return;

    try {
      const response = await deleteFeedback(deleteFeedbackModal.feedback._id);
      if (response.success) {
        toast.success('Feedback deletado!');
        setDeleteFeedbackModalClosing(true);
        setTimeout(() => {
          setDeleteFeedbackModal({ open: false, feedback: null });
          setDeleteFeedbackModalClosing(false);
          fetchFeedbacks();
        }, 300);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao deletar feedback.');
    }
  };

  const confirmDeleteMessage = async () => {
    if (!deleteMessageModal.message) return;

    try {
      const response = await deleteNotificationAdmin(deleteMessageModal.message._id);
      if (response.success) {
        toast.success(`Mensagem "${deleteMessageModal.message.title || 'Mensagem'}" foi deletada com sucesso!`);
        setDeleteMessageModalClosing(true);
        setTimeout(() => {
          setDeleteMessageModal({ open: false, message: null });
          setDeleteMessageModalClosing(false);
          fetchMessages();
        }, 300);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao deletar mensagem.');
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
    if (productModalClosing) return; // Don't open if currently closing
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
    if (productModalClosing) return; // Prevent multiple calls
    setProductModalClosing(true);
    setTimeout(() => {
      setProductModal({ open: false, product: null, mode: 'create' });
      setProductModalClosing(false);
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
    }, 300);
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
        setDeleteProductModalClosing(true);
        setTimeout(() => {
          setDeleteProductModal({ open: false, product: null });
          setDeleteProductModalClosing(false);
          fetchProducts();
        }, 300);
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

        {/* Stats Cards - Overview */}
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
              <span className="text-sm font-medium text-mediumTeal uppercase tracking-wide">Produtos</span>
              <div className="p-2 bg-primary/10 rounded-lg">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
            <div className="flex items-baseline">
              <p className="text-3xl font-bold text-darkTeal">{totalProducts}</p>
              <p className="ml-2 text-sm text-mediumTeal">total</p>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">{visibleProducts} visíveis</span>
            </div>
          </div>
        </div>

        {/* Additional Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-primary/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-mediumTeal uppercase tracking-wide">Blogs</span>
              <div className="p-2 bg-primary/10 rounded-lg">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div className="flex items-baseline">
              <p className="text-3xl font-bold text-darkTeal">{totalBlogs}</p>
              <p className="ml-2 text-sm text-mediumTeal">artigos</p>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">{publishedBlogs} publicados</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-primary/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-mediumTeal uppercase tracking-wide">Feedbacks</span>
              <div className="p-2 bg-primary/10 rounded-lg">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
            </div>
            <div className="flex items-baseline">
              <p className="text-3xl font-bold text-darkTeal">{totalFeedbacks}</p>
              <p className="ml-2 text-sm text-mediumTeal">total</p>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-amber-600 font-medium">{pendingFeedbacks} pendentes</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-primary/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-mediumTeal uppercase tracking-wide">Mensagens</span>
              <div className="p-2 bg-primary/10 rounded-lg">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
            <div className="flex items-baseline">
              <p className="text-3xl font-bold text-darkTeal">{totalMessages}</p>
              <p className="ml-2 text-sm text-mediumTeal">enviadas</p>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-blue-600 font-medium">{unreadMessages} não lidas</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-primary/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-mediumTeal uppercase tracking-wide">Status Geral</span>
              <div className="p-2 bg-primary/10 rounded-lg">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between cursor-pointer hover:bg-primary/5 p-2 rounded transition-colors" onClick={() => setActiveTab('users')}>
                <span className="text-sm text-mediumTeal">Usuários Autorizados</span>
                <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded">{authorizedUsers}</span>
              </div>
              <div className="flex items-center justify-between cursor-pointer hover:bg-primary/5 p-2 rounded transition-colors" onClick={() => setActiveTab('orders')}>
                <span className="text-sm text-mediumTeal">Pedidos Processando</span>
                <span className="px-2 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded">{processingOrders}</span>
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
          <button
            onClick={() => setActiveTab('blogs')}
            className={`px-6 py-2.5 text-sm font-medium rounded-md transition-all duration-300 relative z-10 overflow-hidden ${
              activeTab === 'blogs'
                ? 'bg-primary text-white shadow-md transform scale-105'
                : 'text-mediumTeal hover:text-darkTeal hover:bg-primary/10'
            }`}
          >
            <span className="relative z-10">Blogs</span>
            {activeTab === 'blogs' && (
              <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dark opacity-90 animate-pulse"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('feedbacks')}
            className={`px-6 py-2.5 text-sm font-medium rounded-md transition-all duration-300 relative z-10 overflow-hidden ${
              activeTab === 'feedbacks'
                ? 'bg-primary text-white shadow-md transform scale-105'
                : 'text-mediumTeal hover:text-darkTeal hover:bg-primary/10'
            }`}
          >
            <span className="relative z-10">Feedbacks</span>
            {activeTab === 'feedbacks' && (
              <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dark opacity-90 animate-pulse"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-6 py-2.5 text-sm font-medium rounded-md transition-all duration-300 relative z-10 overflow-hidden ${
              activeTab === 'messages'
                ? 'bg-primary text-white shadow-md transform scale-105'
                : 'text-mediumTeal hover:text-darkTeal hover:bg-primary/10'
            }`}
          >
            <span className="relative z-10">Mensagens</span>
            {activeTab === 'messages' && (
              <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dark opacity-90 animate-pulse"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('faqs')}
            className={`px-6 py-2.5 text-sm font-medium rounded-md transition-all duration-300 relative z-10 overflow-hidden ${
              activeTab === 'faqs'
                ? 'bg-primary text-white shadow-md transform scale-105'
                : 'text-mediumTeal hover:text-darkTeal hover:bg-primary/10'
            }`}
          >
            <span className="relative z-10">FAQs</span>
            {activeTab === 'faqs' && (
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
                onChangePassword={(userId, userName) => {
                  setPasswordModalClosing(false);
                  setShowPassword(false);
                  setPasswordSetSuccess(false);
                  setPasswordModal({ open: true, userId, userName, lastSetPassword: '' });
                }}
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
                    <ElegantSelect
                      label="Ordenar por"
                      value={sortBy}
                      onChange={(value) => setSortBy(value)}
                      options={[
                        { value: 'date-desc', label: 'Data (Mais recente)' },
                        { value: 'date-asc', label: 'Data (Mais antigo)' },
                        { value: 'amount-desc', label: 'Valor (Maior)' },
                        { value: 'amount-asc', label: 'Valor (Menor)' },
                        { value: 'status', label: 'Status' },
                        { value: 'customer', label: 'Cliente (A-Z)' }
                      ]}
                      className="w-full"
                    />
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
                            className="w-full h-48 object-contain rounded-md"
                            style={{ width: '100%', height: '200px', objectFit: 'contain' }}
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
                          onClick={() => {
                            handleOpenProductModal(product);
                          }}
                          className="flex-1 px-3 py-2 bg-primary text-white text-xs font-medium rounded-md hover:bg-primary/90 transition-colors"
                        >
                          Atualizar
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

        {activeTab === 'blogs' && (
          <div 
            className={`bg-white rounded-lg shadow-sm border border-primary/20 transition-all duration-300 ${
              tabTransition ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
            }`}
          >
            <div className="px-6 py-4 border-b border-primary/20">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-darkTeal">Gerenciar Blogs</h2>
                  <p className="text-sm text-mediumTeal mt-1">Crie, edite e remova artigos do blog</p>
                </div>
                <button
                  onClick={() => {
                    setBlogForm({
                      title: '',
                      contentMarkdown: '',
                      excerpt: '',
                      imageUrl: '',
                      tags: [],
                      published: false
                    });
                    setBlogTagsInput('');
                    setBlogModal({ open: true, blog: null, mode: 'create' });
                  }}
                  className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Novo Artigo
                </button>
              </div>
            </div>
            <div className="p-6">
              {blogsLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary mx-auto mb-4" />
                  <p className="text-mediumTeal text-sm font-medium">Carregando blogs...</p>
                </div>
              ) : blogs.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-primary/40 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-sm font-medium text-darkTeal mb-1">Nenhum artigo cadastrado</h3>
                  <p className="text-sm text-mediumTeal mb-4">Comece criando seu primeiro artigo.</p>
                  <button
                    onClick={() => {
                      setBlogForm({
                        title: '',
                        contentMarkdown: '',
                        excerpt: '',
                        imageUrl: '',
                        tags: [],
                        published: false
                      });
                      setBlogTagsInput('');
                      setBlogModal({ open: true, blog: null, mode: 'create' });
                    }}
                    className="inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Criar Artigo
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {blogs.map((blog) => (
                    <div
                      key={blog._id}
                      className="bg-primary/5 rounded-lg border border-primary/20 p-4 hover:shadow-md transition-shadow flex flex-col h-full relative min-h-[400px]"
                    >
                      {!blog.published && (
                        <span className="absolute top-2 right-2 px-3 py-1.5 text-xs font-bold rounded-md bg-gray-800 text-white flex items-center gap-1.5 z-10 shadow-lg border-2 border-gray-900">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                          Invisível
                        </span>
                      )}
                      {blog.imageUrl && (
                        <div className="mb-3">
                          <img
                            src={blog.imageUrl}
                            alt={blog.title}
                            className="w-full h-48 object-cover rounded-md"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/400x300?text=Imagem+Indisponível';
                            }}
                          />
                        </div>
                      )}
                      <h3 className="text-lg font-semibold text-darkTeal mb-2 line-clamp-2">{blog.title}</h3>
                      {blog.excerpt && (
                        <p className="text-sm text-mediumTeal mb-3 line-clamp-2">{blog.excerpt}</p>
                      )}
                      <div className="flex items-center gap-2 mb-3">
                        {blog.published && (
                          <span className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-700 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Visível
                          </span>
                        )}
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          blog.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {blog.published ? 'Publicado' : 'Rascunho'}
                        </span>
                        {blog.tags && blog.tags.length > 0 && (
                          <span className="text-xs text-mediumTeal">
                            {blog.tags.length} tag{blog.tags.length > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                      {(blog.createdAt || blog.updatedAt) && (
                        <p className="text-xs text-mediumTeal/70 mb-3">
                          {blog.updatedAt && new Date(blog.updatedAt) > new Date(blog.createdAt) 
                            ? `Atualizado: ${new Date(blog.updatedAt).toLocaleDateString('pt-BR')}`
                            : `Criado: ${new Date(blog.createdAt).toLocaleDateString('pt-BR')}`
                          }
                        </p>
                      )}
                      <div className="flex gap-2 mt-auto pt-3">
                        <button
                          onClick={() => {
                            setBlogForm({
                              title: blog.title || '',
                              contentMarkdown: blog.contentMarkdown || '',
                              excerpt: blog.excerpt || '',
                              imageUrl: blog.imageUrl || '',
                              tags: blog.tags || [],
                              published: blog.published || false
                            });
                            // Set the tags input to the joined tags string
                            setBlogTagsInput((blog.tags || []).join(', '));
                            setBlogModal({ open: true, blog, mode: 'edit' });
                          }}
                          className="flex-1 px-3 py-2 bg-primary text-white text-xs font-medium rounded-md hover:bg-primary/90 transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => {
                            setDeleteBlogModal({ open: true, blog });
                          }}
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

        {activeTab === 'feedbacks' && (
          <div 
            className={`bg-white rounded-lg shadow-sm border border-primary/20 transition-all duration-300 ${
              tabTransition ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
            }`}
          >
            <div className="px-6 py-4 border-b border-primary/20">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-darkTeal">Gerenciar Feedbacks</h2>
                  <p className="text-sm text-mediumTeal mt-1">Visualize e gerencie feedbacks dos usuários</p>
                </div>
                <div className="flex gap-2">
                  <ElegantSelect
                    value={feedbackStatusFilter}
                    onChange={(newStatus) => {
                      setFeedbackStatusFilter(newStatus);
                      fetchFeedbacks(newStatus);
                    }}
                    options={[
                      { value: 'all', label: 'Todos os status' },
                      { value: 'pending', label: 'Pendente' },
                      { value: 'reviewed', label: 'Revisado' },
                      { value: 'resolved', label: 'Resolvido' },
                      { value: 'archived', label: 'Arquivado' }
                    ]}
                    className="w-auto min-w-[180px]"
                  />
                </div>
              </div>
            </div>
            <div className="p-6">
              {feedbacksLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary mx-auto mb-4" />
                  <p className="text-mediumTeal text-sm font-medium">Carregando feedbacks...</p>
                </div>
              ) : feedbacks.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-primary/40 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  <h3 className="text-sm font-medium text-darkTeal mb-1">Nenhum feedback encontrado</h3>
                  <p className="text-sm text-mediumTeal">Ainda não há feedbacks no sistema.</p>
                </div>
              ) : (
                <div className="space-y-0">
                  {feedbacks.map((feedback, index) => (
                    <div key={feedback._id}>
                      {index > 0 && <div className="border-t border-primary/20 my-4"></div>}
                      <div
                        className="bg-primary/5 rounded-lg border border-primary/20 p-4 hover:shadow-md hover:bg-primary/10 transition-all cursor-pointer"
                      >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {feedback.userId?.photo ? (
                              <img
                                src={feedback.userId.photo}
                                alt={feedback.name}
                                className="w-10 h-10 rounded-full object-cover border-2 border-primary/20 flex-shrink-0"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm flex-shrink-0">
                                {feedback.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <p className="font-semibold text-darkTeal">{feedback.name}</p>
                            <p className="text-sm text-mediumTeal">{feedback.email}</p>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-4 h-4 ${i < feedback.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-mediumTeal mb-3">{feedback.message}</p>
                          <p className="text-xs text-mediumTeal/70">
                            {new Date(feedback.createdAt).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <ElegantSelect
                            value={feedback.status}
                            onChange={async (status) => {
                              try {
                                const response = await updateFeedbackStatus(feedback._id, status);
                                if (response.success) {
                                  toast.success('Status atualizado!');
                                  fetchFeedbacks();
                                }
                              } catch (err) {
                                toast.error(err.response?.data?.message || 'Erro ao atualizar status.');
                              }
                            }}
                            options={[
                              { value: 'pending', label: 'Pendente' },
                              { value: 'reviewed', label: 'Revisado' },
                              { value: 'resolved', label: 'Resolvido' },
                              { value: 'archived', label: 'Arquivado' }
                            ]}
                            className="w-full"
                          />
                          <button
                            onClick={() => {
                              setDeleteFeedbackModal({ open: true, feedback });
                            }}
                            className="px-3 py-1 bg-red-600 text-white text-xs font-medium rounded-md hover:bg-red-700 transition-colors"
                          >
                            Deletar
                          </button>
                        </div>
                      </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div 
            className={`bg-white rounded-lg shadow-sm border border-primary/20 transition-all duration-300 ${
              tabTransition ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
            }`}
          >
            <div className="px-6 py-4 border-b border-primary/20">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-darkTeal">Gerenciar Mensagens</h2>
                  <p className="text-sm text-mediumTeal mt-1">Envie notificações para usuários específicos ou todos os usuários</p>
                </div>
                <button
                  onClick={() => {
                    setMessageForm({
                      userId: '',
                      sendToAll: false,
                      title: '',
                      message: '',
                      type: 'info',
                      link: ''
                    });
                    setMessageModal({ open: true, mode: 'single', editingMessage: null });
                  }}
                  className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Nova Mensagem
                </button>
              </div>
            </div>
            <div className="p-6">
              {messagesLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary mx-auto mb-4" />
                  <p className="text-mediumTeal text-sm font-medium">Carregando mensagens...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-primary/40 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <h3 className="text-sm font-medium text-darkTeal mb-1">Nenhuma mensagem encontrada</h3>
                  <p className="text-sm text-mediumTeal">Comece enviando sua primeira mensagem.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message._id}
                      className="bg-primary/5 rounded-lg border border-primary/20 p-4 hover:shadow-md hover:bg-primary/10 transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <p className="font-semibold text-darkTeal">{message.title}</p>
                            <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                              message.type === 'info' ? 'bg-blue-100 text-blue-700' :
                              message.type === 'success' ? 'bg-green-100 text-green-700' :
                              message.type === 'warning' ? 'bg-amber-100 text-amber-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {message.type}
                            </span>
                          </div>
                          <p className="text-sm text-mediumTeal mb-2">{message.message}</p>
                          <div className="flex items-center gap-4 text-xs text-mediumTeal/70">
                            <span>Para: {message.userId?.name || 'Usuário'} ({message.userId?.email || 'N/A'})</span>
                            <span>
                              {new Date(message.createdAt).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              // Open edit modal with message data
                              setMessageForm({
                                userId: message.userId?._id || message.userId || '',
                                sendToAll: false,
                                title: message.title || '',
                                message: message.message || message.content || '',
                                type: message.type || 'info',
                                link: ''
                              });
                              setMessageModal({ open: true, mode: 'single', editingMessage: message });
                            }}
                            className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => {
                              setDeleteMessageModal({ open: true, message });
                            }}
                            className="px-3 py-1 bg-red-600 text-white text-xs font-medium rounded-md hover:bg-red-700 transition-colors"
                          >
                            Deletar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'faqs' && (
          <div 
            className={`bg-white rounded-lg shadow-sm border border-primary/20 transition-all duration-300 ${
              tabTransition ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
            }`}
          >
            <div className="px-6 py-4 border-b border-primary/20">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-darkTeal">Gerenciar FAQs</h2>
                  <p className="text-sm text-mediumTeal mt-1">Gerencie perguntas frequentes</p>
                </div>
                <button
                  onClick={() => {
                    setFaqForm({
                      question: '',
                      answer: '',
                      order: 0,
                      active: true
                    });
                    setFaqModal({ open: true, faq: null, mode: 'create' });
                  }}
                  className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Nova FAQ
                </button>
              </div>
            </div>
            <div className="p-6">
              {faqsLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary mx-auto mb-4" />
                  <p className="text-mediumTeal text-sm font-medium">Carregando FAQs...</p>
                </div>
              ) : faqs.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-primary/40 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-sm font-medium text-darkTeal mb-1">Nenhuma FAQ encontrada</h3>
                  <p className="text-sm text-mediumTeal">Comece criando sua primeira FAQ.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {faqs.map((faq) => (
                    <div
                      key={faq._id}
                      className="bg-primary/5 rounded-lg border border-primary/20 p-4 hover:shadow-md hover:bg-primary/10 transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <p className="font-semibold text-darkTeal">{faq.question}</p>
                            {!faq.active && (
                              <span className="px-2 py-0.5 text-xs font-medium rounded bg-gray-100 text-gray-700">
                                Inativo
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-mediumTeal mb-2">{faq.answer}</p>
                          <div className="flex items-center gap-4 text-xs text-mediumTeal/70">
                            <span>Ordem: {faq.order || 0}</span>
                            <span>
                              {new Date(faq.createdAt).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setFaqForm({
                                question: faq.question || '',
                                answer: faq.answer || '',
                                order: faq.order || 0,
                                active: faq.active !== false
                              });
                              setFaqModal({ open: true, faq, mode: 'edit' });
                            }}
                            className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => {
                              setDeleteFaqModal({ open: true, faq });
                            }}
                            className="px-3 py-1 bg-red-600 text-white text-xs font-medium rounded-md hover:bg-red-700 transition-colors"
                          >
                            Deletar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Message Modal */}
        {messageModal.open && createPortal(
          <div
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${
              messageModalClosing ? 'opacity-0' : 'opacity-100'
            }`}
            onClick={() => {
              setMessageModalClosing(true);
              setTimeout(() => {
                setMessageModal({ open: false, mode: 'single', editingMessage: null });
                setMessageModalClosing(false);
              }, 300);
            }}
          >
            <div
              className={`bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-all duration-300 ${
                messageModalClosing 
                  ? 'opacity-0 scale-95 translate-y-4' 
                  : 'opacity-100 scale-100 translate-y-0'
              }`}
              onClick={(e) => e.stopPropagation()}
              style={{
                animation: messageModalClosing ? 'none' : 'modalSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-primary/20">
                  <h2 className="text-xl font-semibold text-darkTeal">
                    {messageModal.editingMessage ? 'Editar e Reenviar Mensagem' : 'Nova Mensagem'}
                  </h2>
                  <button
                    onClick={() => {
                      setMessageModalClosing(true);
                      setTimeout(() => {
                        setMessageModal({ open: false, mode: 'single', editingMessage: null });
                        setMessageModalClosing(false);
                      }, 300);
                    }}
                    className="text-mediumTeal hover:text-darkTeal transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    const isEditing = messageModal.editingMessage !== null;
                    
                    if (messageForm.sendToAll) {
                      const response = await sendNotificationToAllUsers({
                        title: messageForm.title,
                        message: messageForm.message,
                        type: messageForm.type,
                        link: null
                      });
                      if (response.success) {
                        toast.success(isEditing ? `Mensagem editada e reenviada para ${response.count} usuário(s)!` : `Mensagem enviada para ${response.count} usuário(s)!`);
                        setMessageModalClosing(true);
                        setTimeout(() => {
                          setMessageModal({ open: false, mode: 'single', editingMessage: null });
                          setMessageModalClosing(false);
                        }, 300);
                        setMessageForm({
                          userId: '',
                          sendToAll: false,
                          title: '',
                          message: '',
                          type: 'info',
                          link: ''
                        });
                        fetchMessages();
                      }
                    } else {
                      if (!messageForm.userId) {
                        toast.error('Selecione um usuário ou marque "Enviar para todos".');
                        return;
                      }
                      if (isEditing && messageModal.editingMessage) {
                        // Update existing message instead of creating new one
                        const response = await updateNotificationAdmin(messageModal.editingMessage._id, {
                          title: messageForm.title,
                          message: messageForm.message,
                          type: messageForm.type,
                          link: null
                        });
                        if (response.success) {
                          toast.success('Mensagem editada e reenviada com sucesso!');
                          setMessageModalClosing(true);
                          setTimeout(() => {
                            setMessageModal({ open: false, mode: 'single', editingMessage: null });
                            setMessageModalClosing(false);
                          }, 300);
                          setMessageForm({
                            userId: '',
                            sendToAll: false,
                            title: '',
                            message: '',
                            type: 'info',
                            link: ''
                          });
                          fetchMessages();
                        }
                      } else {
                        // Create new message
                        const response = await createNotificationAdmin({
                          userId: messageForm.userId,
                          title: messageForm.title,
                          message: messageForm.message,
                          type: messageForm.type,
                          link: null
                        });
                        if (response.success) {
                          toast.success('Mensagem enviada com sucesso!');
                          setMessageModalClosing(true);
                          setTimeout(() => {
                            setMessageModal({ open: false, mode: 'single', editingMessage: null });
                            setMessageModalClosing(false);
                          }, 300);
                          setMessageForm({
                            userId: '',
                            sendToAll: false,
                            title: '',
                            message: '',
                            type: 'info',
                            link: ''
                          });
                          fetchMessages();
                        }
                      }
                    }
                  } catch (err) {
                    toast.error(err.response?.data?.message || 'Erro ao enviar mensagem.');
                  }
                }} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="sendToAll"
                      checked={messageForm.sendToAll}
                      onChange={(e) => setMessageForm({ ...messageForm, sendToAll: e.target.checked, userId: '' })}
                      className="w-4 h-4 text-primary border-primary/30 rounded focus:ring-primary"
                      disabled={messageModal.editingMessage !== null}
                    />
                    <label htmlFor="sendToAll" className={`text-sm font-medium ${messageModal.editingMessage ? 'text-mediumTeal' : 'text-darkTeal'}`}>
                      Enviar para todos os usuários
                      {messageModal.editingMessage && (
                        <span className="text-xs text-mediumTeal ml-1">(não disponível ao editar)</span>
                      )}
                    </label>
                  </div>
                  {!messageForm.sendToAll && (
                    <div>
                      <label className="block text-sm font-medium text-darkTeal mb-1">
                        Usuário *
                      </label>
                      <ElegantSelect
                        label=""
                        value={messageForm.userId}
                        onChange={(userId) => setMessageForm({ ...messageForm, userId })}
                        placeholder="Selecione um usuário"
                        options={[
                          { value: '', label: 'Selecione um usuário' },
                          ...users.map((user) => ({
                            value: user._id,
                            label: `${user.name} (${user.email})`
                          }))
                        ]}
                        required={!messageForm.sendToAll}
                        disabled={messageModal.editingMessage !== null}
                        className="w-full"
                      />
                      {messageModal.editingMessage && (
                        <p className="text-xs text-mediumTeal mt-1">
                          O destinatário não pode ser alterado ao editar uma mensagem.
                        </p>
                      )}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-darkTeal mb-1">
                      Título *
                    </label>
                    <input
                      type="text"
                      value={messageForm.title}
                      onChange={(e) => setMessageForm({ ...messageForm, title: e.target.value })}
                      className="w-full rounded-md border border-primary/30 bg-white px-3 py-2 text-sm text-darkTeal focus:border-primary focus:ring-1 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-darkTeal mb-1">
                      Mensagem *
                    </label>
                    <textarea
                      value={messageForm.message}
                      onChange={(e) => setMessageForm({ ...messageForm, message: e.target.value })}
                      rows={4}
                      className="w-full rounded-md border border-primary/30 bg-white px-3 py-2 text-sm text-darkTeal focus:border-primary focus:ring-1 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <ElegantSelect
                      label="Tipo"
                      value={messageForm.type}
                      onChange={(type) => setMessageForm({ ...messageForm, type })}
                      options={[
                        { value: 'info', label: 'Info' },
                        { value: 'success', label: 'Sucesso' },
                        { value: 'warning', label: 'Aviso' },
                        { value: 'error', label: 'Erro' }
                      ]}
                      className="w-full"
                    />
                  </div>
                  <div className="flex gap-3 justify-end pt-4 border-t border-primary/20">
                    <button
                      type="button"
                      onClick={() => {
                        setMessageModalClosing(true);
                        setTimeout(() => {
                          setMessageModal({ open: false, mode: 'single' });
                          setMessageModalClosing(false);
                        }, 300);
                      }}
                      className="px-4 py-2 text-sm font-medium text-mediumTeal hover:text-darkTeal transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                    >
                      {messageModal.editingMessage ? 'Reenviar Mensagem' : 'Enviar Mensagem'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>,
          document.body
        )}

        {passwordModal.open && createPortal(
          <div
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 ${
              passwordModalClosing ? 'opacity-0' : 'opacity-100'
            }`}
            style={{
              transition: passwordModalClosing ? 'opacity 0.3s ease-out' : 'none',
              willChange: passwordModalClosing ? 'opacity' : 'auto'
            }}
            onClick={() => {
              setPasswordModalClosing(true);
              setTimeout(() => {
                setPasswordModal({ open: false, userId: null, userName: '' });
                setPasswordModalClosing(false);
                setNewPassword('');
                passwordModalAnimatedRef.current = false;
              }, 300);
            }}
          >
            <div
              className={`bg-white rounded-xl shadow-2xl max-w-md w-full p-6 ${
                passwordModalClosing 
                  ? 'opacity-0 scale-95 translate-y-4' 
                  : 'opacity-100 scale-100 translate-y-0'
              }`}
              onClick={(e) => e.stopPropagation()}
              style={{
                transition: passwordModalClosing ? 'opacity 0.3s ease-out, transform 0.3s ease-out' : 'none',
                animation: passwordModalClosing || passwordModalAnimatedRef.current ? 'none' : 'modalSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                animationFillMode: 'forwards',
                willChange: passwordModalClosing ? 'opacity, transform' : 'auto',
                contain: 'layout style paint'
              }}
              onAnimationEnd={() => {
                passwordModalAnimatedRef.current = true;
              }}
            >
              <h2 className="text-xl font-semibold text-darkTeal mb-4">Alterar Senha</h2>
              <p className="text-sm text-mediumTeal mb-4">
                Alterar senha para: <strong>{passwordModal.userName}</strong>
              </p>
              <form onSubmit={async (e) => {
                e.preventDefault();
                try {
                  if (!newPassword || newPassword.length < 6) {
                    toast.error('A senha deve ter no mínimo 6 caracteres.');
                    return;
                  }
                  const response = await updateUserPasswordAdmin(passwordModal.userId, newPassword);
                  if (response.success) {
                    toast.success('Senha alterada com sucesso!');
                    // Store the password that was set so admin can see it
                    setPasswordModal(prev => ({ ...prev, lastSetPassword: newPassword }));
                    setPasswordSetSuccess(true);
                    setShowPassword(true); // Show the password
                    // Don't close modal immediately - let admin see the password
                  }
                } catch (err) {
                  toast.error(err.response?.data?.message || 'Erro ao alterar senha.');
                }
              }}>
                {passwordSetSuccess ? (
                  <div className="mb-4">
                    <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm font-medium text-green-800">Senha alterada com sucesso!</p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-darkTeal mb-2">
                        Senha Definida
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={passwordModal.lastSetPassword}
                          readOnly
                          className="w-full rounded-md border border-primary/30 bg-green-50 px-3 py-2 pr-10 text-sm text-darkTeal font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-mediumTeal hover:text-darkTeal transition-colors"
                          title={showPassword ? "Ocultar senha" : "Mostrar senha"}
                        >
                          {showPassword ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-mediumTeal/70 mt-1">Esta é a senha que foi definida para o usuário</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-darkTeal mb-2">
                        Senha Atual
                      </label>
                      <input
                        type="text"
                        value="••••••••"
                        disabled
                        className="w-full rounded-md border border-primary/30 bg-gray-50 px-3 py-2 text-sm text-mediumTeal cursor-not-allowed"
                        placeholder="Senha atual (oculta por segurança)"
                      />
                      <p className="text-xs text-mediumTeal/70 mt-1">A senha atual não pode ser exibida por motivos de segurança</p>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-darkTeal mb-2">
                        Nova Senha
                      </label>
                      <div className="relative" style={{ isolation: 'isolate' }}>
                        <input
                          type={showPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full rounded-md border border-primary/30 bg-white px-3 py-2 pr-10 text-sm text-darkTeal focus:border-primary focus:ring-1 focus:ring-primary"
                          placeholder="Digite a nova senha (mínimo 6 caracteres)"
                          required
                          minLength={6}
                        />
                        <div 
                          style={{ 
                            position: 'absolute',
                            right: '0.5rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            isolation: 'isolate',
                            contain: 'layout style paint'
                          }}
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowPassword(!showPassword);
                            }}
                            className="p-1 text-mediumTeal cursor-pointer"
                            style={{ 
                              display: 'block',
                              background: 'transparent',
                              border: 'none',
                              outline: 'none'
                            }}
                            title={showPassword ? "Ocultar senha" : "Mostrar senha"}
                          >
                            {showPassword ? (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ display: 'block', pointerEvents: 'none' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ display: 'block', pointerEvents: 'none' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                <div className="flex gap-3 justify-end pt-4 border-t border-primary/20">
                  {passwordSetSuccess ? (
                    <button
                      type="button"
                      onClick={() => {
                        setPasswordModalClosing(true);
                        setTimeout(() => {
                          setPasswordModal({ open: false, userId: null, userName: '', lastSetPassword: '' });
                          setPasswordModalClosing(false);
                          setNewPassword('');
                          setShowPassword(false);
                          setPasswordSetSuccess(false);
                        }, 300);
                      }}
                      className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                    >
                      Fechar
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setPasswordModalClosing(true);
                          setTimeout(() => {
                            setPasswordModal({ open: false, userId: null, userName: '', lastSetPassword: '' });
                            setPasswordModalClosing(false);
                            setNewPassword('');
                            setShowPassword(false);
                            setPasswordSetSuccess(false);
                          }, 300);
                        }}
                        className="px-4 py-2 text-sm font-medium text-mediumTeal hover:text-darkTeal transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                      >
                        Alterar Senha
                      </button>
                    </>
                  )}
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

        {selectedOrder && createPortal(
          <div
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${
              orderModalClosing ? 'opacity-0' : 'opacity-100'
            }`}
            onClick={() => {
              setOrderModalClosing(true);
              setTimeout(() => {
                setSelectedOrder(null);
                setOrderModalClosing(false);
              }, 300);
            }}
          >
            <div
              className={`bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto transition-all duration-300 ${
                orderModalClosing 
                  ? 'opacity-0 scale-95 translate-y-4' 
                  : 'opacity-100 scale-100 translate-y-0'
              }`}
              onClick={(e) => e.stopPropagation()}
              style={{
                animation: orderModalClosing ? 'none' : 'modalSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-primary/20">
                  <h2 className="text-xl font-semibold text-darkTeal">
                    Detalhes do Pedido #{selectedOrder._id.slice(-8).toUpperCase()}
                  </h2>
                  <button
                    onClick={() => {
                      setOrderModalClosing(true);
                      setTimeout(() => {
                        setSelectedOrder(null);
                        setOrderModalClosing(false);
                      }, 300);
                    }}
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
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${
              productModalClosing ? 'opacity-0' : 'opacity-100'
            }`}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                handleCloseProductModal();
              }
            }}
          >
            <div
              className={`bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto transition-all duration-300 ${
                productModalClosing 
                  ? 'opacity-0 scale-95 translate-y-4' 
                  : 'opacity-100 scale-100 translate-y-0'
              }`}
              onClick={(e) => e.stopPropagation()}
              style={{
                animation: productModalClosing ? 'none' : 'modalSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
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
                      <ElegantSelect
                        label="Categoria *"
                        value={productForm.category}
                        onChange={(category) => setProductForm({ ...productForm, category })}
                        options={[
                          { value: 'gummy', label: 'Gummy' },
                          { value: 'oleo', label: 'Óleo' },
                          { value: 'creme', label: 'Creme' }
                        ]}
                        required
                        className="w-full"
                      />
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
                            <label className="px-3 py-2 bg-yellow-600 text-white text-sm rounded-md hover:bg-yellow-700 transition-colors cursor-pointer">
                              <input
                                type="file"
                                className="hidden"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                multiple={false}
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
                                  const maxSize = 5 * 1024 * 1024;
                                  if (!allowedTypes.includes(file.type)) {
                                    toast.error('Tipo de arquivo não permitido. Use JPG, PNG ou WEBP.');
                                    return;
                                  }
                                  if (file.size > maxSize) {
                                    toast.error('Tamanho máximo é 5MB.');
                                    return;
                                  }
                                  try {
                                    setUploadingImages(true);
                                    const response = await uploadProductImages([file]);
                                    if (response.success && response.images && response.images.length > 0) {
                                      const newImages = [...productForm.images];
                                      newImages[index] = response.images[0];
                                      setProductForm({ ...productForm, images: newImages });
                                      toast.success('Imagem atualizada com sucesso!');
                                    }
                                  } catch (err) {
                                    toast.error(err.response?.data?.message || 'Erro ao enviar imagem.');
                                  } finally {
                                    setUploadingImages(false);
                                    e.target.value = '';
                                  }
                                }}
                                disabled={uploadingImages}
                              />
                              Atualizar
                            </label>
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

        {/* Blog Create/Edit Modal */}
        {blogModal.open && createPortal(
          <div
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${
              blogModalClosing ? 'opacity-0' : 'opacity-100'
            }`}
            onClick={() => {
              setBlogModalClosing(true);
              setTimeout(() => {
                setBlogModal({ open: false, blog: null, mode: 'create' });
                setBlogModalClosing(false);
              }, 300);
            }}
          >
            <div
              className={`bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transition-all duration-300 ${
                blogModalClosing 
                  ? 'opacity-0 scale-95 translate-y-4' 
                  : 'opacity-100 scale-100 translate-y-0'
              }`}
              onClick={(e) => e.stopPropagation()}
              style={{
                animation: blogModalClosing ? 'none' : 'modalSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-primary/20">
                  <h2 className="text-2xl font-semibold text-darkTeal">
                    {blogModal.mode === 'create' ? 'Novo Artigo' : 'Editar Artigo'}
                  </h2>
                  <button
                    onClick={() => {
                      setBlogModalClosing(true);
                      setTimeout(() => {
                        setBlogModal({ open: false, blog: null, mode: 'create' });
                        setBlogModalClosing(false);
                      }, 300);
                    }}
                    className="text-mediumTeal hover:text-darkTeal transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  // Convert tags input to array before submitting
                  const tagsArray = blogTagsInput ? blogTagsInput.split(',').map(t => t.trim()).filter(t => t) : [];
                  const formData = {
                    ...blogForm,
                    tags: tagsArray
                  };
                  
                  try {
                    if (blogModal.mode === 'create') {
                      const response = await createBlog(formData);
                      if (response.success) {
                        toast.success('Artigo criado com sucesso!');
                        setBlogModalClosing(true);
                        setTimeout(() => {
                          setBlogModal({ open: false, blog: null, mode: 'create' });
                          setBlogModalClosing(false);
                          setBlogForm({
                            title: '',
                            contentMarkdown: '',
                            excerpt: '',
                            imageUrl: '',
                            tags: [],
                            published: false
                          });
                          setBlogTagsInput('');
                          fetchBlogs();
                        }, 300);
                      }
                    } else {
                      const response = await updateBlog(blogModal.blog._id, formData);
                      if (response.success) {
                        toast.success('Artigo atualizado com sucesso!');
                        setBlogModalClosing(true);
                        setTimeout(() => {
                          setBlogModal({ open: false, blog: null, mode: 'create' });
                          setBlogModalClosing(false);
                          fetchBlogs();
                        }, 300);
                      }
                    }
                  } catch (err) {
                    toast.error(err.response?.data?.message || 'Erro ao salvar artigo.');
                  }
                }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-darkTeal mb-2">Título *</label>
                    <input
                      type="text"
                      value={blogForm.title}
                      onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                      className="w-full rounded-md border border-primary/30 bg-white px-3 py-2 text-sm text-darkTeal focus:border-primary focus:ring-1 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-darkTeal mb-2">Conteúdo (Markdown) *</label>
                    <textarea
                      value={blogForm.contentMarkdown}
                      onChange={(e) => setBlogForm({ ...blogForm, contentMarkdown: e.target.value })}
                      className="w-full rounded-md border border-primary/30 bg-white px-3 py-2 text-sm text-darkTeal focus:border-primary focus:ring-1 focus:ring-primary"
                      rows={12}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-darkTeal mb-2">Resumo (máx. 300 caracteres)</label>
                    <textarea
                      value={blogForm.excerpt}
                      onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                      className="w-full rounded-md border border-primary/30 bg-white px-3 py-2 text-sm text-darkTeal focus:border-primary focus:ring-1 focus:ring-primary"
                      rows={3}
                      maxLength={300}
                    />
                    <p className="text-xs text-mediumTeal mt-1">{blogForm.excerpt.length}/300 caracteres</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-darkTeal mb-2">URL da Imagem</label>
                    <div className="space-y-2">
                      <div className="flex gap-3 items-start">
                        {blogForm.imageUrl && (
                          <div className="w-32 h-32 rounded-md overflow-hidden border border-primary/20 flex-shrink-0">
                            <img
                              src={blogForm.imageUrl}
                              alt="Preview"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/128?text=Erro';
                              }}
                            />
                          </div>
                        )}
                        <input
                          type="url"
                          value={blogForm.imageUrl}
                          onChange={(e) => setBlogForm({ ...blogForm, imageUrl: e.target.value })}
                          className="flex-1 rounded-md border border-primary/30 bg-white px-3 py-2 text-sm text-darkTeal focus:border-primary focus:ring-1 focus:ring-primary"
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-primary/30 rounded-lg cursor-pointer bg-primary/5 hover:bg-primary/10 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-8 h-8 mb-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="mb-2 text-sm text-darkTeal">
                            <span className="font-semibold">Clique para fazer upload</span> ou arraste e solte
                          </p>
                          <p className="text-xs text-mediumTeal">JPG, PNG ou WEBP (máx. 5MB)</p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
                            const maxSize = 5 * 1024 * 1024;
                            if (!allowedTypes.includes(file.type)) {
                              toast.error('Tipo de arquivo não permitido. Use JPG, PNG ou WEBP.');
                              return;
                            }
                            if (file.size > maxSize) {
                              toast.error('Tamanho máximo é 5MB.');
                              return;
                            }
                            try {
                              const response = await uploadProductImages([file]);
                              if (response.success && response.images && response.images.length > 0) {
                                setBlogForm({ ...blogForm, imageUrl: response.images[0] });
                                toast.success('Imagem enviada com sucesso!');
                              }
                            } catch (err) {
                              toast.error(err.response?.data?.message || 'Erro ao enviar imagem.');
                            } finally {
                              e.target.value = '';
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-darkTeal mb-2">Tags (separadas por vírgula)</label>
                    <input
                      type="text"
                      value={blogTagsInput}
                      onChange={(e) => {
                        // Store raw input value to allow comma typing
                        setBlogTagsInput(e.target.value);
                      }}
                      onBlur={(e) => {
                        // Convert to array only when user leaves the field
                        const value = e.target.value;
                        const tagsArray = value ? value.split(',').map(t => t.trim()).filter(t => t) : [];
                        setBlogForm({ 
                          ...blogForm, 
                          tags: tagsArray
                        });
                      }}
                      className="w-full rounded-md border border-primary/30 bg-white px-3 py-2 text-sm text-darkTeal focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="cannabis, CBD, saúde, bem-estar"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="published"
                      checked={blogForm.published}
                      onChange={(e) => setBlogForm({ ...blogForm, published: e.target.checked })}
                      className="w-4 h-4 text-primary border-primary/30 rounded focus:ring-primary"
                    />
                    <label htmlFor="published" className="text-sm font-medium text-darkTeal">
                      Publicar artigo
                    </label>
                  </div>
                  <div className="flex gap-3 justify-end pt-4 border-t border-primary/20">
                    <button
                      type="button"
                      onClick={() => {
                        setBlogModalClosing(true);
                        setTimeout(() => {
                          setBlogModal({ open: false, blog: null, mode: 'create' });
                          setBlogModalClosing(false);
                        }, 300);
                      }}
                      className="px-4 py-2 text-sm font-medium text-mediumTeal hover:text-darkTeal transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                    >
                      {blogModal.mode === 'create' ? 'Criar Artigo' : 'Salvar Alterações'}
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
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${
              deleteProductModalClosing ? 'opacity-0' : 'opacity-100'
            }`}
            onClick={() => {
              setDeleteProductModalClosing(true);
              setTimeout(() => {
                setDeleteProductModal({ open: false, product: null });
                setDeleteProductModalClosing(false);
              }, 300);
            }}
          >
            <div
              className={`bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transition-all duration-300 ${
                deleteProductModalClosing 
                  ? 'opacity-0 scale-95 translate-y-4' 
                  : 'opacity-100 scale-100 translate-y-0'
              }`}
              onClick={(e) => e.stopPropagation()}
              style={{
                animation: deleteProductModalClosing ? 'none' : 'modalSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
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
              <div className="flex gap-3 justify-end px-6">
                <button
                  onClick={() => {
                    setDeleteProductModalClosing(true);
                    setTimeout(() => {
                      setDeleteProductModal({ open: false, product: null });
                      setDeleteProductModalClosing(false);
                    }, 300);
                  }}
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
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${
              deleteModalClosing ? 'opacity-0' : 'opacity-100'
            }`}
            onClick={() => {
              setDeleteModalClosing(true);
              setTimeout(() => {
                setDeleteModal({ open: false, user: null });
                setDeleteModalClosing(false);
              }, 300);
            }}
          >
            <div
              className={`bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transition-all duration-300 ${
                deleteModalClosing 
                  ? 'opacity-0 scale-95 translate-y-4' 
                  : 'opacity-100 scale-100 translate-y-0'
              }`}
              onClick={(e) => e.stopPropagation()}
              style={{
                animation: deleteModalClosing ? 'none' : 'modalSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
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
                  onClick={() => {
                    setDeleteModalClosing(true);
                    setTimeout(() => {
                      setDeleteModal({ open: false, user: null });
                      setDeleteModalClosing(false);
                    }, 300);
                  }}
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

        {/* Delete Blog Modal */}
        {deleteBlogModal.open && createPortal(
          <div
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${
              deleteBlogModalClosing ? 'opacity-0' : 'opacity-100'
            }`}
            onClick={() => {
              setDeleteBlogModalClosing(true);
              setTimeout(() => {
                setDeleteBlogModal({ open: false, blog: null });
                setDeleteBlogModalClosing(false);
              }, 300);
            }}
          >
            <div
              className={`bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transition-all duration-300 ${
                deleteBlogModalClosing 
                  ? 'opacity-0 scale-95 translate-y-4' 
                  : 'opacity-100 scale-100 translate-y-0'
              }`}
              onClick={(e) => e.stopPropagation()}
              style={{
                animation: deleteBlogModalClosing ? 'none' : 'modalSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
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
                Tem certeza que deseja deletar o artigo <strong className="text-darkTeal">"{deleteBlogModal.blog?.title}"</strong>?
                <br />
                <br />
                Esta ação não pode ser desfeita.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setDeleteBlogModalClosing(true);
                    setTimeout(() => {
                      setDeleteBlogModal({ open: false, blog: null });
                      setDeleteBlogModalClosing(false);
                    }, 300);
                  }}
                  className="px-4 py-2 text-sm font-medium text-mediumTeal hover:text-darkTeal transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDeleteBlog}
                  className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Deletar
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

        {/* Delete Feedback Modal */}
        {deleteFeedbackModal.open && createPortal(
          <div
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${
              deleteFeedbackModalClosing ? 'opacity-0' : 'opacity-100'
            }`}
            onClick={() => {
              setDeleteFeedbackModalClosing(true);
              setTimeout(() => {
                setDeleteFeedbackModal({ open: false, feedback: null });
                setDeleteFeedbackModalClosing(false);
              }, 300);
            }}
          >
            <div
              className={`bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transition-all duration-300 ${
                deleteFeedbackModalClosing 
                  ? 'opacity-0 scale-95 translate-y-4' 
                  : 'opacity-100 scale-100 translate-y-0'
              }`}
              onClick={(e) => e.stopPropagation()}
              style={{
                animation: deleteFeedbackModalClosing ? 'none' : 'modalSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
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
                Tem certeza que deseja deletar este feedback?
                <br />
                <br />
                Esta ação não pode ser desfeita.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setDeleteFeedbackModalClosing(true);
                    setTimeout(() => {
                      setDeleteFeedbackModal({ open: false, feedback: null });
                      setDeleteFeedbackModalClosing(false);
                    }, 300);
                  }}
                  className="px-4 py-2 text-sm font-medium text-mediumTeal hover:text-darkTeal transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDeleteFeedback}
                  className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Deletar
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

        {/* FAQ Modal */}
        {faqModal.open && createPortal(
          <div
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${
              faqModalClosing ? 'opacity-0' : 'opacity-100'
            }`}
            onClick={() => {
              setFaqModalClosing(true);
              setTimeout(() => {
                setFaqModal({ open: false, faq: null, mode: 'create' });
                setFaqModalClosing(false);
                setFaqForm({ question: '', answer: '', order: 0, active: true });
              }, 300);
            }}
          >
            <div
              className={`bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-all duration-300 ${
                faqModalClosing 
                  ? 'opacity-0 scale-95 translate-y-4' 
                  : 'opacity-100 scale-100 translate-y-0'
              }`}
              onClick={(e) => e.stopPropagation()}
              style={{
                animation: faqModalClosing ? 'none' : 'modalSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-primary/20">
                  <h2 className="text-xl font-semibold text-darkTeal">
                    {faqModal.mode === 'edit' ? 'Editar FAQ' : 'Nova FAQ'}
                  </h2>
                  <button
                    onClick={() => {
                      setFaqModalClosing(true);
                      setTimeout(() => {
                        setFaqModal({ open: false, faq: null, mode: 'create' });
                        setFaqModalClosing(false);
                        setFaqForm({ question: '', answer: '', order: 0, active: true });
                      }, 300);
                    }}
                    className="text-mediumTeal hover:text-darkTeal transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <form onSubmit={faqModal.mode === 'edit' ? handleUpdateFaq : handleCreateFaq} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-darkTeal mb-1">
                      Pergunta *
                    </label>
                    <input
                      type="text"
                      value={faqForm.question}
                      onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                      className="w-full rounded-md border border-primary/30 bg-white px-3 py-2 text-sm text-darkTeal focus:border-primary focus:ring-1 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-darkTeal mb-1">
                      Resposta *
                    </label>
                    <textarea
                      value={faqForm.answer}
                      onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                      rows={6}
                      className="w-full rounded-md border border-primary/30 bg-white px-3 py-2 text-sm text-darkTeal focus:border-primary focus:ring-1 focus:ring-primary"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-darkTeal mb-1">
                        Ordem
                      </label>
                      <input
                        type="number"
                        value={faqForm.order}
                        onChange={(e) => setFaqForm({ ...faqForm, order: parseInt(e.target.value) || 0 })}
                        className="w-full rounded-md border border-primary/30 bg-white px-3 py-2 text-sm text-darkTeal focus:border-primary focus:ring-1 focus:ring-primary"
                        min="0"
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-8">
                      <input
                        type="checkbox"
                        id="faqActive"
                        checked={faqForm.active}
                        onChange={(e) => setFaqForm({ ...faqForm, active: e.target.checked })}
                        className="w-4 h-4 text-primary border-primary/30 rounded focus:ring-primary"
                      />
                      <label htmlFor="faqActive" className="text-sm font-medium text-darkTeal">
                        Ativo
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end pt-4 border-t border-primary/20">
                    <button
                      type="button"
                      onClick={() => {
                        setFaqModalClosing(true);
                        setTimeout(() => {
                          setFaqModal({ open: false, faq: null, mode: 'create' });
                          setFaqModalClosing(false);
                          setFaqForm({ question: '', answer: '', order: 0, active: true });
                        }, 300);
                      }}
                      className="px-4 py-2 text-sm font-medium text-mediumTeal hover:text-darkTeal transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                    >
                      {faqModal.mode === 'edit' ? 'Salvar Alterações' : 'Criar FAQ'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>,
          document.body
        )}

        {/* Delete FAQ Modal */}
        {deleteFaqModal.open && createPortal(
          <div
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${
              deleteFaqModalClosing ? 'opacity-0' : 'opacity-100'
            }`}
            onClick={() => {
              setDeleteFaqModalClosing(true);
              setTimeout(() => {
                setDeleteFaqModal({ open: false, faq: null });
                setDeleteFaqModalClosing(false);
              }, 300);
            }}
          >
            <div
              className={`bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transition-all duration-300 ${
                deleteFaqModalClosing 
                  ? 'opacity-0 scale-95 translate-y-4' 
                  : 'opacity-100 scale-100 translate-y-0'
              }`}
              onClick={(e) => e.stopPropagation()}
              style={{
                animation: deleteFaqModalClosing ? 'none' : 'modalSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
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
                Tem certeza que deseja deletar a FAQ <strong className="text-darkTeal">"{deleteFaqModal.faq?.question}"</strong>?
                <br />
                <br />
                Esta ação não pode ser desfeita.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setDeleteFaqModalClosing(true);
                    setTimeout(() => {
                      setDeleteFaqModal({ open: false, faq: null });
                      setDeleteFaqModalClosing(false);
                    }, 300);
                  }}
                  className="px-4 py-2 text-sm font-medium text-mediumTeal hover:text-darkTeal transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDeleteFaq}
                  className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Deletar
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

        {/* Delete Message Modal */}
        {deleteMessageModal.open && createPortal(
          <div
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${
              deleteMessageModalClosing ? 'opacity-0' : 'opacity-100'
            }`}
            onClick={() => {
              setDeleteMessageModalClosing(true);
              setTimeout(() => {
                setDeleteMessageModal({ open: false, message: null });
                setDeleteMessageModalClosing(false);
              }, 300);
            }}
          >
            <div
              className={`bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transition-all duration-300 ${
                deleteMessageModalClosing 
                  ? 'opacity-0 scale-95 translate-y-4' 
                  : 'opacity-100 scale-100 translate-y-0'
              }`}
              onClick={(e) => e.stopPropagation()}
              style={{
                animation: deleteMessageModalClosing ? 'none' : 'modalSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
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
                Tem certeza que deseja deletar a mensagem <strong className="text-darkTeal">"{deleteMessageModal.message?.title || 'esta mensagem'}"</strong>?
                <br />
                <br />
                Esta ação não pode ser desfeita. A mensagem será removida apenas do banco de dados e não afetará os usuários que já a receberam.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setDeleteMessageModalClosing(true);
                    setTimeout(() => {
                      setDeleteMessageModal({ open: false, message: null });
                      setDeleteMessageModalClosing(false);
                    }, 300);
                  }}
                  className="px-4 py-2 text-sm font-medium text-mediumTeal hover:text-darkTeal transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDeleteMessage}
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
