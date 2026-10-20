import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app.js';
import connectDB from './config/connectDB.js';

const PORT = Number(process.env.PORT ?? '3000');
let server;
let isShuttingDown = false;

const shutdown = (signal) => {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.info(`${signal} recibido. Cerrando el servidor...`);

  const closeDatabase = async () => {
    try {
      await mongoose.disconnect();
      console.info('Conexión a MongoDB cerrada');
    } catch (error) {
      console.error('Error al cerrar la conexión a MongoDB:', error);
      process.exitCode = 1;
    }
  };

  if (!server) {
    void closeDatabase();
    return;
  }

  server.close((error) => {
    if (error) {
      console.error('Error al cerrar el servidor HTTP:', error);
      process.exitCode = 1;
    }

    void closeDatabase();
  });
};

const startServer = async () => {
  if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
    throw new Error('PORT debe ser un número válido entre 1 y 65535');
  }

  await connectDB();
  if (isShuttingDown) {
    await mongoose.disconnect();
    return;
  }

  server = app.listen(PORT, () => {
    console.info(`Servidor escuchando en el puerto ${PORT}`);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

startServer().catch((error) => {
  console.error('No fue posible iniciar el servidor:', error);
  process.exitCode = 1;
});