const jwt = require('jsonwebtoken');

module.exports = {
  isAuthenticated: (req, res, next) => {
    if (req.session.userId) {
      return next();
    }
    res.status(403).send('Non authentifie!');
  },

  isAdmin: (req, res, next) => {
    if (req.session.role === 'admin') {
      return next();
    }
    res.status(403).send('Accès non autorisé');
  },

  verifyToken: (req, res, next) => {

    const authHeader = req.headers['Authorization'];
    const bearerToken = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null;


    const token = bearerToken || req.cookies.token;

    if (!token) {
      return res.status(401).json({ error: 'Token manquant' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.session.userId = decoded.id;
      req.session.role = decoded.role;


      req.userId = decoded.id;
      req.userRole = decoded.role;

      next();
    } catch (error) {
      return res.status(401).json({ error: 'Token invalide ou expiré' });
    }
  }
};