'use strict';

import { DataTypes, Model, Optional } from 'sequelize';
import connection from '../sequelize';
import { ICategoryAttributes, ICourseAttributes, IRatingAttributes, IUserAttributes } from '../../types';

type TCourseCreationAttributes = Optional<ICourseAttributes, 'id'>;

class Course extends Model<ICourseAttributes, TCourseCreationAttributes> implements ICourseAttributes {
    public id!: number;
    public name!: string;
    public description!: string;
    public whatYouWillLearn!: string;
    public price!: number;
    public thumbnail!: string;
    public instructorId!: number;
    public readonly createdAt?: Date | undefined;
    public readonly updatedAt?: Date | undefined;

    public users?: IUserAttributes[] | undefined;
    public categories?: ICategoryAttributes[] | undefined;
    public ratings?: IRatingAttributes[] | undefined;
    public sections?: ICourseAttributes[] | undefined;
}

Course.init(
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
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        whatYouWillLearn: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        thumbnail: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        instructorId: {
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
        modelName: 'Course',
    },
);

export default Course;
