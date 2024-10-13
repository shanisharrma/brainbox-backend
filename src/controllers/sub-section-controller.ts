import { StatusCodes } from 'http-status-codes';
import { HttpError, HttpResponse } from '../utils/common';
import { AppError } from '../utils/error';
import { ResponseMessage } from '../utils/constants';
import { NextFunction, Request, Response } from 'express';
import { ISubSectionRequestBody } from '../types';
import { SubSectionService } from '../services';
import { FileUploader } from '../utils/helper';

interface ISubSectionRequest extends Request {
    params: { sectionId: string; subSectionId: string };
    file: Express.Multer.File;
    body: ISubSectionRequestBody;
    id: number;
}

class SubSectionController {
    private static subSectionService: SubSectionService = new SubSectionService();

    public static async create(req: Request, res: Response, next: NextFunction) {
        try {
            // * destructure the req
            const { body, params, file, id } = req as ISubSectionRequest;

            // * destructure the params and body
            const { title, description } = body;
            const { sectionId } = params;

            // * check file is uploaded or not
            if (!file) {
                throw new AppError(ResponseMessage.ENTITY_REQUIRED('Video Lecture'), StatusCodes.BAD_REQUEST);
            }

            // * validate the video file
            const validatedFile = FileUploader.validateFile(file, {
                fieldName: file.fieldname,
                allowedMimeTypes: ['video/mp4', 'video/mkv', 'video/avi'],
                maxSize: 1024 * 1024 * 100,
            });

            // * call the create service
            const response = await SubSectionController.subSectionService.create(Number(sectionId), id, validatedFile, {
                title,
                description,
            });

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
}

export default SubSectionController;
