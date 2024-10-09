import { IRatingAttributes } from './course-types';
import { TWithAssociations } from './types';

export interface IUserAttributes {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    lastLoginAt?: Date;
    timezone: string;
    consent: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    roles?: IRoleAttributes[];
    phoneNumber?: IPhoneNumberAttributes;
    accountConfirmation?: IAccountConfirmationAttributes;
    refreshToken?: IRefreshTokenAttributes;
    resetPassword?: IResetPasswordAttributes;
    ratings?: IRatingAttributes;
}

export interface IRoleAttributes {
    id?: number;
    role: string;
    description: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    users?: IUserAttributes[];
}

export interface IUserRolesAttributes {
    id?: number;
    roleId: number;
    userId: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export interface IPhoneNumberAttributes {
    id?: number;
    isoCode: string;
    countryCode: string;
    internationalNumber: string;
    userId: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    user?: IUserAttributes;
}

export interface IAccountConfirmationAttributes {
    id?: number;
    userId: number;
    token: string;
    code: string;
    status: boolean;
    expiresAt: number;
    verifiedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    user?: IUserAttributes;
}

export interface IRefreshTokenAttributes {
    id?: number;
    userId: number;
    token: string;
    expiresAt: number;
    revoked: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    user?: IUserAttributes;
}

export interface IResetPasswordAttributes {
    id?: number;
    userId: number;
    token: string;
    expiresAt: number;
    used?: boolean;
    lastResetAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    user?: IUserAttributes;
}

export interface IProfileAttributes {
    id?: number;
    userId: number;
    gender: string;
    dateOfBirth: string;
    about: string;
    imageUrl: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    user?: IUserAttributes;
}

export interface IRegisterRequestBody {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    role: string;
    consent: boolean;
}

export interface IVerificationRequestBody {
    code: string;
}

export interface ILoginRequestBody {
    email: string;
    password: string;
}

export interface IForgotRequestBody {
    email: string;
}

export interface IResetPasswordRequestBody {
    password: string;
    confirmPassword: string;
}

export interface IChangePasswordRequestBody {
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

export type TAccountConfirmationWithUser = TWithAssociations<IAccountConfirmationAttributes, { user: IUserAttributes }>;

export type TUserWithAssociations = TWithAssociations<
    IUserAttributes,
    { accountConfirmation: IAccountConfirmationAttributes; phoneNumber: IPhoneNumberAttributes; role: IRoleAttributes }
>;

export type TUserWithAccountConfirmationAndResetPassword = TWithAssociations<
    IUserAttributes,
    { accountConfirmation: IAccountConfirmationAttributes; resetPassword: IResetPasswordAttributes }
>;

export type TResetPasswordWithUser = TWithAssociations<IResetPasswordAttributes, { user: IUserAttributes }>;
