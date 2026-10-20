import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js';
import cursoRoutes from './routes/cursoRoutes.js';
import horarioRoutes from './routes/horarioRoutes.js';
import servicioRoutes from './routes/servicioRoutes.js';
import novedadRoutes from './routes/novedadRoutes.js';
import solicitudRoutes from './routes/solicitudRoutes.js';
import errorHandler from './middlewares/errorHandler.js';
import notFound from './middlewares/notFound.js';

const app = express();
const uploadsPath = fileURLToPath(new URL('../uploads/', import.meta.url));

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.resolve(uploadsPath)));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/cursos', cursoRoutes);
app.use('/api/v1/horarios', horarioRoutes);
app.use('/api/v1/servicios', servicioRoutes);
app.use('/api/v1/novedades', novedadRoutes);
app.use('/api/v1/solicitudes', solicitudRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;
