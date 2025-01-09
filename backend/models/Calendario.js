const mongoose = require('mongoose');

// Definir el esquema para los horarios
const HorarioSchema = new mongoose.Schema({
    hora: {
        type: String,
        required: true,
    },
    disponible: {
        type: Boolean,
        required: true,
    },
    evento: {
        type: String,
        required: false,
    },
});


const CalendarioSchema = new mongoose.Schema({
    fecha: {
        type: String,
        required: true,
    },
    horarios: {
        type: [HorarioSchema], 
        required: true,
    },
});

const Calendario = mongoose.model('Calendario', CalendarioSchema);

module.exports = Calendario;

