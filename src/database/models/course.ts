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
    ICourseAttributes,
    ICourseProgressAttributes,
    IRatingAttributes,
    ISectionAttributes,
    ITagsAttributes,
    IUserAttributes,
} from '../../types';
import { BelongsToManyHasAssociationMixin } from 'sequelize';
import User from './user';
import { BelongsToManyGetAssociationsMixin } from 'sequelize';
import { BelongsToManyRemoveAssociationsMixin } from 'sequelize';
import Tag from './tag';

type TCourseCreationAttributes = Optional<ICourseAttributes, 'id'>;

class Course extends Model<ICourseAttributes, TCourseCreationAttributes> implements ICourseAttributes {
    public id!: number;
    public name!: string;
    public description!: string;
    public whatYouWillLearn!: string;
    public price!: number;
    public thumbnail!: string;
    public requirements!: string;
    public instructorId!: number;
    public status!: string;
    public sales!: number;
    public categoryId!: number;
    public readonly createdAt?: Date | undefined;
    public readonly updatedAt?: Date | undefined;

    public students?: IUserAttributes[] | undefined;
    public ratings?: IRatingAttributes[] | undefined;
    public sections?: ISectionAttributes[] | undefined;
    public instructor?: IUserAttributes | undefined;
    public progressRecords?: ICourseProgressAttributes[] | undefined;
    public courseTags?: ITagsAttributes[] | undefined;

    // hooks
    declare hasCourseTag: BelongsToManyHasAssociationMixin<Tag, Tag['id']>;
    declare addCourseTags: BelongsToManyAddAssociationsMixin<Tag, Tag['id']>;
    declare hasCourseTags: BelongsToManyHasAssociationsMixin<Tag, Tag['id']>;
    declare getCourseTags: BelongsToManyGetAssociationsMixin<Tag>;
    declare removeCourseTags: BelongsToManyRemoveAssociationsMixin<Tag, Tag['id']>;

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
        requirements: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        instructorId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        categoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM,
            values: ['draft', 'published'],
        },
        sales: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
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
