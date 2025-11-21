"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"

// Componentes UI
import { Button } from "@/components/ui/button"
import { MedicoDashboard } from "@/components/medico/medicoDashboard" // Asegúrate que la ruta sea correcta


// Lógica y Tipos
import { authService } from "@/services/auth.service"

import { Rol } from "@/types/Enums"
import { getUsuario, StoredUser } from "@/lib/authStorage"
import { RouteGuard } from "@/components/route-guard"

function MedicoDashboardContent() {
  const router = useRouter()
  const [usuario, setUsuario] = useState<StoredUser | null>(null)

  // Obtenemos el usuario del localStorage solo para mostrar el nombre en el Header
  useEffect(() => {
    const user = getUsuario()
    setUsuario(user)
  }, [])

  const handleLogout = () => {
    authService.logout()
    router.replace("/")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* HEADER */}
      <header className="bg-card border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                Panel Médico
              </h1>
              <p className="text-sm text-muted-foreground">
                Bienvenido/a, {usuario?.email || "Doctor"}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Nota: El botón de refrescar se eliminó porque MedicoDashboard 
                  ahora se actualiza automáticamente con React Query (polling) */}
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Cerrar Sesión</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="container mx-auto px-4 py-4 sm:py-6 lg:py-8">
        {/* El componente ahora es autónomo y no requiere props de datos */}
        <MedicoDashboard />
      </main>
    </div>
  )
}

export default function MedicoProtectedPage() {
  
  return (
    <RouteGuard allowedRoles={[Rol.Medico]}>
      <MedicoDashboardContent />
    </RouteGuard>
  )
}