import jwt from 'jsonwebtoken'
import type { Config } from '@netlify/functions'

export default async (req: Request) => {
  const { token } = await req.json()

  if (!token) {
    return Response.json({ erro: 'Token é obrigatório' }, { status: 400 })
  }

  try {
    const payload = jwt.decode(token, { complete: true })

    if (!payload) {
      return Response.json({ erro: 'Token mal formatado' }, { status: 400 })
    }

    return Response.json({
      header: payload.header,
      payload: payload.payload,
      signature: payload.signature,
      token_completo: token,
    })
  } catch {
    return Response.json({ erro: 'Token mal formatado' }, { status: 400 })
  }
}

export const config: Config = {
  path: '/api/decodificar',
  method: 'POST',
}
