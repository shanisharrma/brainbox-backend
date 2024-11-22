'use strict';

import { DataTypes, Model, Optional } from 'sequelize';
import connection from '../sequelize';
import { IRefreshTokenAttributes, IUserAttributes } from '../../types';

type TRefreshTokenCreationAttributes = Optional<IRefreshTokenAttributes, 'id'>;

class Refresh_Token
    extends Model<IRefreshTokenAttributes, TRefreshTokenCreationAttributes>
    implements IRefreshTokenAttributes
{
    public id!: number;
    public userId!: number;
    public token!: string;
    public expiresAt!: number;
    public revoked!: boolean;
    public readonly createdAt?: Date | undefined;
    public readonly updatedAt?: Date | undefined;

    // associations
    public user?: IUserAttributes | undefined;
}
Refresh_Token.init(
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
        expiresAt: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        revoked: {
            type: DataTypes.BOOLEAN,
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
        modelName: 'Refresh_Token',
    },
);

export default Refresh_Token;
