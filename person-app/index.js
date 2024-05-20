import express from 'express';
import morgan from 'morgan';
import chalk from 'chalk';
import debug from 'debug';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import personsRouter from './routes/persons.js';

// Configurar dotenv
dotenv.config();

// Definir __filename y __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Configurar EJS como motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Usar el enrutador de personas
app.use('/persons', personsRouter);

app.listen(port, () => {
  console.log(chalk.green(`Servidor escuchando en el puerto ${port}`));
  debug('server')(`Servidor escuchando en el puerto ${port}`);
});
