import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'react-hot-toast';
import { createFeedback } from '../utils/api';
import { getUser } from '../utils/auth';

const FeedbackModal = ({ isOpen, onClose }) => {
  const user = getUser();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        message: ''
      });
    }
  }, [isOpen]); // Only depend on isOpen to prevent infinite loops

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating) {
      toast.error('Por favor, selecione uma avaliação com estrelas.');
      return;
    }

    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      const response = await createFeedback({
        ...formData,
        rating,
        userId: user?._id || null
      });

      if (response.success) {
        toast.success('Feedback enviado com sucesso! Obrigado pela sua opinião.');
        setRating(0);
        setFormData({
          name: user?.name || '',
          email: user?.email || '',
          message: ''
        });
        // Dispatch custom event to notify admin panel to refresh feedbacks
        window.dispatchEvent(new CustomEvent('feedbackCreated'));
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao enviar feedback. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setRating(0);
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      message: ''
    });
    onClose();
  };

  const handleCloseWithAnimation = () => {
    setIsClosing(true);
    setTimeout(() => {
      handleClose();
      setIsClosing(false);
    }, 300);
  };

  return createPortal(
    <div
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={handleCloseWithAnimation}
    >
      <div
        className={`bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto transition-all duration-300 ${
          isClosing 
            ? 'opacity-0 scale-95 translate-y-4' 
            : 'opacity-100 scale-100 translate-y-0'
        }`}
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: isClosing ? 'none' : 'modalSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-primary/20">
            <h2 className="text-2xl font-semibold text-darkTeal">Deixe seu Feedback</h2>
            <button
              onClick={handleCloseWithAnimation}
              className="text-mediumTeal hover:text-darkTeal transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-darkTeal mb-2">
                Avaliação *
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <svg
                      className={`w-8 h-8 ${
                        star <= (hoveredRating || rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
                {rating > 0 && (
                  <span className="ml-2 text-sm text-mediumTeal">
                    {rating === 1 && 'Péssimo'}
                    {rating === 2 && 'Ruim'}
                    {rating === 3 && 'Regular'}
                    {rating === 4 && 'Bom'}
                    {rating === 5 && 'Excelente'}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-darkTeal mb-2">
                Nome *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-md border border-primary/30 bg-white px-3 py-2 text-sm text-darkTeal focus:border-primary focus:ring-1 focus:ring-primary"
                required
                disabled={!!user}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-darkTeal mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-md border border-primary/30 bg-white px-3 py-2 text-sm text-darkTeal focus:border-primary focus:ring-1 focus:ring-primary"
                required
                disabled={!!user}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-darkTeal mb-2">
                Mensagem *
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                rows={4}
                className="w-full rounded-md border border-primary/30 bg-white px-3 py-2 text-sm text-darkTeal focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                placeholder="Conte-nos sua opinião sobre o site..."
                required
              />
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-primary/20">
              <button
                type="button"
                onClick={handleCloseWithAnimation}
                className="px-4 py-2 text-sm font-medium text-mediumTeal hover:text-darkTeal transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || !rating}
                className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Enviando...' : 'Enviar Feedback'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default FeedbackModal;

