import { config } from "@/lib/config"
import type { Ingreso, EstadoIngreso } from "@/lib/types"

const STORAGE_KEY = "hospital_ingresos"

const MOCK_INGRESOS: Ingreso[] = [
  {
    id: "1",
    fechaIngreso: new Date().toISOString(),
    informe: "Dolor de pecho intenso",
    prioridad: 1,
    estado: "PENDIENTE" as EstadoIngreso,
    frecuenciaCardiaca: 110,
    frecuenciaRespiratoria: 24,
    tensionArterial: "140/90",
    temperatura: 37.2,
    paciente: {
      id: "p1",
      dni: "12345678",
      nombreCompleto: "Carlos Ramírez",
      numeroAfiliado: "A12345",
      telefono: "1234567890",
      fechaNacimiento: "1980-05-15",
    },
    enfermeroId: "1",
    fechaCreacion: new Date(Date.now() - 10 * 60000).toISOString(),
    tiempoEspera: 10,
  },
  {
    id: "2",
    fechaIngreso: new Date().toISOString(),
    informe: "Fiebre alta y tos",
    prioridad: 3,
    estado: "PENDIENTE" as EstadoIngreso,
    frecuenciaCardiaca: 88,
    frecuenciaRespiratoria: 18,
    tensionArterial: "120/80",
    temperatura: 39.5,
    paciente: {
      id: "p2",
      dni: "87654321",
      nombreCompleto: "Ana Martínez",
      numeroAfiliado: "B54321",
      telefono: "0987654321",
      fechaNacimiento: "1992-08-20",
    },
    enfermeroId: "1",
    fechaCreacion: new Date(Date.now() - 25 * 60000).toISOString(),
    tiempoEspera: 25,
  },
]

function getIngresosMock(): Ingreso[] {
  if (typeof window === "undefined") return MOCK_INGRESOS

  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    return JSON.parse(stored)
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_INGRESOS))
  return MOCK_INGRESOS
}

function saveIngresosMock(ingresos: Ingreso[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ingresos))
}

function sortIngresos(ingresos: Ingreso[]): Ingreso[] {
  return ingresos.sort((a, b) => {
    if (a.prioridad !== b.prioridad) {
      return a.prioridad - b.prioridad
    }
    const tiempoA = new Date(a.fechaCreacion).getTime()
    const tiempoB = new Date(b.fechaCreacion).getTime()
    return tiempoA - tiempoB
  })
}

export const ingresosService = {
  async getAll(): Promise<Ingreso[]> {
    console.log("[v0] ingresosService.getAll llamado")

    if (config.useMocks) {
      await new Promise((resolve) => setTimeout(resolve, 300))
      const ingresos = getIngresosMock()
      return sortIngresos(ingresos)
    }

    try {
      const response = await fetch(`${config.apiUrl}/ingresos`)
      if (!response.ok) throw new Error("Error al obtener ingresos")
      return await response.json()
    } catch (error) {
      console.error("[v0] Error al obtener ingresos:", error)
      return []
    }
  },

  async create(ingreso: Omit<Ingreso, "id" | "fechaCreacion" | "tiempoEspera">): Promise<Ingreso> {
    console.log("[v0] ingresosService.create llamado")

    if (config.useMocks) {
      await new Promise((resolve) => setTimeout(resolve, 400))

      const newIngreso: Ingreso = {
        ...ingreso,
        id: Date.now().toString(),
        fechaCreacion: new Date().toISOString(),
        tiempoEspera: 0,
      }

      const ingresos = getIngresosMock()
      ingresos.push(newIngreso)
      saveIngresosMock(ingresos)
      return newIngreso
    }

    try {
      const response = await fetch(`${config.apiUrl}/ingresos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ingreso),
      })

      if (!response.ok) throw new Error("Error al crear ingreso")
      return await response.json()
    } catch (error) {
      console.error("[v0] Error al crear ingreso:", error)
      throw error
    }
  },

  async reclamar(medicoId: string): Promise<Ingreso | null> {
    console.log("[v0] ingresosService.reclamar llamado")

    if (config.useMocks) {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const ingresos = getIngresosMock()
      const sorted = sortIngresos(ingresos.filter((i) => i.estado === "PENDIENTE"))

      if (sorted.length === 0) return null

      const ingreso = sorted[0]
      ingreso.estado = "EN_PROCESO" as EstadoIngreso
      ingreso.medicoId = medicoId

      saveIngresosMock(ingresos)
      return ingreso
    }

    try {
      const response = await fetch(`${config.apiUrl}/ingresos/reclamar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ medicoId }),
      })

      if (!response.ok) return null
      return await response.json()
    } catch (error) {
      console.error("[v0] Error al reclamar paciente:", error)
      return null
    }
  },

  async finalizar(id: string, informeMedico: string): Promise<boolean> {
    console.log("[v0] ingresosService.finalizar llamado")

    if (config.useMocks) {
      await new Promise((resolve) => setTimeout(resolve, 400))

      const ingresos = getIngresosMock()
      const ingreso = ingresos.find((i) => i.id === id)

      if (!ingreso) return false

      ingreso.estado = "FINALIZADO" as EstadoIngreso
      ingreso.informeMedico = informeMedico
      ingreso.fechaFinalizacion = new Date().toISOString()

      saveIngresosMock(ingresos)
      return true
    }

    try {
      const response = await fetch(`${config.apiUrl}/ingresos/finalizar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, informeMedico }),
      })

      return response.ok
    } catch (error) {
      console.error("[v0] Error al finalizar atención:", error)
      return false
    }
  },

  async getByMedico(medicoId: string): Promise<Ingreso[]> {
    const ingresos = await this.getAll()
    return ingresos.filter((i) => i.medicoId === medicoId)
  },

  async getEnProceso(medicoId: string): Promise<Ingreso | null> {
    const ingresos = await this.getAll()
    return ingresos.find((i) => i.medicoId === medicoId && i.estado === "EN_PROCESO") || null
  },
}
