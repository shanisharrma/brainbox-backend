import { IUserAttributes } from './user-types';

export interface ICourseAttributes {
    id?: number;
    name: string;
    description: string;
    whatYouWillLearn: string;
    price: number;
    thumbnail: string;
    instructorId: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    users?: IUserAttributes[];
    categories?: ICategoryAttributes[];
    ratings?: IRatingAttributes[];
    sections?: ICourseAttributes[];
}

export interface IEnrollmentAttributes {
    id?: number;
    studentId: number;
    courseId: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

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

export interface IRatingAttributes {
    id?: number;
    studentId: number;
    courseId: number;
    rating: number;
    review: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    course?: ICategoryAttributes;
    student?: IUserAttributes;
}

export interface ISectionAttributes {
    id?: number;
    name: string;
    courseId: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    course?: ICourseAttributes;
    subSections?: ISubSectionAttributes[];
}

export interface ISubSectionAttributes {
    id?: number;
    title: string;
    description: string;
    duration: string;
    videoUrl: string;
    sectionId: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    section?: ISectionAttributes;
}

export interface ICourseProgressAttributes {
    id?: number;
    studentId: number;
    courseId: number;
    subSectionId: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}
