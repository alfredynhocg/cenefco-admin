# Frontend Alcaldía Municipal

Frontend Angular para el portal institucional de la Alcaldía Municipal. Proporciona la interfaz pública y de administración para noticias, comunicados, eventos, normativas, trámites ciudadanos, transparencia y gestión de contenidos.

---

## Módulos principales

| Módulo | Descripción |
| --- | --- |
| **Noticias** | Visualización y filtrado de noticias municipales |
| **Comunicados** | Publicación de avisos y notas de prensa |
| **Eventos** | Agenda de actividades y eventos municipales |
| **Normas** | Consulta de leyes, decretos y resoluciones |
| **Trámites** | Catálogo de servicios ciudadanos y requisitos |
| **Transparencia** | Acceso a documentos de gestión y reportes |
| **Secretarías** | Presentación de estructura orgánica y responsabilidades |
| **Autoridades** | Directorio de autoridades y funcionarios |
| **Organigrama** | Visualización de la organización institucional |
| **Presupuesto** | Reportes de presupuesto y ejecución financiera |
| **Indicadores** | Datos de gestión histórica por área |
| **Consultas Ciudadanas** | Encuestas y procesos participativos |
| **Sugerencias** | Canal de retroalimentación ciudadana |
| **Directorio Institucional** | Contactos internos de la alcaldía |
| **Banners y Menús** | Gestión de contenido visual y navegación |
| **Usuarios y Roles** | Control de acceso para gestores del portal |

---

## Arquitectura del frontend

Aplicación Angular generada con Angular CLI y basada en la estructura estándar:

```text
src/
├── app/           # Componentes, servicios, rutas y módulos
├── assets/        # Imágenes, estilos y recursos estáticos
├── environments/  # Variables de entorno de desarrollo/producción
├── styles.scss    # Estilos globales
└── main.ts        # Punto de entrada de la aplicación
```

- **Componentes**: UI reutilizable para cada sección del portal.
- **Servicios**: consumo de API REST para obtener datos dinámicos.
- **Routing**: navegación de la aplicación con rutas protegidas.
- **Assets**: recursos estáticos y dependencias de terceros.

---

## Stack tecnológico

| Tecnología | Versión | Descripción |
| --- | --- | --- |
| **Angular** | `^20.1.0` | Framework principal |
| **TypeScript** | `~5.8.2` | Tipado estático |
| **TailwindCSS** | `^4.1.11` | Estilos utilitarios |
| **ApexCharts** | `^5.3.5` | Gráficas y reportes |
| **Angular Signals** | — | Estado reactivo con zoneless |
| **FullCalendar** | `^6.1.19` | Calendarios y eventos |
| **SweetAlert2** | `^11.26.22` | Alertas interactivas |

---

## Inicio rápido

### Prerrequisitos

- Node.js `>=18.x`
- npm `>=10.x`
- Angular CLI opcional

### Instalación

```bash
cd admin_alcaldia
npm install
```

### Servidor de desarrollo

```bash
npm start
```

Abre `http://localhost:4200/` en tu navegador.

### Build de producción

```bash
npm run build
```

### Pruebas unitarias

```bash
npm test
```

---

## Comandos útiles

| Script | Descripción |
| --- | --- |
| `npm start` | Inicia el servidor de desarrollo |
| `npm run build` | Genera la build de producción |
| `npm run watch` | Build en modo observación |
| `npm test` | Ejecuta pruebas unitarias |

---

## Notas importantes

- El código fuente principal está en `src/app`.
- Ajusta la configuración de la API en `src/environments` si es necesario.
- Para crear nuevos componentes, usa `ng generate component nombre`.
- El proyecto puede usar componentes standalone y Angular Signals.

---

## Recursos

- [Angular CLI](https://angular.io/cli)
- [Documentación Angular](https://angular.io/)
