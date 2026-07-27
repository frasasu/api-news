const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { verifyToken } = require('../middlewares/auth');

router.get('/article/:articleId', commentController.getArticleComments);
router.post('/article/:articleId',verifyToken, commentController.addComment);
router.delete('/:commentId', verifyToken, commentController.deleteComment);

module.exports = router;