import { StatusCodes } from 'http-status-codes';
import { AccountConfirmationRepository } from '../repositories';
import { IAccountConfirmationAttributes } from '../types';
import { ResponseMessage } from '../utils/constants';
import { AppError } from '../utils/error';
import { Account_Confirmation } from '../database/models';

class AccountConfirmationService {
    private accountConfirmationRepository: AccountConfirmationRepository;

    constructor() {
        this.accountConfirmationRepository = new AccountConfirmationRepository();
    }

    public async create(data: IAccountConfirmationAttributes) {
        try {
            const { code, status, token, userId, expiresAt } = data;

            const accountConfirmation = await this.accountConfirmationRepository.create({
                code,
                status,
                token,
                userId,
                expiresAt,
            });

            return accountConfirmation.get({ plain: true });
        } catch (error) {
            if (error instanceof AppError) throw error;

            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async findWithUser(token: string, code: string) {
        try {
            const accountConfirmationWithUser = await this.accountConfirmationRepository.findWithUser(token, code);

            return accountConfirmationWithUser;
        } catch (error) {
            if (error instanceof AppError) throw error;

            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
    public async delete(id: number) {
        try {
            return await this.accountConfirmationRepository.destroyById(id);
        } catch (error) {
            if (error instanceof AppError) throw error;

            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async update(id: number, data: Partial<Account_Confirmation>) {
        try {
            return await this.accountConfirmationRepository.update(id, data);
        } catch (error) {
            if (error instanceof AppError) throw error;

            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async getByUserId(userId: number) {
        try {
            return await this.accountConfirmationRepository.getOne({ where: { userId: userId } });
        } catch (error) {
            if (error instanceof AppError) throw error;

            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

export default AccountConfirmationService;
