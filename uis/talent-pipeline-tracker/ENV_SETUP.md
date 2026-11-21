# Configuración de Variables de Entorno

## Requisitos de Configuración

Este proyecto requiere que se configuren las siguientes variables de entorno en un archivo `.env.local` en la raíz del directorio `talent-pipeline-tracker/`.

### Variables Obligatorias

```
NEXT_PUBLIC_API_URL=https://playground.4geeks.com/tracker/api/v1
```

**Descripción**: URL base de la API del Tracker de HealthCore.

### Variables Opcionales

```
NEXT_PUBLIC_API_TIMEOUT=10000
```

**Descripción**: Timeout para las peticiones a la API (en milisegundos). Por defecto: `10000`.

```
NEXT_PUBLIC_DEBUG=false
```

**Descripción**: Habilitar logging de debug en la consola. Por defecto: `false`.

## Procedimiento de Configuración

1. Crea un archivo `.env.local` en la raíz de este directorio:
   ```bash
   touch .env.local
   ```

2. Copia las variables obligatorias:
   ```
   NEXT_PUBLIC_API_URL=https://playground.4geeks.com/tracker/api/v1
   ```

3. (Opcional) Añade las variables opcionales si necesitas configuración personalizada.

4. Reinicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Notas Importantes

- El archivo `.env.local` está incluido en `.gitignore` y **no debe ser versionado**.
- Todas las variables prefijadas con `NEXT_PUBLIC_` estarán disponibles en el navegador.
- Las variables de entorno se cargan cuando inicia el servidor; cambios requieren reinicio.
- En producción, configura estas variables a través de tu plataforma de hosting (Vercel, AWS, etc.).

## Referencias

- Documentación oficial de Next.js sobre variables de entorno: https://nextjs.org/docs/basic-features/environment-variables
- Tracker API: https://playground.4geeks.com/tracker/api/v1/docs
