const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = 3000;

// Chave secreta para assinar os tokens (em produção, usar variável de ambiente)
const SECRET_KEY = 'minha-chave-secreta-super-segura-123';

// Middleware para parsear JSON
app.use(express.json());

// Servir arquivos estáticos do build do React
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

// Endpoint para gerar token
app.post('/api/login', (req, res) => {
  const { usuario, email } = req.body;

  if (!usuario || !email) {
    return res.status(400).json({ erro: 'Usuário e email são obrigatórios' });
  }

  // Payload do token
  const payload = {
    sub: usuario,
    email: email,
    role: 'admin',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hora
  };

  // Gerar token
  const token = jwt.sign(payload, SECRET_KEY, { algorithm: 'HS256' });

  res.json({
    mensagem: 'Token gerado com sucesso!',
    token: token,
    payload: payload
  });
});

// Endpoint para validar token
app.post('/api/validar', (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ erro: 'Token é obrigatório' });
  }

  try {
    // Validar token
    const payload = jwt.verify(token, SECRET_KEY, { algorithms: ['HS256'] });

    res.json({
      valido: true,
      payload: payload,
      mensagem: 'Token válido!'
    });
  } catch (error) {
    res.status(401).json({
      valido: false,
      erro: error.message,
      mensagem: 'Token inválido!'
    });
  }
});

// Endpoint para decodificar token (sem validar assinatura)
app.post('/api/decodificar', (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ erro: 'Token é obrigatório' });
  }

  try {
    // Decodificar sem validar (apenas para demonstração)
    const payload = jwt.decode(token, { complete: true });

    res.json({
      header: payload.header,
      payload: payload.payload,
      signature: payload.signature,
      token_completo: token
    });
  } catch (error) {
    res.status(400).json({ erro: 'Token mal formatado' });
  }
});

// Endpoint VULNERÁVEL: valida apenas o formato, ignora assinatura
app.post('/api/validar-vulneravel', (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ erro: 'Token é obrigatório' });
  }

  try {
    // DEBITÁVEL: Decodifica SEM validar assinatura!
    const payload = jwt.decode(token);

    if (!payload) {
      return res.status(401).json({ erro: 'Token mal formatado', valido: false });
    }

    // APENAS verifica se não expirou (ignora assinatura completamente!)
    const agora = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < agora) {
      return res.status(401).json({ erro: 'Token expirado', valido: false });
    }

    // ATENÇÃO: Aqui o servidor ACEITA o token SEM verificar a assinatura!
    res.json({
      valido: true,
      payload: payload,
      mensagem: 'Token aceito (mas a assinatura NÃO foi verificada!)',
      aviso: 'VULNERABILIDADE: Este endpoint não valida a assinatura!'
    });
  } catch (error) {
    res.status(401).json({ erro: error.message, valido: false });
  }
});

// Rota principal - servir o React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log('Endpoints disponíveis:');
  console.log('  POST /api/login           - Gerar token');
  console.log('  POST /api/validar         - Validar token (com assinatura)');
  console.log('  POST /api/decodificar     - Decodificar token');
  console.log('  POST /api/validar-vulneravel - Validar SEM assinatura (VULNERÁVEL)');
});