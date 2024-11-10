import { Role, User } from '../database/models';
import CrudRepository from './crud-repository';

class RoleRepository extends CrudRepository<Role> {
    constructor() {
        super(Role);
    }

    public async findByRole(role: string) {
        const response = await this.getOne({ where: { role: role } });
        return response;
    }

    public async getRolesByUserId(userId: number) {
        const response = await this.getOne({
            include: [
                {
                    model: User,
                    as: 'users',
                    where: { id: userId },
                    required: true,
                },
            ],
        });
        return response ? response.get({ plain: true }) : null;
    }
}

export default RoleRepository;
