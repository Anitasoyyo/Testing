// Importamos Express
const express = require("express");

// Creamos una instancia de la aplicación Express
const app = express();

// Middleware para interpretar JSON en las solicitudes
app.use(express.json());
// Middleware para registrar método y ruta
//
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next(); // sigue con el siguiente middleware o ruta
  //con req.method registramos el método HTTP (GET, POST, etc.) y con req.path la ruta solicitada
}); //next permite que express continue con el siguiente middleware o ruta

// Endpoint GET que responde a peticiones get para obtener info normalmente: /api/hello
app.get("/api/hello", (req, res) => {
  //api/hello es la ruta donde se escucha la petición GET
  // Obtenemos el parámetro "name" de la query string
  const { name } = req.query;
  // Operador ternario que nos sirve para asignar un valor por defecto ( si no se pasa nombre, se usa "world")
  const mensaje = name ? `hello ${name}` : "hello world";
  res.json({ message: mensaje }); //respuesta en formato JSON
});
//Se personaliza el nombre gracias a los query parameters
//req.query nos permite acceder a los parámetros de consulta en la URL

// Endpoint POST que responde a peticiones post para crear un nuevo recurso: /api/post
app.post("/api/post", (req, res) => {
  const { title, content } = req.body;
  res.status(201).json({ id: 1, title, content });
});

// Endpoint POST /api/echo que devuelve el mismo mensaje que se envía
app.post("/api/echo", (req, res) => {
  // Extraemos el mensaje del cuerpo de la solicitud con req.body
  const { message } = req.body;
  // Verificamos que se haya enviado un mensaje
  if (!message) {
    return res
      .status(400)
      .json({ error: "Se requiere un mensaje en el cuerpo de la solicitud" });
  }
  // Devolvemos el mismo mensaje que se envió
  res.json({ message: message });
});
//Este endpoint permite a los usuarios enviar datos que se les devolverán
//express.json() se encarga de parsear el JSON recibido

// Importamos el modelo User
const User = require("./user");

// Endpoint POST /api/users - Crear un nuevo usuario en la base de datos
app.post("/api/users", async (req, res) => {
  try {
    const { name, email } = req.body; //req.body contiene los datos enviados en la solicitud
    const user = new User({ name, email });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Endpoint GET /api/users - Devolver una lista de todos los usuarios almacenados
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find(); //.find() obtiene todos los documentos de la colección Users
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint GET /api/users/:id - Obtener un usuario por su ID
app.get("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params; //req.params contiene los parámetros de ruta
    const user = await User.findById(id); //findById busca un documento por su ID
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint PUT /api/users/:id - Actualizar un usuario por su ID
app.put("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    
    const user = await User.findByIdAndUpdate(
      id,
      { name, email },
      { new: true, runValidators: true }
    );
    
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Endpoint POST /api/auth/register - Registro de usuario (igual que /api/users pero con respuesta diferente)
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = new User({ name, email });
    await user.save();
    res.status(201).json({ message: "Usuario registrado exitosamente", user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Endpoint POST /api/auth/login - Inicio de sesión básico
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }
    res.json({ message: "Login exitoso", user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint GET /api/greeting - Devuelve "Hello, World!" o "Hello, [name]!" en texto plano
app.get("/api/greeting", (req, res) => {
  const { name } = req.query;
  const mensaje = name ? `Hello, ${name}!` : "Hello, World!";
  res.type('text/plain').send(mensaje);
});

// Exporta la app (importante para los tests con Supertest porque siempre se importa)
module.exports = app;

// Si ejecutas directamente este archivo, levanta el servidor
if (require.main === module) {
  const PORT = 3000; // Puerto donde escuchará el servidor
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
}
