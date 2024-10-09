'use strict';

import { DataTypes, Model, Optional } from 'sequelize';
import connection from '../sequelize';
import { ICourseAttributes, ISectionAttributes, ISubSectionAttributes } from '../../types';

type TSectionCreationAttributes = Optional<ISectionAttributes, 'id'>;

class Section extends Model<ISectionAttributes, TSectionCreationAttributes> implements ISectionAttributes {
    public id!: number;
    public name!: string;
    public courseId!: number;
    public readonly createdAt?: Date | undefined;
    public readonly updatedAt?: Date | undefined;

    public course?: ICourseAttributes | undefined;
    public subSections?: ISubSectionAttributes[] | undefined;
}
Section.init(
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
        courseId: {
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
        modelName: 'Section',
    },
);
export default Section;
