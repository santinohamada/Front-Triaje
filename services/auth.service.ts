import { config } from "@/lib/config"
import type { Usuario } from "@/lib/types"

const MOCK_USERS = [
  {
    id: "1",
    username: "enfermero1",
    password: "enfermero123",
    rol: "Enfermero" as const,
    nombreCompleto: "María González",
  },
  {
    id: "2",
    username: "medico1",
    password: "medico123",
    rol: "Medico" as const,
    nombreCompleto: "Dr. Juan Pérez",
    matricula: "MP 12345",
  },
]

export const authService = {
  async login(username: string, password: string): Promise<Usuario | null> {
    console.log("[v0] authService.login llamado")

    if (config.useMocks) {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const user = MOCK_USERS.find((u) => u.username === username && u.password === password)

      if (user) {
        const { password: _, ...usuario } = user
        return usuario
      }
      return null
    }

    try {
      const response = await fetch(`${config.apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) return null

      const data = await response.json()
      return data.usuario
    } catch (error) {
      console.error("[v0] Error en login:", error)
      return null
    }
  },

  async verify(token: string): Promise<Usuario | null> {
    if (config.useMocks) {
      if (typeof window === "undefined") return null

      const usuarioGuardado = localStorage.getItem("usuario")
      return usuarioGuardado ? JSON.parse(usuarioGuardado) : null
    }

    try {
      const response = await fetch(`${config.apiUrl}/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) return null

      const data = await response.json()
      return data.usuario
    } catch (error) {
      console.error("[v0] Error en verify:", error)
      return null
    }
  },
}
