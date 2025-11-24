// Email Templates for EverWell

export const welcomeEmailTemplate = (userName) => ({
  subject: 'Bem-vindo à EverWell!',
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1C6758; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #1C6758; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>EverWell</h1>
        </div>
        <div class="content">
          <h2>Bem-vindo, ${userName}!</h2>
          <p>Obrigado por se cadastrar na EverWell.</p>
          <p>Seu cadastro foi realizado com sucesso. Em breve, nossa equipe revisará sua solicitação e você receberá um email quando seu acesso aos produtos for autorizado.</p>
          <p><strong>Próximos passos:</strong></p>
          <ul>
            <li>Aguarde a autorização de um administrador</li>
            <li>Complete seu perfil com informações adicionais</li>
            <li>Envie seus documentos quando solicitado</li>
          </ul>
          <p>Conforme as Resoluções da Diretoria Colegiada (RDC) 327/2019 e 660/2022 da Anvisa, todos os produtos são restritos e requerem autorização prévia.</p>
          <p>Se tiver dúvidas, entre em contato conosco.</p>
          <p>Equipe EverWell</p>
        </div>
        <div class="footer">
          <p>Este é um email automático, por favor não responda.</p>
          <p>© 2025 EverWell. Todos os direitos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `,
  text: `
    Bem-vindo à EverWell, ${userName}!
    
    Obrigado por se cadastrar. Seu cadastro foi realizado com sucesso.
    
    Em breve, nossa equipe revisará sua solicitação e você receberá um email quando seu acesso aos produtos for autorizado.
    
    Próximos passos:
    - Aguarde a autorização de um administrador
    - Complete seu perfil com informações adicionais
    - Envie seus documentos quando solicitado
    
    Conforme as Resoluções da Diretoria Colegiada (RDC) 327/2019 e 660/2022 da Anvisa, todos os produtos são restritos e requerem autorização prévia.
    
    Equipe EverWell
  `
});

export const authorizationEmailTemplate = (userName, isAuthorized) => ({
  subject: isAuthorized 
    ? 'Acesso Autorizado - EverWell' 
    : 'Acesso Revogado - EverWell',
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: ${isAuthorized ? '#1C6758' : '#e74c3c'}; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #1C6758; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>EverWell</h1>
        </div>
        <div class="content">
          <h2>Olá, ${userName}!</h2>
          ${isAuthorized ? `
            <p><strong>Boas notícias!</strong> Seu acesso aos produtos EverWell foi autorizado.</p>
            <p>Agora você pode acessar a área de produtos e visualizar todas as informações sobre nossos produtos à base de CBD.</p>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/produtos" class="button">Acessar Produtos</a>
            <p><strong>Lembrete importante:</strong> Todos os produtos são restritos conforme RDC 327/2019 e 660/2022 da Anvisa e requerem prescrição médica e autorização da Anvisa para importação.</p>
          ` : `
            <p>Informamos que seu acesso aos produtos foi revogado.</p>
            <p>Se você acredita que isso foi um erro, entre em contato conosco para esclarecimentos.</p>
            <p>Nossa equipe está à disposição para ajudar.</p>
          `}
          <p>Equipe EverWell</p>
        </div>
        <div class="footer">
          <p>Este é um email automático, por favor não responda.</p>
          <p>© 2025 EverWell. Todos os direitos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `,
  text: isAuthorized ? `
    Olá, ${userName}!
    
    Boas notícias! Seu acesso aos produtos EverWell foi autorizado.
    
    Agora você pode acessar a área de produtos e visualizar todas as informações sobre nossos produtos à base de CBD.
    
    Acesse: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/produtos
    
    Lembrete importante: Todos os produtos são restritos conforme RDC 327/2019 e 660/2022 da Anvisa e requerem prescrição médica e autorização da Anvisa para importação.
    
    Equipe EverWell
  ` : `
    Olá, ${userName}!
    
    Informamos que seu acesso aos produtos foi revogado.
    
    Se você acredita que isso foi um erro, entre em contato conosco para esclarecimentos.
    
    Equipe EverWell
  `
});

export const documentUploadEmailTemplate = (userName, documentType) => {
  const documentNames = {
    medicalPrescription: 'Receita Médica',
    importAuthorization: 'Autorização de Importação',
    proofOfResidence: 'Comprovante de Residência'
  };

  return {
    subject: `Documento Recebido - ${documentNames[documentType] || 'Documento'}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1C6758; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>EverWell</h1>
          </div>
          <div class="content">
            <h2>Olá, ${userName}!</h2>
            <p>Recebemos seu documento: <strong>${documentNames[documentType] || 'Documento'}</strong></p>
            <p>Nossa equipe irá revisar o documento e você será notificado assim que a análise for concluída.</p>
            <p>O status do documento pode ser:</p>
            <ul>
              <li><strong>Pendente:</strong> Aguardando análise</li>
              <li><strong>Aprovado:</strong> Documento aprovado e válido</li>
              <li><strong>Rejeitado:</strong> Documento não atende aos requisitos</li>
            </ul>
            <p>Você pode acompanhar o status dos seus documentos na sua área de cliente.</p>
            <p>Equipe EverWell</p>
          </div>
          <div class="footer">
            <p>Este é um email automático, por favor não responda.</p>
            <p>© 2025 EverWell. Todos os direitos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Olá, ${userName}!
      
      Recebemos seu documento: ${documentNames[documentType] || 'Documento'}
      
      Nossa equipe irá revisar o documento e você será notificado assim que a análise for concluída.
      
      Você pode acompanhar o status dos seus documentos na sua área de cliente.
      
      Equipe EverWell
    `
  };
};

export const documentApprovedEmailTemplate = (userName, documentType) => {
  const documentNames = {
    medicalPrescription: 'Receita Médica',
    importAuthorization: 'Autorização de Importação',
    proofOfResidence: 'Comprovante de Residência'
  };

  return {
    subject: `Documento Aprovado - ${documentNames[documentType] || 'Documento'}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1C6758; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>EverWell</h1>
          </div>
          <div class="content">
            <h2>Olá, ${userName}!</h2>
            <p>Seu documento <strong>${documentNames[documentType] || 'Documento'}</strong> foi aprovado!</p>
            <p>O documento atende a todos os requisitos e está válido.</p>
            <p>Você pode continuar com o processo de compra dos produtos.</p>
            <p>Equipe EverWell</p>
          </div>
          <div class="footer">
            <p>Este é um email automático, por favor não responda.</p>
            <p>© 2025 EverWell. Todos os direitos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Olá, ${userName}!
      
      Seu documento ${documentNames[documentType] || 'Documento'} foi aprovado!
      
      O documento atende a todos os requisitos e está válido.
      
      Você pode continuar com o processo de compra dos produtos.
      
      Equipe EverWell
    `
  };
};

export const orderConfirmationEmailTemplate = (userName, orderDetails) => ({
  subject: 'Confirmação de Pedido - EverWell',
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1C6758; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .order-info { background: white; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>EverWell</h1>
        </div>
        <div class="content">
          <h2>Olá, ${userName}!</h2>
          <p>Seu pedido foi recebido com sucesso!</p>
          <div class="order-info">
            <p><strong>Número do Pedido:</strong> ${orderDetails.orderId || 'N/A'}</p>
            <p><strong>Status:</strong> ${orderDetails.status || 'Pendente'}</p>
            <p><strong>Valor Total:</strong> R$ ${orderDetails.totalAmount || '0.00'}</p>
          </div>
          <p>Nossa equipe irá processar seu pedido e você receberá atualizações por email.</p>
          <p>Equipe EverWell</p>
        </div>
        <div class="footer">
          <p>Este é um email automático, por favor não responda.</p>
          <p>© 2025 EverWell. Todos os direitos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `,
  text: `
    Olá, ${userName}!
    
    Seu pedido foi recebido com sucesso!
    
    Número do Pedido: ${orderDetails.orderId || 'N/A'}
    Status: ${orderDetails.status || 'Pendente'}
    Valor Total: R$ ${orderDetails.totalAmount || '0.00'}
    
    Nossa equipe irá processar seu pedido e você receberá atualizações por email.
    
    Equipe EverWell
  `
});

export const bookingConfirmationEmailTemplate = (userName, bookingDetails) => ({
  subject: 'Consulta Agendada - EverWell',
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1C6758; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .booking-info { background: white; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>EverWell</h1>
        </div>
        <div class="content">
          <h2>Olá, ${userName}!</h2>
          <p>Sua consulta foi agendada com sucesso!</p>
          <div class="booking-info">
            <p><strong>Data:</strong> ${bookingDetails.date || 'N/A'}</p>
            <p><strong>Horário:</strong> ${bookingDetails.time || 'N/A'}</p>
            <p><strong>Serviço:</strong> ${bookingDetails.service || 'Consulta Médica'}</p>
          </div>
          <p>Um lembrete será enviado próximo à data da consulta.</p>
          <p>Equipe EverWell</p>
        </div>
        <div class="footer">
          <p>Este é um email automático, por favor não responda.</p>
          <p>© 2025 EverWell. Todos os direitos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `,
  text: `
    Olá, ${userName}!
    
    Sua consulta foi agendada com sucesso!
    
    Data: ${bookingDetails.date || 'N/A'}
    Horário: ${bookingDetails.time || 'N/A'}
    Serviço: ${bookingDetails.service || 'Consulta Médica'}
    
    Um lembrete será enviado próximo à data da consulta.
    
    Equipe EverWell
  `
});

export const orderStatusUpdateEmailTemplate = (userName, orderId, oldStatus, newStatus, orderDetails) => {
  const statusLabels = {
    pending: 'Pendente',
    paid: 'Pago',
    processing: 'Processando',
    shipped: 'Enviado',
    delivered: 'Entregue',
    cancelled: 'Cancelado'
  };

  const statusMessages = {
    paid: 'Seu pagamento foi confirmado e estamos processando seu pedido.',
    processing: 'Seu pedido está sendo processado e preparado para envio.',
    shipped: 'Seu pedido foi enviado! Você receberá informações de rastreamento em breve.',
    delivered: 'Seu pedido foi entregue! Esperamos que esteja satisfeito com sua compra.',
    cancelled: 'Seu pedido foi cancelado. Se você tiver dúvidas, entre em contato conosco.'
  };

  return {
    subject: `Atualização do Pedido #${orderId.slice(-8).toUpperCase()} - EverWell`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4fb3a8; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f8fdfc; padding: 30px; border-radius: 0 0 8px 8px; }
          .status-box { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #4fb3a8; }
          .order-info { background: white; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          .status-badge { display: inline-block; padding: 5px 15px; border-radius: 20px; font-weight: bold; }
          .status-pending { background: #ffa940; color: white; }
          .status-paid { background: #40a9ff; color: white; }
          .status-processing { background: #40a9ff; color: white; }
          .status-shipped { background: #40a9ff; color: white; }
          .status-delivered { background: #52c41a; color: white; }
          .status-cancelled { background: #ff7875; color: white; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>EverWell</h1>
          </div>
          <div class="content">
            <h2>Olá, ${userName}!</h2>
            <p>Seu pedido teve uma atualização de status.</p>
            
            <div class="status-box">
              <p><strong>Status Anterior:</strong> <span class="status-badge status-${oldStatus}">${statusLabels[oldStatus] || oldStatus}</span></p>
              <p><strong>Novo Status:</strong> <span class="status-badge status-${newStatus}">${statusLabels[newStatus] || newStatus}</span></p>
            </div>

            ${statusMessages[newStatus] ? `<p>${statusMessages[newStatus]}</p>` : ''}

            <div class="order-info">
              <p><strong>Número do Pedido:</strong> #${orderId.slice(-8).toUpperCase()}</p>
              ${orderDetails?.totalAmount ? `<p><strong>Valor Total:</strong> R$ ${orderDetails.totalAmount.toFixed(2)}</p>` : ''}
            </div>

            <p>Você pode acompanhar seu pedido acessando sua conta no site.</p>
            <p>Equipe EverWell</p>
          </div>
          <div class="footer">
            <p>Este é um email automático, por favor não responda.</p>
            <p>© 2025 EverWell. Todos os direitos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Olá, ${userName}!
      
      Seu pedido teve uma atualização de status.
      
      Status Anterior: ${statusLabels[oldStatus] || oldStatus}
      Novo Status: ${statusLabels[newStatus] || newStatus}
      
      ${statusMessages[newStatus] || ''}
      
      Número do Pedido: #${orderId.slice(-8).toUpperCase()}
      ${orderDetails?.totalAmount ? `Valor Total: R$ ${orderDetails.totalAmount.toFixed(2)}` : ''}
      
      Você pode acompanhar seu pedido acessando sua conta no site.
      
      Equipe EverWell
    `
  };
};

export const emailVerificationTemplate = (userName, token, isPendingRegistration = false) => {
  const verificationUrl = isPendingRegistration 
    ? `${process.env.FRONTEND_URL || 'http://localhost:5173'}/complete-registration/${token}`
    : `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email/${token}`;
  
  const subject = isPendingRegistration 
    ? 'Complete seu cadastro - EverWell'
    : 'Verifique seu email - EverWell';
  
  const message = isPendingRegistration
    ? 'Obrigado por se cadastrar na EverWell. Para completar seu cadastro, clique no link abaixo e preencha suas informações.'
    : 'Obrigado por se cadastrar na EverWell. Para completar seu cadastro, por favor verifique seu endereço de email.';
  
  const buttonText = isPendingRegistration
    ? 'Completar Cadastro'
    : 'Verificar Email';
  
  return {
    subject,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4fb3a8; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f8fdfc; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #4fb3a8; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          .link-box { background: white; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #4fb3a8; word-break: break-all; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>EverWell</h1>
          </div>
          <div class="content">
            <h2>Olá, ${userName}!</h2>
            <p>${message}</p>
            <p>Clique no botão abaixo para ${isPendingRegistration ? 'completar seu cadastro' : 'verificar sua conta'}:</p>
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">${buttonText}</a>
            </div>
            <p>Ou copie e cole o link abaixo no seu navegador:</p>
            <div class="link-box">
              <p style="margin: 0; font-size: 12px;">${verificationUrl}</p>
            </div>
            <p><strong>Este link expira em 24 horas.</strong></p>
            <p>Se você não se cadastrou na EverWell, por favor ignore este email.</p>
            <p>Equipe EverWell</p>
          </div>
          <div class="footer">
            <p>Este é um email automático, por favor não responda.</p>
            <p>© 2025 EverWell. Todos os direitos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Olá, ${userName}!
      
      ${message}
      
      Clique no link abaixo para ${isPendingRegistration ? 'completar seu cadastro' : 'verificar sua conta'}:
      ${verificationUrl}
      
      Este link expira em 24 horas.
      
      Se você não se cadastrou na EverWell, por favor ignore este email.
      
      Equipe EverWell
    `
  };
};

export const passwordResetTemplate = (userName, token) => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${token}`;
  
  return {
    subject: 'Redefinir Senha - EverWell',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4fb3a8; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f8fdfc; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #4fb3a8; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          .link-box { background: white; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #4fb3a8; word-break: break-all; }
          .warning { background: #fff7e6; border-left: 4px solid #ffa940; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>EverWell</h1>
          </div>
          <div class="content">
            <h2>Olá, ${userName}!</h2>
            <p>Recebemos uma solicitação para redefinir a senha da sua conta EverWell.</p>
            <p>Clique no botão abaixo para criar uma nova senha:</p>
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Redefinir Senha</a>
            </div>
            <p>Ou copie e cole o link abaixo no seu navegador:</p>
            <div class="link-box">
              <p style="margin: 0; font-size: 12px;">${resetUrl}</p>
            </div>
            <div class="warning">
              <p style="margin: 0;"><strong>⚠️ Importante:</strong></p>
              <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                <li>Este link expira em 1 hora</li>
                <li>Se você não solicitou a redefinição de senha, ignore este email</li>
                <li>Sua senha não será alterada até que você crie uma nova</li>
              </ul>
            </div>
            <p>Por segurança, não compartilhe este link com ninguém.</p>
            <p>Equipe EverWell</p>
          </div>
          <div class="footer">
            <p>Este é um email automático, por favor não responda.</p>
            <p>© 2025 EverWell. Todos os direitos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Olá, ${userName}!
      
      Recebemos uma solicitação para redefinir a senha da sua conta EverWell.
      
      Clique no link abaixo para criar uma nova senha:
      ${resetUrl}
      
      ⚠️ Importante:
      - Este link expira em 1 hora
      - Se você não solicitou a redefinição de senha, ignore este email
      - Sua senha não será alterada até que você crie uma nova
      
      Por segurança, não compartilhe este link com ninguém.
      
      Equipe EverWell
    `
  };
};

