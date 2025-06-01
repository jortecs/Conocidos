import Model from "../model";

import roomController from "entities/rooms/controller"

const Controller = {
  get(conditions) {
    return Model.get(conditions);
  },
  getById(id) {
    return Model.getById(id);
  },
  create(data) {
    return Model.create(data);
  },
  updateById(id, data) {
    return Model.updateById(id, data);
  },
  deleteById(id) {
    return Model.deleteById(id);
  },
  delete(conditions) {
    return Model.delete(conditions)
  },
  updatePlayer(playerId, data){
    return Model.updatePlayer(playerId, data)
  },
  async getRoom(code){
    const data = await roomController.get({code});
    return data;
  }
}

export default Controller;