import { useMutation } from "@tanstack/react-query";
import { ingresoService } from "@/services/ingresos.service";
import { RegistroIngresoRequest } from "@/dto/atencion.dto";

export const useRegistrarIngreso = () => {
  return useMutation({
    mutationFn: ingresoService.registrarIngreso,
  });
};
