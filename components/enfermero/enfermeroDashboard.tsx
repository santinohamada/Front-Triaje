"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import {
  User,
  Activity,
  CheckCircle2,
  Search,
  Loader2,
  ArrowRight,
  Home,
  CreditCard
} from "lucide-react";

// Importamos la utilidad de Toast
import { toastUtils } from "../toastUtils";

import { REGISTRO_INGRESO_DEFAULT_VALUES, registroIngresoSchema, RegistroIngresoSchema } from "@/schemas/registroIngreso.schema";
import { PrioridadTriaje } from "@/types/Enums";
import { useRegistrarIngreso } from "@/hooks/ingreso/useRegistrarIngreso";
import api from "@/lib/axios"; 
import { RegistroIngresoRequest } from "@/dto/atencion.dto";

export function EnfermeroDashboard() {
  // Eliminamos loading manual, usaremos registrarIngresoMutation.isPending
  const [searching, setSearching] = useState(false);
  const [showFullForm, setShowFullForm] = useState(false);
  const [patientFound, setPatientFound] = useState(false);

  const form = useForm<RegistroIngresoSchema>({
    resolver: zodResolver(registroIngresoSchema),
    defaultValues: REGISTRO_INGRESO_DEFAULT_VALUES
  });

  const tieneObraSocialWatch = form.watch("tieneObraSocial");
  const registrarIngresoMutation = useRegistrarIngreso();

  const handleBuscarPaciente = async () => {
    const isValidCuil = await form.trigger("cuilPaciente");
    if (!isValidCuil) return;

    const cuil = form.getValues("cuilPaciente");
    setSearching(true);

    try {
      const { data } = await api.get(`/api/ingreso/buscar-por-cuil?cuil=${cuil}`).catch((err) => {
        // Si es 404 retornamos null data para manejarlo abajo, si es otro error lanzamos exception
        if (err.response && err.response.status === 404) return { data: null };
        throw err;
      });

      if (data) {
        form.setValue("nombrePaciente", data.nombre);
        form.setValue("apellidoPaciente", data.apellido);
        form.setValue("emailPaciente", data.email);
        
        if (data.domicilio) {
          form.setValue("calleDomicilio", data.domicilio.calle);
          form.setValue("numeroDomicilio", data.domicilio.numero);
          form.setValue("localidadDomicilio", data.domicilio.localidad);
        }

        if (data.afiliado) {
          form.setValue("tieneObraSocial", true);
          form.setValue("nombreObraSocial", data.afiliado.nombreObraSocial);
          form.setValue("numeroAfiliado", data.afiliado.numeroAfiliado);
        } else {
          form.setValue("tieneObraSocial", false);
          form.setValue("nombreObraSocial", "");
          form.setValue("numeroAfiliado", "");
        }

        setPatientFound(true);
        // USO DE TOAST UTIL: Éxito
        toastUtils.success("Paciente encontrado", "Datos cargados del padrón.");
      } else {
        setPatientFound(false);
      
        toastUtils.success("Paciente nuevo", "No se encontró en el sistema. Complete los datos.");
        
        form.setValue("nombrePaciente", "");
        form.setValue("apellidoPaciente", "");
        form.setValue("emailPaciente", "");
        form.setValue("calleDomicilio", "");
        form.setValue("numeroDomicilio", 0);
        form.setValue("localidadDomicilio", "");
        form.setValue("tieneObraSocial", false);
      }

      setShowFullForm(true);
    } catch (error) {
      console.error(error);
      // USO DE TOAST UTIL: Error de API
      toastUtils.showApiError("Error de conexión al buscar paciente.");
      setShowFullForm(true); 
    } finally {
      setSearching(false);
    }
  };

  const onSubmit = async (values: RegistroIngresoSchema) => {
    // Preparamos el DTO
    const dto: RegistroIngresoRequest = {
        cuilPaciente: values.cuilPaciente,
        nombrePaciente: values.nombrePaciente,
        apellidoPaciente: values.apellidoPaciente,
        emailPaciente: values.emailPaciente,
        calleDomicilio: values.calleDomicilio,
        numeroDomicilio: values.numeroDomicilio,
        localidadDomicilio: values.localidadDomicilio,
        nombreObraSocial: values.tieneObraSocial ? values.nombreObraSocial : undefined,
        numeroAfiliado: values.tieneObraSocial ? values.numeroAfiliado : undefined,
        informe: values.informe,
        nivelEmergencia: values.prioridad,
        temperatura: values.temperatura,
        frecuenciaCardiaca: values.frecuenciaCardiaca,
        frecuenciaRespiratoria: values.frecuenciaRespiratoria,
        tensionSistolica: values.tensionSistolica,
        tensionDiastolica: values.tensionDiastolica,
    };

    // Creamos la promesa de la mutación
    const promise = registrarIngresoMutation.mutateAsync(dto);

 
    toastUtils.toastPromise(promise, {
        loading: "Registrando ingreso...",
        success: () => {
            form.reset();
            setShowFullForm(false);
            setPatientFound(false);
            return "Ingreso registrado correctamente";
        },
        error: (err) => {
           console.error(err.response.data)
            const apiErrors = err?.response;
            if (apiErrors && apiErrors.length > 0) {
                 // Mostramos los errores detallados poco después
                 setTimeout(() => toastUtils.showApiError(apiErrors), 100);
                 return "Hubo errores de validación";
            }
            return err?.response.data || "Error al registrar el ingreso";
        }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 animate-fade-in">
        
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-2 mb-4">
            <div className="bg-primary/10 p-2 rounded-full">
               <Search className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">1. Identificación</h3>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            <FormField
              control={form.control}
              name="cuilPaciente"
              render={({ field }) => (
                <FormItem className="flex-1 w-full">
                  <FormLabel>CUIL del Paciente</FormLabel>
                  <FormControl>
                    <div className="relative">
                        <Input 
                            {...field} 
                            placeholder="Ej: 20301234567" 
                            autoFocus
                            disabled={showFullForm} 
                        />
                        {showFullForm && (
                            <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                        )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!showFullForm && (
              <Button 
                type="button" 
                onClick={handleBuscarPaciente}
                disabled={searching}
                className="w-full sm:w-auto min-w-[140px]"
              >
                {searching ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Buscando...
                  </>
                ) : (
                  <> Continuar <ArrowRight className="ml-2 h-4 w-4" /> </>
                )}
              </Button>
            )}
            
            {showFullForm && (
                <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => {
                        setShowFullForm(false);
                        setPatientFound(false);
                        form.reset();
                    }}
                    className="text-sm text-muted-foreground hover:text-destructive"
                >
                    Cambiar Paciente
                </Button>
            )}
          </div>
        </div>

        {showFullForm && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            
            {/* DATOS PERSONALES */}
            <div className="bg-accent/20 p-4 rounded-lg border space-y-4">
                <h3 className="font-semibold text-sm flex items-center gap-2 text-muted-foreground border-b pb-2">
                    <User className="h-4 w-4" /> Datos Personales
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="nombrePaciente"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nombre</FormLabel>
                            <FormControl>
                            <Input {...field} disabled={patientFound} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="apellidoPaciente"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Apellido</FormLabel>
                            <FormControl>
                            <Input {...field} disabled={patientFound} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="emailPaciente"
                        render={({ field }) => (
                        <FormItem className="sm:col-span-2">
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                            <Input {...field} disabled={patientFound} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
            </div>

            {/* DOMICILIO */}
            <div className="bg-accent/20 p-4 rounded-lg border space-y-4">
                <h3 className="font-semibold text-sm flex items-center gap-2 text-muted-foreground border-b pb-2">
                    <Home className="h-4 w-4" /> Domicilio
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                    <div className="sm:col-span-6">
                        <FormField
                            control={form.control}
                            name="calleDomicilio"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Calle</FormLabel>
                                <FormControl>
                                <Input {...field} disabled={patientFound} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <FormField
                            control={form.control}
                            name="numeroDomicilio"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Número</FormLabel>
                                <FormControl>
                                <Input type="number" {...field} disabled={patientFound} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                    <div className="sm:col-span-4">
                        <FormField
                            control={form.control}
                            name="localidadDomicilio"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Localidad</FormLabel>
                                <FormControl>
                                <Input {...field} disabled={patientFound} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                </div>
            </div>

            {/* COBERTURA */}
            <div className="bg-accent/20 p-4 rounded-lg border space-y-4">
                <h3 className="font-semibold text-sm flex items-center gap-2 text-muted-foreground border-b pb-2">
                    <CreditCard className="h-4 w-4" /> Cobertura Médica
                </h3>
                
                <FormField
                    control={form.control}
                    name="tieneObraSocial"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 bg-background">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">Obra Social / Prepaga</FormLabel>
                                <FormDescription>Activar si el paciente posee cobertura</FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={patientFound && form.getValues("nombreObraSocial") !== ""}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                {tieneObraSocialWatch && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                        <FormField
                            control={form.control}
                            name="nombreObraSocial"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre Obra Social</FormLabel>
                                <FormControl>
                                <Input {...field} disabled={patientFound && field.value !== ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="numeroAfiliado"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Número de Afiliado</FormLabel>
                                <FormControl>
                                <Input {...field} disabled={patientFound && field.value !== ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                )}
            </div>

            {/* TRIAJE Y SIGNOS VITALES */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm flex items-center gap-2 border-b pb-2">
                <Activity className="h-4 w-4" />
                Triaje y Signos Vitales
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="prioridad"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-3 lg:col-span-1">
                      <FormLabel className="text-primary font-bold">Prioridad de Atención</FormLabel>
                      <Select onValueChange={(v) => field.onChange(Number(v) as PrioridadTriaje)}>
                        <FormControl>
                          <SelectTrigger className="border-primary/50 bg-primary/5">
                            <SelectValue placeholder="Seleccione prioridad" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={String(PrioridadTriaje.Critico)}>🔴 Crítico</SelectItem>
                          <SelectItem value={String(PrioridadTriaje.Emergencia)}>🟠 Emergencia</SelectItem>
                          <SelectItem value={String(PrioridadTriaje.Urgencia)}>🟡 Urgencia</SelectItem>
                          <SelectItem value={String(PrioridadTriaje.UrgenciaMenor)}>🟢 Urgencia Menor</SelectItem>
                          <SelectItem value={String(PrioridadTriaje.SinUrgencia)}>🔵 Sin Urgencia</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {[
                  ["temperatura", "Temperatura (°C)"],
                  ["frecuenciaCardiaca", "Frecuencia Cardíaca"],
                  ["frecuenciaRespiratoria", "Frecuencia Respiratoria"],
                  ["tensionSistolica", "Tensión Sistólica"],
                  ["tensionDiastolica", "Tensión Diastólica"],
                ].map(([name, label]) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{label}</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              <FormField
                control={form.control}
                name="informe"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Motivo / Informe de Ingreso</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={4} placeholder="Describa los síntomas..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="pt-4">
                {/* Usamos el estado isPending de React Query en lugar del loading local */}
                <Button type="submit" size="lg" className="w-full gap-2 shadow-lg" disabled={registrarIngresoMutation.isPending}>
                {registrarIngresoMutation.isPending ? (
                    <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registrando... </>
                ) : (
                    <> <CheckCircle2 className="h-5 w-5" /> Confirmar y Registrar Ingreso </>
                )}
                </Button>
            </div>
          </div>
        )}
      </form>
    </Form>
  );
}