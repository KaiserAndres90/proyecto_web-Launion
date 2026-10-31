import mongoose from 'mongoose';

const connectDB = async () => {
  const { MONGODB } = process.env;

  if (!MONGODB) {
    throw new Error('La variable de entorno MONGODB es obligatoria');
  }

  const connection = await mongoose.connect(MONGODB);
  console.info(`MongoDB conectado: ${connection.connection.host}`);

  return connection;
};

export default connectDB;
