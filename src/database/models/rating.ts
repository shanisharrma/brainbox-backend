'use strict';

import { DataTypes, Model, Optional } from 'sequelize';
import connection from '../sequelize';
import { ICourseAttributes, IRatingAttributes, IUserAttributes } from '../../types';

type TRatingCreationAttributes = Optional<IRatingAttributes, 'id'>;

class Rating extends Model<IRatingAttributes, TRatingCreationAttributes> implements IRatingAttributes {
    public id!: number;
    public studentId!: number;
    public courseId!: number;
    public rating!: number;
    public review!: string;
    public readonly createdAt?: Date | undefined;
    public readonly updatedAt?: Date | undefined;

    public course?: ICourseAttributes | undefined;
    public student?: IUserAttributes | undefined;

    // Declare averageRating as an optional property
    public averageRating?: number | null;
}
Rating.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        studentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        courseId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        rating: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        review: {
            type: DataTypes.STRING,
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
        modelName: 'Rating',
    },
);

export default Rating;
