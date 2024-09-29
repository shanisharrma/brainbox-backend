'use strict';

import { DataTypes, Model } from 'sequelize';
import connection from '../sequelize';
import { ILogAttributes } from '../../types';

class Log extends Model<ILogAttributes> implements ILogAttributes {
    public id!: number;
    public level!: string;
    public message!: string;
    public meta!: string;
    public timestamp!: Date;
    public readonly createdAt?: Date | undefined;
    public readonly updatedAt?: Date | undefined;
}
Log.init(
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        level: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        meta: {
            type: DataTypes.TEXT,
        },
        timestamp: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        sequelize: connection,
        modelName: 'Log',
    },
);

export default Log;
