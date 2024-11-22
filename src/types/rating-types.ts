import { ICourseAttributes } from './course-types';
import { IUserAttributes } from './user-types';

export interface IRatingAttributes {
    id?: number;
    studentId: number;
    courseId: number;
    rating: number;
    review: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    course?: ICourseAttributes;
    student?: IUserAttributes;
}

export interface IRatingRequestBody {
    rating: number;
    review: string;
}
