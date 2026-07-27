const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize } = require('./models');

dotenv.config();

const app = express();
const isProduction = process.env.NODE_ENV === 'production';


app.use(cors({
  origin: isProduction ? process.env.FRONTEND_URL : true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT','DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET || 'secret_temporaire_dev',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: isProduction,
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: isProduction ? 'none' : 'lax'
  }
}));


app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

const authRoutes = require('./routes/auth');
const articleRoutes = require('./routes/articles');
const commentRoutes = require('./routes/comments');

app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/comments', commentRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

app.use((err, req, res, next) => {
  console.error('❌ Erreur capturée par le serveur:', err.message);

  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: `Erreur d'upload: ${err.message}` });
  }

  if (err.message === 'Seules les images sont autorisées') {
    return res.status(400).json({ error: err.message });
  }

  res.status(500).json({
    error: 'Erreur interne du serveur',
    message: isProduction ? undefined : err.message
  });
});

app.use((req, res) => {
  res.status(404).json({ error: `Route non trouvée : ${req.method} ${req.originalUrl}` });
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données établie');

    if (!isProduction) {
      await sequelize.sync({ alter: true });
      console.log('📦 Base de données synchronisée (mode dev)');
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
      console.log(`📝 Environnement: ${isProduction ? 'production' : 'development'}`);
    });
  } catch (err) {
    console.error('❌ Erreur critique lors du démarrage:', err);
    process.exit(1);
  }
};

startServer();