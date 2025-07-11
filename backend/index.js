import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import db from './config/db.js';
import fs from 'fs';
import path from 'path';
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
import ReportesProduccionRoutes from './routes/ReportesProduccionRoutes.js'
import reportesAntiguedadRoutes from './routes/reportesAntiguedadRoutes.js'
import reportesTrabajosNuevosRoutes from './routes/reportesTrabajosNuevosRoutes.js'
import wipTotalRoutes from './routes/wipTotalRoutes.js'
import reportesEnviadosRoutes from './routes/reportesEnviadosRoutes.js'
import reporteResumenRoutes from './routes/reporteResumenRoutes.js'
import trabajosSinMovimientosRoutes from './routes/trabajosSinMovimientosRoutes.js'
import facturacionRoutes from './routes/facturacionRoutes.js'
import mermasRoutes from './routes/mermasRoutes.js'
import mediaRoutes from './routes/mediaRoutes.js';

const app = express();
app.use(express.json());

dotenv.config();

// Verificar que la carpeta "uploads" exista; si no, crearla.
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Carpeta "uploads" creada');
} else {
  console.log('Carpeta "uploads" ya existe');
}
// Servir archivos estáticos desde la carpeta "uploads"
app.use('/uploads', express.static(uploadsDir));

// Conexion a la base de datos 
try {
    await db.authenticate();
    db.sync()
    console.log('Conexion Correcta a la base de datos');
} catch (error) {
    console.log(error);
}

// Configurar CORS
const whitelist = [process.env.FRONTEND_URL];
const corsOptions = {
  origin: (origin, callback) => {
    // Si no hay origin (por ejemplo, en requests desde herramientas como Postman),
    // se permite la petición.
    if (!origin) return callback(null, true);
    
    console.log('Origin de la petición:', origin);
    
    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Error de Cors'));
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
/* Reportes de produccion */
app.use('/api/reportes', ReportesProduccionRoutes)
app.use('/api/reportes', reportesAntiguedadRoutes)
app.use('/api/reportes', reportesTrabajosNuevosRoutes)
app.use('/api/reportes', wipTotalRoutes)
app.use('/api/reportes', reportesEnviadosRoutes)
app.use('/api/reportes', reporteResumenRoutes)
app.use('/api/reportes', trabajosSinMovimientosRoutes)
/* Reportes de Facturacion */
app.use('/api/reportes', facturacionRoutes)
/* Rutas para mermas */
app.use('/api/mermas', mermasRoutes)
/* Rutas para Media (imagenes y videos) */
app.use('/api/media', mediaRoutes);

const PORT = process.env.PORT || 3000;
const servidor = app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
