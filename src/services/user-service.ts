import { StatusCodes } from 'http-status-codes';
import { RoleRepository, UserRepository } from '../repositories';
import { IRegisterRequestBody, IUserAttributes } from '../types';
import { ResponseMessage } from '../utils/constants';
import { AppError } from '../utils/error';
import { Quicker } from '../utils/helper';
import PhoneNumberService from './phone-number-service';

class UserService {
    private userRepository: UserRepository;
    private roleRepository: RoleRepository;
    private phoneNumberService: PhoneNumberService;

    constructor() {
        this.userRepository = new UserRepository();
        this.roleRepository = new RoleRepository();
        this.phoneNumberService = new PhoneNumberService();
    }

    public async registerUser(data: IRegisterRequestBody) {
        try {
            // * destructure data;
            const {
                consent,
                email,
                firstName,
                lastName,
                password,
                phoneNumber,
                username,
                role,
            } = data;

            // * Parsing the phone number
            const { countryCode, internationalNumber, isoCode } =
                Quicker.parsePhoneNumber('+' + phoneNumber);

            // ----> check if any key is empty
            if (!countryCode || !isoCode || !internationalNumber) {
                throw new AppError(
                    ResponseMessage.INVALID_PHONE_NUMBER,
                    StatusCodes.UNPROCESSABLE_ENTITY,
                );
            }

            // * get timezone from phone number iso code
            const timezone = Quicker.getCountryTimezone(isoCode);

            // * check timezone exists or not
            if (!timezone || timezone.length === 0) {
                throw new AppError(
                    ResponseMessage.INVALID_PHONE_NUMBER,
                    StatusCodes.UNPROCESSABLE_ENTITY,
                );
            }

            // * check if user already exists
            const isUserExists = await this.userRepository.findByEmail(email);
            if (isUserExists) {
                throw new AppError(
                    ResponseMessage.EMAIL_ALREADY_IN_USE,
                    StatusCodes.BAD_REQUEST,
                );
            }

            // * create new user
            const user = await this.userRepository.create({
                firstName,
                lastName,
                email,
                password,
                consent,
                username,
                timezone: timezone[0].name,
            });

            // * check if role exists ---> if yes then assign to new user, else ---> throw error
            const user_role = await this.roleRepository.findByRole(role);
            if (user_role) {
                user.addRole(user_role);
            } else {
                throw new AppError(
                    ResponseMessage.NOT_FOUND('Role'),
                    StatusCodes.NOT_FOUND,
                );
            }

            // * create Phone number entry
            const newPhoneNumber =
                await this.phoneNumberService.createPhoneNumber({
                    isoCode,
                    internationalNumber,
                    countryCode,
                    userId: user.id,
                });

            // * create OTP and random token for account verification

            // * send email

            // * return the complete user
            const userDetails: IUserAttributes = {
                ...user,
                phoneNumber: newPhoneNumber,
            };

            return userDetails;
        } catch (error) {
            if (error instanceof AppError) throw error;

            throw new AppError(
                ResponseMessage.SOMETHING_WENT_WRONG,
                StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    }
}

export default UserService;
