# Exemplo Prático - JWT

Projeto de exemplo para demonstrar na aula como funciona a geração, validação e decodificação de tokens JWT.

## Funcionalidades

1. **Gerar Token JWT** - Cria um token com payload personalizado
2. **Validar Token JWT** - Verifica se o token é válido e não expirou
3. **Decodificar Token JWT** - Mostra o conteúdo do header e payload (sem validar assinatura)
4. **Demo de Ataque** - Demonstra o que acontece quando alguém tenta manipular o token

## Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 14 ou superior)
- npm (gerenciador de pacotes do Node.js)

## Instalação e Execução

```bash
# 1. Navegue até a pasta do projeto
cd exemplo-jwt

# 2. Instale as dependências
npm install

# 3. Inicie o servidor
npm start
```

O servidor estará disponível em: **http://localhost:3000**

## Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/login` | Gera um novo token JWT |
| POST | `/api/validar` | Valida um token JWT |
| POST | `/api/decodificar` | Decodifica um token JWT |

### Exemplos com curl

**Gerar token:**
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"usuario": "Bruno", "email": "bruno@exemplo.com"}'
```

**Validar token:**
```bash
curl -X POST http://localhost:3000/api/validar \
  -H "Content-Type: application/json" \
  -d '{"token": "SEU_TOKEN_AQUI"}'
```

## Como Usar na Aula (30 minutos)

### Passo 1: Setup (2 minutos)
```bash
cd exemplo-jwt
npm install
npm start
```

### Passo 2: Demonstração Prática (20 minutos)

1. **Abrir o navegador** em `http://localhost:3000`

2. **Gerar um token** (5 min)
   - Preencher usuário e email
   - Clicar em "Gerar Token JWT"
   - Explicar a estrutura do token (header.payload.signature)
   - Usar jwt.io para decodificar manualmente

3. **Validar o token** (5 min)
   - Copiar o token gerado
   - Colar no campo de validação
   - Clicar em "Validar Token"
   - Mostrar que o payload é retornado

4. **Decodificar sem validar** (5 min)
   - Decodificar o token
   - Mostrar header e payload separados
   - Explicar que o payload NÃO é criptografado

5. **Demo de Ataque** (5 min)
   - Tentar alterar o payload
   - Mostrar que a validação falha
   - Explicar a importância da assinatura

### Passo 3: Encerramento (8 minutos)
- Revisar conceitos-chave
- Responder perguntas
- Mostrar jwt.io para exploração adicional

## Arquitetura do Projeto

```
exemplo-jwt/
├── package.json      # Dependências do projeto
├── server.js         # Backend com Express e endpoints JWT
├── README.md         # Este arquivo
└── public/
    └── index.html    # Interface web (HTML/CSS/JS puro)
```

## Segurança

- A chave secreta está hardcoded para fins didáticos
- Em produção, **SEMPRE** use variáveis de ambiente
- Nunca exponha a chave secreta no frontend

## Tecnologias

- **Backend:** Node.js + Express
- **JWT:** jsonwebtoken (biblioteca oficial)
- **Frontend:** HTML5, CSS3, JavaScript puro