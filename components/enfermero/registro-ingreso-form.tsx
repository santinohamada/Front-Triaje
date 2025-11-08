"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PrioridadTriaje, EstadoIngreso, type Ingreso } from "@/lib/types"
import { ingresosService } from "@/services/ingresos"
import { User, Phone, CreditCard, Calendar, Activity, CheckCircle2 } from "lucide-react"

interface RegistroIngresoFormProps {
  onIngresoRegistrado: (ingreso: Ingreso) => void
  enfermeroId: string
}

export function RegistroIngresoForm({ onIngresoRegistrado, enfermeroId }: RegistroIngresoFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    // Datos del paciente
    pacienteDni: "",
    pacienteNombre: "",
    pacienteAfiliado: "",
    pacienteTelefono: "",
    pacienteFechaNacimiento: "",
    // Datos del ingreso
    informe: "",
    prioridad: "",
    temperatura: "",
    frecuenciaCardiaca: "",
    frecuenciaRespiratoria: "",
    tensionArterial: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const nuevoIngreso = await ingresosService.create({
        fechaIngreso: new Date().toISOString(),
        informe: formData.informe,
        prioridad: Number(formData.prioridad) as PrioridadTriaje,
        estado: EstadoIngreso.PENDIENTE,
        temperatura: formData.temperatura ? Number(formData.temperatura) : undefined,
        frecuenciaCardiaca: Number(formData.frecuenciaCardiaca),
        frecuenciaRespiratoria: Number(formData.frecuenciaRespiratoria),
        tensionArterial: formData.tensionArterial,
        paciente: {
          id: Date.now().toString(),
          dni: formData.pacienteDni,
          nombreCompleto: formData.pacienteNombre,
          numeroAfiliado: formData.pacienteAfiliado,
          telefono: formData.pacienteTelefono,
          fechaNacimiento: formData.pacienteFechaNacimiento,
        },
        enfermeroId,
      })

      // Resetear formulario
      setFormData({
        pacienteDni: "",
        pacienteNombre: "",
        pacienteAfiliado: "",
        pacienteTelefono: "",
        pacienteFechaNacimiento: "",
        informe: "",
        prioridad: "",
        temperatura: "",
        frecuenciaCardiaca: "",
        frecuenciaRespiratoria: "",
        tensionArterial: "",
      })

      onIngresoRegistrado(nuevoIngreso)
    } catch (error) {
      console.error("[v0] Error al registrar ingreso:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Registrar Nuevo Ingreso</CardTitle>
        <CardDescription>Complete los datos del paciente y el triaje inicial</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <User className="h-4 w-4" />
              Datos del Paciente
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pacienteDni">DNI *</Label>
                <Input
                  id="pacienteDni"
                  value={formData.pacienteDni}
                  onChange={(e) => setFormData({ ...formData, pacienteDni: e.target.value })}
                  className="transition-all duration-200 focus:scale-[1.01]"
                  required
                />
              </div>
              <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                <Label htmlFor="pacienteNombre">Nombre Completo *</Label>
                <Input
                  id="pacienteNombre"
                  value={formData.pacienteNombre}
                  onChange={(e) => setFormData({ ...formData, pacienteNombre: e.target.value })}
                  className="transition-all duration-200 focus:scale-[1.01]"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pacienteAfiliado" className="flex items-center gap-1">
                  <CreditCard className="h-3 w-3" />
                  Número de Afiliado *
                </Label>
                <Input
                  id="pacienteAfiliado"
                  value={formData.pacienteAfiliado}
                  onChange={(e) => setFormData({ ...formData, pacienteAfiliado: e.target.value })}
                  className="transition-all duration-200 focus:scale-[1.01]"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pacienteTelefono" className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  Teléfono *
                </Label>
                <Input
                  id="pacienteTelefono"
                  value={formData.pacienteTelefono}
                  onChange={(e) => setFormData({ ...formData, pacienteTelefono: e.target.value })}
                  className="transition-all duration-200 focus:scale-[1.01]"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pacienteFechaNacimiento" className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Fecha de Nacimiento *
                </Label>
                <Input
                  id="pacienteFechaNacimiento"
                  type="date"
                  value={formData.pacienteFechaNacimiento}
                  onChange={(e) => setFormData({ ...formData, pacienteFechaNacimiento: e.target.value })}
                  className="transition-all duration-200 focus:scale-[1.01]"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Triaje y Signos Vitales
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                <Label htmlFor="prioridad">Nivel de Prioridad *</Label>
                <Select
                  value={formData.prioridad}
                  onValueChange={(value) => setFormData({ ...formData, prioridad: value })}
                  required
                >
                  <SelectTrigger className="transition-all duration-200 hover:border-foreground">
                    <SelectValue placeholder="Seleccione prioridad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={String(PrioridadTriaje.Critico)}>🔴 Crítico (Nivel 1)</SelectItem>
                    <SelectItem value={String(PrioridadTriaje.Emergencia)}>🟠 Emergencia (Nivel 2)</SelectItem>
                    <SelectItem value={String(PrioridadTriaje.Urgencia)}>🟡 Urgencia (Nivel 3)</SelectItem>
                    <SelectItem value={String(PrioridadTriaje.UrgenciaMenor)}>🟢 Urgencia Menor (Nivel 4)</SelectItem>
                    <SelectItem value={String(PrioridadTriaje.SinUrgencia)}>🔵 Sin Urgencia (Nivel 5)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="temperatura">Temperatura (°C)</Label>
                <Input
                  id="temperatura"
                  type="number"
                  step="0.1"
                  value={formData.temperatura}
                  onChange={(e) => setFormData({ ...formData, temperatura: e.target.value })}
                  placeholder="36.5"
                  className="transition-all duration-200 focus:scale-[1.01]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="frecuenciaCardiaca">Frecuencia Cardíaca (lpm) *</Label>
                <Input
                  id="frecuenciaCardiaca"
                  type="number"
                  value={formData.frecuenciaCardiaca}
                  onChange={(e) => setFormData({ ...formData, frecuenciaCardiaca: e.target.value })}
                  placeholder="70"
                  className="transition-all duration-200 focus:scale-[1.01]"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="frecuenciaRespiratoria">Frecuencia Respiratoria (rpm) *</Label>
                <Input
                  id="frecuenciaRespiratoria"
                  type="number"
                  value={formData.frecuenciaRespiratoria}
                  onChange={(e) => setFormData({ ...formData, frecuenciaRespiratoria: e.target.value })}
                  placeholder="16"
                  className="transition-all duration-200 focus:scale-[1.01]"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tensionArterial">Tensión Arterial *</Label>
                <Input
                  id="tensionArterial"
                  value={formData.tensionArterial}
                  onChange={(e) => setFormData({ ...formData, tensionArterial: e.target.value })}
                  placeholder="120/80"
                  className="transition-all duration-200 focus:scale-[1.01]"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="informe">Motivo de Consulta / Informe *</Label>
              <Textarea
                id="informe"
                value={formData.informe}
                onChange={(e) => setFormData({ ...formData, informe: e.target.value })}
                placeholder="Describa el motivo de consulta y observaciones relevantes"
                rows={4}
                className="transition-all duration-200 focus:scale-[1.01]"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            disabled={loading}
          >
            <CheckCircle2 className="h-4 w-4" />
            {loading ? "Registrando..." : "Registrar Ingreso"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
