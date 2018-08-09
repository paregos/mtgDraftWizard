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
    draftaholicsRating: {
      type: DataTypes.FLOAT,
      allowNull: true
    }
  }, {
    tableName: 'card',
    timestamps: false
  });
};