import Lab from "./Lab";

const {DataTypes} = require('sequelize');
import {db} from '../db';

export const Discipline = db.define("Discipline", {
    title: {
        type: DataTypes.STRING,
    },
    modified_at: {
        type: DataTypes.DATE,
    },
    jekyll_folder: {
        type: DataTypes.STRING,
    },
}, {
    tableName: "lessons_discipline",
    createdAt: false,
    updatedAt: "modified_at"
});

Discipline.hasMany(Lab, {
    foreignKey: {
        field: "discipline_id"
    }
})
Lab.belongsTo(Discipline, )

export interface IDiscipline {
    title: string
    jekyll_folder: string
}

export default Discipline