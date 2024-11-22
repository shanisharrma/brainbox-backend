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

    public async create(data: IResetPasswordAttributes) {
        try {
            const { expiresAt, token, userId } = data;
            return await this.resetPasswordRepository.create({ expiresAt, token, userId });
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async update(id: number, data: Partial<IResetPasswordAttributes>) {
        try {
            return await this.resetPasswordRepository.update(id, data);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async findWithUserByToken(token: string) {
        try {
            if (!token) {
                throw new AppError(ResponseMessage.RESET_PASSWORD_TOKEN_MISSING, StatusCodes.BAD_REQUEST);
            }
            return await this.resetPasswordRepository.findWithUserByToken(token);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async delete(id: number) {
        try {
            return await this.resetPasswordRepository.destroyById(id);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

export default ResetPasswordService;
