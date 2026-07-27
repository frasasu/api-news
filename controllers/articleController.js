const { Article, User, Comment } = require('../models');
const { Op } = require('sequelize');
const slugify = require('slugify');
const moment = require('moment');

exports.getAllArticles = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    const offset = (page - 1) * limit;

    let where = { status: 'published' };

    if (category) {
      where.category = category;
    }

    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } }
      ];
    }

    const articles = await Article.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'profileImage']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      articles: articles.rows,
      totalPages: Math.ceil(articles.count / limit),
      currentPage: parseInt(page),
      totalArticles: articles.count
    });
  } catch (error) {
    console.error('Erreur récupération articles:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.getArticleBySlug = async (req, res) => {
  try {
    const article = await Article.findOne({
      where: {
        slug: req.params.slug,
        status: 'published'
      },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'profileImage']
        },
        {
          model: Comment,
          as: 'comments',
          where: { status: 'approved' },
          required: false,
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'profileImage']
          }],
          order: [['createdAt', 'DESC']]
        }
      ]
    });

    if (!article) {
      return res.status(404).json({ error: 'Article non trouvé' });
    }

    // Incrémenter le nombre de vues
    await article.increment('views');

    res.json(article);
  } catch (error) {
    console.error('Erreur récupération article:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.createArticle = async (req, res) => {
  try {
    const { title, content, excerpt, category, status } = req.body;

    const slug = slugify(title, {
      lower: true,
      strict: true,
      locale: 'fr'
    });

    const article = await Article.create({
      title,
      slug,
      content,
      excerpt: excerpt || content.substring(0, 200) + '...',
      category,
      status: status || 'draft',
      authorId: req.session.userId,
      featuredImage: req.file ? `/uploads/${req.file.filename}` : null
    });

    res.status(201).json({ message: 'Article créé avec succès', article });
  } catch (error) {
    console.error('Erreur création article:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.updateArticle = async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id);

    if (!article) {
      return res.status(404).json({ error: 'Article non trouvé' });
    }

    // Vérifier les permissions
    if (article.authorId !== req.session.userId && req.session.role !== 'admin') {
      return res.status(403).json({ error: 'Non autorisé' });
    }

    const { title, content, excerpt, category, status } = req.body;

    const updateData = {
      title,
      content,
      excerpt,
      category,
      status
    };

    if (title && title !== article.title) {
      updateData.slug = slugify(title, { lower: true, strict: true, locale: 'fr' });
    }

    if (req.file) {
      updateData.featuredImage = `/uploads/${req.file.filename}`;
    }

    await article.update(updateData);

    res.json({ message: 'Article mis à jour avec succès', article });
  } catch (error) {
    console.error('Erreur mise à jour article:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id);

    if (!article) {
      return res.status(404).json({ error: 'Article non trouvé' });
    }

    // Vérifier les permissions
    if (article.authorId !== req.session.userId && req.session.role !== 'admin') {
      return res.status(403).json({ error: 'Non autorisé' });
    }

    await article.destroy();

    res.json({ message: 'Article supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression article:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};