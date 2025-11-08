"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { User, Lock, AlertCircle } from "lucide-react"

export function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const success = await login(username, password)

    if (success) {
      router.push("/dashboard")
    } else {
      setError("Credenciales inválidas")
    }

    setLoading(false)
  }

  return (
    <Card className="w-full max-w-md shadow-lg animate-fade-in">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">Sistema de Guardia Hospitalaria</CardTitle>
        <CardDescription>Ingrese sus credenciales para acceder al sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Usuario</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="username"
                type="text"
                placeholder="Ingrese su usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10 transition-all duration-200 focus:scale-[1.02]"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 transition-all duration-200 focus:scale-[1.02]"
                required
              />
            </div>
          </div>
          {error && (
            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md animate-shake">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <Button
            type="submit"
            className="w-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            disabled={loading}
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </Button>
        </form>
        <div className="mt-6 space-y-2 text-xs text-muted-foreground bg-muted/50 p-4 rounded-lg">
          <p className="font-semibold text-foreground">Usuarios de prueba:</p>
          <div className="grid gap-1 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="font-medium">Enfermero:</p>
              <p>enfermero1 / enfermero123</p>
            </div>
            <div className="space-y-1">
              <p className="font-medium">Médico:</p>
              <p>medico1 / medico123</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
