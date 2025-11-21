import { useQuery } from "@tanstack/react-query";
import { ingresoService } from "@/services/ingresos.service";

export const useObtenerPaciente = (cuil:string) => {
  return useQuery({
    queryKey: ["paciente"],
    queryFn: ()=>ingresoService.obtenerPaciente(cuil),
 
  });
};
