"use client";

import { useRouter } from "next/navigation";
import { EnfermeroDashboard} from "@/components/enfermero/enfermeroDashboard";
import { ListaPacientes } from "@/components/lista-pacientes";
import { Button } from "@/components/ui/button";
import { RouteGuard } from "@/components/route-guard";
import { LogOut, RefreshCw } from "lucide-react";
import { clearSession, getUsuario } from "@/lib/authStorage";
import { useColaAtencion } from "@/hooks/ingreso/useColaAtencion";
import { Rol } from "@/types/Enums";


function EnfermeroDashboardContent() {
  const router = useRouter();
  const {  isLoading,refetch: refresh} = useColaAtencion();

  // Cargar usuario desde localStorage tipado
  const usuario = getUsuario();
  const email = usuario?.email ?? "Usuario";

  const handleLogout = () => {
    clearSession(); 
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* HEADER */}
      <header className="bg-card border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Panel de Enfermería</h1>
              <p className="text-sm text-muted-foreground">
                Bienvenido/a, {email}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => refresh()}
                disabled={isLoading}
              >
                <RefreshCw
                  className={`h-4 w-4 sm:mr-2 ${
                    isLoading ? "animate-spin" : ""
                  }`}
                />
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

      {/* MAIN */}
      <main className="container mx-auto px-4 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          <EnfermeroDashboard />
          <ListaPacientes  />
        </div>
      </main>
    </div>
  );
}

export default function EnfermeroProtectedPage() {
  return (
    <RouteGuard allowedRoles={[Rol.Enfermero]}>
      <EnfermeroDashboardContent />
    </RouteGuard>
  );
}
