'use strict';

import { DataTypes, Model, Optional } from 'sequelize';
import connection from '../sequelize';
import { ICourseCategoryAttributes } from '../../types';

type TCourseCategoryCreationAttributes = Optional<ICourseCategoryAttributes, 'id'>;

class Course_Category
    extends Model<ICourseCategoryAttributes, TCourseCategoryCreationAttributes>
    implements ICourseCategoryAttributes
{
    public id!: number;
    public courseId!: number;
    public categoryId!: number;
    public readonly createdAt?: Date | undefined;
    public readonly updatedAt?: Date | undefined;
}
Course_Category.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        categoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        courseId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
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
        modelName: 'Course_Category',
    },
);

export default Course_Category;
