/// Relaciones por Referencia (normalizacion)  -> mas para  
let alumno = {
    id: 'A001',
    nombre: 'Jaime',
    email: 'jj@g.com'
}


let curso = {
    id: 'C001',
    autor: 'David Perez',
    usuarios: ['A001','A002','A003','A004'],
    titulo: 'Javascript',
    descripcion: 'Curso Javascript'
}


/// Relaciones por documentos embebidos  -> mas para Performance  

let curso = {
    id: 'C0001',
    autor: {
        nombre: 'David Perez'
    },
    id_alumnos: 
        [
            {id: 'A002', nombre: 'JuanC', email: 'jcc@jj.com' },
            {id: 'A003', nombre: 'Fernando', email: 'ff@h.com' }    
        ],
    titulo: 'Javascript',
    descripcion: 'Javascript moderno'
}