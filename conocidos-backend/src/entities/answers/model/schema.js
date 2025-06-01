import { db, DataTypes } from "@Application/database";

export default db.define("answers", {
  answer_text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  is_correct: {
    type: DataTypes.BOOLEAN,
  },
  questionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "questions",
      key: "id", 
    },
    onDelete: "CASCADE",
  },
});
