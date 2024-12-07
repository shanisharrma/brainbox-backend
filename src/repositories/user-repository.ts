import {
    Account_Confirmation,
    Course,
    Payment,
    Phone_Number,
    Profile,
    Reset_Password,
    Role,
    User,
} from '../database/models';
import { TUserWithAccountConfirmationAndResetPassword, TUserWithAssociations } from '../types';
import CrudRepository from './crud-repository';

class UserRepository extends CrudRepository<User> {
    constructor() {
        super(User);
    }

    public async findByEmail(email: string): Promise<User | null> {
        const response = await User.findOne({ where: { email: email } });
        return response ? (response?.get({ plain: true }) as User) : null;
    }

    public async findByEmailWithPasswordAndRoles(email: string): Promise<User | null> {
        const response = await User.scope('withPassword').findOne({
            where: { email: email },
            include: [{ model: Role, required: true, as: 'roles' }],
        });
        // Return only the dataValues if the response is not null
        return response ? (response.get({ plain: true }) as User) : null;
    }

    public async getWithAssociationsById(id: number): Promise<TUserWithAssociations | null> {
        const response = await this.getOne({
            where: { id: id },
            include: [
                { model: Role, required: true, as: 'roles' },
                { model: Profile, required: true, as: 'profileDetails' },
                { model: Phone_Number, required: true, as: 'phoneNumber' },
                { model: Account_Confirmation, required: true, as: 'accountConfirmation' },
                { model: Profile, as: 'profileDetails' },
            ],
        });

        // Return only the dataValues if the response is not null
        return response ? (response.get({ plain: true }) as User) : null;
    }

    public async getWithAccountConfirmationAndResetPasswordByEmail(
        email: string,
    ): Promise<TUserWithAccountConfirmationAndResetPassword | null> {
        const response = await this.getOne({
            where: { email: email },
            include: [
                { model: Account_Confirmation, as: 'accountConfirmation' },
                { model: Reset_Password, as: 'resetPassword' },
            ],
        });
        // Return only the dataValues if the response is not null
        return response ? (response.get({ plain: true }) as User) : null;
    }

    public async getUserRolesById(userId: number) {
        const response = await this.getOne({
            where: { id: userId },
            include: [{ model: Role, required: true, as: 'roles' }],
        });

        // Return only the dataValues if the response is not null
        return response ? (response.get({ plain: true }) as User) : null;
    }

    public async getWithPasswordById(id: number) {
        const response = await User.scope('withPassword').findOne({ where: { id: id } });
        // Return only the dataValues if the response is not null
        return response ? (response.get({ plain: true }) as User) : null;
    }

    public async getWithProfileAndPhoneById(id: number) {
        const response = await this.getOne({
            where: { id },
            include: [
                {
                    model: Profile,
                    required: true,
                    as: 'profileDetails',
                },
                {
                    model: Phone_Number,
                    required: true,
                    as: 'phoneNumber',
                },
            ],
        });
        // Return only the dataValues if the response is not null
        return response ? (response.get({ plain: true }) as User) : null;
    }

    public async getInstructorData(instructorId: number) {
        const data = await this.getOne({
            where: { id: instructorId },
            include: [
                {
                    model: Course,
                    as: 'taughtCourses',
                    include: [
                        {
                            model: User,
                            as: 'students',
                        },
                        {
                            model: Payment,
                            as: 'payments',
                        },
                    ],
                },
            ],
        });

        return data ? data.get({ plain: true }) : null;
    }
}
export default UserRepository;
