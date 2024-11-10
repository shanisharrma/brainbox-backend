import { StatusCodes } from 'http-status-codes';
import { ResponseMessage } from '../utils/constants';
import { AppError } from '../utils/error';
import { IProfileAttributes, IProfileUpdateParams, TUserWithAssociations } from '../types';
import { ProfileRepository, UserRepository } from '../repositories';
import FileUploaderService from './file-uploader-service';
import { Quicker } from '../utils/helper';

interface IProfileResponse {
    user: TUserWithAssociations;
    warning?: string | null;
}

class ProfileService {
    private userRepository: UserRepository;
    private profileRepository: ProfileRepository;

    constructor() {
        this.profileRepository = new ProfileRepository();
        this.userRepository = new UserRepository();
    }

    public async profile(id: number) {
        try {
            const userWithAssociations = await this.userRepository.getWithAssociationsById(id);

            if (!userWithAssociations) {
                throw new AppError(ResponseMessage.NOT_FOUND('User'), StatusCodes.NOT_FOUND);
            }

            const profileResponse: IProfileResponse = {
                user: userWithAssociations,
                warning: null,
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
            const { about, dateOfBirth, gender, file } = data;

            // * check user exists or not
            const userDetails = await this.userRepository.getWithProfileById(userId);
            if (!userDetails || !userDetails.profileDetails) {
                throw new AppError(ResponseMessage.NOT_AUTHORIZATION, StatusCodes.UNAUTHORIZED);
            }

            // * check profile exists or not with userId
            const profile = await this.profileRepository.getOneById(userDetails.profileDetails.id!);

            // * prepare profileUpdatePayload
            profile.about = about || profile.about;
            profile.gender = gender || profile.gender;
            profile.dateOfBirth = dateOfBirth || profile.dateOfBirth;

            // * check file exists
            if (file) {
                // * if yes --> then upload to cloudinary and update imageUrl
                // * else --> leave as it is
                const uploadedImage = await FileUploaderService.uploadImageToCloudinary(file.buffer, {
                    folder: 'profile',
                    public_id: Quicker.prepareFileName(
                        `${userDetails.firstName} ${userDetails.lastName}-${Date.now()}`,
                    ),
                });

                if (!uploadedImage) {
                    throw new AppError(ResponseMessage.UPLOAD_FAILED('Profile pic'), StatusCodes.INTERNAL_SERVER_ERROR);
                }

                profile.imageUrl = uploadedImage.secure_url;
            }

            // * update profile
            await profile.save();

            // * return response
            return profile;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

export default ProfileService;
