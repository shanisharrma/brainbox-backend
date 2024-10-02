import { Role } from '../database/models';
import CrudRepository from './crud-repository';

class RoleRepository extends CrudRepository<Role> {
    constructor() {
        super(Role);
    }

    public async findByRole(role: string) {
        const response = await this.getOne({ where: { role: role } });
        return response;
    }
}

export default RoleRepository;
