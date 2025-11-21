import { useQuery } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";

export const useWhoAmI = () => {
  return useQuery({
    queryKey: ["whoami"],
    queryFn: authService.whoAmI,
  });
};
