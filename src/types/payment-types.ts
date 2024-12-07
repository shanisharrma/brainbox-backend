import { ICourseAttributes } from './course-types';
import { IUserAttributes } from './user-types';

export interface IPaymentAttributes {
    id?: string;
    userId: number;
    provider: 'stripe' | 'razorpay';
    orderId: string;
    status: 'pending' | 'succeeded' | 'failed';
    amount: number;
    currency: string;
    paymentId?: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    courses?: ICourseAttributes[];
    students?: IUserAttributes;
}

export interface IPaymentCourseAttributes {
    id?: number;
    courseId: number;
    paymentId: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export interface ICapturePaymentRequestBody {
    provider: 'stripe' | 'razorpay';
    courseIds: number[];
}

export interface IVerifyPaymentRequestBody {
    provider: 'stripe' | 'razorpay';
    orderId: string;
    paymentId: string;
    signature: string;
    courseIds: number[];
}
