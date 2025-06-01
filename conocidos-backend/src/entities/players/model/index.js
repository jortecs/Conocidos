import GenericModel from "@Application/repository/generic-model";
import Schema from "./schema";
import roomModel from "entities/rooms/model/schema"
import questionModel from "entities/questions/model/schema"
import answerModel from "entities/answers/model/schema"

Schema.associate = () =>{
  Schema.belongsTo(roomModel, {
    foreignKey: "roomId",
    onDelete: "CASCADE",
  })
  Schema.hasMany(answerModel, {
    foreignKey: "playerId", 
    onDelete:"CASCADE", 
  })
  Schema.hasMany(questionModel, { 
    foreignKey: "playerId",
    onDelete: "CASCADE"
  })
}

const Model = {
  ...GenericModel(Schema),
  getByEmail: (email) => Schema.findOne({ where: { email } }),
};

export default Model;
