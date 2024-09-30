'use strict';

import { DataTypes, Model, Optional } from 'sequelize';
import connection from '../sequelize';
import { IPhoneNumberAttributes, IUserAttributes } from '../../types';

type TPhoneNumberCreationAttributes = Optional<IPhoneNumberAttributes, 'id'>;

class Phone_Number
    extends Model<IPhoneNumberAttributes, TPhoneNumberCreationAttributes>
    implements IPhoneNumberAttributes
{
    public id!: number;
    public isoCode!: string;
    public countryCode!: string;
    public internationalNumber!: string;
    public userId!: number;
    public readonly createdAt?: Date | undefined;
    public readonly updatedAt?: Date | undefined;

    // associations
    public user?: IUserAttributes | undefined;
}
Phone_Number.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        isoCode: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        countryCode: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        internationalNumber: {
            type: DataTypes.STRING,
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
        modelName: 'Phone_Number',
    },
);

export default Phone_Number;
