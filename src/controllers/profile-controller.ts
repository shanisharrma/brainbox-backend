import { NextFunction, Request, Response } from 'express';
import { ProfileService } from '../services';
import { StatusCodes } from 'http-status-codes';
import { ResponseMessage } from '../utils/constants';
import { HttpError, HttpResponse } from '../utils/common';
import { AppError } from '../utils/error';

interface IProfileRequest extends Request {
    id: number;
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
}

export default ProfileController;
