import { Reset_Password, User } from '../database/models';
import CrudRepository from './crud-repository';

class ResetPasswordRepository extends CrudRepository<Reset_Password> {
    constructor() {
        super(Reset_Password);
    }

    public async findWithUserByToken(token: string) {
        const response = await this.getOne({
            where: { token: token },
            include: [{ model: User, required: true, as: 'user' }],
        });
        return response;
    }
}

export default ResetPasswordRepository;
