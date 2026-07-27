const { Comment, User} = require('../models');

exports.getArticleComments = async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: {
        articleId: req.params.articleId,
        status: 'approved'
      },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'profileImage']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(comments);
  } catch (error) {
    console.error('Erreur récupération commentaires:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;

    const comment = await Comment.create({
      content,
      articleId: req.params.articleId,
      userId: req.session.userId,
      status: 'approved'
    });

    const commentWithUser = await Comment.findByPk(comment.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'profileImage']
      }]
    });

    res.status(201).json(commentWithUser);
  } catch (error) {
    console.error('Erreur ajout commentaire:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ error: 'Commentaire non trouvé' });
    }

    // Vérifier les permissions
    if (comment.userId !== req.session.userId && req.session.role !== 'admin') {
      return res.status(403).json({ error: 'Non autorisé' });
    }

    await comment.destroy();

    res.json({ message: 'Commentaire supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression commentaire:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};