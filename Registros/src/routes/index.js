const { Router } = require('express');
const router = Router();
const admin = require('firebase-admin');
const session = require('express-session');
const bodyParser = require('body-parser');

//una vez que agregamos el archivo en el proyecto creamos una variable con la direccion del archivo
var serviceAccount = require("../../constructora-f1b33-firebase-adminsdk-cjf8x-996d3faa6c.json");

//conexion a la base de datos en tiempo real
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://constructora-f1b33-default-rtdb.firebaseio.com/'
});


router.use(session({ secret: 'blackpink', resave: false, saveUninitialized: true }));
router.use(bodyParser.urlencoded({ extended: true }));

const db =admin.database();

router.get('/', (req, res) => {
    res.render('index'); // Reemplaza "nombre-tu-vista" con el nombre de tu vista
    
console.log("holiiiiiii", req.session.user); 
});


//Entrar a la pagina principal
router.get('/login', (req,res)=>{
    res.render('dashboard');
});

// autenticacion
router.post('/login', (req, res) => {
    console.log("Entrooosss");
    const { email, password } = req.body;

    // Consulta la base de datos para verificar el nombre de usuario y la contraseña
    const usersRef = db.ref('Users');
    usersRef.orderByChild('email').equalTo(email).once('value', (snapshot) => {
        const users = snapshot.val();

        if (users) {
            // Obtener el primer usuario encontrado (debería ser único por el método de autenticación)
            const userId = Object.keys(users)[0];
            const user = users[userId];

            if (user.password === password) {
                // Inicio de sesión exitoso
               //console.log("Entrooo");
                req.session.user = user; // Almacena toda la información del usuario en la sesión
                res.render('dashboard', { user: req.session.user }); // Redirige a la página de inicio después del inicio de sesión
            } else {
                // Credenciales incorrectas
                //console.log("no entro");
                res.render('index', { error: 'Email o Contraseña incorrecta' });
            }
        } else {
            // Usuario no encontrado
            //console.log("Usuario no encontrado");
            res.render('index', { error: 'Usuario no encontrado' });
           
        }
    });
});

// Ruta para la página de inicio después del inicio de sesión
router.post('/dashboard', (req, res) => {
   
    if (req.session.user) {
        // Usuario autenticado, mostrar la página de inicio
        res.render('dashboard', { user: req.session.user }); // Debes crear esta vista
    } else {
        // Usuario no autenticado, redirigir al inicio de sesión
        res.redirect('/login');
    }
});

//Pagina de registro

router.get('/registro', (req, res) => {
    res.render('registro'); // Reemplaza 'registro' con el nombre de tu vista de registro
});

router.get('/new', (req, res) => {
    res.render('new'); // Reemplaza 'registro' con el nombre de tu vista de registro
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
    res.render('index');
});

router.post('/guardar-datos', (req, res) => {
    // Verificar si req.session.user está definido y tiene la propiedad email
    if (req.session.user && req.session.user.email) {
        // Creamos una variable con todos los datos que va a llevar el documento
        const nuevoDocumento = {
            empresa: req.body.title,
            rfcEmpresa: req.body.rfc,
            // ... (otros campos)

            // Inicializamos la bitácora como un objeto vacío
            bitacora: {}
        };

        // Obtenemos una referencia al usuario actual
        var usuarioRef = db.ref('users').child(req.session.user.email);

        // Generamos una clave única para el nuevo documento
        var nuevoDocumentoKey = usuarioRef.child('documentos').push().key;

        // Añadimos el nuevo documento a la colección de documentos del usuario
        var documentoRef = usuarioRef.child('documentos').child(nuevoDocumentoKey);
        documentoRef.set(nuevoDocumento);

        res.render('success', { message: 'Datos guardados exitosamente' });
    } else {
        // Si req.session.user no está definido o no tiene la propiedad email, redirige al usuario
        res.redirect('/login');
    }
});

  

module.exports = router;