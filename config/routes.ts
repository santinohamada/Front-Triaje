export const API_ROUTES = {
  auth: {
    base: "/api/auth",
    register: (rol: "Enfermero" | "Medico") => `/api/auth/registrar?rol=${rol}`,
    login: `/api/auth/login`,
    whoami: `/api/auth/quiensoy`,
  },

  ingreso: {
    base: "/api/ingreso",
    registrar: "/api/ingreso/registrar",
    colaAtencion: "/api/ingreso/cola-atencion",
    obtenerPaciente: "/api/ingreso/buscar-por-cuil",
  },

  atencion: {
    base: "/api/atencion",
    obtenerTodas: "/api/atencion",
    reclamarSiguiente: "/api/atencion/reclamar-siguiente",
    registrarAtencion: "/api/atencion/registrar",
  },
};
