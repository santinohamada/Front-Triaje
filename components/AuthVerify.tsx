"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getToken, getUsuario } from "@/lib/authStorage";



interface AuthVerifyProps {
  children: React.ReactNode;
  allowedRoles?: string[]; // Opcional: para proteger por rol (ej: solo Medicos)
}

export default function AuthVerify({ children, allowedRoles }: AuthVerifyProps) {
  const router = useRouter();
  const pathname = usePathname(); // Útil para evitar bucles si ya estás en login
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // 1. Verificar si hay token
    const token = getToken();
    const usuario = getUsuario();

    if (!token || !usuario) {
      // Si no hay credenciales y no estamos ya en el login
      if (pathname !== "/") {
        router.replace("/"); // .replace evita que puedan volver atrás con el botón del navegador
      }
      setIsAuthorized(false);
      return;
    }

    // 2. Verificar Roles (Opcional pero recomendado)
    if (allowedRoles && allowedRoles.length > 0) {
      if (!allowedRoles.includes(usuario.rol)) {
        // Si tiene token pero no el rol adecuado, mandar a una página de "No autorizado" o al Home
        // Por ahora, lo mandamos al login o dashboard por defecto
        router.replace("/dashboard"); // O donde prefieras
        setIsAuthorized(false);
        return;
      }
    }

    // 3. Todo correcto
    setIsAuthorized(true);
  }, [router, pathname, allowedRoles]);

  // Mientras verifica, no mostramos nada (o podrías mostrar un Spinner)
  if (!isAuthorized) {
    return null; 
    // return <div className="h-screen flex items-center justify-center">Cargando...</div>;
  }

  return <>{children}</>;
}