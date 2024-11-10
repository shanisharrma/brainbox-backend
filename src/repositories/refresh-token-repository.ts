import { Refresh_Token } from '../database/models';
import CrudRepository from './crud-repository';

class RefreshTokenRepository extends CrudRepository<Refresh_Token> {
    constructor() {
        super(Refresh_Token);
    }

    public async findByUserId(userId: number) {
        const response = await Refresh_Token.findOne({
            where: { userId: userId },
        });
        return response;
    }

    public async deleteByUserId(userId: number) {
        const refreshToken = await this.getOne({ where: { userId: userId } });
        return await refreshToken!.destroy();
    }

    public async findByToken(token: string) {
        const refreshToken = await this.getOne({ where: { token: token } });
        return refreshToken;
    }
}

export default RefreshTokenRepository;
