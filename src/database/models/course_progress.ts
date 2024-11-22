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
    public subSectionId!: number;
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
        subSectionId: {
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
        modelName: 'Course_Progress',
    },
);

export default Course_Progress;
