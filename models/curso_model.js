const { object } = require('@hapi/joi');
const mongoose = require('mongoose');
// Para ligarlo con la tabla Usuario
const Schema = mongoose.Schema;

//PARA MODO EMBEBIDO

/* const autorSchema = new mongoose.Schema({
    nombre: String,
    email: String
}); */

const cursoSchema = new mongoose.Schema({
    titulo:  { type: String, required: true },

    //MODO ESQUEMA
       autor: { type: Schema.Types.ObjectId, ref: 'Usuario'  },
    //MODO EMBEBIDO
      //autor: autorSchema,

    descripcion:     { type: String, required: false },    
    estado:     { type: Boolean, default: true },
    imagen:     { type: String, required: false },
    alumnos:   { type: String, default: 0 },
    califica:   { type: Number, default: 0 },

});


module.exports = mongoose.model('Curso', cursoSchema);