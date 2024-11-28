import { IRatingAttributes } from './rating-types';
import { ITagsAttributes } from './tags-types';
import { IUserAttributes } from './user-types';

export interface ICourseAttributes {
    id?: number;
    name: string;
    description: string;
    whatYouWillLearn: string;
    price: number;
    thumbnail: string;
    requirements: string;
    instructorId: number;
    categoryId: number;
    status: string;
    sales: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    students?: IUserAttributes[];
    ratings?: IRatingAttributes[];
    sections?: ISectionAttributes[];
    instructor?: IUserAttributes;
    progressRecords?: ICourseProgressAttributes[];
    courseTags?: ITagsAttributes[];
}

export interface IEnrollmentAttributes {
    id?: number;
    studentId: number;
    courseId: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
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

export interface ICourseRequestBody {
    name: string;
    description: string;
    whatYouWillLearn: string;
    price: number;
    category: string;
    tags: string[];
    requirements: string;
    status: string;
}

export interface ISectionRequestBody {
    name: string;
}

export interface ISubSectionRequestBody {
    title: string;
    description: string;
}

export interface ISubSectionUpdateParams extends ISubSectionAttributes {
    file: Express.Multer.File | undefined;
}

export interface ICourseUpdateParams extends ICourseAttributes {
    file: Express.Multer.File | undefined;
    tags: string[];
    category: string;
}
