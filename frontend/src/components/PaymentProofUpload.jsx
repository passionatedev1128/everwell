import { useState, useRef, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { uploadPaymentProofFile } from '../utils/api';
import { trackPaymentProofUpload } from '../utils/analytics';
import { trackContact } from '../utils/facebookPixel';
import { trackPaymentProofUpload as gtmTrackPaymentProofUpload } from '../utils/gtm';

const PaymentProofUpload = ({ orderId, onUploadSuccess, currentProof = null }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  // Allowed file types
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'];
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  // Validate file
  const validateFile = (file) => {
    setValidationError('');

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      const error = `Tipo de arquivo não permitido. Use: ${allowedExtensions.join(', ')}`;
      setValidationError(error);
      toast.error(error);
      return false;
    }

    // Check file size
    if (file.size > maxFileSize) {
      const error = `Arquivo muito grande. Tamanho máximo: ${(maxFileSize / 1024 / 1024).toFixed(0)}MB`;
      setValidationError(error);
      toast.error(error);
      return false;
    }

    return true;
  };

  // Handle file selection
  const handleFileSelect = useCallback((file) => {
    if (!file) return;

    if (!validateFile(file)) {
      return;
    }

    setSelectedFile(file);
    setValidationError('');

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      // For PDF, show file icon
      setPreview(null);
    }
  }, []);

  // Handle file input change
  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Get file type icon
  const getFileIcon = (fileType) => {
    if (fileType?.startsWith('image/')) {
      return '🖼️';
    } else if (fileType === 'application/pdf') {
      return '📄';
    }
    return '📎';
  };

  // Remove selected file
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreview(null);
    setValidationError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Upload file
  const handleUpload = async () => {
    if (!selectedFile || !orderId) return;

    if (!validateFile(selectedFile)) {
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress (since we can't track actual upload progress with current API)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await uploadPaymentProofFile(orderId, selectedFile);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.success) {
        // Track payment proof upload
        trackPaymentProofUpload(orderId);
        trackContact(orderId);
        gtmTrackPaymentProofUpload(orderId);
        
        toast.success('Comprovante de pagamento enviado com sucesso!');
        setSelectedFile(null);
        setPreview(null);
        if (onUploadSuccess) {
          await onUploadSuccess();
        }
      }
    } catch (error) {
      console.error('Error uploading payment proof:', error);
      toast.error(error.response?.data?.message || 'Erro ao enviar comprovante. Tente novamente.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setTimeout(() => {
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 1000);
    }
  };

  return (
    <div className="space-y-4">
      {/* Current Proof Display */}
      {currentProof?.url && !selectedFile && (
        <div className="p-4 bg-bgSecondary rounded-md border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-darkTeal">Comprovante atual:</p>
            <a
              href={currentProof.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              Ver comprovante →
            </a>
          </div>
          {currentProof.url.match(/\.(jpg|jpeg|png|gif|webp)$/i) && (
            <img
              src={currentProof.url}
              alt="Comprovante atual"
              className="mt-2 max-w-full h-auto rounded-md border border-gray-300"
              style={{ maxHeight: '200px' }}
            />
          )}
        </div>
      )}

      {/* Upload Area */}
      {!currentProof?.url || selectedFile ? (
        <div>
          {/* Drag and Drop Zone */}
          <div
            ref={dropZoneRef}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`
              relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300
              ${isDragging 
                ? 'border-primary bg-primary/5 scale-105' 
                : 'border-gray-300 bg-gray-50 hover:border-primary hover:bg-primary/5'
              }
              ${isUploading ? 'pointer-events-none opacity-50' : ''}
              ${validationError ? 'border-error bg-red-50' : ''}
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={allowedExtensions.join(',')}
              onChange={handleFileInputChange}
              className="hidden"
              disabled={isUploading}
            />

            {!selectedFile ? (
              <div className="space-y-2">
                <div className="text-4xl mb-2">📤</div>
                <p className="text-darkTeal font-medium">
                  {isDragging ? 'Solte o arquivo aqui' : 'Arraste o arquivo aqui'}
                </p>
                <p className="text-sm text-mediumTeal">ou clique para selecionar</p>
                <p className="text-xs text-lightTeal mt-2">
                  Formatos aceitos: {allowedExtensions.join(', ').toUpperCase()}
                </p>
                <p className="text-xs text-lightTeal">
                  Tamanho máximo: {(maxFileSize / 1024 / 1024).toFixed(0)}MB
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* File Preview */}
                {preview ? (
                  <div className="space-y-2">
                    <img
                      src={preview}
                      alt="Preview"
                      className="mx-auto max-w-full h-auto rounded-md border border-gray-300"
                      style={{ maxHeight: '300px' }}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-2">
                    <div className="text-6xl">{getFileIcon(selectedFile.type)}</div>
                    <p className="text-darkTeal font-medium">{selectedFile.name}</p>
                  </div>
                )}

                {/* File Info */}
                <div className="bg-white rounded-md p-3 border border-gray-200">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-mediumTeal">Arquivo:</span>
                    <span className="text-darkTeal font-medium">{selectedFile.name}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-1">
                    <span className="text-mediumTeal">Tamanho:</span>
                    <span className="text-darkTeal font-medium">{formatFileSize(selectedFile.size)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-1">
                    <span className="text-mediumTeal">Tipo:</span>
                    <span className="text-darkTeal font-medium">
                      {selectedFile.type === 'application/pdf' ? 'PDF' : 'Imagem'}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile();
                    }}
                    className="btn-secondary text-sm"
                    disabled={isUploading}
                  >
                    Remover
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpload();
                    }}
                    className="btn-primary text-sm"
                    disabled={isUploading}
                  >
                    {isUploading ? 'Enviando...' : 'Enviar Comprovante'}
                  </button>
                </div>
              </div>
            )}

            {/* Upload Progress */}
            {isUploading && (
              <div className="absolute inset-0 bg-white/90 rounded-lg flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-darkTeal font-medium mb-2">Enviando comprovante...</p>
                <div className="w-64 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-mediumTeal mt-2">{uploadProgress}%</p>
              </div>
            )}
          </div>

          {/* Validation Error */}
          {validationError && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700">{validationError}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            Você já enviou um comprovante. Para enviar um novo, clique no botão abaixo.
          </p>
          <button
            onClick={() => {
              setSelectedFile(null);
              setPreview(null);
              fileInputRef.current?.click();
            }}
            className="btn-secondary mt-3 text-sm"
          >
            Enviar Novo Comprovante
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentProofUpload;

