const express = require('express');
const Curso = require('../models/curso_model');
const ruta = express.Router();
const Joi = require('@hapi/joi');
const verificarToken = require('../middlewares/auth');

ruta.get('/', verificarToken ,(req,res) => {

    // mostrar usuario Login

    /* res.json({
        usuario: req.usuario
    }); */
    
    //////
    
    let respuesta = listarCurso();
    respuesta.then(valor => {
        res.json(valor);
        
    })
    .catch(err => {
        res.status(400).json(err)
    })
 
});


ruta.post('/', verificarToken, (req,res) => {
                            // req.body
    let respuesta = crearCurso(req)
    respuesta.then(valor => {
        res.json({
            valor:valor
        })
    })
    .catch( err => {
        res.status(400).json({
            error: err
        })
    })
});


ruta.put('/:id', verificarToken, (req,res) => {
    
    let respuesta = actualizarCurso(req.params.id, req.body);
    respuesta.then(valor => {
        res.json(valor)
    })
    .catch(err => {
        res.status(400).json({err})
    });
});


ruta.delete('/:id', verificarToken ,(req,res) => {
  let respuesta = eliminarCurso(req.params.id);
  respuesta.then(valor => {
      res.json(valor)
  })
  .catch(err => {
      res.status(400).json({err});
  })
});


async function listarCurso() {
    
    let curso = await Curso.find({"estado": true})
        // Populate mostrar la relacion con autor. UNICAMENTE MODO ESQUEMA
                          .populate('autor','nombre -_id');

    return curso;
}


async function crearCurso(req) {
    
    console.log("HOLA: " + req.usuario._id)
    
    let curso = new Curso({
        titulo: req.body.titulo,
        //MODO ESQUEMA
           autor: req.usuario.id,
        // MODO EMBEBIDO
          //autor: req.usuario,

        descripcion: req.body.descripcion /* ,
        alumnos: body.alumnos,
        califica: body.califica */
    });
    return await curso.save();
}


async function actualizarCurso(id, body) {
    let curso = await Curso.findByIdAndUpdate(id, {
        $set:{
            titulo: body.titulo,
            descripcion: body.descripcion
        }
    }, {new: true});
    return curso;
}


async function eliminarCurso(id) {
    let curso = await Curso.findByIdAndUpdate(id, {
        $set:{
            estado: false
        }
    }, {new : true});
    return curso;
}


module.exports=ruta;


