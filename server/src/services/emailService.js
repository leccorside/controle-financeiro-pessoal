const nodemailer = require('nodemailer');

const sendTemporaryPasswordEmail = async (email, tempPassword) => {
  // Configuração do transportador usando variáveis de ambiente
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: parseInt(process.env.EMAIL_PORT) === 465, // true para porta 465, false para outras
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Financeiro Pro" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Sua Senha Temporária - Financeiro Pro',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="display: inline-block; padding: 12px; background-color: #6366f1; border-radius: 12px; margin-bottom: 16px;">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"></path><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"></path></svg>
          </div>
          <h1 style="color: #111827; font-size: 24px; font-weight: 700; margin: 0;">Financeiro Pro</h1>
        </div>
        
        <div style="color: #374151; font-size: 16px; line-height: 1.6;">
          <p>Olá,</p>
          <p>Recebemos uma solicitação para recuperar a senha da sua conta no <strong>Financeiro Pro</strong>.</p>
          <p>Para sua segurança, geramos uma senha temporária exclusiva para você:</p>
          
          <div style="background-color: #f9fafb; border: 2px dashed #e5e7eb; padding: 24px; text-align: center; border-radius: 12px; margin: 32px 0;">
            <span style="font-family: 'Courier New', Courier, monospace; font-size: 32px; font-weight: 700; color: #6366f1; letter-spacing: 4px;">
              ${tempPassword}
            </span>
          </div>
          
          <p style="background-color: #fef2f2; color: #991b1b; padding: 12px; border-radius: 8px; font-size: 14px; text-align: center;">
            <strong>Importante:</strong> Esta senha é válida para apenas um acesso. Recomendamos alterá-la imediatamente após o login.
          </p>
        </div>
        
        <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #e5e7eb; text-align: center;">
          <p style="color: #6b7280; font-size: 14px; margin-bottom: 8px;">Dúvidas? Entre em contato com nosso suporte.</p>
          <p style="color: #9ca3af; font-size: 12px;">© 2024 Financeiro Pro. Todos os direitos reservados.</p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('E-mail enviado: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    throw error;
  }
};

module.exports = { sendTemporaryPasswordEmail };
