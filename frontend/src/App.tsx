import { useState } from "react"
import type { ChangeEvent } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Copy, KeyRound, Shield, ShieldAlert, Code, Bug, CheckCircle2, XCircle, Moon, Sun } from "lucide-react"

function App() {
  const [usuario, setUsuario] = useState("Bruno Silva")
  const [email, setEmail] = useState("bruno@exemplo.com")
  const [tokenGerado, setTokenGerado] = useState("")
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [payloadGerado, setPayloadGerado] = useState<Record<string, any> | null>(null)

  const [tokenValidar, setTokenValidar] = useState("")
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [resultadoValidacao, setResultadoValidacao] = useState<Record<string, any> | null>(null)

  const [tokenDecodificar, setTokenDecodificar] = useState("")
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [resultadoDecodificacao, setResultadoDecodificacao] = useState<Record<string, any> | null>(null)

  const [tokenAtaque, setTokenAtaque] = useState("")
  const [payloadModificado, setPayloadModificado] = useState("")
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [resultadoAtaque, setResultadoAtaque] = useState<Record<string, any> | null>(null)

  const [tokenVulneravel, setTokenVulneravel] = useState("")
  const [payloadModificadoVulneravel, setPayloadModificadoVulneravel] = useState("")
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [resultadoVulneravel, setResultadoVulneravel] = useState<Record<string, any> | null>(null)

  const copiarToken = (token: string) => {
    navigator.clipboard.writeText(token)
  }

  const gerarToken = async () => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, email }),
      })
      const data = await response.json()
      if (response.ok) {
        setTokenGerado(data.token)
        setPayloadGerado(data.payload)
        setTokenValidar(data.token)
        setTokenDecodificar(data.token)
        setTokenAtaque(data.token)
        setTokenVulneravel(data.token)
      }
    } catch {
      alert("Erro ao conectar com o servidor")
    }
  }

  const validarToken = async () => {
    try {
      const response = await fetch("/api/validar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tokenValidar }),
      })
      const data = await response.json()
      setResultadoValidacao(data)
    } catch {
      alert("Erro ao conectar com o servidor")
    }
  }

  const decodificarToken = async () => {
    try {
      const response = await fetch("/api/decodificar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tokenDecodificar }),
      })
      const data = await response.json()
      setResultadoDecodificacao(data)
    } catch {
      alert("Erro ao conectar com o servidor")
    }
  }

  const simularAtaque = async () => {
    if (!payloadModificado) return
    const partes = tokenAtaque.split(".")
    const tokenModificado = partes[0] + "." + payloadModificado + "." + partes[2]
    try {
      const response = await fetch("/api/validar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tokenModificado }),
      })
      const data = await response.json()
      setResultadoAtaque({ ...data, tokenOriginal: tokenAtaque, tokenModificado })
    } catch {
      alert("Erro ao conectar com o servidor")
    }
  }

  const simularAtaqueVulneravel = async () => {
    if (!payloadModificadoVulneravel) return
    const partes = tokenVulneravel.split(".")
    const tokenModificado = partes[0] + "." + payloadModificadoVulneravel + "." + partes[2]
    try {
      const response = await fetch("/api/validar-vulneravel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tokenModificado }),
      })
      const data = await response.json()
      setResultadoVulneravel({ ...data, tokenOriginal: tokenVulneravel, tokenModificado })
    } catch {
      alert("Erro ao conectar com o servidor")
    }
  }

  const { theme, setTheme } = useTheme()

  return (
    <div className="min-h-screen bg-background">
      {/* Theme Toggle - Top Right */}
      <div className="fixed top-4 right-4 z-50">
        <div className="flex items-center gap-2 bg-card border rounded-lg px-3 py-2 shadow-sm">
          <Sun className="h-4 w-4 text-muted-foreground" />
          <Switch
            checked={theme === "dark"}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          />
          <Moon className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <div className="container mx-auto py-10 px-4">
        <div className="flex flex-col items-center justify-center space-y-2 mb-10">
          <h1 className="text-3xl font-bold tracking-tight">JWT Interativo</h1>
          <p className="text-muted-foreground text-center max-w-[600px]">
            Aprenda na pratica como funcionam tokens JWT: geracao, validacao, decodificacao e
            vulnerabilidades de seguranca.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 max-w-7xl mx-auto">
          {/* Card 1: Gerar Token */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <KeyRound className="h-5 w-5 text-primary" />
                Gerar Token
              </CardTitle>
              <CardDescription>Crie um novo JWT com payload personalizado</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="usuario">Usuario</Label>
                <Input
                  id="usuario"
                  value={usuario}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setUsuario(e.target.value)}
                  placeholder="Seu nome"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={gerarToken} className="flex-1">
                  Gerar Token
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setUsuario("")
                    setEmail("")
                    setTokenGerado("")
                    setPayloadGerado(null)
                    setTokenValidar("")
                    setResultadoValidacao(null)
                    setTokenDecodificar("")
                    setResultadoDecodificacao(null)
                    setTokenAtaque("")
                    setPayloadModificado("")
                    setResultadoAtaque(null)
                    setTokenVulneravel("")
                    setPayloadModificadoVulneravel("")
                    setResultadoVulneravel(null)
                  }}
                >
                  Limpar
                </Button>
              </div>

              {tokenGerado && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2 text-sm text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="font-medium">Token gerado com sucesso</span>
                  </div>
                  <div className="relative group">
                    <code className="block p-4 bg-muted text-xs rounded-lg break-all font-mono text-muted-foreground max-h-40 overflow-y-auto">
                      {tokenGerado}
                    </code>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => copiarToken(tokenGerado)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Payload:</p>
                    <pre className="p-4 bg-muted text-xs rounded-lg overflow-auto font-mono text-muted-foreground max-h-48">
                      {JSON.stringify(payloadGerado, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card 2: Validar Token */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5 text-emerald-500" />
                Validar Token
              </CardTitle>
              <CardDescription>Verifique se um token e valido (com assinatura)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tokenValidar">Token JWT</Label>
                <Textarea
                  id="tokenValidar"
                  value={tokenValidar}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setTokenValidar(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIs..."
                  className="font-mono text-xs h-24 md:h-32 resize-none"
                />
              </div>
              <Button onClick={validarToken} className="w-full" variant="outline">
                Validar
              </Button>

              {resultadoValidacao && (
                <div className="space-y-2 pt-2">
                  {resultadoValidacao.valido ? (
                    <>
                      <div className="flex items-center gap-2 text-sm text-emerald-600">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="font-medium">Token valido</span>
                      </div>
                      <pre className="p-4 bg-muted text-xs rounded-lg overflow-x-auto font-mono text-muted-foreground">
                        {JSON.stringify(resultadoValidacao.payload, null, 2)}
                      </pre>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 text-sm text-destructive">
                        <XCircle className="h-4 w-4" />
                        <span className="font-medium">Token invalido</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{resultadoValidacao.erro}</p>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card 3: Decodificar Token */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Code className="h-5 w-5 text-blue-500" />
                Decodificar Token
              </CardTitle>
              <CardDescription>Visualize o conteudo sem validar a assinatura</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tokenDecodificar">Token JWT</Label>
                <Textarea
                  id="tokenDecodificar"
                  value={tokenDecodificar}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setTokenDecodificar(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIs..."
                  className="font-mono text-xs h-24 md:h-32 resize-none"
                />
              </div>
              <Button onClick={decodificarToken} className="w-full" variant="outline">
                Decodificar
              </Button>

              {resultadoDecodificacao && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <Code className="h-4 w-4" />
                    <span className="font-medium">Conteudo decodificado</span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Header
                    </p>
                    <pre className="p-4 bg-muted text-xs rounded-lg overflow-x-auto font-mono text-muted-foreground">
                      {JSON.stringify(resultadoDecodificacao.header, null, 2)}
                    </pre>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Payload
                    </p>
                    <pre className="p-4 bg-muted text-xs rounded-lg overflow-x-auto font-mono text-muted-foreground">
                      {JSON.stringify(resultadoDecodificacao.payload, null, 2)}
                    </pre>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Signature
                    </p>
                    <code className="block p-4 bg-muted text-xs rounded-lg break-all font-mono text-muted-foreground">
                      {resultadoDecodificacao.signature}
                    </code>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card 4: Demo de Ataque */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShieldAlert className="h-5 w-5 text-orange-500" />
                Ataque de Manipulacao
              </CardTitle>
              <CardDescription>Altere o payload e veja o servidor rejeitar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tokenAtaque">Token Original</Label>
                <Textarea
                  id="tokenAtaque"
                  value={tokenAtaque}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setTokenAtaque(e.target.value)}
                  placeholder="Cole um token valido"
                  className="font-mono text-xs h-24 md:h-32 resize-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="payloadModificado">Payload Modificado (Base64)</Label>
                <Input
                  id="payloadModificado"
                  value={payloadModificado}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPayloadModificado(e.target.value)}
                  placeholder="eyJzdWIiOiIxMjM0NSIs..."
                  className="font-mono text-xs"
                />
              </div>
              <Button onClick={simularAtaque} className="w-full" variant="destructive">
                Enviar Token Modificado
              </Button>

              {resultadoAtaque && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <XCircle className="h-4 w-4" />
                    <span className="font-medium">Ataque detectado - Token rejeitado</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">Original</p>
                       <code className="block p-3 bg-muted text-[10px] rounded break-all font-mono text-muted-foreground max-h-24 overflow-y-auto">
                        {resultadoAtaque.tokenOriginal}
                      </code>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-destructive">Modificado</p>
                       <code className="block p-3 bg-destructive/10 text-[10px] rounded break-all font-mono text-destructive max-h-24 overflow-y-auto">
                        {resultadoAtaque.tokenModificado}
                      </code>
                    </div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      A assinatura nao corresponde ao payload modificado. O servidor rejeitou o token.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card 5: Validacao Vulneravel */}
          <Card className="md:col-span-3 border-destructive/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bug className="h-5 w-5 text-destructive" />
                <span className="text-destructive">Validacao Sem Assinatura</span>
                <Badge variant="destructive" className="ml-2">Vulneravel</Badge>
              </CardTitle>
              <CardDescription>
                Endpoint que NAO valida a assinatura - aceita qualquer token com formato valido
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tokenVulneravel" className="text-destructive">
                      Token Original
                    </Label>
                    <Textarea
                      id="tokenVulneravel"
                      value={tokenVulneravel}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setTokenVulneravel(e.target.value)}
                      placeholder="Cole um token valido"
                      className="font-mono text-xs h-32 resize-none border-destructive/30 focus-visible:ring-destructive/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payloadModificadoVulneravel" className="text-destructive">
                      Payload Modificado (Base64)
                    </Label>
                    <Input
                      id="payloadModificadoVulneravel"
                      value={payloadModificadoVulneravel}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setPayloadModificadoVulneravel(e.target.value)}
                      placeholder="eyJzdWIiOiIxMjM0NSIs..."
                      className="font-mono text-xs border-destructive/30 focus-visible:ring-destructive/50"
                    />
                  </div>
                  <Button
                    onClick={simularAtaqueVulneravel}
                    className="w-full"
                    variant="destructive"
                  >
                    Enviar (Sem Validar Assinatura)
                  </Button>
                </div>

                {resultadoVulneravel && (
                  <div className="space-y-3">
                    {resultadoVulneravel.valido ? (
                      <>
                        <div className="flex items-center gap-2 text-sm text-destructive">
                          <Bug className="h-4 w-4" />
                          <span className="font-medium">Vulnerabilidade explorada!</span>
                        </div>
                        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                          <p className="text-sm font-medium text-destructive">
                            Token aceito sem validacao de assinatura!
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            O servidor decodificou o payload e aceitou os dados modificados.
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-destructive uppercase tracking-wide">
                            Payload Aceito
                          </p>
                           <pre className="p-4 bg-muted text-xs rounded-lg overflow-auto font-mono text-muted-foreground max-h-48">
                            {JSON.stringify(resultadoVulneravel.payload, null, 2)}
                          </pre>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Token Enviado
                          </p>
                           <code className="block p-3 bg-muted text-[10px] rounded-lg break-all font-mono text-muted-foreground max-h-24 overflow-y-auto">
                            {resultadoVulneravel.tokenModificado}
                          </code>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <XCircle className="h-4 w-4" />
                        <span>Token rejeitado</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="p-4 bg-muted/50 rounded-lg border">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Por que isso e perigoso?</strong>
                  <br />
                  Se o servidor nao validar a assinatura, qualquer pessoa pode criar tokens com dados
                  falsos e o sistema vai aceitar. Isso permite acesso nao autorizado a recursos
                  restritos como contas de administrador.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-sm text-muted-foreground">
            Projeto de demonstracao para aula de Autenticacao e Autorizacao com JWT
          </p>
        </div>
      </div>
    </div>
  )
}

export default App