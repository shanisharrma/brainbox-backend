import { Profile, User } from '../database/models';
import { IProfileAttributes, TProfileWithUserAssociations } from '../types';
import CrudRepository from './crud-repository';

class ProfileRepository extends CrudRepository<Profile> {
    constructor() {
        super(Profile);
    }

    public async getWithAssociationsByUserId(id: number): Promise<TProfileWithUserAssociations | null> {
        const response = await this.getOne({
            where: { userId: id },
            include: [{ model: User, required: true, as: 'user' }],
        });
        // Return only the dataValues if the response is not null
        return response ? response.get({ plain: true }) : null;
    }

    public async getByUserId(userId: number): Promise<IProfileAttributes | null> {
        const response = await this.getOne({ where: { userId: userId } });
        // Return only the dataValues if the response is not null
        return response ? response.get({ plain: true }) : null;
    }
}

export default ProfileRepository;
