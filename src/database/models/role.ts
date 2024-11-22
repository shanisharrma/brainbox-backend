'use strict';

import { DataTypes, Model, Optional } from 'sequelize';
import connection from '../sequelize';
import { IRoleAttributes, IUserAttributes } from '../../types';

type TRoleCreationAttributes = Optional<IRoleAttributes, 'id'>;

class Role extends Model<IRoleAttributes, TRoleCreationAttributes> implements IRoleAttributes {
    public id!: number;
    public role!: string;
    public description!: string;
    public readonly createdAt?: Date | undefined;
    public readonly updatedAt?: Date | undefined;

    // associations
    public users?: IUserAttributes[] | undefined;
}
Role.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
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
        modelName: 'Role',
    },
);

export default Role;
