import { where } from "sequelize";

const GenericModel = Model => ({
    create(data) {
        return Model.create(data);
    },
    get(conditions) {
        return Model.findAll(conditions ? { where: conditions } : {});
    },
    getById(id) {
        return Model.findOne({ where: { id } });
    },
    updateById(id, data) {
        return Model.update(data, { where: { id } });
    },
    update(code, data) {
        return Model.update(data, { where: { code } });
    },
    deleteById(id) {
        return Model.destroy({ where: { id } });
    },
    delete(conditions) {
        return Model.destroy(conditions ? { where: conditions } : {})
    },
    findOrCreate(condition, newObj) {
        return Model.findOrCreate({ where: condition, defaults: newObj });
    },
    updatePlayer(id, data) {
        return Model.update(data, { where: id })
    }
});

export default GenericModel;
