// En este archivo configuramos la base de datos en memoria para los tests
//Usamos mongodb-memory-server
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

let mongoServer; // instancia del servidor de MongoDB en memoria

// Conectar a la base de datos en memoria antes de los tests
const connectDB = async () => {
  try {
    // Crea una instancia de MongoDB en memoria
    mongoServer = await MongoMemoryServer.create();

    // Obtiene la URI de conexión
    //La URI es un string que indica dónde se encuentra la base de datos y cómo conectarse a ella
    const mongoUri = mongoServer.getUri();

    // Conecta mongoose a la base de datos en memoria
    await mongoose.connect(mongoUri);

    console.log("Conectado a MongoDB en memoria");
  } catch (error) {
    console.error("Error conectando a MongoDB en memoria:", error);
    process.exit(1);
  }
};

// Limpiar la base de datos entre tests
const clearDB = async () => {
  try {
    const collections = mongoose.connection.collections;

    // Limpia todas las colecciones
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  } catch (error) {
    console.error("Error limpiando la base de datos:", error);
  }
};

// Desconectar y cerrar la base de datos después de los tests
const closeDB = async () => {
  try {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();

    console.log("Base de datos en memoria cerrada");
  } catch (error) {
    console.error("Error cerrando la base de datos:", error);
  }
};

module.exports = {
  connectDB,
  clearDB,
  closeDB,
};
