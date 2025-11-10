import { sendEmail } from '../config/email.js';

const buildEmailHtml = (payload) => {
  const {
    name,
    email,
    phone,
    objective,
    timeline,
    currentChallenges,
    medicalBackground,
    supportPreference,
    message,
  } = payload;

  return `
    <h2>Nova solicitação - Defina seus objetivos</h2>
    <p>Uma pessoa enviou o formulário de objetivos no site EverWell.</p>
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px; border: 1px solid #e5e5e5;"><strong>Nome</strong></td>
        <td style="padding: 8px; border: 1px solid #e5e5e5;">${name || '—'}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #e5e5e5;"><strong>Email</strong></td>
        <td style="padding: 8px; border: 1px solid #e5e5e5;">${email || '—'}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #e5e5e5;"><strong>Telefone</strong></td>
        <td style="padding: 8px; border: 1px solid #e5e5e5;">${phone || '—'}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #e5e5e5;"><strong>Objetivo principal</strong></td>
        <td style="padding: 8px; border: 1px solid #e5e5e5;">${objective || '—'}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #e5e5e5;"><strong>Horizonte de resultados</strong></td>
        <td style="padding: 8px; border: 1px solid #e5e5e5;">${timeline || '—'}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #e5e5e5;"><strong>Desafios atuais</strong></td>
        <td style="padding: 8px; border: 1px solid #e5e5e5;">${currentChallenges || '—'}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #e5e5e5;"><strong>Histórico médico</strong></td>
        <td style="padding: 8px; border: 1px solid #e5e5e5;">${medicalBackground || '—'}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #e5e5e5;"><strong>Preferência de suporte</strong></td>
        <td style="padding: 8px; border: 1px solid #e5e5e5;">${supportPreference || '—'}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #e5e5e5;"><strong>Mensagem</strong></td>
        <td style="padding: 8px; border: 1px solid #e5e5e5;">${message || '—'}</td>
      </tr>
    </table>
  `;
};

export const submitGoalForm = async (req, res, next) => {
  try {
    const payload = req.body || {};
    const { name, email, objective } = payload;

    if (!name || !email || !objective) {
      return res.status(400).json({
        success: false,
        message: 'Nome, email e objetivo são obrigatórios.',
      });
    }

    const recipient = process.env.LEAD_NOTIFICATION_EMAIL || process.env.EMAIL_USER;
    if (!recipient) {
      console.warn('⚠️ LEAD_NOTIFICATION_EMAIL não configurado. Dados serão apenas registrados no log.');
    } else {
      await sendEmail({
        to: recipient,
        subject: 'EverWell - Novo formulário de objetivos',
        html: buildEmailHtml(payload),
      });
    }

    console.log('📨 Nova submissão de objetivos recebida:', {
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      objective: payload.objective,
    });

    res.json({
      success: true,
      message: 'Formulário enviado com sucesso.',
    });
  } catch (error) {
    console.error('❌ Erro ao processar formulário de objetivos:', error);
    next(error);
  }
};


