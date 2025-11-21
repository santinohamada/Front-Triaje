import { useMutation } from "@tanstack/react-query";
import { atencionService } from "@/services/atencion.service";

export const useReclamarSiguiente = () => {
  return useMutation({
    mutationFn: atencionService.reclamarSiguiente,
  });
};
