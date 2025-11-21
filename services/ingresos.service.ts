import  api  from "@/lib/axios";
import { API_ROUTES } from "@/config/routes";
import { IngresoResponse, ObtenerPacienteResponse, RegistroIngresoRequest } from "@/dto/atencion.dto";
import { ColaAtencionResponse } from "@/dto/atencion.dto";

export const ingresoService = {
  async registrarIngreso(request: RegistroIngresoRequest) {
    const res = await api.post<IngresoResponse>(
      API_ROUTES.ingreso.registrar,
      request
    );
    return res.data;
  },

  async obtenerColaAtencion() {
    const res = await api.get<ColaAtencionResponse>(
      API_ROUTES.ingreso.colaAtencion
    );
    return res.data;
  },
  async obtenerPaciente(cuil:string) {
    const res = await api.get<ObtenerPacienteResponse>(
      API_ROUTES.ingreso.obtenerPaciente,
      {params:{cuil}}
    );
    return res.data;
  },
};
