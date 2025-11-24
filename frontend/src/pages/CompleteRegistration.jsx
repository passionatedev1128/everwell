import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { completeRegistration, verifyEmail } from '../utils/api';
import { setToken, setUser } from '../utils/auth';
import { trackSignUp } from '../utils/analytics';
import { identifyContact } from '../utils/hubspot';
import { trackSignUp as gtmTrackSignUp } from '../utils/gtm';
import { uploadUserPhoto } from '../utils/api';

const CompleteRegistration = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const photoInputRef = useRef(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    if (token) {
      checkToken();
    } else {
      setLoading(false);
      toast.error('Token de verificação não fornecido.');
    }
  }, [token]);

  const checkToken = async () => {
    try {
      setVerifying(true);
      const response = await verifyEmail(token);
      if (response.success && response.pending) {
        setTokenValid(true);
      } else {
        toast.error('Token inválido ou expirado.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao verificar token.');
    } finally {
      setLoading(false);
      setVerifying(false);
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      toast.error('Tipo de arquivo não permitido. Use JPG, PNG ou WEBP.');
      return;
    }

    if (file.size > maxSize) {
      toast.error('Arquivo muito grande. Tamanho máximo é 5MB.');
      return;
    }

    setPhotoFile(file);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      let photoUrl = null;
      
      // Upload photo if provided
      if (photoFile) {
        try {
          setUploadingPhoto(true);
          const photoResponse = await uploadUserPhoto(photoFile);
          if (photoResponse.success) {
            photoUrl = photoResponse.photoUrl;
          }
        } catch (err) {
          console.error('Error uploading photo:', err);
        } finally {
          setUploadingPhoto(false);
        }
      }

      const requestData = {
        password: data.password,
        phone: data.phone || undefined,
        gender: data.gender || undefined,
        dateOfBirth: data.dateOfBirth || undefined,
        photo: photoUrl || undefined,
        address: data.street ? {
          street: data.street,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country || 'Brasil'
        } : undefined
      };
      
      const response = await completeRegistration(token, requestData);

      if (response.success) {
        setToken(response.token);
        setUser(response.user);
        identifyContact(response.user);
        trackSignUp('email');
        gtmTrackSignUp('email');
        toast.success('Cadastro completado com sucesso!');
        navigate('/');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erro ao completar cadastro. Tente novamente.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading || verifying) {
    return (
      <div className="min-h-screen bg-bgSecondary flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-mediumTeal">{verifying ? 'Verificando token...' : 'Carregando...'}</p>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-bgSecondary flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-darkTeal mb-4">Token Inválido</h2>
          <p className="text-mediumTeal mb-6">
            O token de verificação é inválido ou expirado. Por favor, solicite um novo link de verificação.
          </p>
          <Link to="/login" className="btn-primary">
            Ir para Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-accent flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <h2 className="text-3xl font-bold text-center text-text-dark mb-2">
            Complete seu Cadastro
          </h2>
          <p className="text-center text-mediumTeal text-sm mb-6">
            Preencha as informações abaixo para finalizar seu cadastro
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Password Section */}
            <div className="border-b border-gray-200 pb-4 mb-4">
              <h3 className="text-lg font-semibold text-darkTeal mb-4">Informações de Acesso</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Senha *
                </label>
                <input
                  type="password"
                  {...register('password', { 
                    required: 'Senha é obrigatória',
                    minLength: {
                      value: 6,
                      message: 'Senha deve ter no mínimo 6 caracteres'
                    }
                  })}
                  className="input-field"
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>
            </div>

            {/* Personal Information Section */}
            <div className="border-b border-gray-200 pb-4 mb-4">
              <h3 className="text-lg font-semibold text-darkTeal mb-4">Informações Pessoais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gênero
                  </label>
                  <select
                    {...register('gender')}
                    className="input-field"
                  >
                    <option value="">Selecione</option>
                    <option value="male">Masculino</option>
                    <option value="female">Feminino</option>
                    <option value="other">Outro</option>
                    <option value="prefer_not_to_say">Prefiro não informar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Nascimento
                  </label>
                  <input
                    type="date"
                    {...register('dateOfBirth')}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    {...register('phone')}
                    className="input-field"
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Foto de Perfil
                  </label>
                  <div className="flex items-center gap-4">
                    {photoPreview && (
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/20">
                        <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <label className="flex-1 cursor-pointer">
                      <input
                        ref={photoInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                      <div className="px-4 py-2 border-2 border-dashed border-primary/30 rounded-lg text-center hover:border-primary transition-colors">
                        <span className="text-sm text-mediumTeal">
                          {photoFile ? photoFile.name : 'Clique para fazer upload da foto'}
                        </span>
                      </div>
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG ou WEBP (máx. 5MB)</p>
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="border-b border-gray-200 pb-4 mb-4">
              <h3 className="text-lg font-semibold text-darkTeal mb-4">Endereço (Opcional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rua/Logradouro
                  </label>
                  <input
                    type="text"
                    {...register('street')}
                    className="input-field"
                    placeholder="Rua, Avenida, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cidade
                  </label>
                  <input
                    type="text"
                    {...register('city')}
                    className="input-field"
                    placeholder="Cidade"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <input
                    type="text"
                    {...register('state')}
                    className="input-field"
                    placeholder="Estado"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CEP
                  </label>
                  <input
                    type="text"
                    {...register('zipCode')}
                    className="input-field"
                    placeholder="00000-000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    País
                  </label>
                  <input
                    type="text"
                    {...register('country')}
                    className="input-field"
                    defaultValue="Brasil"
                    placeholder="País"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || uploadingPhoto}
              className="w-full btn-primary disabled:opacity-50"
            >
              {loading || uploadingPhoto ? 'Processando...' : 'Completar Cadastro'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-primary hover:underline">
              Já tem uma conta? Faça login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteRegistration;

