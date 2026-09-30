<!-- ============================================================
     README · E-commerce Básico
     Paleta: navy #0a1628 · dorado #f0b429 · cian #22d3ee
     ============================================================ -->

<h1 align="center">
  🛒 E-commerce Básico
</h1>

<p align="center">
  <strong>Tienda online funcional</strong> con catálogo de productos, carrito persistente y flujo de venta completo.
</p>

<p align="center">
  <a href="#-demo"><img src="https://img.shields.io/badge/Demo-en_vivo-f0b429?style=for-the-badge&logo=vercel&logoColor=0a1628&labelColor=0a1628" alt="Demo"></a>
  <a href="#-instalación"><img src="https://img.shields.io/badge/Docs-Instalación-22d3ee?style=for-the-badge&logo=readthedocs&logoColor=0a1628&labelColor=0a1628" alt="Instalación"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/Licencia-MIT-a8b8cc?style=for-the-badge&logo=opensourceinitiative&logoColor=0a1628&labelColor=0a1628" alt="Licencia MIT"></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=0a1628&labelColor=0a1628" alt="React">
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white&labelColor=0a1628" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white&labelColor=0a1628" alt="Node.js">
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white&labelColor=0a1628" alt="Express">
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white&labelColor=0a1628" alt="MongoDB">
</p>

---

## 📖 Sobre el proyecto

**E-commerce Básico** es una tienda online completamente funcional construida como proyecto de portafolio. Cubre el ciclo completo de una compra: desde que el usuario explora el catálogo hasta que confirma su pedido.

El objetivo principal fue demostrar dominio del stack **MERN** (MongoDB, Express, React, Node.js) aplicado a un caso real, priorizando:

- 🎯 **Experiencia de usuario clara** — flujo de compra sin fricción, estados visibles y feedback inmediato.
- ⚡ **Rendimiento** — carga diferida de rutas, optimización de imágenes y consultas eficientes a la base de datos.
- ♿ **Accesibilidad** — navegación por teclado, roles ARIA y contraste de color conforme a WCAG AA.
- 🧩 **Código mantenible** — separación clara entre cliente y servidor, componentes reutilizables y tipado consistente.

---

## ✨ Características principales

### 🛍️ Catálogo de productos
- Listado con paginación y búsqueda por texto.
- Filtros por categoría, rango de precio y disponibilidad.
- Ordenamiento por precio, novedad y popularidad.
- Vista de detalle con galería, variantes y stock en tiempo real.

### 🛒 Carrito de compras
- Añadir, actualizar y eliminar productos sin recargar la página.
- Persistencia en `localStorage` para usuarios no autenticados.
- Sincronización automática con la cuenta al iniciar sesión.
- Cálculo dinámico de subtotal, impuestos y envío.

### 💳 Flujo de venta
- Formulario de checkout con validación en cliente y servidor.
- Direcciones de envío y facturación independientes.
- Resumen del pedido antes de confirmar.
- Generación de número de orden y correo de confirmación.

### 🔐 Autenticación
- Registro e inicio de sesión con **JWT**.
- Contraseñas hasheadas con `bcrypt`.
- Rutas protegidas en el frontend y middleware de autorización en el backend.

### 🛠️ Panel de administración
- CRUD completo de productos.
- Gestión de pedidos con estados: *pendiente · pagado · enviado · entregado*.
- Métricas básicas: ventas totales, productos más vistos, ticket promedio.

---

## 🧰 Stack tecnológico

| Capa | Tecnología | Uso |
|------|-----------|-----|
| **Frontend** | React 18 + Vite | Interfaz SPA con HMR ultrarrápido |
| | Tailwind CSS | Sistema de diseño y utilidades |
| | React Router | Enrutado del cliente |
| | Context API + Zustand | Estado global ligero (carrito, auth) |
| **Backend** | Node.js + Express | API REST |
| | MongoDB + Mongoose | Base de datos NoSQL y modelado |
| | JWT + bcrypt | Autenticación y seguridad |
| | Multer | Subida de imágenes de productos |
| **Herramientas** | ESLint + Prettier | Calidad y estilo de código |
| | Vitest + Supertest | Tests unitarios e integración |
| | Docker Compose | Entorno de desarrollo reproducible |

---

## 📂 Estructura del proyecto
