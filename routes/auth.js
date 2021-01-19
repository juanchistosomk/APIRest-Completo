const express = require('express');
const Usuarios = require('../models/usuario_model');
const ruta = express.Router();
//const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');

// Login usuario
ruta.post('/', (req, res) => {
    // Verificar Usuario si existe
    Usuarios.findOne({email: req.body.email})
    .then(datos => {
        if(datos){
            // Verifica Contraseña
            const passVerifica = bcrypt.compareSync(req.body.password, datos.password)
            if(!passVerifica) return res.status(400).json({error: "ok", msj: "Usuario o contraseña incorrecta"});
            else {
                // Genera el Token JWT
                const jsonToken= jwt.sign({
                    usuario: {id: datos._id , nombre: datos.nombre, email: datos.email }
                  }, config.get('configToken.SEED'), { expiresIn: config.get('configToken.expiration') });                  
                
                res.json({
                    usuario:  {
                    _id: datos._id,
                    nombre: datos.nombre,
                    email: datos.email 
                    },
                    token: jsonToken

                });

                //jwt.sign({id: datos._id , nombre: datos.nombre, email: datos.email }, 'password');
                //res.send(jsonToken);

                //res.json(datos);
            }
        } else {
        res.status(400).json({
            error: 'ok',
            msj: 'Usuario o contraseña incorrecta'
        })        
        }
    })
    .catch(err => {
        res.status(400).json({
            error: "ok",
            msj: 'Error en el servicio' + err 
        })

    })


});




module.exports=ruta;