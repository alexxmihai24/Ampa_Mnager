# AMPA Manager 🏫

Sistema de gestión para Asociaciones de Madres y Padres de Alumnos (AMPA). Inspirado en el diseño de **iPasen**.

## 🚀 Características
- **Dashboard Dinámico**: Visualización de hijos/as, noticias del centro y tablón de anuncios.
- **Gestión de Actividades**: Inscripción visual con barras de progreso de plazas.
- **Control de Pagos**: Historial de recibos y seguimiento de deudas pendientes.
- **Autenticación Segura**: Sistema de login y registro con JWT y roles (Padre/Admin).
- **Base de Datos Cloud**: Integración con PostgreSQL (Neon.tech).

## 🛠️ Tecnologías
- **Frontend**: React, Vite, Bootstrap 5.
- **Backend**: Node.js, Express.
- **Base de Datos**: PostgreSQL.
- **Despliegue**: Preparado para Vercel.

## 📦 Instalación Local
1. Instalar dependencias: `npm install` (en raíz, client y server).
2. Configurar `.env` en `/server`.
3. Ejecutar: `npm run dev`.

## 🌐 Despliegue en Vercel
1. Conectar con GitHub.
2. Configurar variables de entorno: `DATABASE_URL` y `JWT_SECRET`.
3. ¡Listo!
