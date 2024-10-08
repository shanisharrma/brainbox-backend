import { Account_Confirmation, Phone_Number, Reset_Password, Role, User } from '../database/models';
import { TUserWithAccountConfirmationAndResetPassword, TUserWithAssociations } from '../types';
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

    public async getUserWithAssociationsById(id: number): Promise<TUserWithAssociations | null> {
        const response: TUserWithAssociations = await this.getOne({
            where: { id: id },
            include: [
                { model: Phone_Number, required: true, as: 'phoneNumber' },
                { model: Role, required: true, as: 'roles' },
                { model: Account_Confirmation, as: 'accountConfirmation' },
            ],
        });
        return response;
    }

    public async getUserWithAccountConfirmationAndResetPasswordByEmail(email: string) {
        const response: TUserWithAccountConfirmationAndResetPassword = await this.getOne({
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
}
export default UserRepository;
