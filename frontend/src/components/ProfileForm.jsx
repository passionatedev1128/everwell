import { useState, useEffect, useRef } from 'react';
import { updateProfile, uploadUserPhoto } from '../utils/api';
import { toast } from 'react-hot-toast';

const ProfileForm = ({ user, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Brasil'
    }
  });
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          zipCode: user.address?.zipCode || '',
          country: user.address?.country || 'Brasil'
        }
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [addressField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await updateProfile(formData);
      if (response.success) {
        setSuccess('Perfil atualizado com sucesso!');
        if (onUpdateSuccess) {
          onUpdateSuccess();
        }
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao atualizar perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      toast.error('Tipo de arquivo não permitido. Use JPG, PNG ou WEBP.');
      return;
    }
    if (file.size > maxSize) {
      toast.error('Tamanho máximo é 5MB.');
      return;
    }

    try {
      setUploadingAvatar(true);
      const response = await uploadUserPhoto(file);
      if (response.success) {
        toast.success('Foto atualizada com sucesso!');
        if (onUpdateSuccess) {
          onUpdateSuccess();
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao atualizar foto.');
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-darkTeal mb-6 font-heading">Perfil</h2>
      
      {!user ? (
        <p className="text-mediumTeal">Carregando...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Section */}
          <div className="border-b pb-6">
            <label className="form-label block mb-4">Foto de Perfil</label>
            <div className="flex items-center gap-6">
              <div className="relative">
                {user.photo ? (
                  <img
                    src={user.photo}
                    alt={user.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-semibold border-4 border-primary/20">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
                {uploadingAvatar && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleAvatarChange}
                  disabled={uploadingAvatar}
                  className="hidden"
                  id="avatar-upload"
                />
                <label
                  htmlFor="avatar-upload"
                  className={`inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90 transition-colors cursor-pointer ${
                    uploadingAvatar ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {uploadingAvatar ? 'Enviando...' : 'Alterar Foto'}
                </label>
                <p className="text-xs text-mediumTeal mt-2">
                  Formatos aceitos: JPG, PNG, WEBP. Tamanho máximo: 5MB.
                </p>
              </div>
            </div>
          </div>
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-md text-green-700">
              {success}
            </div>
          )}

          <div>
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              value={user.email}
              disabled
              className="form-input bg-gray-100 cursor-not-allowed"
            />
            <p className="text-xs text-lightTeal mt-1">O email não pode ser alterado.</p>
          </div>

          <div>
            <label htmlFor="name" className="form-label">Nome Completo *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div>
            <label htmlFor="phone" className="form-label">Telefone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(00) 00000-0000"
              className="form-input"
            />
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-darkTeal mb-4">Endereço</h3>
            
            <div className="mb-4">
              <label htmlFor="address.street" className="form-label">Rua e Número</label>
              <input
                type="text"
                id="address.street"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
                placeholder="Ex: Rua das Flores, 123"
                className="form-input"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="address.city" className="form-label">Cidade</label>
                <input
                  type="text"
                  id="address.city"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                  placeholder="Ex: São Paulo"
                  className="form-input"
                />
              </div>
              <div>
                <label htmlFor="address.state" className="form-label">Estado</label>
                <input
                  type="text"
                  id="address.state"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleChange}
                  placeholder="Ex: SP"
                  className="form-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="address.zipCode" className="form-label">CEP</label>
                <input
                  type="text"
                  id="address.zipCode"
                  name="address.zipCode"
                  value={formData.address.zipCode}
                  onChange={handleChange}
                  placeholder="00000-000"
                  className="form-input"
                />
              </div>
              <div>
                <label htmlFor="address.country" className="form-label">País</label>
                <input
                  type="text"
                  id="address.country"
                  name="address.country"
                  value={formData.address.country}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <label className="form-label">Status de Autorização</label>
            <p className={user.isAuthorized ? 'text-success font-medium' : 'text-warning font-medium'}>
              {user.isAuthorized ? '✓ Autorizado para comprar' : '⏳ Aguardando autorização'}
            </p>
            {!user.isAuthorized && (
              <p className="text-sm text-mediumTeal mt-2">
                Envie os documentos necessários na aba "Documentos" para ser autorizado.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full md:w-auto"
          >
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ProfileForm;

