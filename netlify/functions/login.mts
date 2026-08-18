import jwt from 'jsonwebtoken'
import type { Config } from '@netlify/functions'

const SECRET_KEY = process.env.JWT_SECRET || 'minha-chave-secreta-super-segura-123'

export default async (req: Request) => {
  const { usuario, email } = await req.json()

  if (!usuario || !email) {
    return Response.json({ erro: 'Usuário e email são obrigatórios' }, { status: 400 })
  }

  const payload = {
    sub: usuario,
    email: email,
    role: 'admin',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (60 * 60),
  }

  const token = jwt.sign(payload, SECRET_KEY, { algorithm: 'HS256' })

  return Response.json({
    mensagem: 'Token gerado com sucesso!',
    token: token,
    payload: payload,
  })
}

export const config: Config = {
  path: '/api/login',
  method: 'POST',
}
