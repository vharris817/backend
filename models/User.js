const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database"); // ✅ Import database instance

class User extends Model {}

User.init(
  {
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, allowNull: false, validate: { isIn: [["admin", "user"]] } },
  },
  {
    sequelize, // ✅ Use the existing DB connection
    modelName: "User",
    tableName: "users",
    timestamps: true,
    underscored: true, // ✅ Ensures `created_at` and `updated_at`
  }
);

module.exports = User;
