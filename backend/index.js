import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import db from './config/db.js';
import registroRoutes from './routes/registroRoutes.js';
import bloqueoTalladoRoutes from './routes/bloqueoTalladoRoutes.js';
import pulidoRoutes from './routes/pulidoRoutes.js';
import engraverRoutes from './routes/engraverRoutes.js';
import bloqueoTerminadoRoutes from './routes/bloqueoTerminadoRoutes.js';
import biseladoRoutes from './routes/biseladoRoutes.js';
import metaRoutes from './routes/metaGeneradoresRoutes.js'
import metaTalladosRoutes from './routes/metaTalladosRoutes.js'
import metaPulidosRoutes from './routes/metaPulidosRoutes.js'
import metaEngraversRoutes from './routes/metaEngraversRoutes.js'
import metaTerminadosRoutes from './routes/metaTerminadosRoutes.js'
import metaBiseladosRoutes from './routes/metaBiseladosRoutes.js'
import metaManualesRoutes from './routes/metaManualesRoutes.js'
import usuarioRoutes from './routes/usuarioRoutes.js'
import manualRoutes  from './routes/manualRoutes.js'
import historialRoutes from './routes/historialRoutes.js'

const app = express();
app.use(express.json());

dotenv.config();

// Conexion a la base de datos 
try {
    await db.authenticate();
    db.sync()
    console.log('Conexion Correcta a la base de datos');
} catch (error) {
    console.log(error);
}

//Configurar CORS
const whitelist = [process.env.FRONTEND_URL];

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.includes(origin)) {
      // Puede consultar la API
     callback(null, true);
    } else {
      // No esta permitido
      callback(new Error("Error de Cors"));
    }
  },
};

app.use(cors(corsOptions));

//Routing
app.use("/api/generadores", registroRoutes);
app.use("/api/tallado", bloqueoTalladoRoutes);
app.use("/api/pulido", pulidoRoutes);
app.use("/api/engraver", engraverRoutes);
app.use("/api/terminado", bloqueoTerminadoRoutes);
app.use("/api/biselado", biseladoRoutes);
app.use("/api/manual", manualRoutes);
app.use("/api/historial", historialRoutes);
/* Rutas de meta */
app.use("/api/metas", metaRoutes);
app.use("/api/metas", metaTalladosRoutes);
app.use("/api/metas", metaTalladosRoutes);
app.use("/api/metas", metaPulidosRoutes);
app.use("/api/metas", metaEngraversRoutes);
app.use("/api/metas", metaTerminadosRoutes);
app.use("/api/metas", metaBiseladosRoutes);
app.use("/api/metas", metaManualesRoutes);
/* Rutas de autenticación */
app.use('/api/login', usuarioRoutes)

const PORT = process.env.PORT || 3000;
const servidor = app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
