const mongoose = require('mongoose');

const HorarioSchema = new mongoose.Schema({
    hora: String,
    disponible: Boolean,
    evento: String, 
});

const CalendarioSchema = new mongoose.Schema({
    fecha: String,
    horarios: [HorarioSchema],
});

module.exports = mongoose.model('Calendario', CalendarioSchema);
