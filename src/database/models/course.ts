'use strict';

import {
    BelongsToManyAddAssociationMixin,
    BelongsToManyAddAssociationsMixin,
    BelongsToManyHasAssociationsMixin,
    DataTypes,
    Model,
    Optional,
} from 'sequelize';
import connection from '../sequelize';
import {
    ICategoryAttributes,
    ICourseAttributes,
    ICourseProgressAttributes,
    IRatingAttributes,
    ISectionAttributes,
    IUserAttributes,
} from '../../types';
import Category from './category';
import { BelongsToManyHasAssociationMixin } from 'sequelize';
import User from './user';
import { BelongsToManyGetAssociationsMixin } from 'sequelize';
import { BelongsToManyRemoveAssociationsMixin } from 'sequelize';

type TCourseCreationAttributes = Optional<ICourseAttributes, 'id'>;

class Course extends Model<ICourseAttributes, TCourseCreationAttributes> implements ICourseAttributes {
    public id!: number;
    public name!: string;
    public description!: string;
    public whatYouWillLearn!: string;
    public price!: number;
    public thumbnail!: string;
    public instructorId!: number;
    public readonly createdAt?: Date | undefined;
    public readonly updatedAt?: Date | undefined;

    public students?: IUserAttributes[] | undefined;
    public categories?: ICategoryAttributes[] | undefined;
    public ratings?: IRatingAttributes[] | undefined;
    public sections?: ISectionAttributes[] | undefined;
    public instructor?: IUserAttributes | undefined;
    public progressRecords?: ICourseProgressAttributes[] | undefined;

    // hooks
    declare hasCategory: BelongsToManyHasAssociationMixin<Category, Category['id']>;
    declare addCategories: BelongsToManyAddAssociationsMixin<Category, Category['id']>;
    declare hasCategories: BelongsToManyHasAssociationsMixin<Category, Category['id']>;
    declare getCategories: BelongsToManyGetAssociationsMixin<Category>;
    declare removeCategories: BelongsToManyRemoveAssociationsMixin<Category, Category['id']>;

    declare addStudent: BelongsToManyAddAssociationMixin<User, User['id']>;
    declare hasStudent: BelongsToManyHasAssociationMixin<User, User['id']>;
    declare getStudents: BelongsToManyGetAssociationsMixin<User>;
    declare removeStudents: BelongsToManyRemoveAssociationsMixin<User, User['id']>;
}

Course.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        whatYouWillLearn: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        thumbnail: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        instructorId: {
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
        modelName: 'Course',
    },
);

export default Course;
