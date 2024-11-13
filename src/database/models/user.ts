'use strict';

import {
    BelongsToManyAddAssociationMixin,
    BelongsToManyHasAssociationMixin,
    DataTypes,
    Model,
    Optional,
} from 'sequelize';
import connection from '../sequelize';
import {
    IAccountConfirmationAttributes,
    ICourseAttributes,
    ICourseProgressAttributes,
    IPhoneNumberAttributes,
    IProfileAttributes,
    IRatingAttributes,
    IRefreshTokenAttributes,
    IResetPasswordAttributes,
    IRoleAttributes,
    IUserAttributes,
} from '../../types';
import { Quicker } from '../../utils/helper';
import Role from './role';
import { BelongsToManyGetAssociationsMixin } from 'sequelize';
import Course from './course';

type TUserCreationAttributes = Optional<IUserAttributes, 'id'>;

class User extends Model<IUserAttributes, TUserCreationAttributes> implements IUserAttributes {
    public id!: number;
    public firstName!: string;
    public lastName!: string;
    public email!: string;
    public password!: string;
    public timezone!: string;
    public consent!: boolean;
    public lastLoginAt!: Date;
    public readonly createdAt?: Date | undefined;
    public readonly updatedAt?: Date | undefined;

    // Associations
    public roles?: IRoleAttributes[] | undefined;
    public profileDetails?: IProfileAttributes | undefined;
    public phoneNumber?: IPhoneNumberAttributes | undefined;
    public accountConfirmation?: IAccountConfirmationAttributes | undefined;
    public refreshToken?: IRefreshTokenAttributes | undefined;
    public resetPassword?: IResetPasswordAttributes | undefined;
    public ratings?: IRatingAttributes | undefined;
    public enrolledCourses?: ICourseAttributes | undefined;
    public taughtCourses?: ICourseAttributes[] | undefined;
    public progressRecords?: ICourseProgressAttributes[] | undefined;

    //
    declare addRole: BelongsToManyAddAssociationMixin<Role, Role['id']>;
    declare hasRole: BelongsToManyHasAssociationMixin<Role, Role['id']>;

    declare addEnrolledCourses: BelongsToManyAddAssociationMixin<Course, Course['id']>;
    declare getEnrolledCourses: BelongsToManyGetAssociationsMixin<Course>;
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
