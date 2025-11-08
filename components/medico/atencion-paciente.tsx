"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { type Ingreso, PrioridadTriaje } from "@/lib/types"
import {
  Clock,
  Activity,
  Thermometer,
  Heart,
  CheckCircle2,
  AlertCircle,
  User,
  Phone,
  CreditCard,
  Calendar,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AtencionPacienteProps {
  ingreso: Ingreso
  onFinalizarAtencion: (ingresoId: string, informeMedico: string) => Promise<boolean>
}

const prioridadConfig = {
  [PrioridadTriaje.Critico]: { label: "Crítico", color: "bg-red-600 text-white hover:bg-red-700" },
  [PrioridadTriaje.Emergencia]: { label: "Emergencia", color: "bg-orange-600 text-white hover:bg-orange-700" },
  [PrioridadTriaje.Urgencia]: { label: "Urgencia", color: "bg-amber-600 text-white hover:bg-amber-700" },
  [PrioridadTriaje.UrgenciaMenor]: { label: "Urgencia Menor", color: "bg-lime-600 text-white hover:bg-lime-700" },
  [PrioridadTriaje.SinUrgencia]: { label: "Sin Urgencia", color: "bg-sky-600 text-white hover:bg-sky-700" },
}

export function AtencionPaciente({ ingreso, onFinalizarAtencion }: AtencionPacienteProps) {
  const [informeMedico, setInformeMedico] = useState("")
  const [finalizando, setFinalizando] = useState(false)
  const [error, setError] = useState("")

  const formatearTiempo = (minutos: number) => {
    if (minutos < 60) {
      return `${minutos} min`
    }
    const horas = Math.floor(minutos / 60)
    const mins = minutos % 60
    return `${horas}h ${mins}m`
  }

  const handleFinalizar = async () => {
    if (!informeMedico.trim()) {
      setError("Debes ingresar un informe médico antes de finalizar la atención")
      return
    }

    setFinalizando(true)
    setError("")
    try {
      const success = await onFinalizarAtencion(ingreso.id, informeMedico.trim())

      if (success) {
        setInformeMedico("")
      } else {
        setError("Error al finalizar la atención")
      }
    } catch (error) {
      setError("Error al finalizar la atención")
    } finally {
      setFinalizando(false)
    }
  }

  const prioridad = prioridadConfig[ingreso.prioridad]

  return (
    <Card className="border-2 border-primary shadow-lg animate-scale-in">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="text-xl sm:text-2xl">Paciente en Atención</CardTitle>
          <Badge className={`${prioridad.color} transition-colors duration-200 w-fit`}>{prioridad.label}</Badge>
        </div>
        <CardDescription>Complete el informe médico para finalizar la atención</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-muted/50 rounded-lg p-4 space-y-3 animate-fade-in">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1 space-y-3">
              <h3 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                <User className="h-5 w-5" />
                {ingreso.paciente.nombreCompleto}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">DNI:</span>
                  <span className="text-muted-foreground">{ingreso.paciente.dni}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-3 w-3 text-muted-foreground" />
                  <span className="font-medium text-foreground">Afiliado:</span>
                  <span className="text-muted-foreground">{ingreso.paciente.numeroAfiliado}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3 text-muted-foreground" />
                  <span className="font-medium text-foreground">Teléfono:</span>
                  <span className="text-muted-foreground">{ingreso.paciente.telefono}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span className="font-medium text-foreground">Nacimiento:</span>
                  <span className="text-muted-foreground">
                    {new Date(ingreso.paciente.fechaNacimiento).toLocaleDateString("es-AR")}
                  </span>
                </div>
              </div>
            </div>
            {ingreso.tiempoEspera !== undefined && (
              <div className="flex items-center gap-2 text-sm bg-background px-4 py-3 rounded-md border w-fit">
                <Clock className="h-5 w-5 text-primary animate-pulse" />
                <div>
                  <p className="text-xs text-muted-foreground">Tiempo de espera</p>
                  <p className="font-bold text-foreground text-base">{formatearTiempo(ingreso.tiempoEspera)}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold text-foreground">Motivo de Consulta</h4>
          <p className="text-sm bg-muted p-3 rounded-md text-foreground leading-relaxed">{ingreso.informe}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {ingreso.temperatura && (
            <div className="bg-muted rounded-lg p-3 space-y-1 transition-all hover:bg-muted/80 hover:scale-105">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Thermometer className="h-4 w-4" />
                <span className="text-xs font-medium">Temperatura</span>
              </div>
              <p className="text-base sm:text-lg font-bold text-foreground">{ingreso.temperatura}°C</p>
            </div>
          )}
          <div className="bg-muted rounded-lg p-3 space-y-1 transition-all hover:bg-muted/80 hover:scale-105">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Heart className="h-4 w-4" />
              <span className="text-xs font-medium">FC</span>
            </div>
            <p className="text-base sm:text-lg font-bold text-foreground">{ingreso.frecuenciaCardiaca} lpm</p>
          </div>
          <div className="bg-muted rounded-lg p-3 space-y-1 transition-all hover:bg-muted/80 hover:scale-105">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Activity className="h-4 w-4" />
              <span className="text-xs font-medium">FR</span>
            </div>
            <p className="text-base sm:text-lg font-bold text-foreground">{ingreso.frecuenciaRespiratoria} rpm</p>
          </div>
          <div className="bg-muted rounded-lg p-3 space-y-1 transition-all hover:bg-muted/80 hover:scale-105">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Activity className="h-4 w-4" />
              <span className="text-xs font-medium">TA</span>
            </div>
            <p className="text-base sm:text-lg font-bold text-foreground">{ingreso.tensionArterial}</p>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t">
          <Label htmlFor="informe-medico" className="text-base font-semibold">
            Informe Médico *
          </Label>
          <Textarea
            id="informe-medico"
            placeholder="Ingrese diagnóstico, tratamiento indicado, medicación prescrita y recomendaciones..."
            value={informeMedico}
            onChange={(e) => {
              setInformeMedico(e.target.value)
              setError("")
            }}
            className="min-h-[150px] sm:min-h-[200px] text-sm sm:text-base transition-all duration-200 focus:scale-[1.01]"
          />
          {error && (
            <Alert variant="destructive" className="animate-shake">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button
            onClick={handleFinalizar}
            disabled={finalizando}
            size="lg"
            className="w-full gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <CheckCircle2 className="h-5 w-5" />
            {finalizando ? "Finalizando..." : "Finalizar Atención"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
