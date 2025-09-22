# SINAES App - Doctores (Frontend Web)

Aplicación web desarrollada en React con Vite para la gestión de citas médicas y control de información de pacientes por parte de los doctores.
Este frontend consume la API del backend de SINAES, permitiendo a los doctores gestionar su agenda, consultar expedientes médicos, y recibir notificaciones sobre citas.

---

## 🚀 Tecnologías utilizadas

- **React Native**: Framework principal para el desarrollo de la aplicación móvil.
- **JavaScript**: Tipado estático para mayor seguridad y mantenibilidad.
- **Zustand**: Librería ligera y rápida para gestión de estado global.
- **React Navigation**: Manejo de rutas y navegación entre pantallas.
- **Axios / Fetch API**: Consumo de la **API Backend**.


---

## 📂 Estructura del proyecto

```plaintext
SINAES-WEB/
├── public/                # Archivos estáticos (favicon, imágenes, etc.)
├── src/
│   ├── api/               # Conexiones y peticiones al backend
│   ├── assets/            # Recursos como imágenes, íconos y fuentes
│   ├── components/        # Componentes reutilizables
│   ├── hooks/             # Custom hooks
│   ├── pages/             # Páginas principales (Dashboard, Citas, Expedientes, etc.)
│   ├── routes/            # Definición de rutas con React Router
│   ├── utils/             # Funciones y helpers reutilizables
│   └── main.tsx           # Punto de entrada de la aplicación
├── index.html             # HTML principal
├── package.json           # Dependencias del proyecto
├── tsconfig.json          # Configuración TypeScript
└── vite.config.ts         # Configuración de Vite

```

⚙️ Requerimientos técnicos

    Node.js >= 18.x

    npm o yarn

    Navegador moderno

    Acceso a la API Backend (Node.js + Express + Prisma con base de datos en Supabase)



1. Clonar el repositorio:
   ```bash
   git clone https://github.com/tuusuario/tu-repositorio.git
   cd tu-repositorio
   ````

Instalar dependencias:

    npm install
     o
    yarn install

Ejecutar en modo desarrollo:

    npm run dev

Abrir en el Navegador:

    http://localhost:5173


📱 Funcionalidades principales

    Gestión de citas médicas: creación, modificación y cancelación.

    Acceso a expedientes clínicos: visualización y actualización de información de pacientes.

    Dashboard médico: métricas y reportes de citas, pacientes y estados.

    Gestión de personal: administración de médicos y enfermería.

    Notificaciones internas: recordatorios y alertas para el personal de salud.

    Configuración de hospital: administración de áreas y recursos.

📌 Notas

    La aplicación requiere conexión a internet para interactuar con el backend.

    El backend está implementado en Node.js + Express + Prisma, con base de datos en Supabase.

    Se recomienda configurar las variables de entorno en un archivo

## Author

- [@Cristopher Quintana](https://github.com/isCris-Q05)

