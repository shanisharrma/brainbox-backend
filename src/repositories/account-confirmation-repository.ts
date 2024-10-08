import { Account_Confirmation, User } from '../database/models';
import { TAccountConfirmationWithUser } from '../types';
import CrudRepository from './crud-repository';

class AccountConfirmationRepository extends CrudRepository<Account_Confirmation> {
    constructor() {
        super(Account_Confirmation);
    }

    public async findWithUser(token: string, code: string) {
        const response: TAccountConfirmationWithUser = await this.getOne({
            where: { token: token, code: code },
            include: [{ model: User, required: true, as: 'user' }],
        });

        return response;
    }
}

export default AccountConfirmationRepository;
