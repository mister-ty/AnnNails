const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

//variables de entorno
dotenv.config();

const app = express();


app.use(bodyParser.json());
app.use(express.json());

//MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/Febrero';

mongoose
    .connect(MONGO_URI, {
        useNewUrlParser: true, 
        useUnifiedTopology: true, 
    })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

//rutas
const calendarioRoutes = require('./routes/calendario');


app.use('/api/calendario', calendarioRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Depuración: listar todas las rutas registradas
app._router.stack.forEach((middleware) => {
    if (middleware.route) {
        console.log(`Ruta registrada: ${middleware.route.path}`);
    }
});
