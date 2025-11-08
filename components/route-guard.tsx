"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import type { Rol } from "@/lib/types"

interface RouteGuardProps {
  children: React.ReactNode
  allowedRoles?: Rol[]
}

export function RouteGuard({ children, allowedRoles }: RouteGuardProps) {
  const { usuario, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !usuario) {
      router.push("/")
    }

    if (!isLoading && usuario && allowedRoles && !allowedRoles.includes(usuario.rol)) {
      router.push("/dashboard")
    }
  }, [usuario, isLoading, allowedRoles, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!usuario) {
    return null
  }

  if (allowedRoles && !allowedRoles.includes(usuario.rol)) {
    return null
  }

  return <>{children}</>
}
