import { NextFunction, Request, Response } from 'express';
import { RatingService } from '../services';
import { HttpError, HttpResponse } from '../utils/common';
import { AppError } from '../utils/error';
import { StatusCodes } from 'http-status-codes';
import { ResponseMessage } from '../utils/constants';
import { IRatingRequestBody } from '../types';

interface IRatingRequest extends Request {
    body: IRatingRequestBody;
    params: { courseId: string };
    id: number;
}

class RatingController {
    private static ratingService: RatingService = new RatingService();

    public static async create(req: Request, res: Response, next: NextFunction) {
        try {
            // * destructure request
            const { body, params, id } = req as IRatingRequest;
            // * get courseId
            const { courseId } = params;

            // * call create rating service
            const response = await RatingController.ratingService.create(id, Number(courseId), body);

            HttpResponse(req, res, StatusCodes.CREATED, ResponseMessage.CREATED('Rating'), response);
        } catch (error) {
            HttpError(
                next,
                error,
                req,
                error instanceof AppError ? error.statusCode : StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    }

    public static async getAverage(req: Request, res: Response, next: NextFunction) {
        try {
            // * destructure request
            const { params } = req as IRatingRequest;
            // * get courseId
            const { courseId } = params;

            // * call create rating service
            const response = await RatingController.ratingService.getAverage(Number(courseId));

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

    public static async showAll(req: Request, res: Response, next: NextFunction) {
        try {
            // * call create rating service
            const response = await RatingController.ratingService.showAll();

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

export default RatingController;
