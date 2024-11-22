import { NextFunction, Request, Response } from 'express';
import { HttpError, HttpResponse } from '../utils/common';
import { AppError } from '../utils/error';
import { StatusCodes } from 'http-status-codes';
import { ResponseMessage } from '../utils/constants';
import { ICategoryRequestBody } from '../types';
import { CategoryService } from '../services';

interface ICategoryRequest extends Request {
    body: ICategoryRequestBody;
    params: { categoryName: string };
}

class CategoryController {
    private static categoryService: CategoryService = new CategoryService();

    public static async create(req: Request, res: Response, next: NextFunction) {
        try {
            // * destruct the request
            const { body } = req as ICategoryRequest;

            // * call category service
            const response = await CategoryController.categoryService.create(body);

            HttpResponse(req, res, StatusCodes.CREATED, ResponseMessage.CREATED('Category'), response);
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
            const categories = await CategoryController.categoryService.getAll();
            HttpResponse(req, res, StatusCodes.OK, ResponseMessage.CATEGORY_SUCCESS, categories);
        } catch (error) {
            HttpError(
                next,
                error,
                req,
                error instanceof AppError ? error.statusCode : StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    }

    public static async showAllCourses(req: Request, res: Response, next: NextFunction) {
        try {
            const { params } = req as ICategoryRequest;

            const { categoryName } = params;

            const allCourses = await CategoryController.categoryService.showAllCourses(categoryName);

            HttpResponse(req, res, StatusCodes.OK, ResponseMessage.CATEGORY_SUCCESS, allCourses);
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

export default CategoryController;
