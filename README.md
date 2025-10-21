# Express Testing Project - Jest to Vitest Migration

Una aplicación Express completa que demuestra **testing** con migración de Jest a Vitest, implementación de TDD y múltiples tipos de pruebas (unitarias, de integración y funcionales).

## **Descripción del Proyecto**

Este proyecto documenta el proceso completo de migración de Jest a Vitest en una aplicación Express, implementando diferentes estrategias de testing y metodología TDD (Test-Driven Development).

## **Características Principales**

- **API REST** con Express.js
- **Testing completo** con Vitest y Supertest
- **Base de datos** MongoDB con Mongoose
- **MongoDB Memory Server** para testing en memoria y aislado
- **TDD Implementation** con ejemplos reales
- **Documentación detallada** del proceso de aprendizaje

## **Tecnologías Utilizadas**

Indicando la categoría y la tecnología empleada:
| **Backend** | Node.js . Express.js |
| **Testing** | Vitest . Supertest |
| **Base de Datos** | MongoDB . Mongoose |
| **Testing DB** | MongoDB Memory Server |
| **Desarrollo** | TDD . API REST |

## **Estructura del Proyecto**

```
TestExpress/
├──  app.js                 # Aplicación Express principal
├──  user.js                # Modelo de usuario con Mongoose
├──  package.json           # Dependencias y scripts
├──  vitest.config.mjs      # Configuración de Vitest
├──  tests/
│   ├──  app.test.js        # Tests de endpoints y funcionalidad
│   └──  db-config.js       # Configuración de DB en memoria
├──  **Documentación:**
├──  APUNTES.md             # Proceso de migración Jest → Vitest
├──  TIPOS-DE-PRUEBAS.md    # Teoría sobre tipos de testing
└──  REFLEXION-TDD.md       # Análisis y beneficios de TDD
```

## **Instalación y Uso**

### **Prerequisitos**

- Node.js (v20.14.0 o superior)
- npm (v10.7.0 o superior)

### **1. Clonar el repositorio**

```bash
git clone https://github.com/Anitasoyyo/Testing.git
cd Testing
```

### **2. Instalar dependencias**

```bash
npm install
```

### **3. Ejecutar la aplicación**

```bash
npm start
```

La aplicación estará disponible en `http://localhost:3000`

### **4. Ejecutar tests**

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests una vez
npm run test:run

# Ejecutar tests con interfaz gráfica
npm run test:ui
```

## **Endpoints Disponibles**

### **Endpoints Básicos**

- `GET /api/hello` - Saludo básico o personalizado
- `POST /api/echo` - Devuelve el mensaje enviado
- `GET /api/greeting` - Saludo en texto plano

### **Endpoints de Usuarios**

- `POST /api/users` - Crear nuevo usuario
- `GET /api/users` - Obtener todos los usuarios
- `GET /api/users/:id` - Obtener usuario por ID
- `PUT /api/users/:id` - Actualizar usuario

### **Endpoints de Autenticación**

- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión

## **Tipos de pruebas que he implementado**

### ** Pruebas Unitarias**

Validan funciones individuales del modelo User

### ** Pruebas de Integración**

Verifican la interacción entre endpoints y la base de datos

### ** Pruebas Funcionales**

Simulan el flujo completo del usuario con el registro y login

### ** TDD (Test-Driven Development)**

Implementación paso a paso del endpoint `/api/greeting` siguiendo el flujo de TDD:escribir código para que falle, luego para que pase y finalmente refactorizar.

## **Documentación que incluyo:**

`APUNTES.md` Proceso completo de migración Jest → Vitest ya que es más moderno y utilizado actualmente
`TIPOS-DE-PRUEBAS.md` Teoría y diferencias entre pruebas unitarias, de integración y funcionales
`REFLEXION-TDD.md` Beneficios y desafíos de TDD

---
