"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getToken, getUsuario, clearSession, StoredUser } from "@/lib/authStorage";
import { Rol } from "@/types/Enums"; 

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: Rol[] | string[]; // Flexible para aceptar el Enum o strings
}

export function RouteGuard({ children, allowedRoles }: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname(); // Útil para depurar o evitar redirecciones cíclicas
  const [isChecking, setIsChecking] = useState(true);
  const [usuario, setUsuario] = useState<StoredUser | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = getToken();
      const user = getUsuario();

   
      if (!token || !user) {
        clearSession(); 
       
        if (pathname !== "/") {
            router.replace("/");
        }
        setIsChecking(false);
        return;
      }

      setUsuario(user);

  
      if (allowedRoles && allowedRoles.length > 0) {
     
        const tienePermiso = allowedRoles.includes(user.rol as any);

        if (!tienePermiso) {
       
          console.warn(`Acceso denegado. Rol usuario: ${user.rol}, Permitidos: ${allowedRoles}`);
          router.replace("/dashboard"); 
          setIsChecking(false);
          return;
        }
      }

      // 3. Todo correcto
      setIsChecking(false);
    };

    checkAuth();
  }, [router, allowedRoles, pathname]);

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground text-sm font-medium">Verificando acceso...</p>
        </div>
      </div>
    );
  }

 
  if (!usuario) return null;

 
  return <>{children}</>;
}