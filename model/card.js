module.exports = (sequelize, DataTypes) => {
  return sequelize.define('card', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    lsvRating: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    lsvDescription: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    draftaholicsRating: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    lrcRating: {
      type: DataTypes.FLOAT,
      allowNull: true
    }
  }, {
    tableName: 'card',
    timestamps: false
  });
};