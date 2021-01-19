const express = require('express');
//const { findByIdAndUpdate } = require('../models/usuario_model');
const Usuarios = require('../models/usuario_model');
const verificarToken = require('../middlewares/auth'); 
const ruta = express.Router();
const Joi = require('@hapi/joi');
// Encriptacion
const bcrypt = require('bcrypt');


const schema = Joi.object({
    email: Joi.string(),
    nombre: Joi.string().required(),
    password: Joi.string().required().length(6)
    /* isbn: Joi.string().length(10),
    pageCount: Joi.number(),
    datePublished: Joi.date().iso() */
});

/* server.route({
    method: 'GET',
    path: '/books',
    handler: async function (request, h) {

        return await getBooks();
    },
    options: {
        response: {
            sample: 50,
            schema: Joi.array().items(bookSchema)
        }
    }
}); */



// se llama el Middleware para la verificacion del Token

ruta.get('/', verificarToken , (req,res) => {
    // res.json('Listo el GET de Usuarios.');
    let respuesta = listarUsuariosAct()
    respuesta.then(valor=> {
        res.json({
            valor:valor
        })
    })
    .catch( err => {
        res.status(400).json({
            error:err
        })
    })
});


ruta.post('/', (req,res) => {
    // Lo que llega del cliente
        let body = req.body;

 
const {error,value} = schema.validate({email: body.email, nombre: body.nombre, password: body.password});

if(!error){

    // Validar que dato sea UNICO
 Usuarios.findOne({email: body.email}, (err, user) => {
    if(err){
        return res.status(400).json({ error: "Server error."});   
        res.end();     
    }
    if(user){
        // usuario si existe
        return res.status(400).json({msj: `Este email: ${body.email} ya existe!` });
        res.end();   
    } else {

        let resultado = crearUsuaro(body);
        resultado.then( user => {
            res.json({
                email: user.email,
                nombre: user.nombre
            })
            //console.log('Entrooo');
        })
        .catch( err => {
            res.status(400).json({
                error: err
            })
        })

    }
 });     

   

} else {

    res.status(400).json({
        error:error
    })

}
       
});


ruta.put('/:email', verificarToken , (req,res) => {
   
    
    let body = req.body;

    const {error,value} = schema.validate({nombre: req.body.nombre , password: req.body.password});

   if(!error){
    
    let email = req.params.email;
    //console.log(email);

    let respuesta = actualizarUsuario(email, body);

    respuesta.then(valor => { 
            res.json({
            nombre: valor.nombre,
            email: valor.email
            })  
        }).catch( err => {
            res.status(400).json({
                error: err                
            })   
        })    

    } else {
        res.status(400).json({
            error:error
        })
    }
});


ruta.delete('/:email', verificarToken, (req, res) => {
    
    let respuesta = eliminarUsuario(req.params.email)
    respuesta.then(valor => {
        res.json({
            email: valor.email,
            nombre: valor.nombre
        })
    })
    .catch(err => {
        res.status(400).json({
            error: err
        })
    })

});


// listar Usuarios Activos

async function listarUsuariosAct(){
    let usuario= await Usuarios.find({estado:true})
    .select({nombre:1, email:1})
    return usuario;
}


// inserta
async function crearUsuaro(body){
    let usuario = new Usuarios({
        email:body.email,
        nombre:body.nombre,
        // Encripta password
        password: bcrypt.hashSync(body.password, 10)        
    });
    return await usuario.save();
}

// actualiza
async function actualizarUsuario(email, body){
                    // Se busca en la tabla Usuarios y se actualiza el registro
    let usuario = await Usuarios.findOneAndUpdate( {"email": email},{
        $set: { 
        nombre: body.nombre,
        password: body.password        
        }
    }, {new:true});
        return usuario;

}

// deshabilita
async function eliminarUsuario(email){
    let usuario = await Usuarios.findOneAndUpdate({"email": email}, {
        $set:{
            estado:false
        }

    }, {new:true});

    return usuario;
}

module.exports=ruta;