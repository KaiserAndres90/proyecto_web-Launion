import mongoose from 'mongoose';

const connectDB = async () => {
  const mongoUri = process.env.MONGODB || process.env.DATABASE;

  if (!mongoUri) {
    throw new Error('La variable de entorno MONGODB o DATABASE es obligatoria');
  }

  const connection = await mongoose.connect(mongoUri);
  console.info(`MongoDB conectado: ${connection.connection.host}`);

  return connection;
};

export default connectDB;
