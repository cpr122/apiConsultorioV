// server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

// Inicializar la aplicación de Express
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Para parsear el JSON en las solicitudes

// Crear la conexión con la base de datos MySQL
const db = mysql.createConnection({
  host: 'localhost', // Tu host (por defecto 'localhost')
  user: 'root', // Tu usuario de MySQL
  password: '', // Tu contraseña de MySQL
  database: 'vet_services' // Nombre de la base de datos
});

// Conectar a la base de datos MySQL
db.connect(err => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.stack);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
});

// API para obtener todos los servicios
app.get('/services', (req, res) => {
  db.query('SELECT * FROM services', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener los servicios' });
    }
    res.json(results);
  });
});

// API para agregar un nuevo servicio
app.post('/services', (req, res) => {
  const { name, category, price, duration } = req.body;

  if (!name || !category || !price || !duration) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  const query = 'INSERT INTO services (name, category, price, duration) VALUES (?, ?, ?, ?)';
  db.query(query, [name, category, price, duration], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al agregar el servicio' });
    }
    res.status(201).json({
      id: results.insertId,
      name,
      category,
      price,
      duration
    });
  });
});

// API para eliminar un servicio
app.delete('/services/:id', (req, res) => {
  const serviceId = req.params.id;
  
  const query = 'DELETE FROM services WHERE id = ?';
  db.query(query, [serviceId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al eliminar el servicio' });
    }
    res.status(204).send(); // No content, eliminado correctamente
  });
});

// Iniciar el servidor
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
