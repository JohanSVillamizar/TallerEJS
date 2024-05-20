import express from 'express';
import fs from 'fs';
import moment from 'moment';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

// Definir __filename y __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Leer archivo de ambiente
const MIN_AGE_DAYS = process.env.MIN_AGE_DAYS || 5475;

// Ruta /persons
router.get('/', (req, res) => {
  // Añadir la fecha y hora actual al archivo access.json
  const accessLog = {
    timestamp: moment().format('YYYY-MM-DD HH:mm:ss')
  };

  fs.readFile(path.join(__dirname, '../access.json'), 'utf8', (err, data) => {
    if (err && err.code !== 'ENOENT') {
      console.error('Error leyendo el archivo access.json', err);
      return res.status(500).send('Error del servidor');
    }

    const logs = data ? JSON.parse(data) : [];
    logs.push(accessLog);

    fs.writeFile(path.join(__dirname, '../access.json'), JSON.stringify(logs, null, 2), (err) => {
      if (err) {
        console.error('Error escribiendo en el archivo access.json', err);
        return res.status(500).send('Error del servidor');
      }
    });
  });

  // Leer y filtrar el archivo persons.json
  fs.readFile(path.join(__dirname, '../persons.json'), 'utf8', (err, data) => {
    if (err) {
      console.error('Error leyendo el archivo persons.json', err);
      return res.status(500).send('Error del servidor');
    }

    const persons = JSON.parse(data);
    const filteredPersons = persons.filter(person => {
      const ageInDays = moment().diff(moment(person.birthDate, 'YYYY-MM-DD'), 'days');
      return ageInDays > MIN_AGE_DAYS;
    });

    // Renderizar la plantilla EJS
    res.render('persons', { persons: filteredPersons, moment });
  });
});

export default router;
