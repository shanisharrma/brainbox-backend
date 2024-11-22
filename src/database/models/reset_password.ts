'use strict';

import { DataTypes, Model, Optional } from 'sequelize';
import connection from '../sequelize';
import { IResetPasswordAttributes, IUserAttributes } from '../../types';

type TResetPasswordCreationAttributes = Optional<IResetPasswordAttributes, 'id'>;

class Reset_Password
    extends Model<IResetPasswordAttributes, TResetPasswordCreationAttributes>
    implements IResetPasswordAttributes
{
    public id!: number;
    public userId!: number;
    public token!: string;
    public used!: boolean;
    public lastResetAt!: Date;
    public expiresAt!: number;
    public readonly createdAt?: Date | undefined;
    public readonly updatedAt?: Date | undefined;

    // associations
    public user?: IUserAttributes | undefined;
}
Reset_Password.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        used: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        lastResetAt: {
            type: DataTypes.DATE,
        },
        expiresAt: {
            type: DataTypes.BIGINT,
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
        modelName: 'Reset_Password',
    },
);

export default Reset_Password;
