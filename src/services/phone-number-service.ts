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

    public async update(id: number, data: Partial<IPhoneNumberAttributes>) {
        try {
            const { countryCode, internationalNumber, isoCode, userId } = data;

            const phoneNumber = await this.phoneRepository.getOne({ where: { id: id, userId: userId } });
            if (!phoneNumber) {
                throw new AppError(ResponseMessage.NOT_FOUND('Phone Number'), StatusCodes.NOT_FOUND);
            }

            phoneNumber.update({ countryCode, internationalNumber, isoCode });

            return phoneNumber;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

export default PhoneNumberService;
