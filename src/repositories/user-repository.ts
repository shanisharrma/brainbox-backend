import { Account_Confirmation, Phone_Number, Role, User } from '../database/models';
import { TUserWithAssociations } from '../types';
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
}
export default UserRepository;
