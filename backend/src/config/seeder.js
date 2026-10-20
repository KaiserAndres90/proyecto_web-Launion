import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Usuario from '../models/Usuario.js';
import Curso from '../models/Curso.js';

// Configurar dotenv para que busque el .env en la raíz de backend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const importarDatos = async () => {
  try {
    if (!process.env.DATABASE) {
      throw new Error('La variable DATABASE no está definida en el archivo .env');
    }

    console.log('⏳ Conectando a MongoDB...');
    await mongoose.connect(process.env.DATABASE);
    console.log('✅ Conectado a MongoDB para el Seeder');

    console.log('⏳ Eliminando datos antiguos...');
    await Usuario.deleteMany();
    await Curso.deleteMany();
    console.log('🗑️  Datos antiguos eliminados');

    console.log('⏳ Creando usuarios...');
    const usuarios = await Usuario.create([
      { nombre: 'Administrador CEA', email: 'admin@launion.com', telefono: '3001234567', password: 'admin123', rol: 'admin' },
      { nombre: 'Gerente CEA', email: 'gerente@launion.com', telefono: '3007654321', password: 'gerente123', rol: 'gerente' },
      { nombre: 'Auxiliar CEA', email: 'auxiliar@launion.com', telefono: '3009876543', password: 'auxiliar123', rol: 'auxiliar' },
    ]);
    console.log(`👥 ${usuarios.length} usuarios creados`);

    console.log('⏳ Creando cursos...');
    const cursos = await Curso.create([
      { nombre: 'Curso A1 - Motos hasta 125cc', descripcion: 'Curso teórico-práctico.', categoria: 'A1', duracionHoras: 30, precio: 450000, requisitos: ['Cédula', 'Examen médico'] },
      { nombre: 'Curso A2 - Motos más de 125cc', descripcion: 'Curso para motos de alto cilindraje.', categoria: 'A2', duracionHoras: 40, precio: 550000, requisitos: ['Cédula', 'Examen médico'] },
      { nombre: 'Curso B1 - Vehículos Particulares', descripcion: 'Para automóviles y camionetas.', categoria: 'B1', duracionHoras: 45, precio: 850000, requisitos: ['Cédula', 'Examen médico'] },
      { nombre: 'Curso B2 - Camiones y Buses', descripcion: 'Para camiones rígidos.', categoria: 'B2', duracionHoras: 50, precio: 950000, requisitos: ['Cédula', 'Examen médico', 'Licencia B1'] },
      { nombre: 'Curso B3 - Articulados', descripcion: 'Para vehículos articulados.', categoria: 'B3', duracionHoras: 60, precio: 1100000, requisitos: ['Cédula', 'Examen médico', 'Licencia B2'] },
      { nombre: 'Curso C1 - Servicio Público', descripcion: 'Automóviles de servicio público.', categoria: 'C1', duracionHoras: 50, precio: 950000, requisitos: ['Cédula', 'Examen médico', 'Mayor de 18 años'] },
      { nombre: 'Curso C2 - Servicio Público Pesado', descripcion: 'Camiones y buses públicos.', categoria: 'C2', duracionHoras: 60, precio: 1200000, requisitos: ['Cédula', 'Examen médico', 'Licencia C1'] },
      { nombre: 'Curso C3 - Articulados Públicos', descripcion: 'Vehículos articulados públicos.', categoria: 'C3', duracionHoras: 70, precio: 1350000, requisitos: ['Cédula', 'Examen médico', 'Licencia C2'] },
    ]);
    console.log(`📚 ${cursos.length} cursos creados`);

    console.log('🎉 Datos importados exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en el Seeder:', error.message);
    process.exit(1);
  }
};

importarDatos();