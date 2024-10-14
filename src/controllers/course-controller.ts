import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CourseService, FileUploaderService } from '../services';
import { ResponseMessage } from '../utils/constants';
import { HttpError, HttpResponse } from '../utils/common';
import { AppError } from '../utils/error';
import { ICourseRequestBody } from '../types';

interface ICourseRequest extends Request {
    body: ICourseRequestBody;
    file: Express.Multer.File;
    id: number;
}

class CourseController {
    private static courseService: CourseService = new CourseService();

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
}

export default CourseController;
