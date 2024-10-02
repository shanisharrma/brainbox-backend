import { User } from '../database/models';
import CrudRepository from './crud-repository';

class UserRepository extends CrudRepository<User> {
    constructor() {
        super(User);
    }

    public async findByEmail(email: string): Promise<User | null> {
        const response = await User.findOne({ where: { email: email } });
        return response;
    }
}

export default UserRepository;
