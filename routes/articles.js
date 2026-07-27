const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const articleController = require('../controllers/articleController');
const { verifyToken } = require('../middlewares/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Seules les images sont autorisées'));
    }
  }
});


router.get('/?', articleController.getAllArticles);
router.get('/:slug', articleController.getArticleBySlug);

router.post('/?', verifyToken, upload.single('image'), articleController.createArticle);
router.put('/:id', verifyToken, upload.single('image'), articleController.updateArticle);
router.delete('/:id', verifyToken, articleController.deleteArticle);

module.exports = router;