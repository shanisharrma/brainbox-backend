'use strict';

import { DataTypes, Model, Optional } from 'sequelize';
import { ICourseProgressAttributes } from '../../types';
import connection from '../sequelize';

type TCourseProgressCreationAttributes = Optional<ICourseProgressAttributes, 'id'>;

class Course_Progress
    extends Model<ICourseProgressAttributes, TCourseProgressCreationAttributes>
    implements ICourseProgressAttributes
{
    public id!: number;
    public studentId!: number;
    public courseId!: number;
    public completedSubSections!: number[];
    public progressPercentage!: number;
    public totalSubSections!: number;
    public readonly createdAt?: Date | undefined;
    public readonly updatedAt?: Date | undefined;
}
Course_Progress.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        courseId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        studentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        completedSubSections: {
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
        },
        progressPercentage: {
            type: DataTypes.FLOAT,
            defaultValue: 0,
            allowNull: false,
        },
        totalSubSections: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
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
        modelName: 'Course_Progress',
    },
);

export default Course_Progress;
