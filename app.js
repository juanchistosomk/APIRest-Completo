const express = require('express');
const mongoose= require('mongoose');
const usuarios = require('./routes/usuarios');
const cursos = require('./routes/cursos');
const auth = require('./routes/auth');
const config = require('config');
mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);

//Conectar a BD
mongoose.connect(config.get('configDB.HOST'), {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{ console.log('Conectado a MongoDB'); })
.catch( err => { console.log('Error de conexion a MongoDB ',err) } ); 

//Instancia la aplicacion
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/api/usuarios',usuarios);
app.use('/api/cursos', cursos);
app.use('/api/auth', auth);

// Ejecutar el Servicio
const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`API REST Conectada a: ${port}`);
}); 