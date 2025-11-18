import { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { uploadDocument } from '../utils/api';
import { trackDocumentUpload } from '../utils/analytics';
import { trackLead } from '../utils/hubspot';
import { trackDocumentUpload as gtmTrackDocumentUpload } from '../utils/gtm';

const DocumentUpload = ({ user, onUploadSuccess }) => {
  const [uploading, setUploading] = useState({});
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState({});

  const documentTypes = {
    medicalPrescription: {
      label: 'Receita Médica',
      description: 'Receita médica prescrita por profissional habilitado',
      required: true
    },
    importAuthorization: {
      label: 'Autorização de Importação (Anvisa)',
      description: 'Autorização da Anvisa para importação de produtos',
      required: true
    },
    proofOfResidence: {
      label: 'Comprovante de Residência',
      description: 'Comprovante de residência atualizado (últimos 3 meses)',
      required: true
    }
  };

  const getDocumentStatus = (documentType) => {
    if (!user?.documents?.[documentType]) {
      return { status: 'missing', label: 'Não enviado' };
    }
    const doc = user.documents[documentType];
    const statusMap = {
      pending: { label: 'Pendente', color: 'warning' },
      approved: { label: 'Aprovado', color: 'success' },
      rejected: { label: 'Rejeitado', color: 'error' }
    };
    return statusMap[doc.status] || { label: 'Desconhecido', color: 'secondary' };
  };

  const handleFileChange = async (documentType, file) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (!allowedTypes.includes(file.type)) {
      const errorMsg = 'Tipo de arquivo não permitido. Envie apenas documentos PDF ou Word (.doc, .docx).';
      setErrors({
        ...errors,
        [documentType]: errorMsg
      });
      toast.error(errorMsg);
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      const errorMsg = 'Arquivo muito grande. Tamanho máximo: 10MB.';
      setErrors({
        ...errors,
        [documentType]: errorMsg
      });
      toast.error(errorMsg);
      return;
    }

    setUploading({ ...uploading, [documentType]: true });
    setErrors({ ...errors, [documentType]: '' });
    setSuccess({ ...success, [documentType]: '' });

    try {
      const response = await uploadDocument(documentType, file);
      if (response.success) {
        // Track document upload (wrap in try-catch to prevent tracking errors from breaking upload)
        try {
          trackDocumentUpload(documentType);
        } catch (trackingError) {
          console.warn('GA4 tracking error:', trackingError);
          // Don't break upload flow if tracking fails
        }
        
        try {
          trackLead(documentType);
        } catch (trackingError) {
          console.warn('HubSpot tracking error:', trackingError);
          // Don't break upload flow if tracking fails
        }
        
        try {
          gtmTrackDocumentUpload(documentType);
        } catch (trackingError) {
          console.warn('GTM tracking error:', trackingError);
          // Don't break upload flow if tracking fails
        }
        
        const successMsg = 'Documento enviado com sucesso! Aguarde a análise.';
        setSuccess({
          ...success,
          [documentType]: successMsg
        });
        toast.success(successMsg);
        if (onUploadSuccess) {
          onUploadSuccess();
        }
      }
    } catch (error) {
      // Log full error for debugging
      console.error('Document upload error:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      
      // Get specific error message
      let errorMsg = 'Erro ao enviar documento. Tente novamente.';
      
      if (error.response) {
        // Server responded with error
        errorMsg = error.response.data?.message || errorMsg;
        
        // Add specific messages for common errors
        if (error.response.status === 401) {
          errorMsg = 'Sessão expirada. Por favor, faça login novamente.';
        } else if (error.response.status === 403) {
          errorMsg = 'Acesso negado. Verifique suas permissões.';
        } else if (error.response.status === 404) {
          errorMsg = 'Rota não encontrada. Verifique a configuração do servidor.';
        } else if (error.response.status === 413) {
          errorMsg = 'Arquivo muito grande. Tamanho máximo: 10MB.';
        } else if (error.response.status === 500) {
          errorMsg = 'Erro no servidor. Tente novamente mais tarde.';
        }
      } else if (error.request) {
        // Request was made but no response received
        errorMsg = 'Não foi possível conectar ao servidor. Verifique se o servidor está rodando.';
        console.error('Network error - server may not be running');
      } else {
        // Something else happened
        errorMsg = error.message || errorMsg;
      }
      
      setErrors({
        ...errors,
        [documentType]: errorMsg
      });
      toast.error(errorMsg);
    } finally {
      setUploading({ ...uploading, [documentType]: false });
    }
  };

  return (
    <div className="space-y-6">
      {Object.entries(documentTypes).map(([docType, docInfo]) => {
        const docStatus = getDocumentStatus(docType);
        const currentDoc = user?.documents?.[docType];
        
        return (
          <div key={docType} className="border border-borderLight rounded-lg p-6 bg-bgSecondary">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-darkTeal mb-1">
                  {docInfo.label}
                  {docInfo.required && <span className="text-error ml-1">*</span>}
                </h3>
                <p className="text-sm text-mediumTeal">{docInfo.description}</p>
              </div>
              <span className={`badge ${docStatus.color === 'success' ? 'badge-success' : docStatus.color === 'error' ? 'badge-error' : docStatus.color === 'warning' ? 'badge-warning' : 'badge-secondary'}`}>
                {docStatus.label}
              </span>
            </div>

            {currentDoc?.url && (
              <div className="mb-4 p-3 bg-white rounded-md">
                <p className="text-sm text-mediumTeal mb-2">Documento enviado:</p>
                <a
                  href={currentDoc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary-dark text-sm"
                >
                  Ver documento →
                </a>
                {currentDoc.uploadedAt && (
                  <p className="text-xs text-lightTeal mt-1">
                    Enviado em: {new Date(currentDoc.uploadedAt).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </div>
            )}

            {errors[docType] && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                {errors[docType]}
              </div>
            )}

            {success[docType] && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm">
                {success[docType]}
              </div>
            )}

            <div className="file-upload">
              <input
                type="file"
                id={`file-${docType}`}
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    handleFileChange(docType, file);
                  }
                }}
                disabled={uploading[docType]}
                className="hidden"
              />
              <label
                htmlFor={`file-${docType}`}
                className="cursor-pointer flex flex-col items-center justify-center"
              >
                {uploading[docType] ? (
                  <>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                    <p className="text-mediumTeal">Enviando...</p>
                  </>
                ) : (
                  <>
                    <svg className="w-12 h-12 text-primary mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-darkTeal font-medium mb-1">
                      {currentDoc ? 'Substituir Documento' : 'Enviar Documento'}
                    </p>
                    <p className="text-sm text-mediumTeal">Apenas PDF ou Word (.doc/.docx) - máx. 10MB</p>
                  </>
                )}
              </label>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DocumentUpload;

