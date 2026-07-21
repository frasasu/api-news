// models/User.js
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 50]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('user', 'editor', 'admin'),
      defaultValue: 'user'
    },
    profileImage: {
      type: DataTypes.STRING,
      defaultValue: 'default-avatar.png'
    }
  }, {
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      }
    }
  });

  User.associate = (models) => {
    User.hasMany(models.Article, { foreignKey: 'authorId', as: 'articles' });
    User.hasMany(models.Comment, { foreignKey: 'userId', as: 'comments' });
  };

  User.prototype.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  };

  return User;
};