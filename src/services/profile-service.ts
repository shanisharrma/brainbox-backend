import { StatusCodes } from 'http-status-codes';
import { ResponseMessage } from '../utils/constants';
import { AppError } from '../utils/error';
import { IProfileAttributes, IProfileUpdateParams } from '../types';
import { ProfileRepository, UserRepository } from '../repositories';
import FileUploaderService from './file-uploader-service';
import { Quicker } from '../utils/helper';
import PhoneNumberService from './phone-number-service';
import { ParseError } from 'libphonenumber-js';

interface IProfileResponse {
    firstName: string;
    lastName: string;
    email: string;
    timezone: string;
    consent: boolean;
    roles: { role: string }[];
    profileDetails: {
        gender: string | null;
        dateOfBirth: string | null;
        about: string | null;
        imageUrl: string;
    };
    phoneNumber: {
        isoCode: string;
        countryCode: string;
        internationalNumber: string;
    };
    accountConfirmation: {
        status: boolean;
    };
    warning?: string | null;
}

class ProfileService {
    private userRepository: UserRepository;
    private profileRepository: ProfileRepository;
    private phoneNumberService: PhoneNumberService;

    constructor() {
        this.profileRepository = new ProfileRepository();
        this.userRepository = new UserRepository();
        this.phoneNumberService = new PhoneNumberService();
    }

    public async profile(id: number) {
        try {
            const userWithAssociations = await this.userRepository.getWithAssociationsById(id);

            if (
                !userWithAssociations ||
                !userWithAssociations.roles ||
                !userWithAssociations.profileDetails ||
                !userWithAssociations.accountConfirmation ||
                !userWithAssociations.phoneNumber
            ) {
                throw new AppError(ResponseMessage.NOT_FOUND('User'), StatusCodes.NOT_FOUND);
            }

            const profileResponse: IProfileResponse = {
                firstName: userWithAssociations.firstName,
                lastName: userWithAssociations.lastName,
                email: userWithAssociations.email,
                timezone: userWithAssociations.timezone,
                consent: userWithAssociations.consent,
                roles: userWithAssociations.roles.map((role) => ({ role: role.role })),
                profileDetails: {
                    about: userWithAssociations.profileDetails.about,
                    dateOfBirth: userWithAssociations.profileDetails.dateOfBirth,
                    gender: userWithAssociations.profileDetails.gender,
                    imageUrl: userWithAssociations.profileDetails.imageUrl,
                },
                phoneNumber: {
                    isoCode: userWithAssociations.phoneNumber.isoCode,
                    countryCode: userWithAssociations.phoneNumber.countryCode,
                    internationalNumber: userWithAssociations.phoneNumber.internationalNumber,
                },
                accountConfirmation: {
                    status: userWithAssociations.accountConfirmation.status,
                },
            };

            if (
                !userWithAssociations.accountConfirmation ||
                userWithAssociations.accountConfirmation.status === false
            ) {
                profileResponse.warning = ResponseMessage.ACCOUNT_NOT_VERIFIED;
            }

            return profileResponse;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async create(data: IProfileAttributes) {
        try {
            // * destructure the data
            const { about, dateOfBirth, gender, imageUrl, userId } = data;

            // * check user exists
            const user = await this.userRepository.getOneById(userId);
            if (!user) {
                throw new AppError(ResponseMessage.NOT_FOUND('User'), StatusCodes.NOT_FOUND);
            }

            // * check user profile details already created or not
            const existingProfile = await this.profileRepository.getByUserId(userId);
            if (existingProfile) {
                throw new AppError(ResponseMessage.PROFILE_ALREADY_CREATED, StatusCodes.BAD_REQUEST);
            }

            // * create user profile
            return await this.profileRepository.create({ about, dateOfBirth, gender, imageUrl, userId });
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async update(userId: number, data: Partial<IProfileUpdateParams>) {
        try {
            // * destructure the data
            const { about, dateOfBirth, gender, file, firstName, lastName, phoneNumber } = data;

            // * check user exists
            const userWithAssociations = await this.userRepository.getWithAssociationsById(userId);

            if (
                !userWithAssociations ||
                !userWithAssociations.roles ||
                !userWithAssociations.profileDetails ||
                !userWithAssociations.accountConfirmation ||
                !userWithAssociations.phoneNumber
            ) {
                throw new AppError(ResponseMessage.NOT_AUTHORIZATION, StatusCodes.UNAUTHORIZED);
            }

            // * check profile exists or not with userId
            const profile = await this.profileRepository.getOneById(userWithAssociations.profileDetails.id!);

            const profileResponse: IProfileResponse = {
                firstName: userWithAssociations.firstName,
                lastName: userWithAssociations.lastName,
                email: userWithAssociations.email,
                timezone: userWithAssociations.timezone,
                consent: userWithAssociations.consent,
                roles: userWithAssociations.roles.map((role) => ({ role: role.role })),
                profileDetails: {
                    about: userWithAssociations.profileDetails.about,
                    dateOfBirth: userWithAssociations.profileDetails.dateOfBirth,
                    gender: userWithAssociations.profileDetails.gender,
                    imageUrl: userWithAssociations.profileDetails.imageUrl,
                },
                phoneNumber: {
                    isoCode: userWithAssociations.phoneNumber.isoCode,
                    countryCode: userWithAssociations.phoneNumber.countryCode,
                    internationalNumber: userWithAssociations.phoneNumber.internationalNumber,
                },
                accountConfirmation: {
                    status: userWithAssociations.accountConfirmation.status,
                },
            };

            if (firstName && lastName && about && dateOfBirth && gender && phoneNumber) {
                // * Parsing the phone number
                const { countryCode, internationalNumber, isoCode } = Quicker.parsePhoneNumber(phoneNumber!);

                // ----> check if any key is empty
                if (!countryCode || !isoCode || !internationalNumber) {
                    throw new AppError(ResponseMessage.INVALID_PHONE_NUMBER, StatusCodes.UNPROCESSABLE_ENTITY);
                }

                // * get timezone from phone number iso code
                const timezone = Quicker.getCountryTimezone(isoCode);

                // * check timezone exists or not
                if (!timezone || timezone.length === 0) {
                    throw new AppError(ResponseMessage.INVALID_PHONE_NUMBER, StatusCodes.UNPROCESSABLE_ENTITY);
                }

                // * prepare profileUpdatePayload
                profile.about = about || profile.about;
                profile.gender = gender || profile.gender;
                profile.dateOfBirth = dateOfBirth || profile.dateOfBirth;

                // * check phoneNumber exists
                const updatedPhoneNumber = await this.phoneNumberService.update(userWithAssociations.phoneNumber.id!, {
                    countryCode,
                    internationalNumber,
                    isoCode,
                    userId,
                });

                // * update the profile details
                const updatedProfile = await profile.save();

                // * update user details firstName and lastName
                const updatedUser = await this.userRepository.update(userId, {
                    firstName,
                    lastName,
                    timezone: timezone[0].name,
                });

                profileResponse.phoneNumber.countryCode = updatedPhoneNumber.countryCode;
                profileResponse.phoneNumber.internationalNumber = updatedPhoneNumber.internationalNumber;
                profileResponse.phoneNumber.isoCode = updatedPhoneNumber.isoCode;
                profileResponse.firstName = updatedUser.firstName;
                profileResponse.lastName = updatedUser.lastName;
                profileResponse.timezone = updatedUser.timezone;
                profileResponse.profileDetails.about = updatedProfile.about;
                profileResponse.profileDetails.dateOfBirth = updatedProfile.dateOfBirth;
                profileResponse.profileDetails.gender = updatedProfile.gender;
            }

            // * check file exists
            if (file) {
                // * if yes --> then upload to cloudinary and update imageUrl
                // * else --> leave as it is
                const uploadedImage = await FileUploaderService.uploadImageToCloudinary(file.buffer, {
                    folder: 'profile',
                    public_id: Quicker.prepareFileName(
                        `${userWithAssociations.firstName} ${userWithAssociations.lastName}-${Date.now()}`,
                    ),
                });

                if (!uploadedImage) {
                    throw new AppError(
                        ResponseMessage.UPLOAD_FAILED('Profile picture'),
                        StatusCodes.INTERNAL_SERVER_ERROR,
                    );
                }

                profile.imageUrl = uploadedImage.secure_url;
            }

            // * update profile
            const updatedProfile = await profile.save();
            profileResponse.profileDetails.imageUrl = updatedProfile.imageUrl;

            return profileResponse;
        } catch (error) {
            if (error instanceof ParseError) {
                throw new AppError(error.message, StatusCodes.UNPROCESSABLE_ENTITY);
            }
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

export default ProfileService;
