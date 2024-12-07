import { NextFunction, Request, Response } from 'express';
import { HttpError, HttpResponse } from '../utils/common';
import { AppError } from '../utils/error';
import { StatusCodes } from 'http-status-codes';
import { ResponseMessage } from '../utils/constants';
import { CourseProgressService } from '../services';

interface ICourseProgressRequest extends Request {
    params: {
        courseId: string;
        subSectionId: string;
    };
    id: number;
}

class CourseProgressController {
    private static courseProgressService: CourseProgressService = new CourseProgressService();

    public static async create(req: Request, res: Response, next: NextFunction) {
        try {
            // * destructure the request
            const { params, id } = req as ICourseProgressRequest;
            // * get course id and subSection id
            const { subSectionId, courseId } = params;

            const response = await CourseProgressController.courseProgressService.create(
                Number(courseId),
                id,
                Number(subSectionId),
            );

            HttpResponse(req, res, StatusCodes.CREATED, ResponseMessage.CREATED('Course Progress'), response);
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
            const { params, id } = req as ICourseProgressRequest;
            // * get course id and subSection id
            const { subSectionId, courseId } = params;

            const response = await CourseProgressController.courseProgressService.updateProgress(
                id,
                Number(courseId),
                Number(subSectionId),
            );

            HttpResponse(req, res, StatusCodes.CREATED, ResponseMessage.UPDATED('Course Progress'), response);
        } catch (error) {
            HttpError(
                next,
                error,
                req,
                error instanceof AppError ? error.statusCode : StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    }

    public static async getProgress(req: Request, res: Response, next: NextFunction) {
        try {
            const { params, id } = req as ICourseProgressRequest;
            const { courseId } = params;

            const response = await CourseProgressController.courseProgressService.getProgress(id, Number(courseId));

            HttpResponse(req, res, StatusCodes.CREATED, ResponseMessage.SUCCESS, response);
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

export default CourseProgressController;
