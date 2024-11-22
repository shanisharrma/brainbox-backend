'use strict';

import { DataTypes, Model, Optional } from 'sequelize';
import connection from '../sequelize';
import { IEnrollmentAttributes } from '../../types';

type TEnrollmentCreationAttributes = Optional<IEnrollmentAttributes, 'id'>;

class Enrollment extends Model<IEnrollmentAttributes, TEnrollmentCreationAttributes> implements IEnrollmentAttributes {
    public id!: number;
    public studentId!: number;
    public courseId!: number;
    public readonly createdAt?: Date | undefined;
    public readonly updatedAt?: Date | undefined;
}
Enrollment.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        studentId: {
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
        modelName: 'Enrollment',
    },
);

export default Enrollment;
