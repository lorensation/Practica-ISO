const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');


// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/futbol360')
.then(() => {
    console.log('Conectado a MongoDB');
}).catch(err => {
    console.error('Error al conectar a MongoDB:', err);
});

// Definir el esquema de usuario
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Cifrar la contraseña antes de guardar
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10);
    }
    next();
});

// Crear el modelo de Usuario
const User = mongoose.model('User', userSchema);

// Inicializar Express
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client', 'build'))); // Servir archivos estáticos desde /build

// Ruta para servir la página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

// Rutas específicas (si las necesitas para autenticación, las puedes mantener)
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

// Ruta para manejar el registro
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Registrar el nuevo usuario en la base de datos
        const nuevoUsuario = new User({ username, email, password });
        await nuevoUsuario.save();

        // Configurar el correo de bienvenida
        const mailOptions = {
            from: 'futbol360.client@gmail.com',
            to: email, 
            subject: 'Bienvenido a Futbol360',
            text: `Hola ${username},\n\nGracias por registrarte en Futbol360. ¡Esperamos que disfrutes de la plataforma!\n\nSaludos,\nEl equipo de Futbol360`
        };

        // Enviar el correo de bienvenida
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.error('Error al enviar el correo:', error);
            }
            console.log(`Correo enviado: ${info.response}`);
        });

        res.redirect('/');
    } catch (err) {
        res.status(400).send('Error al registrar usuario: ' + err.message);
    }
});

// Ruta para manejar el inicio de sesión
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const usuario = await User.findOne({ email });
        if (!usuario) {
            return res.status(400).send('Usuario no encontrado');
        }

        const passwordCorrecta = await bcrypt.compare(password, usuario.password);
        if (!passwordCorrecta) {
            return res.status(400).send('Contraseña incorrecta');
        }

        res.redirect('/');
    } catch (err) {
        res.status(400).send('Error al iniciar sesión: ' + err.message);
    }
});

// Manejar rutas de React
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'futbol360.client@gmail.com',
        pass: 'Futbol-360-mail'
    }
});
