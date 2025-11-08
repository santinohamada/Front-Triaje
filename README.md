# Sistema de Guardia Hospitalaria

Sistema de gestión para guardia hospitalaria con dos roles: Enfermero y Médico.

## Características

### Rol Enfermero
- Registrar ingresos de pacientes con triaje completo
- Ver listado de todos los pacientes en guardia
- Registrar signos vitales y nivel de prioridad

### Rol Médico
- Reclamar pacientes automáticamente por prioridad y tiempo de espera
- Atender un paciente a la vez
- Registrar informe médico al finalizar la atención
- Ver historial de pacientes atendidos

## Configuración

### Modo Mock (Desarrollo sin Backend)

El sistema puede funcionar completamente sin un backend real usando mocks y localStorage:

1. Crear archivo `.env.local`:
\`\`\`env
NEXT_PUBLIC_USE_MOCKS=true
\`\`\`

2. Los datos se guardan en localStorage del navegador
3. Usuarios de prueba disponibles:
   - Enfermero: `enfermero1` / `enfermero123`
   - Médico: `medico1` / `medico123`

### Modo Producción (Con Backend Real)

1. Configurar variables de entorno:
\`\`\`env
NEXT_PUBLIC_USE_MOCKS=false
NEXT_PUBLIC_API_URL=https://api.example.com
\`\`\`

2. El backend debe implementar los siguientes endpoints:
   - `POST /api/auth/login` - Autenticación
   - `GET /api/ingresos` - Listar ingresos
   - `POST /api/ingresos` - Crear ingreso
   - `POST /api/ingresos/reclamar` - Reclamar paciente
   - `POST /api/ingresos/finalizar` - Finalizar atención

## Arquitectura

- **Services**: Capa de servicios para comunicación con API o mocks
- **Hooks**: Custom hooks para gestión de estado y lógica de negocio
- **Components**: Componentes reutilizables con protección de rutas
- **Route Guards**: Protección de rutas por roles de usuario

## Tecnologías

- Next.js 16 con App Router
- TypeScript
- Tailwind CSS v4
- shadcn/ui components
- React Hooks
