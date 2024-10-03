'use strict';

import { DataTypes, Model, Optional } from 'sequelize';
import connection from '../sequelize';
import { IAccountConfirmationAttributes } from '../../types';

type TAccountConfirmationCreationAttributes = Optional<
    IAccountConfirmationAttributes,
    'id'
>;

class Account_Confirmation
    extends Model<
        IAccountConfirmationAttributes,
        TAccountConfirmationCreationAttributes
    >
    implements IAccountConfirmationAttributes
{
    public id!: number;
    public userId!: number;
    public token!: string;
    public code!: string;
    public status!: boolean;
    public expiresAt!: number;
    public verifiedAt!: Date;
    public readonly createdAt?: Date | undefined;
    public readonly updatedAt?: Date | undefined;
}
Account_Confirmation.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: { type: DataTypes.INTEGER, allowNull: false },
        token: { type: DataTypes.STRING, allowNull: false },
        code: { type: DataTypes.STRING, allowNull: false },
        status: { type: DataTypes.BOOLEAN, allowNull: false },
        expiresAt: { type: DataTypes.BIGINT, allowNull: false },
        verifiedAt: { type: DataTypes.DATE },
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
        modelName: 'Account_Confirmation',
    },
);

export default Account_Confirmation;
