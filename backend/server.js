const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');

//variables de entorno
dotenv.config();

// calendario
const calendarioRoutes = require('./routes/calendario');


const app = express();

// Middleware para manejar CORS
app.use((req, res, next) => {
    res.set("Access-Control-Allow-Credentials", "true");
    res.set("Access-Control-Allow-Origin",  "*"); 
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.set("Access-Control-Allow-Methods", "OPTIONS,GET,PUT,POST,DELETE");
    next();
});

// Middleware para logs, cookies y parsing
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/Magical';
mongoose
    .connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('Connected to MongoDB (Magical)'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

// calendario

app.use('/api/calendario', calendarioRoutes);



app.use((req, res) => {
    res.status(404).json({ message: 'Recurso no encontrado' });
});


module.exports = app;

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


// Depuración
app._router.stack.forEach((middleware) => {
    if (middleware.route) {
        console.log(`Ruta registrada: ${middleware.route.path}`);
    } else if (middleware.name === 'router') {
        middleware.handle.stack.forEach((handler) => {
            if (handler.route) {
                console.log(`Ruta registrada: ${handler.route.path}`);
            }
        });
    }
});

console.log('MongoDB URI:', process.env.MONGO_URI);
console.log('Server running on port:', process.env.PORT);
