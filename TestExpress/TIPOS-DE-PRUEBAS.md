# Investigación: Tipos de Pruebas

**Diferencias entre Pruebas Unitarias, de Integración y Funcionales**

**Pruebas Unitarias**

**¿Qué prueban?**

- Una función o método individual de forma aislada
- Se enfocan en la lógica interna de una unidad **específica** de código
- No dependen de sistemas externos como bases de datos, APIs, etc...

**Características:**
Tienen un alcance muy limitado , en cuanto a la velocidad son muy rápidas de ejecutar .
Usan mocks para dependencias externas.

**Ejemplo en esta app:**

```javascript
// Probar solo la validación del modelo User
test("debería fallar si el name tiene menos de 3 caracteres", () => {
  const user = new User({ name: "Jo", email: "jo@email.com" });
  expect(user.validateSync().errors.name).toBeDefined();
});
```

---

**Las pruebas de Integración**

**¿Qué prueban?**

- Cómo interactúan múltiples componentes entre sí
- La comunicación entre diferentes módulos del sistema
- Que los datos fluyen correctamente entre componentes

**Características:**
Tienen un alcance más amplio que las unitarias , por lo que son más lentas de ejecutar .
Pueden usar sistemas reales (DB en memoria, servicios externos simulados).
El propósito es verificar que los componentes se integran correctamente.

**Ejemplo en esta app:**

```javascript
// Probar que el endpoint POST /api/users guarda correctamente en la base de datos
test("debería crear un usuario y almacenarlo en la base de datos", async () => {
  const res = await request(app)
    .post("/api/users")
    .send({ name: "Juan", email: "juan@email.com" });

  expect(res.statusCode).toBe(201);
  // Aquí se prueban: endpoint + validación + guardado en DB y por eso es esencial una prueba de integración
});
```

---

**Pruebas Funcionales**

**¿Qué prueban?**

- Flujos completos desde la perspectiva del usuario final
- Escenarios de negocio completos de principio a fin
- Que toda la aplicación funciona como se espera

**Características:**
Tienen el mayor alcance de todas las pruebas y su velocidad es la más lenta.
Simulan el comportamiento real del usuario final.

**Ejemplo en esta app:**

```javascript
// Probar flujo completo de registro,login y acceso a los datos.
test("debería permitir registro y posterior inicio de sesión", async () => {
  // Usuario se registra
  const registerRes = await request(app)
    .post("/api/auth/register")
    .send({ name: "Carlos", email: "carlos@email.com" });

  //  Usuario inicia sesión
  const loginRes = await request(app)
    .post("/api/auth/login")
    .send({ email: "carlos@email.com" });

  // Verificar que todo el flujo funciona
  expect(registerRes.statusCode).toBe(201);
  expect(loginRes.statusCode).toBe(200);
});
```

---

**Escenario donde una Prueba Funcional es Esencial**

**Flujo de Autenticación Completo en nuestra aplicación:**

Un usuario nuevo:
Se registra, inicia sesión y accede a sus datos protegidos.
**¿Por qué es esencial una prueba funcional en este caso?**

- Simula un flujo real que los usuarios experimentarán
- Detecta problemas que no aparecerían en pruebas aisladas

Este tipo de prueba asegura que todo el sistema funciona desde el punto de vista del usuario final.
