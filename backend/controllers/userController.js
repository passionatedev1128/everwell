import User from '../models/User.js';
import { sendEmail } from '../config/email.js';
import { 
  documentUploadEmailTemplate, 
  documentApprovedEmailTemplate 
} from '../utils/emailTemplates.js';
import { getFileUrl } from '../config/upload.js';

export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado.'
      });
    }

    // Update fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) {
      user.address = {
        ...user.address,
        ...address
      };
    }

    await user.save();

    res.json({
      success: true,
      message: 'Perfil atualizado com sucesso.',
      user
    });
  } catch (error) {
    next(error);
  }
};

export const uploadDocument = async (req, res, next) => {
  try {
    const { documentType } = req.params;
    const file = req.file;

    const validDocumentTypes = ['medicalPrescription', 'importAuthorization', 'proofOfResidence'];
    
    if (!validDocumentTypes.includes(documentType)) {
      return res.status(400).json({
        success: false,
        message: 'Tipo de documento inválido.'
      });
    }

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'Nenhum arquivo foi enviado.'
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado.'
      });
    }

    // Get file URL
    const fileUrl = getFileUrl(file.filename, 'document');

    // Update document
    user.documents[documentType] = {
      url: fileUrl,
      uploadedAt: new Date(),
      status: 'pending'
    };

    await user.save();

    // Send email notification
    const emailTemplate = documentUploadEmailTemplate(user.name, documentType);
    sendEmail({
      to: user.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text
    }).catch(err => {
      console.error('Failed to send document upload email:', err);
    });

    res.json({
      success: true,
      message: 'Documento enviado com sucesso. Aguarde a análise.',
      document: user.documents[documentType]
    });
  } catch (error) {
    next(error);
  }
};

