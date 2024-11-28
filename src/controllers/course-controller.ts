import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { FileUploaderService, ServiceFactory } from '../services';
import { ResponseMessage } from '../utils/constants';
import { HttpError, HttpResponse } from '../utils/common';
import { AppError } from '../utils/error';
import { ICourseRequestBody, ICourseUpdateParams } from '../types';

interface ICourseRequest extends Request {
    body: ICourseRequestBody;
    file: Express.Multer.File;
    id: number;
    params: { courseId: string };
}

class CourseController {
    private static courseService = ServiceFactory.getInstance().getCourseService();

    public static async create(req: Request, res: Response, next: NextFunction) {
        try {
            // * destruct the request
            const { body, file, id } = req as ICourseRequest;

            // * check file is uploaded or not
            if (!file) {
                throw new AppError(ResponseMessage.ENTITY_REQUIRED('Thumbnail'), StatusCodes.BAD_REQUEST);
            }

            // * check file validation
            const validatedFile = FileUploaderService.validateFile(file, {
                fieldName: file.fieldname,
                allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png'],
                maxSize: 1024 * 1024 * 5,
            });

            // * call category service
            const response = await CourseController.courseService.create(body, validatedFile, id);

            HttpResponse(req, res, StatusCodes.CREATED, ResponseMessage.CREATED('Course'), response);
        } catch (error) {
            HttpError(
                next,
                error,
                req,
                error instanceof AppError ? error.statusCode : StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    }

    public static async showAll(req: Request, res: Response, next: NextFunction) {
        try {
            // * call category service
            const response = await CourseController.courseService.showAll();

            HttpResponse(req, res, StatusCodes.OK, ResponseMessage.SUCCESS, response);
        } catch (error) {
            HttpError(
                next,
                error,
                req,
                error instanceof AppError ? error.statusCode : StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    }

    public static async showPublic(req: Request, res: Response, next: NextFunction) {
        try {
            const { params } = req as ICourseRequest;

            const { courseId } = params;

            // * call category service
            const response = await CourseController.courseService.getOneWithAssociationsById(Number(courseId));

            HttpResponse(req, res, StatusCodes.OK, ResponseMessage.SUCCESS, response);
        } catch (error) {
            HttpError(
                next,
                error,
                req,
                error instanceof AppError ? error.statusCode : StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    }

    public static async showEditable(req: Request, res: Response, next: NextFunction) {
        try {
            const { params, id } = req as ICourseRequest;

            const { courseId } = params;

            // * call category service
            const response = await CourseController.courseService.getOneWithAssociationsByIdAndInstructor(
                Number(courseId),
                id,
            );

            HttpResponse(req, res, StatusCodes.OK, ResponseMessage.SUCCESS, response);
        } catch (error) {
            HttpError(
                next,
                error,
                req,
                error instanceof AppError ? error.statusCode : StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    }

    public static async enrolledCourses(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req as ICourseRequest;

            // * call category service
            const response = await CourseController.courseService.enrolledCourses(id);

            HttpResponse(req, res, StatusCodes.OK, ResponseMessage.SUCCESS, response);
        } catch (error) {
            HttpError(
                next,
                error,
                req,
                error instanceof AppError ? error.statusCode : StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    }

    public static async taughtCourses(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req as ICourseRequest;

            // * call category service
            const response = await CourseController.courseService.taughtCourses(id);

            HttpResponse(req, res, StatusCodes.OK, ResponseMessage.SUCCESS, response);
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
            // * destructure the request
            const { body, params, id, file } = req as ICourseRequest;
            // * destructure the params
            const { courseId } = params;
            // * destructure the body
            const { category, description, name, price, requirements, status, tags, whatYouWillLearn } = body;

            const updatedCourseData: Partial<ICourseUpdateParams> = {
                description,
                category,
                tags,
                name,
                price,
                requirements,
                status,
                whatYouWillLearn,
                file: undefined,
            };

            if (file) {
                // * validate the file
                const validatedFile = FileUploaderService.validateFile(file, {
                    fieldName: file.filename,
                    allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png'],
                    maxSize: 1024 * 1024 * 5,
                });
                updatedCourseData.file = validatedFile;
            }

            const response = await CourseController.courseService.update(Number(courseId), id, updatedCourseData);

            HttpResponse(req, res, StatusCodes.OK, ResponseMessage.UPDATED('Course'), response);
        } catch (error) {
            HttpError(
                next,
                error,
                req,
                error instanceof AppError ? error.statusCode : StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    }

    public static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const { params, id } = req as ICourseRequest;

            const { courseId } = params;

            const response = await CourseController.courseService.destroy(Number(courseId), id);

            HttpResponse(req, res, StatusCodes.OK, ResponseMessage.DELETED('Course'), response);
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

export default CourseController;
