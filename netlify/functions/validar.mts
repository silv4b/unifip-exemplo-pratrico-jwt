import jwt from 'jsonwebtoken'
import type { Config } from '@netlify/functions'

const SECRET_KEY = process.env.JWT_SECRET || 'minha-chave-secreta-super-segura-123'

export default async (req: Request) => {
  const { token } = await req.json()

  if (!token) {
    return Response.json({ erro: 'Token é obrigatório' }, { status: 400 })
  }

  try {
    const payload = jwt.verify(token, SECRET_KEY, { algorithms: ['HS256'] })

    return Response.json({
      valido: true,
      payload: payload,
      mensagem: 'Token válido!',
    })
  } catch (error) {
    return Response.json(
      {
        valido: false,
        erro: (error as Error).message,
        mensagem: 'Token inválido!',
      },
      { status: 401 },
    )
  }
}

export const config: Config = {
  path: '/api/validar',
  method: 'POST',
}
