'use strict';

import { DataTypes, Model, Optional } from 'sequelize';
import connection from '../sequelize';
import { ISectionAttributes, ISubSectionAttributes } from '../../types';

type TSubSectionCreationAttributes = Optional<ISubSectionAttributes, 'id'>;

class Sub_Section extends Model<ISubSectionAttributes, TSubSectionCreationAttributes> implements ISubSectionAttributes {
    public id!: number;
    public title!: string;
    public description!: string;
    public duration!: string;
    public videoUrl!: string;
    public sectionId!: number;
    public readonly createdAt?: Date | undefined;
    public readonly updatedAt?: Date | undefined;

    public section?: ISectionAttributes | undefined;
}
Sub_Section.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        duration: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        videoUrl: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        sectionId: {
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
        modelName: 'Sub_Section',
    },
);

export default Sub_Section;
