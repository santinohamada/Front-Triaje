import  api  from "@/lib/axios";
import { API_ROUTES } from "@/config/routes";
import type {
  LoginResponse,
  RegisterResponse,
  WhoAmIResponse} from "@/dto/atencion.dto";
import { clearSession, setSession } from "@/lib/authStorage";

export const authService = {
  async login(data: { email: string; password: string }) {
    const res = await api.post<LoginResponse>(API_ROUTES.auth.login, data);

    if (res.data.esExitoso && res.data.token) {
    
      setSession(res.data.token, {
        email: res.data.email,
        rol: res.data.rol || "" 
      });
    }

    return res.data;
  },

  
  logout() {
    clearSession(); // Usamos tu helper
    // Opcional: Redireccionar o recargar
    window.location.href = "/";
  },
  async register(dto: any, rol: "Enfermero" | "Medico") {
    const res = await api.post<RegisterResponse>(
      API_ROUTES.auth.register(rol),
      dto
    );
    return res.data;
  },

  async whoAmI() {
    const res = await api.get<WhoAmIResponse>(API_ROUTES.auth.whoami);
    return res.data;
  },

 
};
