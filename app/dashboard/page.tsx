"use client"

import { useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { Rol } from "@/lib/types"

export default function DashboardRedirect() {
  const { usuario, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!usuario) {
        router.push("/")
      } else if (usuario.rol === Rol.Enfermero) {
        router.push("/dashboard/enfermero")
      } else if (usuario.rol === Rol.Medico) {
        router.push("/dashboard/medico")
      }
    }
  }, [usuario, isLoading, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-muted-foreground">Redirigiendo...</p>
      </div>
    </div>
  )
}
