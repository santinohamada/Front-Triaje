import { useQuery } from "@tanstack/react-query";
import { atencionService } from "@/services/atencion.service";

export const useObtenerAtenciones = () => {
  return useQuery({
    queryKey: ["atenciones"],
    queryFn: atencionService.obtenerTodas,
  });
};
