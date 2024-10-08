import { StatusCodes } from 'http-status-codes';
import { PhoneNumberRepository } from '../repositories';
import { IPhoneNumberAttributes } from '../types';
import { ResponseMessage } from '../utils/constants';
import { AppError } from '../utils/error';

class PhoneNumberService {
    private phoneRepository: PhoneNumberRepository;

    constructor() {
        this.phoneRepository = new PhoneNumberRepository();
    }

    public async create(data: IPhoneNumberAttributes) {
        try {
            const { countryCode, internationalNumber, isoCode, userId } = data;

            const response = await this.phoneRepository.create({
                countryCode,
                internationalNumber,
                isoCode,
                userId,
            });

            return response;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

export default PhoneNumberService;
