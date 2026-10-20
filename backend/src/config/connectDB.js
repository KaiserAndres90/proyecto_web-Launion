import mongoose from 'mongoose';

const connectDB = async () => {
  const { DATABASE } = process.env;

  if (!DATABASE) {
    throw new Error('La variable de entorno DATABASE es obligatoria');
  }

  const connection = await mongoose.connect(DATABASE);
  console.info(`MongoDB conectado: ${connection.connection.host}`);

  return connection;
};

export default connectDB;
