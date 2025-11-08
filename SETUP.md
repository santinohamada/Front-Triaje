# Configuración Inicial del Sistema

## Variables de Entorno Requeridas

Para que el sistema funcione correctamente, debes configurar las siguientes variables de entorno:

### Desarrollo (Modo Mock)

Agrega esta variable en la sección **Vars** del sidebar de v0:

- **Variable**: `NEXT_PUBLIC_USE_MOCKS`
- **Valor**: `true`

Con esta configuración, el sistema funcionará completamente sin backend, usando datos simulados en localStorage.

### Producción (Con Backend Real)

Si tienes un backend real, configura:

- **Variable**: `NEXT_PUBLIC_USE_MOCKS`
- **Valor**: `false`

- **Variable**: `NEXT_PUBLIC_API_URL`  
- **Valor**: La URL de tu backend (ej: `https://api.tudominio.com`)

## Usuarios de Prueba (Modo Mock)

### Enfermero
- **Usuario**: `enfermero1`
- **Contraseña**: `enfermero123`

### Médico
- **Usuario**: `medico1`
- **Contraseña**: `medico123`

## Arquitectura del Sistema

El sistema está diseñado para funcionar sin backend mediante servicios que pueden trabajar con:

1. **Mocks + localStorage**: Para desarrollo y pruebas
2. **API REST real**: Para producción

Los servicios (`authService` e `ingresosService`) cambian automáticamente su comportamiento según la variable `NEXT_PUBLIC_USE_MOCKS`.

## Protección de Rutas

Las rutas están protegidas mediante el componente `RouteGuard` que valida:
- Usuario autenticado
- Rol apropiado para cada sección

## Hooks Personalizados

- `useAuth()`: Gestión de autenticación y sesión
- `useIngresos()`: CRUD de ingresos para enfermeros
- `useIngresoMedico()`: Gestión de atención médica

Todos los hooks consumen los servicios de manera centralizada.
