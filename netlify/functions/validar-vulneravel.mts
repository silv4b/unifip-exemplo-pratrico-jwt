import jwt from 'jsonwebtoken'
import type { Config } from '@netlify/functions'

export default async (req: Request) => {
  const { token } = await req.json()

  if (!token) {
    return Response.json({ erro: 'Token é obrigatório' }, { status: 400 })
  }

  try {
    // DEBITÁVEL: Decodifica SEM validar assinatura!
    const payload = jwt.decode(token) as Record<string, unknown> | null

    if (!payload) {
      return Response.json({ erro: 'Token mal formatado', valido: false }, { status: 401 })
    }

    // APENAS verifica se não expirou (ignora assinatura completamente!)
    const agora = Math.floor(Date.now() / 1000)
    if (typeof payload.exp === 'number' && payload.exp < agora) {
      return Response.json({ erro: 'Token expirado', valido: false }, { status: 401 })
    }

    // ATENÇÃO: Aqui o servidor ACEITA o token SEM verificar a assinatura!
    return Response.json({
      valido: true,
      payload: payload,
      mensagem: 'Token aceito (mas a assinatura NÃO foi verificada!)',
      aviso: 'VULNERABILIDADE: Este endpoint não valida a assinatura!',
    })
  } catch (error) {
    return Response.json({ erro: (error as Error).message, valido: false }, { status: 401 })
  }
}

export const config: Config = {
  path: '/api/validar-vulneravel',
  method: 'POST',
}
