import { db, DataTypes } from "@Application/database";

export default db.define("rooms", {
  code: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true
  },
  maxPlayers: DataTypes.INTEGER,
  maxQuestions: DataTypes.INTEGER
});
