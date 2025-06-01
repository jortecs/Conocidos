import { db, DataTypes } from "@Application/database";

export default db.define("questions", {
  question_text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  roomId: {
    type: DataTypes.STRING(10),
    allowNull: false,
    references: {
      model: "rooms",
      key: "code",
    },
    onDelete: "CASCADE",
  },
  playerId: {
    type: DataTypes.INTEGER,
    allowNull: false, 
    references: {
      model: "players", 
      key: "id", 
    },
    onDelete: "CASCADE", 
  },
});
