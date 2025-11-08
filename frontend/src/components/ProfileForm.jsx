import { useState, useEffect } from 'react';
import { updateProfile } from '../utils/api';

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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  return (
    <div>
      <h2 className="text-2xl font-bold text-darkTeal mb-6 font-heading">Perfil</h2>
      
      {!user ? (
        <p className="text-mediumTeal">Carregando...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
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

