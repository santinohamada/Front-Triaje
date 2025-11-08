"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { authService } from "@/services/auth"
import type { Usuario } from "@/lib/types"

interface AuthContextType {
  usuario: Usuario | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario")
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado))
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const usuario = await authService.login(username, password)

      if (usuario) {
        setUsuario(usuario)
        localStorage.setItem("usuario", JSON.stringify(usuario))
        return true
      }
      return false
    } catch (error) {
      console.error("[v0] Error en login:", error)
      return false
    }
  }

  const logout = () => {
    setUsuario(null)
    localStorage.removeItem("usuario")
  }

  return <AuthContext.Provider value={{ usuario, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}
