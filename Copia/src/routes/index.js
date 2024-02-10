const { Router } = require('express');
const router = Router();
const admin = require('firebase-admin');

//una vez que agregamos el archivo en el proyecto creamos una variable con la direccion del archivo
var serviceAccount = require("../../constructora-f1b33-firebase-adminsdk-cjf8x-996d3faa6c.json");

//conexion a la base de datos en tirmpo real
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://constructora-f1b33-default-rtdb.firebaseio.com/'
});

const db =admin.database();

router.get('/', (req,res)=>{
    db.ref('Users').once('value', (snapshot)=>{
        const data = snapshot.val();
        console.log(data);
        res.render('index', { Users: data});
    });
    res.render('index');
});

let userId = 1;

router.post('/new-user', (req, res)=>{
    console.log(req.body);
    //creamos una variable donde estan todos los datos que va a lleva el usuario
    const newUser= {
        id: userId,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        password2: req.body.password2
    };

    userId++;
    //mandamos los datos a una coleccion llamada Users
    db.ref('Users').push(newUser);
    res.send('recibido');
});


module.exports = router;