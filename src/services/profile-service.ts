import { StatusCodes } from 'http-status-codes';
import { ResponseMessage } from '../utils/constants';
import { AppError } from '../utils/error';
import { TUserWithAssociations } from '../types';
import { UserRepository } from '../repositories';

interface IProfileResponse {
    user: TUserWithAssociations;
    warning?: string;
}

class ProfileService {
    private userRepository: UserRepository;
    // private profileRepository: ProfileRepository;

    constructor() {
        // this.profileRepository = new ProfileRepository();
        this.userRepository = new UserRepository();
    }

    public async profile(id: number) {
        try {
            const userWithAssociations = await this.userRepository.getWithAssociationsById(id);

            if (
                !userWithAssociations ||
                !userWithAssociations.accountConfirmation ||
                userWithAssociations.accountConfirmation.status === false
            ) {
                const profileResponse: IProfileResponse = {
                    user: userWithAssociations!,
                    warning: ResponseMessage.ACCOUNT_NOT_VERIFIED,
                };
                return profileResponse;
            }

            return userWithAssociations;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

export default ProfileService;
