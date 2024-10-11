import { Profile, User } from '../database/models';
import { TProfileWithUserAssociations } from '../types';
import CrudRepository from './crud-repository';

class ProfileRepository extends CrudRepository<Profile> {
    constructor() {
        super(Profile);
    }

    public async getWithAssociationsByUserId(id: number): Promise<TProfileWithUserAssociations | null> {
        const response: TProfileWithUserAssociations = await this.getOne({
            where: { userId: id },
            include: [{ model: User, required: true, as: 'user' }],
        });
        return response;
    }
}

export default ProfileRepository;
