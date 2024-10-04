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

    public async deleteRefreshTokenByToken(token: string) {
        const refreshToken = await this.getOne({ where: { token: token } });
        return await refreshToken.destroy();
    }
}

export default RefreshTokenRepository;
