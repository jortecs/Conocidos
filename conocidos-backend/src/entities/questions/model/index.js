import GenericModel from "@Application/repository/generic-model";
import Schema from "./schema";
import answerModel from "entities/answers/model/schema";
import roomModel from "entities/rooms/model/schema";
import playerModel from "entities/players/model/schema";

Schema.associate = () => {
  Schema.belongsTo(roomModel, {
    foreignKey: "roomId",
    onDelete: "CASCADE",
  });

  Schema.belongsTo(playerModel, {
    foreignKey: "playerId",
    onDelete: "CASCADE",
  });

  Schema.hasMany(answerModel, {
    foreignKey: "questionId",
    onDelete: "CASCADE",
  });
};

const Model = {
  ...GenericModel(Schema),
  getByEmail: (email) => Schema.findOne({ where: { email } }),
};

export default Model;
