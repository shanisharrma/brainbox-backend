import { NextFunction, Request, Response } from 'express';
import { HttpError, HttpResponse } from '../utils/common';
import { AppError } from '../utils/error';
import { StatusCodes } from 'http-status-codes';
import { ResponseMessage } from '../utils/constants';
import { ICategoryRequestBody } from '../types';
import { ServiceFactory } from '../services';
import { Quicker } from '../utils/helper';

interface ICategoryRequest extends Request {
    body: ICategoryRequestBody;
    params: { category: string };
}

class CategoryController {
    private static categoryService = ServiceFactory.getInstance().getCategoryService();

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

            const categoriesResponse = categories.map((category) => ({
                name: category.name,
                description: category.description,
            }));

            HttpResponse(req, res, StatusCodes.OK, ResponseMessage.CATEGORY_SUCCESS, categoriesResponse);
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

            const { category } = params;

            const categoryName = Quicker.capitalizeWord(category);

            const response = await CategoryController.categoryService.showAllCourses(categoryName);

            HttpResponse(req, res, StatusCodes.OK, ResponseMessage.CATEGORY_SUCCESS, response);
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
