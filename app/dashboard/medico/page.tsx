"use client"

import { useAuth } from "@/hooks/use-auth"
import { useIngresoMedico } from "@/hooks/use-ingresos"
import { useRouter } from "next/navigation"
import { Rol } from "@/lib/types"
import { ListaPacientesMedico } from "@/components/medico/lista-pacientes-medico"
import { Button } from "@/components/ui/button"
import { RouteGuard } from "@/components/route-guard"
import { LogOut, RefreshCw } from "lucide-react"

function MedicoDashboardContent() {
  const { usuario, logout } = useAuth()
  const router = useRouter()
  const { ingresoActual, ingresosPrevios, isLoading, reclamarPaciente, finalizarAtencion, refresh } = useIngresoMedico(
    usuario?.id || "",
  )

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
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">Panel Médico</h1>
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
        <ListaPacientesMedico
          ingresoActual={ingresoActual}
          ingresosPrevios={ingresosPrevios}
          onReclamarPaciente={reclamarPaciente}
          onFinalizarAtencion={finalizarAtencion}
          medicoId={usuario?.id || ""}
        />
      </main>
    </div>
  )
}

export default function MedicoDashboard() {
  return (
    <RouteGuard allowedRoles={[Rol.Medico]}>
      <MedicoDashboardContent />
    </RouteGuard>
  )
}
