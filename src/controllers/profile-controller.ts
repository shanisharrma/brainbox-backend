import { NextFunction, Request, Response } from 'express';
import { FileUploaderService, ProfileService } from '../services';
import { StatusCodes } from 'http-status-codes';
import { ResponseMessage } from '../utils/constants';
import { HttpError, HttpResponse } from '../utils/common';
import { AppError } from '../utils/error';
import { IProfileRequestBody, IProfileUpdateParams } from '../types';

interface IProfileRequest extends Request {
    body: IProfileRequestBody;
    file: Express.Multer.File;
    id: number;
}

interface IInstructorCourse {
    id: number;
    name: string;
    description: string;
    thumbnail: string;
    price: number;
    enrolledStudents: number;
    amountGenerated: number;
}

interface IInstructorDashboardData {
    courses: IInstructorCourse[];
    totalStudents: number;
    totalRevenue: number;
}

class ProfileController {
    private static profileService: ProfileService = new ProfileService();

    public static async profile(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req as IProfileRequest;
            const response = await ProfileController.profileService.profile(id);

            HttpResponse(req, res, StatusCodes.OK, ResponseMessage.PROFILE_SUCCESS, response);
        } catch (error) {
            HttpError(
                next,
                error,
                req,
                error instanceof AppError ? error.statusCode : StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    }

    public static async update(req: Request, res: Response, next: NextFunction) {
        try {
            // * destructure the req
            const { body, file, id } = req as IProfileRequest;

            // * destructure the body
            const { about, dateOfBirth, gender, firstName, lastName, phoneNumber } = body;

            // * update profile data params
            const updateProfile: Partial<IProfileUpdateParams> = {
                about,
                dateOfBirth,
                gender,
                firstName,
                lastName,
                phoneNumber,
                file: undefined,
            };

            // * check file exists
            if (file) {
                const validatedFile = FileUploaderService.validateFile(file, {
                    fieldName: file.fieldname,
                    allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png'],
                    maxSize: 1024 * 1024 * 5,
                });
                updateProfile.file = validatedFile;
            }

            const response = await ProfileController.profileService.update(id, updateProfile);

            HttpResponse(req, res, StatusCodes.OK, ResponseMessage.UPDATED('Profile details'), response);
        } catch (error) {
            HttpError(
                next,
                error,
                req,
                error instanceof AppError ? error.statusCode : StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    }

    public static async getInstructorData(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req as IProfileRequest;

            const response = await ProfileController.profileService.instructorDashboard(id);

            const taughtCourses: IInstructorCourse[] = response!.taughtCourses!.map((course) => ({
                id: course.id!,
                name: course.name,
                description: course.description,
                thumbnail: course.thumbnail,
                price: course.price,
                enrolledStudents: course.students ? course.students.length : 0,
                amountGenerated: course.payments
                    ? course.payments.reduce((acc, payment) => acc + payment.amount, 0)
                    : 0,
            }));

            let totalRevenue = 0;
            let totalStudents = 0;
            taughtCourses.forEach((course) => {
                totalStudents += course.enrolledStudents;
                totalRevenue += course.amountGenerated;
            });

            const instructorDashboardResponse: IInstructorDashboardData = {
                courses: taughtCourses,
                totalRevenue,
                totalStudents,
            };

            HttpResponse(req, res, StatusCodes.OK, ResponseMessage.SUCCESS, instructorDashboardResponse);
        } catch (error) {
            HttpError(
                next,
                error,
                req,
                error instanceof AppError ? error.statusCode : StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    }
}

export default ProfileController;
