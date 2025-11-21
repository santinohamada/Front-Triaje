import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";

export const useRegister = () => {
  return useMutation({
    mutationFn: ({ dto, rol }: { dto: any; rol: "Enfermero" | "Medico" }) =>
      authService.register(dto, rol),
  });
};
