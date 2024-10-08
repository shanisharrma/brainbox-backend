import { StatusCodes } from 'http-status-codes';
import { RefreshTokenRepository } from '../repositories';
import { IRefreshTokenAttributes } from '../types';
import { ResponseMessage } from '../utils/constants';
import { AppError } from '../utils/error';

class RefreshTokenService {
    private refreshTokenRepository: RefreshTokenRepository;

    constructor() {
        this.refreshTokenRepository = new RefreshTokenRepository();
    }

    public async create(payload: IRefreshTokenAttributes) {
        try {
            return await this.refreshTokenRepository.create(payload);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async findByUserId(userId: number) {
        try {
            return await this.refreshTokenRepository.findByUserId(userId);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async update(id: number, data: Partial<IRefreshTokenAttributes>) {
        try {
            return await this.refreshTokenRepository.update(id, data);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async deleteByToken(token: string) {
        try {
            return this.refreshTokenRepository.deleteByToken(token);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async findByToken(token: string) {
        try {
            return await this.refreshTokenRepository.findByToken(token);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

export default RefreshTokenService;
