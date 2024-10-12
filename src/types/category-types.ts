import { ICourseAttributes } from './course-types';

export interface ICategoryAttributes {
    id?: number;
    name: string;
    description: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    courses?: ICourseAttributes[];
}

export interface ICourseCategoryAttributes {
    id?: number;
    categoryId: number;
    courseId: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export interface ICategoryRequestBody {
    name: string;
    description: string;
}
