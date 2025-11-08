"use client"
import { useAuth } from "@/hooks/use-auth"
import { useIngresos } from "@/hooks/use-ingresos"
import { useRouter } from "next/navigation"
import { Rol } from "@/lib/types"
import { RegistroIngresoForm } from "@/components/enfermero/registro-ingreso-form"
import { ListaPacientes } from "@/components/enfermero/lista-pacientes"
import { Button } from "@/components/ui/button"
import { RouteGuard } from "@/components/route-guard"
import { LogOut, RefreshCw } from "lucide-react"

function EnfermeroDashboardContent() {
  const { usuario, logout } = useAuth()
  const router = useRouter()
  const { ingresos, isLoading, createIngreso, refresh } = useIngresos()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Panel de Enfermería</h1>
              <p className="text-sm text-muted-foreground">Bienvenido/a, {usuario?.nombreCompleto}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={refresh} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 sm:mr-2 ${isLoading ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">Actualizar</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Salir</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          <RegistroIngresoForm onIngresoRegistrado={() => refresh()} enfermeroId={usuario?.id || ""} />
          <ListaPacientes ingresos={ingresos} />
        </div>
      </main>
    </div>
  )
}

export default function EnfermeroDashboard() {
  return (
    <RouteGuard allowedRoles={[Rol.Enfermero]}>
      <EnfermeroDashboardContent />
    </RouteGuard>
  )
}
