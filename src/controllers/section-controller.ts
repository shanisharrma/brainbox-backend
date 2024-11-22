import { NextFunction, Request, Response } from 'express';
import { SectionService } from '../services';
import { HttpError, HttpResponse } from '../utils/common';
import { AppError } from '../utils/error';
import { StatusCodes } from 'http-status-codes';
import { ResponseMessage } from '../utils/constants';
import { ISectionRequestBody } from '../types';

interface ISectionRequest extends Request {
    params: {
        courseId: string;
        sectionId: string;
    };
    body: ISectionRequestBody;
    id: number;
}

class SectionController {
    private static sectionService: SectionService = new SectionService();

    public static async create(req: Request, res: Response, next: NextFunction) {
        try {
            // * destructure the req
            const { body, params, id } = req as ISectionRequest;

            // * destructure the params and body
            const { name } = body;
            const { courseId } = params;

            // * call the create service
            const response = await SectionController.sectionService.create(Number(courseId), id, { name });

            HttpResponse(req, res, StatusCodes.CREATED, ResponseMessage.CREATED('Section'), response);
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
            const { body, params } = req as ISectionRequest;

            // * destructure the params and body
            const { name } = body;
            const { courseId, sectionId } = params;

            // * call the create service
            const response = await SectionController.sectionService.update(Number(sectionId), Number(courseId), {
                name,
            });

            HttpResponse(req, res, StatusCodes.OK, ResponseMessage.UPDATED('Section'), response);
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
            // * destructure the req
            const { params } = req as ISectionRequest;

            // * destructure the params
            const { courseId, sectionId } = params;

            // * call the create service
            await SectionController.sectionService.delete(Number(sectionId), Number(courseId));

            HttpResponse(req, res, StatusCodes.OK, ResponseMessage.DELETED('Section'));
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

export default SectionController;
