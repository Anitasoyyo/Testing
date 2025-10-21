const request = require("supertest"); //importamos supertest para hacer peticiones HTTP en los tests
const app = require("../app"); //importamos el archivo app.js donde está nuestra aplicación Express
const { connectDB, clearDB, closeDB } = require("./db-config"); //importamos configuración de DB en memoria

//SUPERTEST: Se encarga de simular las solicitudes HTTP (request, get, post, etc.)
//VITEST: Se encarga de la estructura de tests (describe, test) y las aserciones (expect)
//MongoDB Memory Server: Crea una base de datos temporal solo para testing
//El propósito de este test es comprobar el endpoint GET /api/hello
//Con describe le decimos a Vitest qué conjunto de tests vamos a hacer.Es decir,voy a probar todo lo que tenga que ver con GET /api/hello
//Con test definimos un test individual y le indicamos qué esperamos y le pasamos la función async donde hacemos la petición y las comprobaciones
//con expect verificamos que la respuesta sea la esperada
//request(app) es una función de Supertest que nos permite hacer peticiones HTTP a nuestra aplicación Express sin necesidad de levantar un servidor real
//toEqual es un método de vitest que compara objetos o arrays.

beforeAll(async () => {
  await connectDB(); // Conecta a MongoDB en memoria antes de todos los tests
});

afterEach(async () => {
  await clearDB(); // Limpia la base de datos después de cada test
});

afterAll(async () => {
  await closeDB(); // Cierra la conexión después de todos los tests
});

describe("GET /api/hello", () => {
  test("debería devolver código 200 y el mensaje por defecto", async () => {
    //supertest simula solicitud HTTP GET sin servidor real
    const res = await request(app).get("/api/hello");

    // vitest: aserciones para verificar la respuesta
    expect(res.statusCode).toBe(200); // Vitest verifica status code
    expect(res.body).toEqual({ message: "hello world" }); //Vitest verifica contenido JSON
  });

  test("debería devolver un mensaje personalizado si se pasa el parámetro name", async () => {
    // ← Vitest: otro test individual
    //supertest: simula solicitud HTTP GET con query parameters
    const res = await request(app).get("/api/hello?name=Juan");
    expect(res.statusCode).toBe(200); // verifica status code
    expect(res.body).toEqual({ message: "hello Juan" }); //verifica mensaje personalizado
  });
});

describe("POST /api/echo", () => {
  test("debería devolver el mismo mensaje que se envía en el cuerpo", async () => {
    const mensajeEnviado = { message: "Hola desde el cliente" };

    //supertest: simula solicitud HTTP POST con datos JSON
    const res = await request(app).post("/api/echo").send(mensajeEnviado); // Enviamos datos JSON en el cuerpo

    // vitest: aserciones para verificar que funciona el echo
    expect(res.statusCode).toBe(200); // Verifica status code
    expect(res.body).toEqual({ message: "Hola desde el cliente" }); // Verifica que devuelve el mismo mensaje
  });

  test("debería devolver error 400 si no se envía mensaje", async () => {
    //supertest: simula solicitud POST sin mensaje
    const res = await request(app).post("/api/echo").send({}); // Enviamos objeto vacío

    // vitest: aserciones para verificar manejo de errores
    expect(res.statusCode).toBe(400); // Verifica error 400
    expect(res.body).toEqual({
      error: "Se requiere un mensaje en el cuerpo de la solicitud",
    });
  });
});

describe("User endpoints", () => {
  test("debería crear un usuario y almacenarlo correctamente en la base de datos", async () => {
    const userData = {
      name: "Juan Pérez",
      email: "juan@example.com",
    };

    const res = await request(app).post("/api/users").send(userData);

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("Juan Pérez");
    expect(res.body.email).toBe("juan@example.com");
    expect(res.body._id).toBeDefined();
  });

  test("debería devolver todos los usuarios almacenados", async () => {
    // Crear un usuario primero
    const userData = {
      name: "Ana García",
      email: "ana@example.com",
    };

    await request(app).post("/api/users").send(userData);

    // Obtener todos los usuarios
    const res = await request(app).get("/api/users");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("no debería permitir crear dos usuarios con el mismo correo electrónico", async () => {
    const userData = {
      name: "Pedro López",
      email: "pedro@example.com",
    };

    // Crear el primer usuario
    await request(app).post("/api/users").send(userData);

    // Intentar crear segundo usuario con mismo email
    const res = await request(app).post("/api/users").send({
      name: "Pedro Martínez",
      email: "pedro@example.com", // Mismo email
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});

describe("Functional Tests - Flujo de autenticación", () => {
  test("debería permitir registro y posterior inicio de sesión de usuario", async () => {
    const userData = {
      name: "Carlos Ruiz",
      email: "carlos@example.com",
    };

    // PASO 1: El registro de usuario
    const registerRes = await request(app)
      .post("/api/auth/register")
      .send(userData);

    expect(registerRes.statusCode).toBe(201);
    expect(registerRes.body.message).toBe("Usuario registrado exitosamente");
    expect(registerRes.body.user.email).toBe("carlos@example.com");
    expect(registerRes.body.user.name).toBe("Carlos Ruiz");

    // PASO 2: Inicio de sesión con el usuario ya registrado
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: userData.email });

    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body.message).toBe("Login exitoso");
    expect(loginRes.body.user.email).toBe("carlos@example.com");
    expect(loginRes.body.user.name).toBe("Carlos Ruiz");

    // PASO 3: Verificar que todo el flujo completo funciona
    expect(registerRes.body.user.id).toBe(loginRes.body.user.id);
  });
});

describe("TDD - GET /api/greeting", () => {
  test("debería devolver 'Hello, World!' con código 200 y tipo text/plain", async () => {
    const res = await request(app).get("/api/greeting");

    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("Hello, World!");
    expect(res.headers["content-type"]).toContain("text/plain");
  });
});

describe("TDD - PUT /api/users/:id", () => {
  test.only("debería actualizar un usuario existente", async () => {
    // Primero crear un usuario
    const createRes = await request(app)
      .post("/api/users")
      .send({ name: "Ana García", email: "ana@example.com" });

    const userId = createRes.body._id;

    // Luego intentar actualizarlo
    const updateRes = await request(app)
      .put(`/api/users/${userId}`)
      .send({ name: "Ana López", email: "ana.lopez@example.com" });

    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body.name).toBe("Ana López");
    expect(updateRes.body.email).toBe("ana.lopez@example.com");
    expect(updateRes.body._id).toBe(userId);
  });
});

//"Las aserciones son las líneas expect".
