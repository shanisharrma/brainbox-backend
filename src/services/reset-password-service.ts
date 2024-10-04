import { StatusCodes } from 'http-status-codes';
import { ResetPasswordRepository } from '../repositories';
import { IResetPasswordAttributes } from '../types';
import { ResponseMessage } from '../utils/constants';
import { AppError } from '../utils/error';

class ResetPasswordService {
    private resetPasswordRepository: ResetPasswordRepository;

    constructor() {
        this.resetPasswordRepository = new ResetPasswordRepository();
    }

    public async createResetPassword(data: IResetPasswordAttributes) {
        try {
            const { expiresAt, token, userId } = data;
            return await this.resetPasswordRepository.create({ expiresAt, token, userId });
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async updateResetPassword(id: number, data: Partial<IResetPasswordAttributes>) {
        try {
            return this.resetPasswordRepository.update(id, data);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

export default ResetPasswordService;
