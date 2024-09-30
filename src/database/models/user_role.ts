'use strict';

import { DataTypes, Model, Optional } from 'sequelize';
import connection from '../sequelize';
import { IUserRolesAttributes } from '../../types';

type TUserRoleCreationAttributes = Optional<IUserRolesAttributes, 'id'>;
class User_Role
    extends Model<IUserRolesAttributes, TUserRoleCreationAttributes>
    implements IUserRolesAttributes
{
    public id!: number;
    public userId!: number;
    public roleId!: number;
    public readonly createdAt?: Date | undefined;
    public readonly updatedAt?: Date | undefined;
}
User_Role.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        roleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        userId: {
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
        modelName: 'User_Role',
    },
);

export default User_Role;
