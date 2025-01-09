const express = require('express');
const router = express.Router();
const Calendario = require('../models/Calendario'); // Asegúrate de tener el modelo creado correctamente


router.get('/verificar/:fecha', async (req, res) => {
    try {
        const { fecha } = req.params; // Captura la fecha desde la URL
        console.log('Verificando datos para la fecha:', fecha);

        // consulta en la base de datos
        const calendario = await Calendario.findOne({ fecha });
        console.log('Datos encontrados:', calendario);

        
        if (!calendario) {
            return res.status(404).json({ message: `No hay datos para la fecha: ${fecha}` });
        }

      
        res.json(calendario);
    } catch (err) {
        console.error('Error al verificar la fecha:', err);
        res.status(500).json({ message: 'Error interno del servidor al verificar la fecha.' });
    }
});


router.post('/agendar', async (req, res) => {
    try {
        const { fecha, hora, evento } = req.body;
        console.log('Datos recibidos para agendar:', fecha, hora, evento); 

        const calendario = await Calendario.findOne({ fecha });
        console.log('Resultado de la consulta para agendar:', calendario); 

        if (!calendario) {
            return res.status(404).json({ message: 'No hay horarios para esta fecha.' });
        }

        const horario = calendario.horarios.find((h) => h.hora === hora);
        if (!horario) {
            return res.status(404).json({ message: 'El horario no existe.' });
        }

        if (!horario.disponible) {
            return res.status(400).json({ message: 'El horario ya está reservado.' });
        }

        horario.disponible = false;
        horario.evento = evento;
        await calendario.save();
        res.json({ message: 'Horario reservado exitosamente.', calendario });
    } catch (err) {
        console.error('Error en la ruta POST:', err); 
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});


module.exports = router;
