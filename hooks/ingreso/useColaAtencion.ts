import { useQuery } from "@tanstack/react-query";
import { ingresoService } from "@/services/ingresos.service";

export const useColaAtencion = () => {
  return useQuery({
    queryKey: ["cola-atencion"],
    queryFn: ingresoService.obtenerColaAtencion,
    refetchInterval: 3000, // Opcional: refresca cada 3s
  });
};
