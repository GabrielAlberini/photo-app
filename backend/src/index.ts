// src/index.ts
import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import authRoutes from './routes/auth';
import cors from "cors"

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors())

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server en puerto ${PORT}`);
    });
  } catch (error) {
    console.error('❌ No se pudo arrancar el servidor por fallo en la DB:', error);
    process.exit(1);
  }
})();
