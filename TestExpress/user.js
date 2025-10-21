const mongoose = require('mongoose');

// Esquema de Mongoose para el modelo Usuario
const userSchema = new mongoose.Schema({
  // Campo name: nombre del usuario
  name: {
    type: String,
    required: [true, 'El nombre es requerido'],
    minLength: [3, 'El nombre debe tener al menos 3 caracteres'] // Longitud mínima de 3 caracteres
  },
  
  // Campo email: correo electrónico del usuario
  email: {
    type: String,
    required: [true, 'El email es requerido'], // Campo obligatorio
    unique: true // Debe ser único en la base de datos
  }
});

// Crear y exportar el modelo basado en el esquema
const User = mongoose.model('User', userSchema);

module.exports = User;

//Un esquema define la estructura y reglas para los documentos en una colección de MongoDB.