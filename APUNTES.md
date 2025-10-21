# Apuntes de Testing con Express

## **Cambio de Jest a Vitest**

### **¿Por qué cambié de Jest a Vitest?**

Cambié el proyecto de jest a vitest porque vitest es más rápido y ligero se integra muy bien con proyectos de javascript modernos y con vite además su configuración es más sencilla y las pruebas se ejecutan más rápido lo que mejora la experiencia al desarrollar

### **Proceso de migración:**

1. **Desinstalé Jest:**

   ```bash
   npm uninstall jest
   ```

2. **Instalé Vitest:**

   ```bash
   npm install --save-dev vitest @vitest/ui
   ```

3. **Actualicé package.json:**

   ````json
   "scripts": {
     "start": "node app.js",
     "test": "vitest",           // Comando principal para tests.
     "test:ui": "vitest --ui",   // Interfaz gráfica en el navegador.
     "test:run": "vitest run"    // Ejecuta todos los tests una sóla vez.
   }//el modo watch se activa por defecto al correr "vitest"y hace que los tests se recarguen automáticamente después de cada cambio.
   ```;

   ````

4. **Creé vitest.config.mjs:**

   ```javascript
   import { defineConfig } from "vitest/config";

   export default defineConfig({
     test: {
       globals: true, // Permite usar describe, test, expect sin importar
       environment: "node", // Perfecto para testing de APIs Express
     },
   });
   ```

### **¿Por qué necesito vitest.config.mjs?**

- **globals: true**: Permite usar `describe`, `test`, `expect` sin importarlos (como en Jest)
- **environment: 'node'**: Configura el entorno para aplicaciones Node.js/Express
- **Compatibilidad**: Mi app usa CommonJS (`require`) y este config hace que todo funcione junto

---

## He creado el archivo db-config.js para configurar la base de datos en memoria para los tests

## **Testing con Express y Supertest**

### **¿Cómo funciona el testing sin servidor real?**

No necesitamos levantar un servidor HTTP real en un puerto para hacer tests.
Además las herramientas como Supertest simulan las peticiones HTTP directamente a la aplicación Express en memoria.

#### **Lo que hace Supertest:**

```javascript
const request = require("supertest");
const app = require("../app"); // Importamos la app Express

// Supertest crea un servidor temporal solo para el test
const res = await request(app).get("/api/hello");
```

#### **¿Por qué no se abre puerto?**

1. **Supertest simula las peticiones HTTP** directamente a la aplicación Express
2. **No usa la red real** - todo sucede en memoria
3. **Más rápido** que levantar servidor real
4. **No hay conflictos de puertos** entre tests

#### **Diferencia clave en app.js:**

```javascript
// Exporta la app (importante para los tests)
module.exports = app;

// Solo levanta servidor si se ejecuta directamente
if (require.main === module) {
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
}
```

**Explicación:**

- **En tests**: Solo importamos `app` - no se ejecuta `app.listen()`
- **En desarrollo**: Ejecutamos `node app.js` - sí se levanta servidor en puerto 3000

---

## **Estructura de un test típico**

```javascript
const request = require("supertest");
const app = require("../app");

describe("GET /api/hello", () => {
  test("debería devolver código 200 y mensaje correcto", async () => {
    const res = await request(app).get("/api/hello");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: "hello world" });
  });
});
```

### **¿Qué hace cada parte?**

- **`request(app)`**: Supertest crea cliente HTTP temporal
- **`.get("/api/hello")`**: Simula petición GET a ese endpoint
- **`expect(res.statusCode).toBe(200)`**: Verifica código de estado
- **`expect(res.body).toEqual(...)`**: Verifica contenido de respuesta

---

## **Ventajas del enfoque con Supertest:**

- **Rápido**: No hay latencia de red real
- **Aislado**: Cada test es independiente
- **Confiable**: No depende de puertos disponibles
- **Completo**: Testa toda la cadena HTTP (middleware, rutas, respuestas)

---

ESTRUCTURA ENDPOINTS
Para definir un endpoint usamos la siguiente estructura :
app.MÉTODO("/ruta", (req, res) => {
// Aquí va la lógica
});

---

MONGOOSE
Mongoose es una librería de Node.js que sirve para conectar la app con MongoDb .MongoDB es una base de datos NoSQL y mongoose añade nuevas funcionalidades para como :
**Modelos:** definir cómo se ve un “documento” (una especie de “tabla” en SQL)
**Validaciones:** asegurarte de que los datos cumplen ciertas reglas antes de guardarlos
**Métodos:** funciones para consultar, actualizar o eliminar documentos más fácil
**Middleware:** funciones que se ejecutan durante el ciclo de vida de una solicitud HTTP
He instalado mongoose con npm install mongoose

---

MONGO MEMORY SERVER :
MongoDB Memory Server es una base de datos MongoDB que corre en memoria (RAM), solo para tests
Permite ejecutar código antes o después de ciertas operaciones
Instalo mongodb memory server para hacer pruebas con base de datos en memoria sin necesidad de un servidor real de MongoDB:
npm install --save-dev mongodb-memory-server
En la práctica,siempre se suele usar junto con mongoose .

---
