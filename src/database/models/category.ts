'use strict';

import { DataTypes, Model, Optional } from 'sequelize';
import connection from '../sequelize';
import { ICategoryAttributes, ICourseAttributes } from '../../types';

type TCategoryCreationAttributes = Optional<ICategoryAttributes, 'id'>;

class Category extends Model<ICategoryAttributes, TCategoryCreationAttributes> implements ICategoryAttributes {
    public id!: number;
    public name!: string;
    public description!: string;
    public readonly createdAt?: Date | undefined;
    public readonly updatedAt?: Date | undefined;

    public categoryCourses?: ICourseAttributes[] | undefined;
}
Category.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: { type: DataTypes.STRING },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        sequelize: connection,
        modelName: 'Category',
    },
);

export default Category;
