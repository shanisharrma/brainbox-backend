import { Refresh_Token } from '../database/models';
import CrudRepository from './crud-repository';

class RefreshTokenRepository extends CrudRepository<Refresh_Token> {
    constructor() {
        super(Refresh_Token);
    }

    public async findRefreshTokenByUserId(userId: number) {
        const response = await Refresh_Token.findOne({
            where: { userId: userId },
        });
        return response;
    }
}

export default RefreshTokenRepository;
