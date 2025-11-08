"use client"

import { useState, useEffect, useCallback } from "react"
import { ingresosService } from "@/services/ingresos"
import type { Ingreso } from "@/lib/types"

export function useIngresos() {
  const [ingresos, setIngresos] = useState<Ingreso[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchIngresos = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await ingresosService.getAll()
      setIngresos(data)
      setError(null)
    } catch (err) {
      setError("Error al cargar ingresos")
      console.error("[v0] Error al cargar ingresos:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchIngresos()

    // Actualizar cada 30 segundos
    const interval = setInterval(fetchIngresos, 30000)
    return () => clearInterval(interval)
  }, [fetchIngresos])

  const createIngreso = useCallback(async (ingreso: Omit<Ingreso, "id" | "fechaCreacion" | "tiempoEspera">) => {
    try {
      const newIngreso = await ingresosService.create(ingreso)
      setIngresos((prev) => [...prev, newIngreso])
      return newIngreso
    } catch (err) {
      setError("Error al crear ingreso")
      console.error("[v0] Error al crear ingreso:", err)
      throw err
    }
  }, [])

  const refresh = useCallback(() => {
    fetchIngresos()
  }, [fetchIngresos])

  return {
    ingresos,
    isLoading,
    error,
    createIngreso,
    refresh,
  }
}

export function useIngresoMedico(medicoId: string) {
  const [ingresoActual, setIngresoActual] = useState<Ingreso | null>(null)
  const [ingresosPrevios, setIngresosPrevios] = useState<Ingreso[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchIngresos = useCallback(async () => {
    try {
      setIsLoading(true)
      const [enProceso, todos] = await Promise.all([
        ingresosService.getEnProceso(medicoId),
        ingresosService.getByMedico(medicoId),
      ])

      setIngresoActual(enProceso)
      setIngresosPrevios(todos.filter((i) => i.estado === "FINALIZADO"))
      setError(null)
    } catch (err) {
      setError("Error al cargar ingresos")
      console.error("[v0] Error al cargar ingresos del médico:", err)
    } finally {
      setIsLoading(false)
    }
  }, [medicoId])

  useEffect(() => {
    fetchIngresos()

    const interval = setInterval(fetchIngresos, 15000)
    return () => clearInterval(interval)
  }, [fetchIngresos])

  const reclamarPaciente = useCallback(async () => {
    try {
      const ingreso = await ingresosService.reclamar(medicoId)
      if (ingreso) {
        setIngresoActual(ingreso)
        return ingreso
      }
      return null
    } catch (err) {
      setError("Error al reclamar paciente")
      console.error("[v0] Error al reclamar paciente:", err)
      return null
    }
  }, [medicoId])

  const finalizarAtencion = useCallback(
    async (ingresoId: string, informeMedico: string) => {
      try {
        const success = await ingresosService.finalizar(ingresoId, informeMedico)
        if (success) {
          await fetchIngresos()
          return true
        }
        return false
      } catch (err) {
        setError("Error al finalizar atención")
        console.error("[v0] Error al finalizar atención:", err)
        return false
      }
    },
    [fetchIngresos],
  )

  return {
    ingresoActual,
    ingresosPrevios,
    isLoading,
    error,
    reclamarPaciente,
    finalizarAtencion,
    refresh: fetchIngresos,
  }
}
