const express = require('express');
const router = express.Router();
const Calendario = require("../models/Calendario");

// Ruta POST: Crear un nuevo calendario
router.post('/', async function (req, res) {
    try {
        const calendario = new Calendario({
            fecha: req.body.fecha,
            horarios: req.body.horarios,
        });
        await calendario.save();
        res.status(201).send(calendario);
    } catch (err) {
        console.error('Error al crear el calendario:', err);
        res.status(500).send({ message: 'Error al crear el calendario.' });
    }
});

// Ruta GET: Obtener todos los calendarios
router.get('/', async function (req, res) {
    try {
        const calendarios = await Calendario.find();
        res.status(200).send(calendarios);
    } catch (err) {
        console.error('Error al obtener calendarios:', err);
        res.status(500).send({ message: 'Error al obtener los calendarios.' });
    }
});

// Ruta GET: Verificar horarios de una fecha específica
router.get('/verificar/:fecha', async function (req, res) {
    try {
        const { fecha } = req.params;
        console.log(`Verificando datos para la fecha: ${fecha}`);
        const calendario = await Calendario.findOne({ fecha });
        if (!calendario) {
            return res.status(404).send({ message: 'No hay horarios para esta fecha.' });
        }
        res.status(200).send(calendario);
    } catch (err) {
        console.error('Error al verificar el calendario:', err);
        res.status(500).send({ message: 'Error al verificar el calendario.' });
    }
});

// Ruta POST: Agendar un horario
router.post('/agendar', async function (req, res) {
    try {
        const { fecha, hora, evento } = req.body;
        console.log(`Datos recibidos para agendar: ${fecha} ${hora} ${evento}`);
        const calendario = await Calendario.findOne({ fecha });
        if (!calendario) {
            return res.status(404).send({ message: 'No hay horarios para esta fecha.' });
        }

        const horario = calendario.horarios.find(h => h.hora === hora);
        if (!horario) {
            return res.status(404).send({ message: 'El horario no existe.' });
        }
        if (!horario.disponible) {
            return res.status(400).send({ message: 'El horario ya está reservado.' });
        }

        horario.disponible = false;
        horario.evento = evento;
        await calendario.save();
        res.status(200).send({ message: 'Horario reservado exitosamente.', calendario });
    } catch (err) {
        console.error('Error al agendar el horario:', err);
        res.status(500).send({ message: 'Error al agendar el horario.' });
    }
});

// Ruta DELETE: Eliminar un calendario por ID
router.delete('/:id', async function (req, res) {
    try {
        const calendario = await Calendario.findByIdAndDelete(req.params.id);
        if (!calendario) {
            return res.status(404).send({ message: 'Calendario no encontrado para eliminar.' });
        }
        res.status(200).send({ message: 'Calendario eliminado con éxito.' });
    } catch (err) {
        console.error('Error al eliminar el calendario:', err);
        res.status(500).send({ message: 'Error al eliminar el calendario.' });
    }
});

// Ruta PUT: Actualizar un calendario por ID
router.put('/:id', async function (req, res) {
    try {
        const calendario = await Calendario.findByIdAndUpdate(
            req.params.id,
            {
                fecha: req.body.fecha,
                horarios: req.body.horarios,
            },
            { new: true }
        );
        if (!calendario) {
            return res.status(404).send({ message: 'Calendario no encontrado para actualizar.' });
        }
        res.status(200).send(calendario);
    } catch (err) {
        console.error('Error al actualizar el calendario:', err);
        res.status(500).send({ message: 'Error al actualizar el calendario.' });
    }
});

module.exports = router;
