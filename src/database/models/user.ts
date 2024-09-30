'use strict';

import { DataTypes, Model, Optional } from 'sequelize';
import connection from '../sequelize';
import { IRoleAttributes, IUserAttributes } from '../../types';
import { Quicker } from '../../utils/helper';

type TUserCreationAttributes = Optional<IUserAttributes, 'id'>;

class User
    extends Model<IUserAttributes, TUserCreationAttributes>
    implements IUserAttributes
{
    public id!: number;
    public firstName!: string;
    public lastName!: string;
    public username!: string;
    public email!: string;
    public password!: string;
    public timezone!: string;
    public consent!: boolean;
    public lastLoginAt!: string;
    public readonly createdAt?: Date | undefined;
    public readonly updatedAt?: Date | undefined;

    // Associations
    public roles?: IRoleAttributes[] | undefined;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [3, 72],
            },
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        timezone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastLoginAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        consent: {
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
        modelName: 'User',
        defaultScope: {
            attributes: {
                exclude: ['password'],
            },
        },
        scopes: {
            withPassword: {
                attributes: {
                    exclude: [],
                },
            },
        },
    },
);

User.beforeCreate(async (user: User) => {
    user.password = await Quicker.hashPassword(user.password);
});

export default User;
