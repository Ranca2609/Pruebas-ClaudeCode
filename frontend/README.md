# Frontend - Sistema de Gestión de Inventario

Aplicación web frontend desarrollada con React + Vite para la gestión de productos e inventarios.

## Tecnologías

- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **React Router** - Navegación entre páginas
- **Axios** - Cliente HTTP para API REST

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno (opcional):
```bash
cp .env.example .env
```

## Modo Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

**Importante**: Asegúrate de que el backend esté corriendo en `http://localhost:3000`

## Modo Producción

```bash
# Compilar
npm run build

# Previsualizar build
npm run preview
```

## Características

### Dashboard
- 📊 Estadísticas generales del inventario
- 💰 Valor total del inventario
- ⚠️ Alertas de productos con stock bajo
- 📈 Métricas en tiempo real

### Gestión de Productos
- ✅ Listar todos los productos
- ➕ Crear nuevos productos
- ✏️ Editar productos existentes
- 🗑️ Eliminar productos
- 🔍 Búsqueda avanzada por nombre, SKU, categoría

### Gestión de Inventario
- 📦 Ver inventario completo con detalles
- 📝 Actualizar niveles de stock
- 📍 Gestionar ubicaciones en almacén
- 💵 Visualizar valor total por producto
- 🔔 Indicadores visuales de estado de stock

### Movimientos de Inventario
- 📥 Registrar entradas de stock (IN)
- 📤 Registrar salidas de stock (OUT)
- 🔧 Ajustes de inventario (ADJUSTMENT)
- 📋 Historial completo de movimientos
- 📅 Seguimiento con fecha y razón

## Estructura del Proyecto

```
frontend/
├── src/
│   ├── pages/              # Páginas de la aplicación
│   │   ├── DashboardPage.tsx
│   │   ├── ProductsPage.tsx
│   │   ├── InventoryPage.tsx
│   │   └── MovementsPage.tsx
│   ├── services/           # Servicios API
│   │   └── api.ts
│   ├── types/              # Tipos TypeScript
│   │   └── index.ts
│   ├── App.tsx            # Componente principal
│   ├── App.css            # Estilos globales
│   ├── main.tsx           # Punto de entrada
│   └── vite-env.d.ts      # Tipos de Vite
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## API Backend

El frontend se conecta al backend mediante proxy configurado en Vite:

- **Development**: Usa proxy `/api` → `http://localhost:3000`
- **Production**: Configura `VITE_API_URL` en `.env`

## Scripts Disponibles

- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Compila para producción
- `npm run preview` - Previsualiza build de producción
- `npm run lint` - Ejecuta ESLint

## Navegación

La aplicación tiene 4 secciones principales:

1. **Dashboard** (`/`) - Vista general y estadísticas
2. **Productos** (`/products`) - CRUD de productos
3. **Inventario** (`/inventory`) - Gestión de stock
4. **Movimientos** (`/movements`) - Historial de operaciones

## Características de UI

- 🎨 Diseño responsive (funciona en móviles y tablets)
- 🌈 Badges de colores para estados de stock
- 📋 Modales para formularios
- ⚡ Carga dinámica de datos
- ✅ Validación de formularios
- 🔔 Alertas y notificaciones

## Solución de Problemas

### Error de conexión al backend
- Verifica que el backend esté corriendo en el puerto 3000
- Revisa la configuración de CORS en el backend
- Comprueba la URL del API en `.env`

### La página está en blanco
- Revisa la consola del navegador para errores
- Asegúrate de haber ejecutado `npm install`
- Verifica que el puerto 5173 no esté en uso

### Errores de TypeScript
- Ejecuta `npm install` para asegurarte de tener todas las dependencias
- Verifica que los tipos estén correctamente definidos

## Personalización

### Cambiar el puerto de desarrollo
Edita `vite.config.ts`:
```typescript
server: {
  port: 3001, // tu puerto preferido
}
```

### Cambiar la URL del API
Edita `.env`:
```
VITE_API_URL=http://tu-servidor:puerto
```

## Licencia

ISC
