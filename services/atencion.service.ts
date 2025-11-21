import  api  from "@/lib/axios";
import { API_ROUTES } from "@/config/routes";
import type {
  ObtenerTodasAtencionesResponse,
  ReclamarSiguienteResponse,
  RegistrarAtencionResponse,
} from "@/dto/atencion.dto";

export const atencionService = {
  async obtenerTodas() {
    const res = await api.get<ObtenerTodasAtencionesResponse>(
      API_ROUTES.atencion.obtenerTodas
    );
    return res.data;
  },

  async reclamarSiguiente() {
    const res = await api.get<ReclamarSiguienteResponse>(
      API_ROUTES.atencion.reclamarSiguiente
    );
    return res.data;
  },

  async registrarAtencion(dto: any) {
    const res = await api.post<RegistrarAtencionResponse>(
      API_ROUTES.atencion.registrarAtencion,
      dto
    );
    return res.data;
  },
};
