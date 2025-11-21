import { useMutation } from "@tanstack/react-query";
import { atencionService } from "@/services/atencion.service";

export const useRegistrarAtencion = () => {
  return useMutation({
    mutationFn: atencionService.registrarAtencion,
  });
};
