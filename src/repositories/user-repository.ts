import { Account_Confirmation, Phone_Number, Profile, Reset_Password, Role, User } from '../database/models';
import {
    TUserWithAccountConfirmationAndResetPassword,
    TUserWithAssociations,
    TUserWithProfileAssociations,
} from '../types';
import CrudRepository from './crud-repository';

class UserRepository extends CrudRepository<User> {
    constructor() {
        super(User);
    }

    public async findByEmail(email: string): Promise<User | null> {
        const response = await User.findOne({ where: { email: email } });
        return response;
    }

    public async findByEmailWithPassword(email: string): Promise<User | null> {
        const response = await User.scope('withPassword').findOne({
            where: { email: email },
        });
        return response;
    }

    public async getWithAssociationsById(id: number): Promise<TUserWithAssociations | null> {
        const response: TUserWithAssociations | null = await this.getOne({
            where: { id: id },
            include: [
                { model: Role, required: true, as: 'roles' },
                { model: Profile, required: true, as: 'profileDetails' },
                { model: Phone_Number, required: true, as: 'phoneNumber' },
                { model: Account_Confirmation, as: 'accountConfirmation' },
                { model: Profile, as: 'profileDetails' },
            ],
        });
        return response;
    }

    public async getWithAccountConfirmationAndResetPasswordByEmail(email: string) {
        const response: TUserWithAccountConfirmationAndResetPassword | null = await this.getOne({
            where: { email: email },
            include: [
                { model: Account_Confirmation, as: 'accountConfirmation' },
                { model: Reset_Password, as: 'resetPassword' },
            ],
        });
        return response;
    }

    public async getWithPasswordById(id: number) {
        const response = await User.scope('withPassword').findOne({ where: { id: id } });
        return response;
    }

    public async getWithProfileById(id: number) {
        const response: TUserWithProfileAssociations | null = await this.getOne({
            where: { id },
            include: [
                {
                    model: Profile,
                    required: true,
                    as: 'profileDetails',
                },
            ],
        });
        return response;
    }
}
export default UserRepository;
